export enum ProjectStatus {
  PLANNING = 'Planning',
  IN_PROGRESS = 'In Progress',
  ON_HOLD = 'On Hold',
  COMPLETE = 'Completed',
  CANCELLED = 'Cancelled',
}

export type TaskStatus = 'To Do' | 'In Progress' | 'Review' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

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
    role: 'admin' | 'member' | 'owner' | 'viewer';
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
    role: 'admin' | 'manager' | 'contributor' | 'viewer';
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
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  project: Project;
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
  dueDate: Date;
  priority: TaskPriority;
  assignee: User | string;
  createdBy: User | string;
  assignees: User[];
  subtasks?: Subtask[];
  watchers?: User[];
  attachments?: Attachment[];
}

export interface MemberProps {
  _id: string;
  user: User;
  role: 'admin' | 'member' | 'owner' | 'viewer';
  joinedAt: Date;
}

export interface CommentReaction {
  emoji: string;
  user: User;
}

export interface Comment {
  _id: string;
  author: User;
  text: string;
  createdAt: Date;
  reactions?: CommentReaction[];
  attachments?: {
    fileName: string;
    fileUrl: string;
    fileType?: string;
    fileSize?: number;
  }[];
}

export enum ProjectMemberRole {
  MANAGER = 'manager',
  CONTRIBUTOR = 'contributor',
  VIEWER = 'viewer',
}

export type ResourceType = 'Task' | 'Project' | 'Workspace' | 'Comment' | 'User';

export type ActionType =
  | 'created_task'
  | 'updated_task'
  | 'created_subtask'
  | 'updated_subtask'
  | 'completed_task'
  | 'created_project'
  | 'updated_project'
  | 'completed_project'
  | 'created_workspace'
  | 'updated_workspace'
  | 'added_comment'
  | 'added_member'
  | 'removed_member'
  | 'joined_workspace'
  | 'added_attachment';

export interface ActivityLog {
  _id: string;
  user: User;
  action: ActionType;
  resourceType: ResourceType;
  resourceId: string;
  details: any;
  createdAt: Date;
}

export interface ProjectStatusData {
  name: string;
  value: number;
  color: string;
}

export interface StatsCardProps {
  totalProjects: number;
  totalTasks: number;
  totalProjectInProgress: number;
  totalTaskCompleted: number;
  totalTaskToDo: number;
  totalTaskInProgress: number;
}

export interface TaskTrendsData {
  name: string;
  completed: number;
  inProgress: number;
  toDo: number;
}

export interface TaskPriorityData {
  name: string;
  value: number;
  color: string;
}

export interface WorkspaceProductivityData {
  name: string;
  completed: number;
  total: number;
}
