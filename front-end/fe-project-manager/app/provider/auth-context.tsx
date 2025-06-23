import type {User} from "~/types";
import React, {createContext} from "react";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider =  ({children}:{children: React.ReactNode}) => {
    const [user, setUser] = React.useState(null);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const login = async (email: string, password: string) => {
        console.log(email, password);
    }

    const logout = async () => {
        console.log("logout")
    }

    return (
        <AuthContext.Provider value={{user, isAuthenticated, isLoading, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within the AuthProvider');
    }

    return context;
}