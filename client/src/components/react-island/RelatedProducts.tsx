import { useState, useEffect } from 'react'
import type { ProductView } from '../../types/types'

interface RelatedProductsProps {
  categoryName: string
  excludeId: number
  backendUrl: string
}

export default function RelatedProducts({
  categoryName,
  excludeId,
  backendUrl
}: RelatedProductsProps) {
  const [products, setProducts] = useState<ProductView[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!categoryName) {
        setLoading(false)
        return
      }

      try {
        const query = `fields[0]=name&fields[1]=slug&populate[categories][fields][0]=name&populate[model][fields][0]=name&populate[brand][fields][0]=name&populate[images][fields][0]=url&populate[images][fields][1]=alternativeText&pagination[pageSize]=12&sort[0]=createdAt:desc`
        const response = await fetch(
          `${backendUrl}/api/productos?filters[categories][name][$eq]=${encodeURIComponent(categoryName)}&${query}`
        )

        if (response.ok) {
          const { data } = await response.json()
          const filtered = data
            .filter((p: any) => p.documentId !== excludeId)
            .map((p: any) => ({
              id: p.id,
              documentId: p.documentId,
              slug: p.slug,
              name: p.name,
              images: (p.images ?? []).map((img: any) => ({
                id: img.id,
                url: img.url,
                alt: img.alternativeText ?? ''
              })),
              category: p.categories?.[0]?.name ?? '',
              categories: p.categories?.map((cat: any) => cat.name) ?? [],
              brand: p.brand?.name ?? '',
              model: p.model?.name ?? '',
              description: p.description ?? ''
            }))
          setProducts(filtered)
        }
      } catch (error) {
        console.error('Error loading related products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedProducts()
  }, [categoryName, excludeId, backendUrl])

  console.log(products)

  return (
    <section className='bg-gray-50 py-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-2xl font-bold text-[#2f2f3b]'>
            Productos relacionados
          </h2>
        </div>
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className='bg-white rounded-2xl overflow-hidden border border-gray-100'
              >
                <div className='aspect-3/4 bg-gray-100 animate-pulse'></div>
                <div className='p-4 space-y-2'>
                  <div className='h-3 bg-gray-100 animate-pulse rounded-full w-1/3'></div>
                  <div className='h-5 bg-gray-100 animate-pulse rounded-full w-2/3'></div>
                  <div className='h-4 bg-gray-100 animate-pulse rounded-full w-1/2'></div>
                </div>
              </div>
            ))
          ) : products.length > 0 ? (
            products.slice(0, 4).map((item) => (
              <a
                key={item.id}
                href={`/producto/${item.documentId}/${item.slug}`}
                className='group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300'
              >
                <div className='relative aspect-3/4 bg-gray-50 overflow-hidden p-4'>
                  <img
                    src={item.images[0]?.url}
                    alt={item.name}
                    className='w-full h-full object-contain group-hover:scale-105 transition-transform duration-500'
                    loading='lazy'
                  />
                  <span className='absolute top-3 left-3 bg-[#504aff]/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider'>
                    {item.category}
                  </span>
                </div>
                <div className='p-4'>
                  <h3 className='font-semibold text-[#2f2f3b] text-sm mb-1 uppercase tracking-wide group-hover:text-[#504aff] transition-colors'>
                    {item.name}
                  </h3>
                  <p className='text-xs text-gray-400 mb-1'>{item.model}</p>
                  <p className='text-xs text-[#504aff] font-medium'>
                    Marca: {item.brand}
                  </p>
                </div>
              </a>
            ))
          ) : (
            <div className='col-span-full text-center py-8 text-gray-500'>
              No hay productos relacionados disponibles
            </div>
          )}
        </div>
        {!loading && products.length > 4 && (
          <div className='flex justify-center mt-10'>
            <a
              href={`/catalogo?categoria=${encodeURIComponent(categoryName)}`}
              className='inline-flex items-center gap-2 bg-[#504aff] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#3f3bcc] transition-all duration-300 shadow-md shadow-[#504aff]/20 hover:shadow-lg hover:shadow-[#504aff]/30 hover:-translate-y-0.5 text-sm'
            >
              Ver todos los productos de {categoryName}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='m9 18 6-6-6-6' />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
