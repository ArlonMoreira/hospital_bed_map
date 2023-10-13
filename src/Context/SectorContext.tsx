//Hooks
import { useContext, createContext, useState, SetStateAction, Dispatch } from "react";

interface ISectorContext {
    sectorSelected: string | null,
    setSectorSelected: Dispatch<SetStateAction<string | null>>
};

//Preciso criar uma instância do contexto qeu inicialmente receberá o valor nulo
const SectorContext = createContext<ISectorContext | null>(null);

export const SectorProvider = ({children}: {children:any}) => {

    const [sectorSelected, setSectorSelected] = useState<string | null>(null);

    return (
        <SectorContext.Provider value={{sectorSelected, setSectorSelected}}>
            {children}
        </SectorContext.Provider>
    )
};

export const useSectorContext = () => {
    return useContext(SectorContext);
};