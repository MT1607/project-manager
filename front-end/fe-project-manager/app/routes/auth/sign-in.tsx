import {z} from "zod";
import {signInSchema} from "~/lib/schema";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "~/components/ui/card";
import {FormControl, FormField, FormItem, FormLabel, Form, FormMessage} from "~/components/ui/form";
import {Input} from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {Link} from "react-router";

type SignInFormData = z.infer<typeof signInSchema>;

const SignIn = () => {
    const form= useForm<SignInFormData> ({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = (values: SignInFormData) => {
        console.log(values);
    }

    return(
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
                                name="password"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder={"password"} type={"password"}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <Button type={"submit"} className={"w-full"}>
                                Sign in
                            </Button>
                        </form>
                    </Form>
                    <CardFooter>
                        <div className={"flex justify-center items-center w-full"}>
                            <p className={"text-muted-foreground text-sm"}>Don&apos;t have an account? <Link to={"/sign-up"}>Sign up</Link></p>
                        </div>
                    </CardFooter>
                </CardContent>
            </Card>
        </div>
    )
}

export default SignIn;