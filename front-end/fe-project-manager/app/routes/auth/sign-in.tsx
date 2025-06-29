import {z} from "zod";
import {signInSchema} from "~/lib/schema";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "~/components/ui/card";
import {FormControl, FormField, FormItem, FormLabel, Form, FormMessage} from "~/components/ui/form";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import {Link, useNavigate} from "react-router";
import {useLoginUser} from "~/hooks/use-auth";
import {toast} from "sonner";
import {Loader2} from "lucide-react";

type SignInFormData = z.infer<typeof signInSchema>;

const SignIn = () => {
    const navigate = useNavigate();
    const {mutate, isPending} = useLoginUser()

    const form = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = (values: SignInFormData) => {
        mutate(values, {
            onSuccess: () => {
                console.log("sig-in success");
                navigate("/dashboard");
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
            <Card className={'max-w-md w-full shadow-xl'}>
                <CardHeader className={"text-center mb-5"}>
                    <CardTitle className={"text-2xl font-bold"}>Welcome to Project Manager</CardTitle>
                    <CardDescription className={"text-muted-foreground text-sm"}>Sign-in to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-4"}>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder={"example@gmail.com"}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem>
                                        <div className={"flex justify-between items-center"}>
                                            <FormLabel>Password</FormLabel>
                                            <Link to={"/forgot-password"} className={"text-blue-600"}>Forgot
                                                password</Link>
                                        </div>
                                        <FormControl>
                                            <Input {...field} placeholder={"password"} type={"password"}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <Button type={"submit"} className={"w-full hover:cursor-pointer"} disabled={isPending}>
                                {isPending ? <Loader2 className={"w-4 h-4 mr-2"}/> : "Sign In"}
                            </Button>
                        </form>
                    </Form>
                    <CardFooter>
                        <div className={"flex justify-center items-center w-full mt-5"}>
                            <p className={"text-muted-foreground text-sm"}>Don&apos;t have an account? <Link
                                className={"text-blue-600"} to={"/sign-up"}>Sign Up</Link></p>
                        </div>
                    </CardFooter>
                </CardContent>
            </Card>
        </div>
    )
}

export default SignIn;