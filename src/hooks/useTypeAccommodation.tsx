//interfaces
import { ITypeAccommodationResponse } from "../interfaces/TypeAccommodation";

const url = `${process.env.REACT_APP_BASE_URL}`;

interface Params {
    token: string
}

const useTypeAccommodation = () => {

    const list = async (params: Params): Promise<ITypeAccommodationResponse> => {
        try {
            const response:Response = await fetch(`${url}setor/acomodacoes/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${params.token}`
                }
            });
            const result = await response.json();
        
            return {
                success: response.ok,
                ...result
            } as ITypeAccommodationResponse;            

        } catch(error) {
            return {
                success: false,
                message: 'Erro interno no sistema. Contate o administrador.'
            } as ITypeAccommodationResponse
        }
    };

    return {
        list
    };
    
};

export default useTypeAccommodation;