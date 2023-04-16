export interface ILogin {
    username: string;
    password: string;
};

export interface IAuthentication {
    success: boolean;
    message: string;
    data: { //Caso for com sucesso retornará esse objeto caso contrário o array será retornado um array vazio
        refresh: string
        access: string
    } | []
};

export interface AuthHookResult {
    auth: boolean
};