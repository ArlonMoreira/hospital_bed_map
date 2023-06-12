export interface IHospitalErrors {
    cnes: string[];
    cnpj: string[];
    name: string[];
    acronym: string[];
    is_active: string[];
}

export interface IHospitalParams {
    cnes: string | null;
    cnpj: string | null;
    name: string;
    acronym: string;
    is_active?: boolean;    
}

export interface IHospital {
    id: number;
    cnes: string;
    cnpj: string;
    name: string;
    acronym: string;
    is_active: boolean;
}

export interface IHospitalResponse {
    success: boolean;
    message: string;
    data?: IHospital[] | IHospitalErrors
}