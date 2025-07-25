export enum ProjectStatus {
    PLANNING = "Planning",
    IN_PROGRESS = "In Progress",
    ON_HOLD = "On Hold",
    COMPLETE = "Completed",
    CANCELLED = "Cancelled"
}

export type TaskStatus = "To Do" | "In Progress" | "Review" | "Done"
export type TaskPriority = "Low" | "Medium" | "High"

export interface User {
    _id: string;
    email: string;
    name: string;
    password: string;
    createdAt: Date;
    isEmailVerified: boolean;
    updatedAt: Date;
    profilePicture?: string;
}

export interface Workspace {
    _id: string;
    name: string;
    description?: string;
    owner: User | string;
    color: string;
    members: {
        _id: string;
        user: User;
        role: "admin" | "member" | "owner" | "viewer";
        joinAt: Date;
    }[];
    projects: Project[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Project {
    _id: string;
    title: string;
    description?: string;
    workspace: Workspace;
    status: ProjectStatus;
    startDate: Date;
    dueDate: Date;
    progress: number;
    tasks: Task[];
    members: {
        user: User;
        role: "admin" | "manager" | "contributor" | "viewer";
    }[];
    // tags: string[];
    // createdBy: User;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Subtask {
    _id: string;
    title: string;
    completed: boolean;
    createAt: Date;
}

export interface Attachment {
    _id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    uploadBy: User;
    uploadAt: Date;
}

export interface Task {
    _id: string,
    title: string;
    description?: string;
    project: Project;
    status: TaskStatus;
    priority: TaskPriority;
    assignees: User[];
    assignee: User | string;
    watchers?: User[];
    dueDate: Date;
    completedAt: Date;
    estimatedHours: number;
    actualHours: number;
    tags: string[];
    subtasks?: Subtask[];
    comments: Comment[];
    attachments?: Attachment[];
    createdBy: User | string;
    isArchivedL: boolean;
    createdAt: Date;
    updateAt: Date;
}

export interface MemberProps {
    _id: string;
    user: User;
    role: "admin" | "member" | "owner" | "viewer";
    joinedAt: Date;
}

// export interface Comment {
//     text: string;
//     task: Task;
//     author: User;
//     mentions: [
//         {
//             user: User;
//             offset: number;
//             length: number;
//         }
//     ];
//     reactions: [
//         {
//             emoji: string;
//             user: User;
//         }
//     ];
//     attachments: [
//         {
//             fileName: string;
//             fileUrl: string;
//             fileType: string;
//             fileSize: number;
//         }
//     ];
//     isEdited: boolean;
//     createdAt: Date;
//     updatedAt: Date;
// }
