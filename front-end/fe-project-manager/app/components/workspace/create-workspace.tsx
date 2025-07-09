import React from "react";
import {z} from "zod";
import {workspaceSchema} from "~/lib/schema";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent, DialogFooter,
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
import {cn} from "~/lib/utils";
import {Button} from "~/components/ui/button";
import {useCreateWorkspace} from "~/hooks/use-workspace";
import {toast} from "sonner";
import {useNavigate} from "react-router";

interface CreateWorkspaceProps {
    isCreatingWorkspace: boolean;
    setIsCreatingWorkspace: React.Dispatch<React.SetStateAction<boolean>>;
}

export const colorOption = [
    "#FF5733",
    "#33C1FF",
    "#28A745",
    "#FFC300",
    "#8E44AD",
    "#E67E22",
    "#2ECC71",
    "#34495E",
];

export type WorkspaceForm = z.infer<typeof workspaceSchema>;

const CreateWorkspace = ({
                             isCreatingWorkspace,
                             setIsCreatingWorkspace,
                         }: CreateWorkspaceProps) => {
    const {mutate, isPending} = useCreateWorkspace();
    const navigate = useNavigate();

    const form = useForm<WorkspaceForm>({
        resolver: zodResolver(workspaceSchema),
        defaultValues: {
            name: "",
            color: colorOption[0],
            description: "",
        },
    });

    const onSubmit = (data: WorkspaceForm) => {
        mutate(data, {
            onSuccess: (data: any) => {
                form.reset();
                setIsCreatingWorkspace(false);
                toast.success("Workspace created successfully.");
                navigate(`/workspaces/${data._id}`)
            },
            onError: (error: any) => {
                const errorMessage = error.response.data.message || "An error occurred.";
                console.error("Error", error.response.data.message);
                toast.error(errorMessage);
            }
        })
    };
    return (
        <Dialog open={isCreatingWorkspace} onOpenChange={setIsCreatingWorkspace}>
            <DialogContent className={"max-h-[80vh] overflow-y-auto"}>
                <DialogHeader>
                    <DialogTitle>Create Workspace</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className={"space-y-4 py-4"}>
                            <FormField
                                control={form.control}
                                name={"name"}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder={"Workspace Name"}/>
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
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder={"Workspace Description"}
                                                rows={3}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={"color"}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <div className={"flex gap-3"}>
                                                {colorOption.map((color) => (
                                                    <div
                                                        key={color}
                                                        className={cn(
                                                            "w-6 h-6 rounded-full cursor-pointer hover:opacity-80 transition-all duration-300",
                                                            field.value === color &&
                                                            "ring-2 ring-offset-2 ring-blue-500"
                                                        )}
                                                        style={{backgroundColor: color}}
                                                        onClick={() => field.onChange(color)}
                                                    ></div>
                                                ))}
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button type={"submit"} disabled={isPending}>
                                {isPending ? "Creating..." : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateWorkspace;
