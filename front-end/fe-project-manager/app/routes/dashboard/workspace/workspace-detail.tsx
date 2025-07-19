import {useParams} from "react-router";
import {useState} from "react";
import {useGetWorkspaceId} from "~/hooks/use-workspace";
import type {Project, Workspace} from "~/types";
import Loader from "~/components/loader";
import WorkspaceHeader from "~/components/workspace/workspace-header";

const WorkspaceDetail = () => {
    const {workspaceId} = useParams<{ workspaceId: string }>();
    const [isCreateProject, setIsCreateProject] = useState(false);
    const [isInviteMember, setIsInviteMember] = useState(false);

    if (!workspaceId) {
        return <div>No workspace found</div>;
    }

    const {data, isLoading} = useGetWorkspaceId(workspaceId) as {
        data: {
            workspace: Workspace;
            projects: Project[];
        };
        isLoading: boolean;
    };

    if (isLoading) {
        return (
            <div>
                <Loader/>
            </div>
        );
    }
    console.log("Workspace detail", data);
    return (
        <div className={"space-y-8"}>
            <WorkspaceHeader
                workspace={data.workspace}
                members={data?.workspace.members}
                onCreateProject={() => setIsCreateProject(true)}
                onInviteMember={() => setIsInviteMember(true)}
            />
        </div>
    );
};

export default WorkspaceDetail;
