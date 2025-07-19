import {useState} from "react";
import {useGetWorkspace} from "~/hooks/use-workspace";
import type {Workspace} from "~/types";
import Loader from "~/components/loader";
import CreateWorkspace from "~/components/workspace/create-workspace";
import {Button} from "~/components/ui/button";
import {PlusCircle, User, Users} from "lucide-react";
import NoDataFound from "~/components/no-data-found";
import {Link} from "react-router";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import WorkspaceAvatar from "~/components/workspace/workspace-avatar";
import {format} from "date-fns";

const Workspace = () => {
    const [isCreateWorkspace, setIsCreateWorkspace] = useState(false);
    const {data: workspaces, isLoading} = useGetWorkspace() as {
        data: Workspace[];
        isLoading: boolean;
    };

    if (isLoading) {
        return <Loader/>;
    }

    return (
        <>
            <div className={"space-y-8"}>
                <div className={"flex items-center justify-between"}>
                    <h2 className={"text-xl md:text-3xl font-bold"}>Workspaces</h2>
                    <Button onClick={() => setIsCreateWorkspace(true)}>
                        <PlusCircle className={"size-4 mr-2"}/>
                        New Workspace
                    </Button>
                </div>

                <div className={"grid gap-6 sm:grid-cols-2 lg:grid-cols-3"}>
                    {workspaces.map((ws) => (
                        <WorkspaceCard workspace={ws} key={ws._id}/>
                    ))}

                    {workspaces.length === 0 && (
                        <NoDataFound
                            title={"No workspaces found."}
                            description={"Create a new workspace to get started"}
                            buttonText={"Create Workspace"}
                            buttonAction={() => setIsCreateWorkspace(true)}
                        />
                    )}
                </div>
            </div>
            <CreateWorkspace
                isCreatingWorkspace={isCreateWorkspace}
                setIsCreatingWorkspace={setIsCreateWorkspace}
            />
        </>
    );
};

const WorkspaceCard = ({workspace}: { workspace: Workspace }) => {
    return (
        <Link to={`/workspaces/${workspace._id}`}>
            <Card className={"transition-all hover:shadow-md hover:-translate-y-1"}>
                <CardHeader className={"pb-2"}>
                    <div className={"flex items-center justify-between"}>
                        <div className={"flex gap-2"}>
                            <WorkspaceAvatar color={workspace.color} name={workspace.name}/>

                            <div>
                                <CardTitle>{workspace.name}</CardTitle>
                                <span
                                    className={"text-xs text-muted-foreground"}>Create at {format(workspace.createdAt, "MMM d, yyyy h:mm a")}
                                </span>
                            </div>
                        </div>

                        <div className={"flex items-center text-muted-foreground"}>
                            <Users className={"size-4 mr-1"}/>
                            <span className={"text-xs"}>{workspace.members.length}</span>
                        </div>
                    </div>
                    <CardDescription>{workspace.description || "No description"}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className={"text-sm text-muted-foreground"}>
                        View workspace detail and projects
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};
export default Workspace;
