export interface IErrors {
    error_message: string | null;
    errors: {
        [key: string]: string[] //A chave é string e o valor é um array(lista) de string.
    };
};