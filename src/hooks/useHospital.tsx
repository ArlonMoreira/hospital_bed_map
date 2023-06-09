//interfaces
import { IHospitalParams, IHospitalResponse } from "../interfaces/Hospital";

const url = `${process.env.REACT_APP_BASE_URL}`;

interface Params {
    token: string,
    data ?: IHospitalParams
};

const useHospital = () => {

    const hospital = async({params, id}:{params: Params, id: string}):Promise<IHospitalResponse> => {
        try {
            const response:Response = await fetch(`${url}hospital/${id}/`, {
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
            } as IHospitalResponse;

        } catch(error) {
            return {
                success: false,
                message: 'Erro interno no sistema. Contate o administrador.'
            } as IHospitalResponse;
        }
    };

    const hospitals = async(params: Params):Promise<IHospitalResponse> => {
        try {
            const response:Response = await fetch(`${url}hospital/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${params.token}`
                }
            });
            const result = await response.json();

            const request:IHospitalResponse = {
                success: response.ok,
                ...result
            };

            return request;

        } catch(error) {
            return {
                success: false,
                message: 'Erro interno no sistema. Contate o administrador.'
            } as IHospitalResponse;
        }
    };

    const register = async (params: Params):Promise<IHospitalResponse> => {
        try {
            const response:Response = await fetch(`${url}hospital/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${params.token}`
                },
                body: JSON.stringify(params.data)
            });
    
            const result = await response.json();
    
            const request:IHospitalResponse = {
                success: response.ok,
                ...result
            };
    
            return request;
        } catch(error) {
            return {
                success: false,
                message: 'Erro interno no sistema. Contate o administrador.'
            } as IHospitalResponse;
        };

    };

    return {
        hospital,
        register,
        hospitals
    }
};

export default useHospital;