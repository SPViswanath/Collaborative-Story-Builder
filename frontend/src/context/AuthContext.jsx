import { createContext, useContext, useState } from "react";
import * as authApi from "../api/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }){
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);

    const Login = async (data)=>{
        setLoading(true);
        try{
            await authApi.login(data);
            setIsAuthenticated(true);    
        }
        finally{
            setLoading(false);
        }
    }

    const signup = async (data)=>{
        setLoading(true);
        try{
            await authApi.signup(data);
            setIsAuthenticated(true);    
        }
        finally{
            setLoading(false);
        }
    }

    const logout = async () => {
        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include"
        });

        setUser(null);
    };


    return (
        <AuthContext.Provider
          value={{isAuthenticated,loading,Login,signup}}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext)