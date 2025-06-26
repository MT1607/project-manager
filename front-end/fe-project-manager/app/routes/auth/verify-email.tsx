import {Link, useSearchParams} from "react-router";
import {useEffect, useState} from "react";
import {Card, CardContent, CardHeader} from "~/components/ui/card";
import {ArrowLeft, CheckCircle, XCircle} from "lucide-react";
import {Button} from "~/components/ui/button";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            setIsSuccess(false);
        } else {
            setIsSuccess(true);
        }
    }, [searchParams])
    return(
        <div className={"flex flex-col justify-center items-center h-screen"}>
            <h1 className={"text-2xl font-bold"}>Verify Email</h1>
            <p className={"text-sm text-gray-500"}>Verifying email...</p>

            <Card className={"w-full max-w-md"}>
                <CardHeader>
                    <Link to={"/sign-in"} className={"flex items-center gap-2 text-sm"}>
                        <ArrowLeft className={'w-4 h-4 mr-2'}/>
                        Back to Sign in
                    </Link>
                </CardHeader>
                <CardContent>
                    <div className={"flex justify-center items-center flex-col"}>
                        {isSuccess ? (
                            <>
                                <CheckCircle color="green" className={"w-10 h-10"}/>
                                <h3 className={"text-lg font-semibold"}>Email Verified</h3>
                                <p className={"text-sm text-gray-500"}>Your has been verified successfully</p>
                            </>
                        ) : (
                            <>
                                <XCircle color={"red"} className={"w-10 h-10"}/>
                                <h3 className={"text-lg font-semibold"}>Email Verification Failed</h3>
                                <p className={"text-sm text-gray-500"}>Your has been verified failed. Please try again.</p>

                                <Link to={"sign-in"} className={"text-sm text-blue-500"}>
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