import {useAuth} from "~/provider/auth-context";
import Loader from "~/components/loader";
import {Navigate, Outlet, redirect} from "react-router";
import Header from "~/components/layout/header";
import {useState} from "react";
import type {Workspace} from "~/types";
import SidebarComponent from "~/components/layout/sidebar-component";
import CreateWorkspace from "~/components/workspace/create-workspace";
import {getData} from "~/lib/fetch-utils";

export const clientLoader = async () => {
    try {
        const [workspace] = await Promise.all([getData("/workspaces")]);
        return {workspace}
    } catch (e: any) {
        if (e.status === 401) {
            window.dispatchEvent(new Event("force-logout"));
            throw redirect("/sign-in");
        }
        return {workspace: []};
    }
}

const DashboardLayout = () => {
    const {isAuthenticated, isLoading} = useAuth();
    const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
    const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null)

    if (isLoading) {
        return <Loader/>
    }

    if (!isAuthenticated) {
        return <Navigate to={"/sign-in"}/>
    }

    const handleWorkspaceSelected = (workspace: Workspace) => {
        setCurrentWorkspace(workspace);
    }

    return (
        <div className={"flex h-screen w-full"}>
            {/*Sidebar Component*/}
            <SidebarComponent currentWorkspace={currentWorkspace}/>
            <div className={"flex flex-col flex-1 h-full"}>
                {/*Header*/}
                <Header
                    onWorkspaceSelected={handleWorkspaceSelected}
                    selectedWorkspace={currentWorkspace}
                    onCreateWorkspace={() => setIsCreatingWorkspace(true)}/>

                <main className={"flex overflow-y-auto h-full w-full"}>
                    <div className={"mx-auto container px-2 sm:px-6 lg:px-8 py-0 md:py-8 w-full h-full"}>
                        <Outlet/>
                    </div>
                </main>
            </div>

            <CreateWorkspace isCreatingWorkspace={isCreatingWorkspace} setIsCreatingWorkspace={setIsCreatingWorkspace}/>
        </div>
    )
}

export default DashboardLayout;