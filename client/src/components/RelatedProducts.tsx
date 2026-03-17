import { useState, useEffect } from 'react';
import type { ProductView } from '../types/types';

interface RelatedProductsProps {
  categoryName: string;
  excludeId: number;
  backendUrl: string;
}

export default function RelatedProducts({ categoryName, excludeId, backendUrl }: RelatedProductsProps) {
  const [products, setProducts] = useState<ProductView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!categoryName) {
        setLoading(false);
        return;
      }

      try {
        const query = `fields[0]=name&populate[categories][fields][0]=name&populate[model][fields][0]=name&populate[brand][fields][0]=name&populate[images][fields][0]=url&populate[images][fields][1]=alternativeText&pagination[pageSize]=12&sort[0]=createdAt:desc`;
        const response = await fetch(
          `${backendUrl}/api/productos?filters[categories][name][$eq]=${encodeURIComponent(categoryName)}&${query}`
        );

        if (response.ok) {
          const { data } = await response.json();
          const filtered = data
            .filter((p: any) => p.id !== excludeId)
            .map((p: any) => ({
              id: p.id,
              name: p.name,
              images: (p.images ?? []).map((img: any) => ({
                id: img.id,
                url: `${backendUrl}${img.url}`,
                alt: img.alternativeText ?? '',
              })),
              category: p.categories?.[0]?.name ?? '',
              categories: p.categories?.map((cat: any) => cat.name) ?? [],
              brand: p.brand?.name ?? '',
              model: p.model?.name ?? '',
              description: p.description ?? '',
            }));
          setProducts(filtered);
        }
      } catch (error) {
        console.error('Error loading related products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [categoryName, excludeId, backendUrl]);

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Productos relacionados
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="aspect-3/4 bg-gray-200 animate-pulse"></div>
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-200 animate-pulse rounded w-1/3"></div>
                  <div className="h-5 bg-gray-200 animate-pulse rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : products.length > 0 ? (
            products.map((item) => (
              <a
                key={item.id}
                href={`/producto/${item.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-3/4 bg-gray-100 overflow-hidden">
                  <img
                    src={item.images[0]?.url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">
                    {item.brand}
                  </span>
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#504aff] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600">{item.model}</p>
                </div>
              </a>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-500">
              No hay productos relacionados disponibles
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
