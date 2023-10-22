//interfaces
import { IHospitalParams, IHospitalResponse } from "../interfaces/Hospital";

const url = `${process.env.REACT_APP_BASE_URL}`;

interface Params {
    token?: string,
    data ?: IHospitalParams
};

const useHospital = () => {

    const config = async({params, url, method}: {params?:Params, url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE'}): Promise<IHospitalResponse> => {
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
            } as IHospitalResponse;

        } catch(error) {
            return {
                success: false,
                message: 'Erro interno no sistema. Contate o administrador.'
            } as IHospitalResponse
        }
    };

    return {
        hospital: ({params, hospital}: {params: Params, hospital: string}) => {
            return config({params, url: `${url}hospital/${hospital}/`, method: 'GET'});
        },
        hospitals: ({ token }: Params = {}) => {
            if(!token){
                return config({url: `${url}hospital/public/`, method: 'GET'});
            }
            
            const params = {
                token
            } as Params

            return config({params, url: `${url}hospital/`, method: 'GET'});
        },
        register: ({token, data}: Params) => {
            const params = {
                token, data
            } as Params

            return config({params, url: `${url}hospital/cadastrar/`, method: 'POST'});
        },
        update: ({params, hospital}: {params: Params, hospital: string}) => {
            return config({params, url: `${url}hospital/${hospital}/`, method: 'PUT'});
        },
    }
};

export default useHospital;