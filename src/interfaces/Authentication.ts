export interface ILogin {
    username: string;
    password: string;
};

/**
 * Quando sucesso no login é retornado o token de acesso e o token de atualização.
 */
export interface IAuth {
    access: string;
    refresh: string;
}

/**
 * Quando ocorre erro de atenticação 401, são retornados as inconsistências existentes para os campos
 * username e password
 */
export interface IAuthError {
    username: string[],
    password: string[]
}

export interface IRefreshError {
    refresh: string[],
}

/**
 * A api de autenticação pode retornar os valores (IAuth) caso ocorrer sucesso.
 * Ou um erro (IAuthError), ou então pode não retornar nada caso for um erro interno no sistema. 
 * */
export interface IAuthentication {
    success: boolean;
    message: string;
    data?: IAuth | IAuthError | IRefreshError
};

export interface AuthHookResult {
    auth: boolean
};