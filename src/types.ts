export interface AnimalResponse {
    name: string;
    description: string;
    gender: string;
    img: string;
    link: string;
}

export interface Animal extends AnimalResponse {
    caption: string;
}

export interface TotalNumber {
    total: number;
}