//interfaces
import { IStatus, IBedResponse, IBedParams } from "../interfaces/Bed";

const url = `${process.env.REACT_APP_BASE_URL}`;

interface Params {
    token: string,
    data?: IBedParams
};

const useBed = () => {

    const config = async({params, url, method}: {params?:Params, url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE'}): Promise<IBedResponse> => {
        try {
            const paramsResponse = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                }
            } as {
                method: string,
                headers: {
                    'Content-Type': string,
                    Authorization: string
                },
                body: string
            }

            if(params?.token && params){
                paramsResponse.headers.Authorization = `Bearer ${params.token}`
            }
            
            if(params){
                if(params.data) {
                    paramsResponse.body = JSON.stringify(params.data)
                }
            }
            
            const response:Response = await fetch(url, paramsResponse);
            
            const result = await response.json();

            return {
                success: response.ok,
                ...result
            } as IBedResponse;

        } catch(error) {
            return {
                success: false,
                message: 'Erro interno no sistema. Contate o administrador.'
            } as IBedResponse;
        }
    };

    return {
        status: ({params}: {params: Params}) => {
            return config({params, url: `${url}leitos/status/`, method: 'GET'})
        },
        type: ({params}: {params: Params}) => {
            return config({params, url: `${url}leitos/tipo/`, method: 'GET'})
        },
        register: ({params}: {params: Params}) => {
            return config({params, url: `${url}leitos/cadastrar/`, method: 'POST'});
        },
        list: ({params, sector}: {params: Params, sector: string}) => {
            return config({params, url: `${url}leitos/listar/${sector}/`, method: 'GET'});
        },
        occupation: ({params, bed}: {params: Params, bed: string}) => {
            return config({params, url: `${url}leitos/occupation/${bed}/`, method: 'PUT'});
        },
        active: ({params, bed}: {params: Params, bed: string}) => {
            return config({params, url: `${url}leitos/active/${bed}/`, method: 'PUT'});
        },
        remove: ({params, bed}: {params: Params, bed: string}) => {
            return config({params, url: `${url}leitos/remove/${bed}/`, method: 'DELETE'});
        },
        sectors: (hospital: string) => {
            return config({url: `${url}leitos/public/${hospital}/`, method: 'GET'});
        }
    }

};

export default useBed;