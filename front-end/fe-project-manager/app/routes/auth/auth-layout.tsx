import {Navigate, Outlet} from "react-router";
import {useAuth} from "~/provider/auth-context";


const AuthLayout = () => {
    const {isLoading, isAuthenticated} = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                Loading...
            </div>
        )
    }

    if (isAuthenticated) {
        return (
            <Navigate to={"/dashboard"}/>
        )
    }
    return(
        <Outlet/>
    )
}

export default AuthLayout;