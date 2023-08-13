export interface IType {
    id: number | null;
    description: string | null;
}

export interface IStatus {
    id: number | null;
    status: string | null;
    description: string | null;
}

export interface IBedParams {
    sector: number | null;
    name: string | null;
    type_occupation: number | null;
    type: number | null;
    is_active: boolean;
    is_extra: boolean;
}

export interface IBedErrors {
    sector?: string[];
    name?: string[];
    type_occupation?: string[];
    type?: string[];
    is_active?: string[];
    is_extra?: string[];
}

export interface IBed {
    id: number;
    hospital_id: number;
    sector_id: number;
    name: string;
    type_occupation_status: string;
    type_occupation_description: string;
    type: string;
    is_active: boolean;
    is_extra: boolean;
}

export interface IBedResponse {
    success: boolean;
    message: string;
    data?: IStatus[] | IType[] | IBed[] | IBedErrors;
}