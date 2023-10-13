//Hooks
import { useContext, createContext, useState, SetStateAction, Dispatch } from "react";

interface IBedContext {
    bedSelected: string | null,
    setBedSelected: Dispatch<SetStateAction<string | null>>
};

const BedContext = createContext<IBedContext | null>(null);

export const BedProvider = ({children}: {children:any}) => {

    const [bedSelected, setBedSelected] = useState<string | null>(null);

    return (
        <BedContext.Provider value={{bedSelected, setBedSelected}}>
            {children}
        </BedContext.Provider>
    );

};

export const useBedContext = () => {
    return useContext(BedContext);
};

