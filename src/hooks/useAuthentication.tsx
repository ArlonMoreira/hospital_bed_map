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

interface refreshResponse {
    access: string
}
  
const useAuthentication = () => {

    const refreshToken = async(user: IAuth):Promise<IAuth> => { //Caso não tiver autenticado pode receber valor null

        let accessToken:string = '';
        let refreshToken:string = '';

        accessToken = user.access;
        refreshToken = user.refresh;

        const decodedAccessToken:DecodedAccessToken = jwt_decode(accessToken); //Decodifica o token
        const dataFinshToken = dayjs.unix(decodedAccessToken.exp); //Data em que o token expira
        const isExpired = dataFinshToken.diff(dayjs()) < 1; //Compara com a data atual e verifica se o token expirou

        if (!isExpired) return user; //Se não tiver expirado retorna o usuário original
        
        const response: Response = await fetch(`${url}token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "refresh": refreshToken
            })
        });
        const result: refreshResponse = await response.json();
        
        return {
            access: result.access,
            refresh: user.refresh
        };
    
    };

    const login = async(params: ILogin):Promise<IAuthentication> => {
        try {
            const response: Response = await fetch(`${url}accounts/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            });
    
            const result = await response.json();
            
            const request: IAuthentication  = {
                success: response.ok,
                ...result
            };
            
            return request;

        } catch(error: unknown) {
            const request: IAuthentication = {
                success: false,
                message: 'Ocorreu um erro ao realizar o login. Erro interno no sistema. Contate o administrador do sistema.',
                data: []
            }
            return request;
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