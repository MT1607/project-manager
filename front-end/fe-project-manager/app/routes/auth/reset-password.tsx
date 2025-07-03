import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {resetPasswordSchema} from "~/lib/schema";
import {Card, CardContent, CardHeader} from "~/components/ui/card";
import {Link, useSearchParams} from "react-router";
import {ArrowLeft, CheckCircle, Loader2} from "lucide-react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import {z} from "zod";
import {useState} from "react";
import {useResetPassword} from "~/hooks/use-auth";
import {toast} from "sonner";

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token")
    const [isSuccess, setIsSuccess] = useState(false);
    const {mutate: resetPassword, isPending} = useResetPassword();

    const form = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: ""
        }
    })

    const onSubmit = (values: ResetPasswordForm) => {
        if (!token) {
            toast.error("Invalid Token.");
            return;
        }
        resetPassword({...values, token: token as string}, {
            onSuccess: () => {
                setIsSuccess(true)
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
                    <h1 className={"text-2xl font-bold"}>Reset Password</h1>
                    <p className={"text-muted-foreground"}>Enter your password below</p>
                </div>

                <Card className={'max-w-md w-full shadow-xl'}>
                    <CardHeader>
                        <Link to={"/sign-in"} className={"flex items-center gap-2 text-sm"}>
                            <ArrowLeft className={'w-4 h-4 mr-2'}/>
                            Back to Sign in
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {isSuccess ? (
                            <div className={"flex-col flex justify-center items-center space-y-2"}>
                                <CheckCircle color={"green"} className={"w-10 h-10"}/>
                                <h1 className={"text-2xl font-bold"}>Password reset successfully</h1>
                                {/*<p className={"text-muted-foreground"}>Check your email for a link to reset*/}
                                {/*    password*/}
                                {/*</p>*/}
                            </div>
                        ) : (
                            <>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-4"}>

                                        <FormField
                                            control={form.control}
                                            name="newPassword"
                                            render={({field}) => (
                                                <FormItem>
                                                    <div className={"flex justify-between items-center"}>
                                                        <FormLabel>New Password</FormLabel>
                                                    </div>
                                                    <FormControl>
                                                        <Input {...field} placeholder={"*********"} type={"password"}/>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="confirmPassword"
                                            render={({field}) => (
                                                <FormItem>
                                                    <div className={"flex justify-between items-center"}>
                                                        <FormLabel>Confirm Password</FormLabel>
                                                    </div>
                                                    <FormControl>
                                                        <Input {...field} placeholder={"*********"} type={"password"}/>
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
                            </>)}
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}

export default ResetPassword;