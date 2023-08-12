//interface
import { ISectorParams, ISectorResponse, ISector } from "../interfaces/Sector";

const url = `${process.env.REACT_APP_BASE_URL}`;

interface Params {
    id?: number | string,
    token: string,
    data?: ISectorParams
}

const useSectors = () => {

    const config = async({params, url, method}:{params:Params, url:string, method:string}) => {
        try {
            const response:Response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${params.token}`
                },
                body: JSON.stringify(params.data)
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
        }
    };

    return {
        register: ({id, token, data}: Params) => {
            return config({
                params: {
                    id, token, data 
                },
                url: `${url}setor/${id}/`,
                method: 'POST'
            });
        },
        list: ({id, token}: Params) => {
            return config({
                params: {
                    id, token 
                },
                url: `${url}setor/${id}/`,
                method: 'GET'
            });
        },
        update: ({id, token, data}: Params) => {
            return config({
                params: {
                    id, token, data 
                },
                url: `${url}setor/atualizar/${id}/`,
                method: 'PUT'
            });
        },
        remove: ({id, token}: Params) => {
            return config({
                params: {
                    id, token 
                },
                url: `${url}setor/remover/${id}/`,
                method: 'DELETE'
            });
        },
    };

};

export default useSectors;