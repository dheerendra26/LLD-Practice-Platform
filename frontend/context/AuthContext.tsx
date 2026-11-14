"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

import api from "@/lib/api";
import { AuthResponse, AuthUser } from "@/types";

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (
        name: string,
        email: string,
        password: string
    ) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const handleUnauthorized = () => {
            setUser(null);
            setIsLoading(false);

            const currentPath =
                window.location.pathname + window.location.search;

            const redirect = encodeURIComponent(currentPath);

            window.location.replace(`/login?redirect=${redirect}`);
        };

        window.addEventListener(
            "auth:unauthorized",
            handleUnauthorized
        );

        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            setIsLoading(false);

            return () => {
                active = false;
                window.removeEventListener(
                    "auth:unauthorized",
                    handleUnauthorized
                );
            };
        }

        const verifyUser = async () => {
            try {
                const response = await api.get<AuthUser>("/auth/me");

                if (active) {
                    setUser(response.data);
                }
            } catch (error) {
                localStorage.removeItem("accessToken");

                if (active) {
                    setUser(null);
                }
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        };

        verifyUser();

        return () => {
            active = false;
            window.removeEventListener(
                "auth:unauthorized",
                handleUnauthorized
            );
        };
    }, []);

    const login = async (email: string, password: string) => {
        const response = await api.post<AuthResponse>("/auth/login", {
            email,
            password,
        });

        localStorage.setItem("accessToken", response.data.accessToken);
        setUser(response.data.user);
    };

    const register = async (
        name: string,
        email: string,
        password: string
    ) => {
        const response = await api.post<AuthResponse>("/auth/register", {
            name,
            email,
            password,
        });

        localStorage.setItem("accessToken", response.data.accessToken);
        setUser(response.data.user);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
}