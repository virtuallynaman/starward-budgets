import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState();
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const isUser = JSON.parse(localStorage.getItem('user'));
        if (isUser) {
            setUser(isUser);
        }
    }, [])

    const login = (responseData) => {
        const userData = { email: responseData.email, accessToken: responseData.accessToken, name: responseData.name };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuth(true);
    }

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setIsAuth(false);
        toast.success("Logged out successfully");
    }    

    return (
        <AuthContext.Provider value={{ user, isAuth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}