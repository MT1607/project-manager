export interface User {
    _id: string;
    email: string;
    name: string;
    password: string;
    createdAt: Date;
    isEmailVerified: boolean;
    updateAt: Date;
    profilePicture?: string;
}

export interface Workspace {
    _id: string;
    name: string;
    description?: string;
    owner: User | string;
    color: string;
    members: {
        user: User,
        role: "admin" | "member" | "owner" | "viewer";
        joinAt: Date
    }[];
    createdAt: Date;
    updateAt: Date;
}