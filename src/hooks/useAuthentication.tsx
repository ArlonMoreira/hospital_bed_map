//Jwt decode
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
//interfaces
import { ILogin, IAuthentication } from "../interfaces/Authentication";
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

    const refreshToken = async(user: IAuthentication):Promise<IAuthentication> => {

        let accessToken:string = '';
        let refreshToken:string = '';
        
        if(typeof user === 'object'){ //user pode retornar um array ou um objecto pra que não ocorra um erro, será necessário afirmar que trata-se de um objeto
            if('access' in user.data && 'refresh' in user.data){ //É preciso afirmar que access e refresh existem no objeto data, caso contrário ocorrerá o erro "'access' in user.data && 'refresh' in user.data"
                accessToken = user.data.access
                refreshToken = user.data.refresh
            }
        }
        
        const decodedAccessToken:DecodedAccessToken = jwt_decode(accessToken); //Decodifica o token
        const dataFinshToken = dayjs.unix(decodedAccessToken.exp); //Data em que o token expira
        const isExpired = dataFinshToken.diff(dayjs()) < 1; //Compara com a data atual e verifica se o token expirou

        if (!isExpired) return user; //Se não tiver expirado retorna o usuário original

        const access: string = await fetch(`${url}token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "refresh": refreshToken
            })
        }).then((result) => result.json())
        .catch((error) => { throw error });

        if(typeof user === 'object' && 'access' in user.data){
            user.data.access = access;
        }

        return user;
        
    };

    const login = async(params: ILogin):Promise<IAuthentication | undefined> => {
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

        } catch(error) {
            console.error(error);

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