export interface StrapiNameRelation {
    name: string;
}

export interface StrapiImage {
    id: number;
    url: string;
    alternativeText?: string;
}

export interface StrapiProduct {
    id: number;
    name: string;
    description: string;
    images: StrapiImage[];
    category: StrapiNameRelation;
    brand: StrapiNameRelation;
    model: StrapiNameRelation;
}

export interface ProductImage {
    id: number;
    url: string;
    alt: string;
}

export interface ProductView {
    id: number;
    name: string;
    images: ProductImage[];
    category: string;
    brand: string;
    model: string;
    description: string;
}

