export interface ISectorErrors {
    name?: [];
    description?: [];
    tip_acc?: [];
    is_active?: [];
};

export interface ISectorParams {
    name?: string | null;
    description?: string | null;
    tip_acc?: string;
    is_active?: boolean;
}

export interface ISector {
    id?: number | string;
    name: string;
    description: string;
    tip_acc: string;
    activation_date?: string;
    deactivation_date?: string;
    is_active?: boolean
};

export interface ISectorResponse {
    success: boolean;
    message: string;
    data?: ISector[] | ISectorErrors
};