//interface
import { ISectorParams, ISectorResponse, ISector } from "../interfaces/Sector";

const url = `${process.env.REACT_APP_BASE_URL}`;

interface Params {
    id?: number | string,
    token: string,
    data?: ISectorParams
}

const useSectors = () => {

    const list = async({id, token}: Params):Promise<ISectorResponse> => {
        try {
            const response: Response = await fetch(`${url}setor/${id}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
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

    const update = async ({id, token, data}: Params) => {
        try {
            const response:Response = await fetch(`${url}setor/atualizar/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();

            return {
                success: response.ok,
                ...result
            } as ISectorResponse

        } catch (error) {
            return {
                success: false,
                message: 'Erro interno no sistema. Contate o administrador.'
            } as ISectorResponse
        }
    };

    return {
        register,
        list,
        update
    };

};

export default useSectors;