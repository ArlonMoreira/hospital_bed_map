//Jwt decode
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
//interfaces
import { ILogin, IAuthentication, IAuth } from "../interfaces/Authentication";
import { IData } from "../interfaces/Data";

const url = `${process.env.REACT_APP_BASE_URL}`;

interface DecodedAccessToken {
    exp: number; //tempo de expiração do token em formato UNIX timestamp (em segundos)
    iat: number; //tempo em que o token foi emitido, também em formato UNIX timestamp (em segundos)
    jti: string; //um identificador único para o token.
    token_type: 'access' | 'refresh', //tipo de token
    user_id: number; // identificador do usuário autenticado.
}
  
const useAuthentication = () => {

    const refreshToken = async(user: IAuth):Promise<IAuthentication> => { //Caso não tiver autenticado pode receber valor null

        const { access, refresh } = user;

        const decodedAccessToken:DecodedAccessToken = jwt_decode(access); //Decodifica o token
        const tokenExpirationDate = dayjs.unix(decodedAccessToken.exp); //Data em que o token expira
        const isTokenExpired = tokenExpirationDate.diff(dayjs()) < 1; //Compara com a data atual e verifica se o token expirou

        if (!isTokenExpired) {//Se não tiver expirado retorna o usuário original
            return { 
                success: true,
                message: 'Sessão renovada.',
            } as IAuthentication
        } 
        
        try {
            const response:Response = await fetch(`${url}token/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refresh
                })
            });
            
            if(!response.ok){
                return {
                    success: response.ok,
                    message: 'Sessão encerrada.'
                } as IAuthentication
            }

            const result:IAuth = await response.json();
            
            return {
                success: response.ok,
                message: 'Sessão renovada.',
                data: {
                    access: result.access,
                    refresh,
                },
            } as IAuthentication; 

        } catch(Error: unknown) {
            return { 
                success: false,
                message: 'Erro interno no sistema. Contate o administrador.'
            } as IAuthentication; 

        }
    
    };

    const login = async(params: ILogin):Promise<IAuthentication> => {
        try {
            const response:Response = await fetch(`${url}accounts/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            });
    
            const result = await response.json();
            
            const request:IAuthentication  = {
                success: response.ok,
                ...result
            };
            
            return request;

        } catch(error) {
            return {
                success: false,
                message: 'Erro interno no sistema. Contate o administrador.'
            } as IAuthentication;
        }

    };

    const logout = async():Promise<IData | undefined> => {
        try {
            const response: IData = await fetch(`${url}accounts/logout/`, {
                method: 'POST'
            }).then((data) => data.json())
            .catch((error) => console.error(error))

            return response;
            
        } catch(error) {
            console.error(error);
        }
    };

    return {
        login,
        logout,
        refreshToken
    };
};

export default useAuthentication;