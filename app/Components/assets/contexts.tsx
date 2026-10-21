//darkmode context
"use client"
import { Dispatch, SetStateAction , createContext, useContext , useState , ReactNode } from "react"


interface Mode {
    mode: string
    setMode: Dispatch <SetStateAction<string>>
}

//create context

const themeContext = createContext<Mode | null>(null)

export const useThemeContext = () => {
    const context = useContext(themeContext)

    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context
}

//ThemeProvider
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [mode, setMode] = useState<string>("light");
    return (
        <themeContext.Provider value={{ mode, setMode }}>
            {children}
        </themeContext.Provider>
    );
};


// register form


interface Form {
    form: string
    setForm: Dispatch <SetStateAction<string>>
}

//create context

const formContext = createContext<Form | null>(null)

export const useFormContext = () => {
    const context = useContext(formContext)

    if (!context) {
        throw new Error('useform must be used within a formProvider');
    }
    return context
}

//ThemeProvider
export const FormProvider = ({ children }: { children: ReactNode }) => {
    const [form, setForm] = useState<string>("login");
    return (
        <formContext.Provider value={{ form, setForm }}>
            {children}
        </formContext.Provider>
    );
};

//open comments 




interface selectedComment {
    selectedComment: string,
    setSelectedComment: Dispatch <SetStateAction<string>>
}


const SelectedCommentContext = createContext<selectedComment | null>(null)

export const useSelectedCommentContext = () => {
    const context = useContext(SelectedCommentContext)

    if (!context) {
        throw new Error('useTheme must be used within a commentsProvider');
    }
    return context
}

export const SelectedCommentsProvider = ({ children }: { children: ReactNode }) => {
    const [selectedComment, setSelectedComment] = useState<string>("");
    return (
        <SelectedCommentContext.Provider value={{ selectedComment, setSelectedComment }}>
            {children}
        </SelectedCommentContext.Provider>
    );
};

//opencheckout




interface checkout {
    openCheckout: boolean,
    setOpenCheckout: Dispatch <SetStateAction<boolean>>
}


const OpenCheckoutContext = createContext<checkout | null>(null)

export const useOpenCheckoutContext = () => {
    const context = useContext(OpenCheckoutContext)

    if (!context) {
        throw new Error('useTheme must be used within a checkoutProvider');
    }
    return context
}

export const OpenCheckoutProvider = ({ children }: { children: ReactNode }) => {
    const [openCheckout, setOpenCheckout] = useState<boolean>(false);
    return (
        <OpenCheckoutContext.Provider value={{ openCheckout, setOpenCheckout }}>
            {children}
        </OpenCheckoutContext.Provider>
    );
};

//open update profile 

interface updateProfile {
    openUpdateProfile: boolean,
    setOpenUpdateProfile: Dispatch <SetStateAction<boolean>>
}


const OpenUpdateProfileContext = createContext<updateProfile | null>(null)

export const useUpdateProfileContext = () => {
    const context = useContext(OpenUpdateProfileContext)

    if (!context) {
        throw new Error('useTheme must be used within a updatesProvider');
    }
    return context
}

export const OpenUpdateProfileProvider = ({ children }: { children: ReactNode }) => {
    const [openUpdateProfile, setOpenUpdateProfile] = useState<boolean>(false);
    return (
        <OpenUpdateProfileContext.Provider value={{ openUpdateProfile, setOpenUpdateProfile }}>
            {children}
        </OpenUpdateProfileContext.Provider>
    );
};