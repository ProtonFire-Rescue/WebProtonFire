import type { StrapiProduct } from "../types";

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
      throw new Error(`HTTP error! status: ${response.status}`);
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
        `${STRAPI_URL}/api/productos?filters[category][name][$eq]=${encodeURIComponent(categoryName)}&populate=${encodeURIComponent(populate)}`,
        `related-${categoryName}-${populate}`,
    );
};

export const getRelatedProductsQuery = async (categoryName: string, query: string, opts?: { cacheTtlMs?: number }) => {
    const q = query.startsWith('?') ? query.slice(1) : query;
    return fetchWithCache(
        `${STRAPI_URL}/api/productos?filters[category][name][$eq]=${encodeURIComponent(categoryName)}&${q}`,
        `related-${categoryName}-${q}`,
    );
};

// Nueva función para obtener categorías con sus productos en paralelo (para el menú)
export const getCategoriesWithProducts = async () => {
  try {
    // Obtener categorías y productos en paralelo
    const categoriesData = await fetchWithCache(`${STRAPI_URL}/api/categories?fields[0]=name&populate[type][fields][0]=name`, 'categories-menu');
    const productsData = await fetchWithCache(`${STRAPI_URL}/api/productos?populate=category&populate[brand][fields][0]=name`, 'products-menu');

    console.log(categoriesData);
    console.log(productsData);

    // Agrupar productos por categoría
    const categoriesMap = new Map();
    
    // Inicializar categorías
    if (categoriesData?.data) {
      categoriesData.data.forEach((category: any) => {
        categoriesMap.set(category.id, {
          id: category.id,
          name: category.categoryName || category.name,
          slug: category.slug || (category.categoryName || category.name)?.toLowerCase().replace(/\s+/g, '-'),
          products: []
        });
      });
    }

    // Agrupar productos por categoría
    if (productsData?.data) {
      productsData.data.forEach((product: any) => {
        const categoryId = product.category?.id;
        if (categoryId && categoriesMap.has(categoryId)) {
          const category = categoriesMap.get(categoryId);
          category.products.push({
            id: product.id,
            name: product.product_name || product.name,
            slug: product.slug || (product.product_name || product.name)?.toLowerCase().replace(/\s+/g, '-'),
            brand: product.brand?.modelName || product.brand?.name
          });
        }
      });
    }

    return Array.from(categoriesMap.values());
  } catch (error) {
    console.error('Error fetching categories with products:', error);
    return [];
  }
};