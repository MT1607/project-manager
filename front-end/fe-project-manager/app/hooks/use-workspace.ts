import {useMutation} from "@tanstack/react-query";
import type {WorkspaceForm} from "~/components/workspace/create-workspace";
import {postData} from "~/lib/fetch-utils";

const useCreateWorkspace = () => {
    return useMutation({
        mutationFn: (data: WorkspaceForm) => postData("/workspaces ", data)
    })
}

export {useCreateWorkspace}