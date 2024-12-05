import React, {createContext, useContext, useState, ReactNode} from "react"; 

interface ResetPasswordEmailContextType {
    email: string; 
    setEmail: React.Dispatch<React.SetStateAction<string>>; 
}

const ResetPasswordEmailContext = createContext<ResetPasswordEmailContextType | undefined>(undefined); 

export const ResetPasswordEmailProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [email, setEmail] = useState<string>(""); 
    return (
        <ResetPasswordEmailContext.Provider value={{email, setEmail}}>
            {children} 
        </ResetPasswordEmailContext.Provider>
    ); 
}; 

export const useResetPasswordEmail = (): ResetPasswordEmailContextType => {
    const context = useContext(ResetPasswordEmailContext); 
    if(!context)
    {
        throw new Error("useResetPasswordEmail must be used within a ResetPasswordEmailProvider"); 
    }

    return context; 
}
