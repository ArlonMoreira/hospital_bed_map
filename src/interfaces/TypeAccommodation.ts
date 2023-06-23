export interface ITypeAccommodation {
    id: number,
    description: string
};

export interface ITypeAccommodationResponse {
    success: boolean;
    message: string;
    data?: ITypeAccommodation[]
};