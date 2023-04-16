//interfaces
import { ILogin, IAuthentication } from "../interfaces/Authentication";
import { IData } from "../interfaces/Data";

const url = `${process.env.REACT_APP_BASE_URL}`;

const useAuthentication = () => {

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
        logout
    };
};

export default useAuthentication;