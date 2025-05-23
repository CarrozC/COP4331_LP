// src/contexts/UserContext.tsx 
import React, {createContext, useContext, useState, ReactNode} from "react"; 

interface User {
    id: number; 
    diet: string[]; 
    firstName: string; 
    lastName: string; 
    username: string; 
    allergens: string[]; 
    favorites: number[]; 
    pantry: string[]; 
    email: string;
    emailVerified: boolean; 
}

interface UserContextType {
    user: User | null; 
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined); 

export const UserProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null); 

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children} 
        </UserContext.Provider>
    ); 
}; 

export const useUser = (): UserContextType => {
    const context = useContext(UserContext); 
    if(!context)
    {
        throw new Error("useUser must be used within a UserProvider"); 
    }

    return context; 
}