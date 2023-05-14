export interface IHospitalErrors {
    name: string[];
    acronym: string[];
    is_active: string[];
}

export interface IHospitalParams {
    name: string;
    acronym: string;
    is_active: boolean;    
}

export interface IHospital {
    id: number;
    name: string;
    acronym: string;
    is_active: boolean;
}

export interface IHospitalResponse {
    success: boolean;
    message: string;
    data: IHospital[] | IHospitalErrors[] | unknown
}