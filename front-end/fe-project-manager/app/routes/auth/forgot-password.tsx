import {z} from "zod";
import {forgotPasswordSchema} from "~/lib/schema";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Card, CardContent, CardHeader} from "~/components/ui/card";
import {Link} from "react-router";
import {ArrowLeft, CheckCircle, Loader2} from "lucide-react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import {useState} from "react";
import {useForgotPassword} from "~/hooks/use-auth";
import {toast} from "sonner";


type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
    const [isSuccess, setIsSuccess] = useState(false);
    const {mutate: forgotPassword, isPending} = useForgotPassword();
    ;
    const form = useForm<ForgotPasswordSchema>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        }
    })

    const onSubmit = (values: ForgotPasswordSchema) => {
        forgotPassword(values, {
            onSuccess: () => {
                setIsSuccess(true);
            },
            onError: (error: any) => {
                const errorMessage = error.response.data.message || "An error occurred.";
                console.error("Error", error.response.data.message);
                toast.error(errorMessage);
            }
        })
    }

    return (
        <div className={"min-h-screen flex items-center justify-center flex-col bg-muted/40 p-4"}>
            <div className={"w-full max-w-md space-y-6"}>
                <div className={"flex-col flex justify-center items-center space-y-2"}>
                    <h1 className={"text-2xl font-bold"}>Forgot Password</h1>
                    <p className={"text-muted-foreground"}>Enter your email below</p>
                </div>

                <Card className={'max-w-md w-full shadow-xl'}>
                    <CardHeader>
                        <Link to={"/sign-in"} className={"flex items-center gap-2 text-sm"}>
                            <ArrowLeft className={'w-4 h-4 mr-2'}/>
                            Back to Sign in
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {
                            isSuccess ? (
                                <div className={"flex-col flex justify-center items-center space-y-2"}>
                                    <CheckCircle color={"green"} className={"w-10 h-10"}/>
                                    <h1 className={"text-2xl font-bold"}>Password reset email send</h1>
                                    <p className={"text-muted-foreground"}>Check your email for a link to reset
                                        password
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-4"}>

                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <div className={"flex justify-between items-center"}>
                                                            <FormLabel>New Password</FormLabel>
                                                        </div>
                                                        <FormControl>
                                                            <Input {...field} placeholder={"E.g:example@gmail.com"}
                                                                   type={"text"}/>
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type={"submit"} className={"w-full hover:cursor-pointer"}
                                                    disabled={isPending}>
                                                {isPending ? <Loader2 className={"w-4 h-4 mr-2"}/> : "Submit"}
                                            </Button>
                                        </form>
                                    </Form>
                                </>)
                        }
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ForgotPassword;