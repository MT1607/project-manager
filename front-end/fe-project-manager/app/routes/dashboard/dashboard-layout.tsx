import {useAuth} from "~/provider/auth-context";
import {Button} from "~/components/ui/button";

const DashboardLayout = () => {
    const {logout} = useAuth();

    return (
        <>
            <Button onClick={logout}>Logout</Button>
        </>
    )
}

export default DashboardLayout;