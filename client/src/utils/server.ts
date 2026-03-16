import type { StrapiProduct } from "../types";

const STRAPI_URL = (import.meta as any).env?.PUBLIC_STRAPI_URL ?? 'http://localhost:1337';

type CacheEntry = { expiresAt: number; value: unknown };
const __cache = new Map<string, CacheEntry>();

const fetchJson = async <T>(url: string, init?: RequestInit, cacheTtlMs?: number): Promise<T> => {
    const cacheKey = `${init?.method ?? 'GET'} ${url}`;
    if (cacheTtlMs && cacheTtlMs > 0) {
        const cached = __cache.get(cacheKey);
        if (cached && cached.expiresAt > Date.now()) return cached.value as T;
    }

    const response = await fetch(url, init);
    if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }
    const data = (await response.json()) as T;

    if (cacheTtlMs && cacheTtlMs > 0) {
        __cache.set(cacheKey, { expiresAt: Date.now() + cacheTtlMs, value: data });
    }
    return data;
};

export const getProducts = async (opts?: { populate?: string; cacheTtlMs?: number }) => {
    const populate = opts?.populate ?? '*';
    return fetchJson<{data: StrapiProduct[]}>(`${STRAPI_URL}/api/productos?populate=${encodeURIComponent(populate)}`, undefined, opts?.cacheTtlMs);
};

export const getProductsQuery = async (query: string, opts?: { cacheTtlMs?: number }) => {
    const q = query.startsWith('?') ? query.slice(1) : query;
    return fetchJson<{data: StrapiProduct[]}>(`${STRAPI_URL}/api/productos?${q}`, undefined, opts?.cacheTtlMs);
};

export const getCategories = async (opts?: { cacheTtlMs?: number }) => {
    const {data} = await fetchJson<{data: any[]}>(`${STRAPI_URL}/api/categories`, undefined, opts?.cacheTtlMs);
    const refinedData = ['Todos', ...data.map((category: any) => category.name)];
    return refinedData;
};

export const getBrands = async (opts?: { cacheTtlMs?: number }) => {
    const {data} = await fetchJson<{data:any[]}>(`${STRAPI_URL}/api/brands`, undefined, opts?.cacheTtlMs);
    const refinedData = ['Todos', ...data.map((brand: any) => brand.name)];
    return refinedData;
};

export const getProductById = async (
    id: string | undefined,
    opts?: { populate?: string; cacheTtlMs?: number },
) => {
    if (!id) throw new Error('Missing id');
    const populate = opts?.populate ?? '*';
    return fetchJson(
        `${STRAPI_URL}/api/productos?filters[id][$eq]=${encodeURIComponent(id)}&populate=${encodeURIComponent(populate)}`,
        undefined,
        opts?.cacheTtlMs,
    );
};

export const getProductByIdQuery = async (id: string | undefined, query: string, opts?: { cacheTtlMs?: number }) => {
    if (!id) throw new Error('Missing id');
    const q = query.startsWith('?') ? query.slice(1) : query;
    return fetchJson<{data: StrapiProduct[]}>(`${STRAPI_URL}/api/productos?filters[id][$eq]=${encodeURIComponent(id)}&${q}`, undefined, opts?.cacheTtlMs);
};

export const getRelatedProducts = async (
    categoryName: string,
    opts?: { populate?: string; cacheTtlMs?: number },
) => {
    const populate = opts?.populate ?? '*';
    return fetchJson<{data: StrapiProduct[]}>(
        `${STRAPI_URL}/api/productos?filters[category][name][$eq]=${encodeURIComponent(categoryName)}&populate=${encodeURIComponent(populate)}`,
        undefined,
        opts?.cacheTtlMs,
    );
};

export const getRelatedProductsQuery = async (categoryName: string, query: string, opts?: { cacheTtlMs?: number }) => {
    const q = query.startsWith('?') ? query.slice(1) : query;
    return fetchJson<{data: StrapiProduct[]}>(
        `${STRAPI_URL}/api/productos?filters[category][name][$eq]=${encodeURIComponent(categoryName)}&${q}`,
        undefined,
        opts?.cacheTtlMs,
    );
};