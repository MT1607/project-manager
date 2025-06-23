import {z} from "zod";
import {signUpSchema} from "~/lib/schema";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "~/components/ui/card";
import {FormControl, FormField, FormItem, FormLabel, Form, FormMessage} from "~/components/ui/form";
import {Input} from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {Link} from "react-router";
import {useSignUpMutation} from "~/hooks/use-auth";
import {toast} from "sonner";

export type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUp = () => {
    const form= useForm<SignUpFormData> ({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
            confirmPassword: ""
        }
    })

    const {mutate, isPending} = useSignUpMutation();

    const onSubmit = (values: SignUpFormData) => {
        mutate(values, {
            onSuccess: () => {
                toast.success("Account created successfully.");
            },
            onError: (error: any) => {
                const errorMessage = error.response.data.message || "An error occurred.";
                console.error("Error" ,error.response.data.message);
                toast.error(errorMessage);
            }
        })
    }

    return(
        <div className={"min-h-screen flex items-center justify-center flex-col bg-muted/40 p-4"}>
            <Card className={'max-w-md w-full shadow-xl'}>
                <CardHeader className={"text-center mb-5"}>
                    <CardTitle className={"text-2xl font-bold"}>Welcome to Project Manager</CardTitle>
                    <CardDescription className={"text-muted-foreground text-sm"}>Sign-up to create account</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-4"}>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field})=>(
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
                                name="name"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder={"Eg: Gia Son"}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder={"********"} type={"password"}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder={"********"} type={"password"}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />


                            <Button type={"submit"} className={"w-full hover:cursor-pointer"} disabled={isPending}>
                                {isPending ? "Signing Up..." : "Sign Up"}
                            </Button>
                        </form>
                    </Form>
                    <CardFooter>
                        <div className={"flex justify-center items-center w-full mt-5"}>
                            <p className={"text-muted-foreground text-sm"}>Have an account? <Link className={"text-blue-600"} to={"/sign-in"}>Sign In</Link></p>
                        </div>
                    </CardFooter>
                </CardContent>
            </Card>
        </div>
    )
}

export default SignUp;