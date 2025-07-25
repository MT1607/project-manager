import {type MemberProps, ProjectStatus} from "~/types";
import {date, z} from "zod";
import {projectSchema} from "~/lib/schema";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form";
import {Input} from "~/components/ui/input";
import {Textarea} from "~/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover";
import {Button} from "~/components/ui/button";
import {Calendar} from "~/components/ui/calendar";
import {format} from "date-fns";
import {CalendarIcon} from "lucide-react";
import {Checkbox} from "~/components/ui/checkbox";
import useCreateProject from "~/hooks/use-project";
import {toast} from "sonner";

interface CreateProjectDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    workspaceId: string;
    workspaceMembers: MemberProps[];
}

export type CreateProjectFormData = z.infer<typeof projectSchema>;

const CreateProjectDialog = ({
                                 isOpen,
                                 onOpenChange,
                                 workspaceId,
                                 workspaceMembers,
                             }: CreateProjectDialogProps) => {
    const form = useForm<CreateProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: "",
            description: "",
            status: ProjectStatus.PLANNING,
            startDate: "",
            dueDate: "",
            members: [],
            tags: undefined,
        },
    });

    const {mutate, isPending} = useCreateProject();

    const onSubmit = (data: CreateProjectFormData) => {
        if (!workspaceId) return;

        mutate({
            projectData: data,
            workspaceId
        }, {
            onSuccess: () => {
                toast.success("Create new project successfully.");
                form.reset();
                onOpenChange(false);
            }, onError: (error: any) => {
                const errorMessage = error.response?.data?.message;
                toast.error(errorMessage);
                console.log("error create project: ", error);
            }
        })
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className={"sm:max-w-[540px]"}>
                <DialogHeader>
                    <DialogTitle>Create Project</DialogTitle>
                    <DialogDescription>
                        Create a new project to get started
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className={"space-y-4 py-4"}>
                            <FormField
                                control={form.control}
                                name={"title"}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Project Title</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder={"Project Title"}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={"description"}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Project Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder={"Project Description"}
                                                rows={3}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={"status"}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Project Status</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger className={"w-full"}>
                                                    <SelectValue placeholder={"Select Project Status"}/>
                                                </SelectTrigger>

                                                <SelectContent>
                                                    {Object.values(ProjectStatus).map((status) => (
                                                        <SelectItem value={status} key={status}>
                                                            {status}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <div className={"grid grid-cols-2 gap-4"}>
                                <FormField
                                    control={form.control}
                                    name={"startDate"}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Project Start Date</FormLabel>
                                            <FormControl>
                                                <Popover modal={true}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={
                                                                "w-full justify-start text-left font-normal" +
                                                                (!field.value ? "text-muted-foreground" : "")
                                                            }
                                                        >
                                                            <CalendarIcon className={"size-4 mr-2"}/>
                                                            {field.value ? (
                                                                format(new Date(field.value), "PPPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>

                                                    <PopoverContent>
                                                        <Calendar
                                                            mode={"single"}
                                                            selected={
                                                                field.value ? new Date(field.value) : undefined
                                                            }
                                                            onSelect={(day) => {
                                                                field.onChange(day?.toISOString() || undefined);
                                                            }}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={"dueDate"}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Project Due Date</FormLabel>
                                            <FormControl>
                                                <Popover modal={true}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={
                                                                "w-full justify-start text-left font-normal" +
                                                                (!field.value ? "text-muted-foreground" : "")
                                                            }
                                                        >
                                                            <CalendarIcon className={"size-4 mr-2"}/>
                                                            {field.value ? (
                                                                format(new Date(field.value), "PPPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>

                                                    <PopoverContent>
                                                        <Calendar
                                                            mode={"single"}
                                                            selected={
                                                                field.value ? new Date(field.value) : undefined
                                                            }
                                                            onSelect={(day) => {
                                                                field.onChange(day?.toISOString() || undefined);
                                                            }}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name={"tags"}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Tags</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder={"Tags seperated by command"}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={"members"}
                                render={({field}) => {
                                    const selectedMembers = field.value || [];
                                    return (
                                        <FormItem>
                                            <FormLabel>Members</FormLabel>
                                            <FormControl>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={
                                                                "w-full justify-start text-left font-normal"
                                                            }
                                                        >
                                                            {selectedMembers.length === 0 ? (
                                                                <span
                                                                    className={"text-muted-foreground"}>Select Members</span>
                                                            ) : selectedMembers.length <= 2 ? (
                                                                selectedMembers.map((m) => {
                                                                    const member = workspaceMembers.find(wm => wm.user._id === m.user)
                                                                    return `${member?.user.name} (${member?.role})`;
                                                                })
                                                            ) : (
                                                                `${selectedMembers.length} members selected`
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className={"w-full max-w-60 overflow-y-auto"}
                                                        align={"start"}
                                                    >
                                                        <div className={"flex flex-col gap-2"}>
                                                            {workspaceMembers.map((member) => {
                                                                const selectedMember = selectedMembers.find(
                                                                    (m) => m.user === member.user._id
                                                                );
                                                                return (
                                                                    <div
                                                                        key={member._id}
                                                                        className={
                                                                            "flex items-center gap-2 p-2 border rounded"
                                                                        }
                                                                    >
                                                                        <Checkbox
                                                                            checked={!!selectedMember}
                                                                            onCheckedChange={(checked) => {
                                                                                if (checked) {
                                                                                    field.onChange([
                                                                                        ...selectedMembers,
                                                                                        {
                                                                                            user: member.user._id,
                                                                                            role: "contributor",
                                                                                        },
                                                                                    ]);
                                                                                } else {
                                                                                    field.onChange(
                                                                                        selectedMembers.filter(
                                                                                            (m) => m.user !== member.user._id
                                                                                        )
                                                                                    );
                                                                                }
                                                                            }}
                                                                            id={`member-${member.user._id}`}
                                                                        />
                                                                        <span
                                                                            className={"truncate flex-1"}>{member.user.name}</span>
                                                                        {selectedMember && (
                                                                            <Select
                                                                                value={selectedMember.role}
                                                                                onValueChange={(role) => {
                                                                                    selectedMembers.map((m) =>
                                                                                        m.user === member.user._id
                                                                                            ? {
                                                                                                ...m,
                                                                                                role: role as
                                                                                                    | "contributor"
                                                                                                    | "manager"
                                                                                                    | "viewer",
                                                                                            }
                                                                                            : m
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <SelectTrigger>
                                                                                    <SelectValue
                                                                                        placeholder={"Select Role"}
                                                                                    />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    <SelectItem value={"contributor"}>
                                                                                        Contributor
                                                                                    </SelectItem>
                                                                                    <SelectItem value={"manager"}>
                                                                                        Manager
                                                                                    </SelectItem>
                                                                                    <SelectItem value={"viewer"}>
                                                                                        Viewer
                                                                                    </SelectItem>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    );
                                }}
                            />
                        </div>

                        <DialogFooter>
                            <Button type={"submit"}
                                    disabled={isPending}>{isPending ? "Creating..." : "Create Project"}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateProjectDialog;
