//interfaces
import { ILogin, IAuthentication } from "../interfaces/Authentication";

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
    
            const request:IAuthentication = {
                success: response.ok,
                ...result
            }
    
            return request;

        } catch(error) {
            console.error(error);

        }

    };

    return {
        login
    };
};

export default useAuthentication;