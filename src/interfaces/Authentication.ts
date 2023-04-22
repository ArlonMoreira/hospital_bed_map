export interface ILogin {
    username: string;
    password: string;
};

//Interface com os tokens de acesso.
export interface IAuth {
    access: string;
    refresh: string;
}

//A api de autenticação pode retornar os valores IAuth caso ocorrer uscesso como também um array
export interface IAuthentication {
    success: boolean;
    message: string;
    data: 
        IAuth | 
        [
            {
                [key: string]: string[] //A chave é string e o valor é um array(lista) de string.
            }
        ] | 
        []
};

export interface AuthHookResult {
    auth: boolean
};