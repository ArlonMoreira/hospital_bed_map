export interface ILogin {
    username: string;
    password: string;
};

//Interface com os tokens de acesso.
export interface IAuth {
    access: string;
    refresh: string;
}

export interface IAuthError {
    username: string[],
    password: string[]
}

//A api de autenticação pode retornar os valores IAuth caso ocorrer uscesso como também um array
export interface IAuthentication {
    success: boolean;
    message: string;
    data: IAuth | IAuthError | unknown
};

export interface AuthHookResult {
    auth: boolean
};