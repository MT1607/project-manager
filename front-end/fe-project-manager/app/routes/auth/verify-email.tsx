import {Link, useSearchParams} from "react-router";
import {useEffect, useState} from "react";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {ArrowLeft, CheckCircle, Loader, XCircle} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useVerifyEmail} from "@/hooks/use-auth";
import {toast} from "sonner";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [isSuccess, setIsSuccess] = useState(true);
    const {mutate, isPending: isVerifying} = useVerifyEmail();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            mutate({token}, {
                onSuccess: () => {
                    setIsSuccess(true);
                },
                onError: (error: any) => {
                    const errorMsg = error.response?.data?.message || "An error has occurred";
                    setIsSuccess(false);
                    console.log(error);
                    toast.error(errorMsg);
                }
            })
        }
    }, [searchParams])
    return (
        <div className={"flex flex-col justify-center items-center h-screen"}>
            <h1 className={"text-2xl font-bold"}>Verify Email</h1>
            <p className={"text-sm text-gray-500"}>Verifying email...</p>

            <Card className={"w-full max-w-md"}>
                {/*<CardHeader>*/}
                {/*    <Link to={"/sign-in"} className={"flex items-center gap-2 text-sm"}>*/}
                {/*        <ArrowLeft className={'w-4 h-4 mr-2'}/>*/}
                {/*        Back to Sign in*/}
                {/*    </Link>*/}
                {/*</CardHeader>*/}
                <CardContent>
                    <div className={"flex justify-center items-center flex-col"}>
                        {isVerifying ? (
                            <>
                                <Loader className={"w-10 h-10 text-gray-500 animate-spin"}/>
                                <h3 className={"text-lg font-semibold"}>Verifying Email...</h3>
                                <p className="text-sm text-gray-500">
                                    Please wait while verify your email.
                                </p>
                            </>
                        ) : isSuccess ? (
                            <>
                                <CheckCircle color="green" className={"w-10 h-10"}/>
                                <h3 className={"text-lg font-semibold"}>Email Verified</h3>
                                <p className={"text-sm text-gray-500"}>Your has been verified successfully</p>

                                <Link to={"/sign-in"} className={"text-sm text-blue-500 mt-6"}>
                                    <Button variant={"outline"}>Back to Sign in</Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <XCircle color={"red"} className={"w-10 h-10"}/>
                                <h3 className={"text-lg font-semibold"}>Email Verification Failed</h3>
                                <p className={"text-sm text-gray-500"}>Your has been verified failed. Please try
                                    again.</p>

                                <Link to={"/sign-in"} className={"text-sm text-blue-500 mt-6"}>
                                    <Button variant={"outline"}>Back to Sign in</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default VerifyEmail;