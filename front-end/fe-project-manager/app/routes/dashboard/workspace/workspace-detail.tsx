import {useParams} from "react-router";
import {useState} from "react";
import {useGetWorkspaceId} from "~/hooks/use-workspace";
import type {Project, Workspace} from "~/types";
import Loader from "~/components/loader";
import WorkspaceHeader from "~/components/workspace/workspace-header";
import ProjectList from "~/components/workspace/project-list";
import CreateProjectDialog from "~/components/project/create-project";

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

    return (
        <div className={"space-y-8"}>
            <WorkspaceHeader
                workspace={data.workspace}
                members={data?.workspace.members}
                onCreateProject={() => setIsCreateProject(true)}
                onInviteMember={() => setIsInviteMember(true)}
            />

            <ProjectList
                projects={data.projects}
                workspaceId={workspaceId}
                onCreateProject={() => setIsCreateProject(true)}
            />

            <CreateProjectDialog
                isOpen={isCreateProject}
                onOpenChange={setIsCreateProject}
                workspaceId={workspaceId}
                workspaceMembers={data.workspace.members as any}
            />
        </div>
    );
};

export default WorkspaceDetail;
