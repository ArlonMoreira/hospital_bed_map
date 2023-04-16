
export interface ILogin {
    username: string;
    password: string;
};

export interface IAuthentication {
    success: boolean;
    message: string;
    data: {
        refresh: string
        access: string
    }
};