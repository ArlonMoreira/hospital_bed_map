//Hooks
import { useContext, createContext, useState, SetStateAction, Dispatch } from "react";

interface ICnesContext {
    cnesDefault: string | null,
    setCnesDefault: Dispatch<SetStateAction<string | null>>
};

const CnesContext = createContext<ICnesContext | null>(null);

export const CnesProvider = ({children}: {children:any}) => {

    const [cnesDefault, setCnesDefault] = useState<string | null>(null);

    return (
        <CnesContext.Provider value={{cnesDefault, setCnesDefault}}>
            {children}
        </CnesContext.Provider>
    );

};

export const useCnesContext = () => {
    return useContext(CnesContext);
};