/**
 * Converts a string to a URL-friendly slug.
 * E.g. "Equipos SCBA & Protección" → "equipos-scba-proteccion"
 */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')    // non-alphanumeric → hyphen
    .replace(/^-+|-+$/g, '')         // trim leading/trailing hyphens
    .replace(/-{2,}/g, '-');         // collapse multiple hyphens
}

/**
 * Builds the canonical product URL.
 * @param categoryName - Human-readable category name (will be slugified)
 * @param productSlug  - Product slug from Strapi (already URL-safe)
 */
export function productUrl(categoryName: string, productSlug: string): string {
  const catSlug = slugify(categoryName || 'producto');
  return `/producto/${catSlug}/${productSlug}`;
}
