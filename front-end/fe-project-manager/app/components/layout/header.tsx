import type {Workspace} from "~/types";
import {useAuth} from "~/provider/auth-context";
import {Button} from "~/components/ui/button";
import {Bell, PlusCircle} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "~/components/ui/avatar";
import {Link, useLoaderData} from "react-router";
import WorkspaceAvatar from "../workspace/workspace-avatar";

interface HeaderProps {
    onWorkspaceSelected: (workspace: Workspace) => void;
    selectedWorkspace: Workspace | null;
    onCreateWorkspace: () => void;
}

const Header = ({
                    onWorkspaceSelected,
                    selectedWorkspace,
                    onCreateWorkspace,
                }: HeaderProps) => {
    const {user, logout} = useAuth();
    const {workspace} = useLoaderData() as { workspace: Workspace[] };
    return (
        <div className={"bg-background sticky top-0 z-40 border-b"}>
            <div
                className={
                    "flex justify-between h-14 items-center px-4 sm:px-6 lg:px-8 py-4"
                }
            >
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"outline"}>
                            {selectedWorkspace ? (
                                <>
                                    {selectedWorkspace.color && (
                                        <WorkspaceAvatar
                                            color={selectedWorkspace.color}
                                            name={selectedWorkspace.name}
                                        />
                                    )}
                                    <span className={"font-medium"}>
                    {selectedWorkspace.name}
                  </span>
                                </>
                            ) : (
                                <span className={"font-medium"}>Select Workspace</span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align={"end"}>
                        <DropdownMenuLabel>Workspace</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            {workspace.map((ws) => (
                                <DropdownMenuItem key={ws._id} onClick={() => onWorkspaceSelected(ws)}>
                                    {ws.color && (
                                        <WorkspaceAvatar
                                            color={ws.color}
                                            name={ws.name}
                                        />
                                    )}
                                    <span className={"ml-2"}>{ws.name}</span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>

                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={onCreateWorkspace}>
                                <PlusCircle className={"w-4 h-4"}/>
                                Create Workspace
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className={"flex items-center gap-2"}>
                    <Button variant={"ghost"} size={"icon"}>
                        <Bell/>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className={"rounded-full border p-1"}>
                                <Avatar className={"w-8 h-8"}>
                                    <AvatarImage src={user?.profilePicture} alt={user?.name}/>
                                    <AvatarFallback
                                        className={"bg-primary text-primary-foreground"}
                                    >
                                        {user?.name?.charAt(0)?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align={"end"}>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem>
                                <Link to={"/user/profile"}>Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem onClick={logout}>Log Out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
};

export default Header;
