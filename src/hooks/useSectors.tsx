//interface
import { ISectorParams, ISectorResponse } from "../interfaces/Sector";

const url = `${process.env.REACT_APP_BASE_URL}`;

interface Params {
    id: number,
    token: string,
    data?: ISectorParams
}

const useSectors = () => {

    const register = async ({id, token, data}: Params):Promise<ISectorResponse> => {

        try {
            const response: Response = await fetch(`${url}setor/${id}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();

            return {
                success: response.ok,
                ...result
            } as ISectorResponse;

        } catch(error) {
            return {
                success: false,
                message: 'Erro interno no sistema. Contate o administrador.'
            } as ISectorResponse;
        };

    };

    return {
        register
    };

};

export default useSectors;