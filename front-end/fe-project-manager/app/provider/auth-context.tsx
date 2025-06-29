import type {User} from "~/types";
import React, {createContext, useEffect} from "react";
import {useQueryClient} from "@tanstack/react-query";
import {useLocation, useNavigate} from "react-router";
import {publicRoutes} from "~/lib";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const [user, setUser] = React.useState(null);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const queryClient = useQueryClient();

    const navigate = useNavigate();
    const pathname = useLocation().pathname;

    const isPublicRoutes = publicRoutes.includes(pathname);

    // check token
    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);

            const userInfo = localStorage.getItem("user");

            if (userInfo) {
                setUser(JSON.parse(userInfo));
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                if (!isPublicRoutes) {
                    navigate("/sign-in");
                }
            }
            setIsLoading(false);
        }
        checkAuth();
    }, []);

    useEffect(() => {
        const handleLogout = () => {
            logout();
            navigate("/sign-in");
        }
        window.addEventListener("force-logout", handleLogout);
        return window.removeEventListener("force-logout", handleLogout);
    }, []);

    const login = async (data: any) => {
        localStorage.setItem("jwt_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);
    }

    const logout = async () => {
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
        queryClient.clear();
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