import type { StrapiProduct } from "../types/types";

const STRAPI_URL = (import.meta as any).env?.PUBLIC_STRAPI_URL ?? 'http://localhost:1337';

type CacheEntry = { expiresAt: number; value: unknown };
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Helper function para cache
function getCachedData(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedData(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

// Optimización: fetch con timeout y cache
async function fetchWithCache(url: string, cacheKey: string): Promise<any> {
  // Verificar cache primero
  const cached = getCachedData(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch con timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

  try {
    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} ${response}`);
    }
    
    const data = await response.json();
    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export const getProducts = async (opts?: { populate?: string; cacheTtlMs?: number }) => {
  const populate = opts?.populate ?? '*';
  return fetchWithCache(`${STRAPI_URL}/api/productos?populate=${encodeURIComponent(populate)}`, `products-${populate}`);
};

export const getProductsQuery = async (query: string, opts?: { cacheTtlMs?: number }) => {
  const q = query.startsWith('?') ? query.slice(1) : query;
  return fetchWithCache(`${STRAPI_URL}/api/productos?${q}`, `products-${q}`);
};

export const getCategories = async (opts?: { cacheTtlMs?: number }) => {
  const {data} = await fetchWithCache(`${STRAPI_URL}/api/categories`, 'categories-all');
  const refinedData = ['Todos', ...data.map((category: any) => category.name)];
  return refinedData;
};

export const getBrands = async (opts?: { cacheTtlMs?: number }) => {
  const {data} = await fetchWithCache(`${STRAPI_URL}/api/brands`, 'brands-all');
  const refinedData = ['Todos', ...data.map((brand: any) => brand.name)];
  return refinedData;
};

export const getProductById = async (
  id: string | undefined,
  opts?: { populate?: string; cacheTtlMs?: number },
) => {
    if (!id) throw new Error('Missing id');
    const populate = opts?.populate ?? '*';
    return fetchWithCache(
        `${STRAPI_URL}/api/productos?filters[id][$eq]=${encodeURIComponent(id)}&populate=${encodeURIComponent(populate)}`,
        `product-${id}-${populate}`,
    );
};

export const getProductByIdQuery = async (id: string | undefined, query: string, opts?: { cacheTtlMs?: number }) => {
    if (!id) throw new Error('Missing id');
    const q = query.startsWith('?') ? query.slice(1) : query;
    return fetchWithCache(`${STRAPI_URL}/api/productos?filters[id][$eq]=${encodeURIComponent(id)}&${q}`, `product-${id}-${q}`);
};

export const getRelatedProducts = async (
    categoryName: string,
    opts?: { populate?: string; cacheTtlMs?: number },
) => {
    const populate = opts?.populate ?? '*';
    return fetchWithCache(
        `${STRAPI_URL}/api/productos?filters[categories][name][$eq]=${encodeURIComponent(categoryName)}&populate=${encodeURIComponent(populate)}`,
        `related-${categoryName}-${populate}`,
    );
};

export const getRelatedProductsQuery = async (categoryName: string, query: string, opts?: { cacheTtlMs?: number }) => {
    const q = query.startsWith('?') ? query.slice(1) : query;
    return fetchWithCache(
        `${STRAPI_URL}/api/productos?filters[categories][name][$eq]=${encodeURIComponent(categoryName)}&${q}`,
        `related-${categoryName}-${q}`,
    );
};
