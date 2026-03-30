import { useState, useRef, useCallback } from 'react'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Shield,
  Truck,
  Headphones,
  Award,
  User
} from 'lucide-react'
import type { ProductView } from '../../types/types'

interface ProductDetailProps {
  product: ProductView
  onCotizar?: (productId: string) => void
  onBack?: () => void
}

export default function ProductDetail({
  product,
  onCotizar
}: ProductDetailProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isCotizando, setIsCotizando] = useState(false)
  const thumbsRef = useRef<HTMLDivElement>(null)

  const selectedImage = product.images[currentIndex]?.url || ''

  const goToImage = useCallback((index: number) => {
    setCurrentIndex(index)
    // Scroll thumbnail into view
    const container = thumbsRef.current
    if (!container) return
    const thumb = container.children[index] as HTMLElement
    if (!thumb) return
    thumb.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    })
  }, [])

  const handleImageClick = useCallback(() => {
    const nextIndex = (currentIndex + 1) % product.images.length
    goToImage(nextIndex)
  }, [currentIndex, product.images.length, goToImage])

  const handleCotizar = () => {
    setIsCotizando(true)
    onCotizar?.(product.id.toString())
    setTimeout(() => setIsCotizando(false), 2000)
  }

  return (
    <div className='min-h-screen bg-white dark:bg-[#0b0b12]'>
      {/* Breadcrumb */}
      <div className='max-w-7xl mx-auto pt-30 px-4 sm:px-6 lg:px-8 py-4'>
        <nav className='flex items-center text-sm text-gray-400 dark:text-[#6b7280]'>
          <a href='/' className='hover:text-[#504aff] transition-colors'>
            Inicio
          </a>
          <ChevronRight size={14} className='mx-2' />
          <a
            href='/catalogo/all'
            className='hover:text-[#504aff] transition-colors'
          >
            Catálogo
          </a>
          <ChevronRight size={14} className='mx-2' />
          <span className='text-[#2f2f3b] dark:text-white font-medium truncate max-w-[200px]'>
            {product.name}
          </span>
        </nav>
      </div>

      {/* Main Product Section */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16'>
        <div className='grid lg:grid-cols-2 gap-6 lg:gap-12'>
          {/* Left - Image Gallery */}
          <div className='space-y-4 min-w-0'>
            {/* Main Image */}
            <div className='aspect-[4/3] sm:aspect-square bg-gray-50 dark:bg-[#12121e] rounded-2xl overflow-hidden border border-gray-100 dark:border-[#2a2a3e] relative group'>
              <img
                src={selectedImage}
                alt={product.name}
                className='w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105'
              />
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      goToImage(
                        (currentIndex - 1 + product.images.length) %
                        product.images.length
                      )
                    }
                    className='absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 dark:bg-[#1a1a2e]/80 hover:bg-white dark:hover:bg-[#1a1a2e] shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                    aria-label='Imagen anterior'
                  >
                    <ChevronLeft size={20} className='text-gray-700' />
                  </button>
                  <button
                    onClick={() =>
                      goToImage((currentIndex + 1) % product.images.length)
                    }
                    className='absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 dark:bg-[#1a1a2e]/80 hover:bg-white dark:hover:bg-[#1a1a2e] shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                    aria-label='Siguiente imagen'
                  >
                    <ChevronRight size={20} className='text-gray-700' />
                  </button>
                  <div className='absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full'>
                    {currentIndex + 1} / {product.images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails with navigation */}
            <div
              ref={thumbsRef}
              className='flex gap-2 sm:gap-3 overflow-x-hidden pb-1 scrollbar-hide'
            >
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => goToImage(index)}
                  className={`shrink-0 w-14 h-14 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${currentIndex === index
                      ? 'border-[#504aff] shadow-md shadow-[#504aff]/20'
                      : 'border-gray-200 dark:border-[#2a2a3e] hover:border-gray-300 dark:hover:border-[#504aff]/50'
                    }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className='w-full h-full object-cover'
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right - Product Info */}
          <div className='space-y-6 min-w-0'>
            {/* Categories badges */}
            <div className='flex flex-wrap gap-2'>
              {product.categories.map((category) => (
                <a href={`/catalogo/${category}`}
                  key={category}
                  className='group relative inline-flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-semibold px-3 py-1 rounded-full border border-green-200 dark:border-green-800'
                  data-tip={category}
                >
                  <Check size={12} />
                  {category}
                  <div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-[#2a2a3e] shadow-lg text-gray-700 dark:text-[#c8c8d8] text-xs font-normal p-3 rounded-lg opacity-0 invisible md:group-hover:opacity-100 md:group-hover:visible transition-all duration-200 z-10'>
                    {`Este producto pertenece a la categoria de productos en "${category}"`}
                    <div className='absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white'></div>
                  </div>
                </a>
              ))}
            </div>

            {/* Title & Brand */}
            <div>
              <h1 className='text-3xl md:text-4xl font-bold text-[#2f2f3b] dark:text-white mb-3'>
                {product.name}
              </h1>
              <div className='flex items-center gap-3 text-sm flex-wrap'>
                <span className='text-gray-500 dark:text-[#9ca3b8]'>
                  Marca:{' '}
                  <span className='text-[#2f2f3b] dark:text-white font-medium bg-blue-50 dark:bg-[#1a1a2e] px-2 py-1 rounded-full'>
                    {product.brand}
                  </span>
                </span>
                <span className='text-gray-300 dark:text-[#2a2a3e]'>|</span>
                <span className='text-gray-500 dark:text-[#9ca3b8]'>
                  Modelo:{' '}
                  <span className='text-[#2f2f3b] dark:text-white font-medium bg-blue-50 dark:bg-[#1a1a2e] px-2 py-1 rounded-full'>
                    {product.model}
                  </span>
                </span>
                {product.genero && product.genero !== 'N/A' && (
                  <>
                    <span className='text-gray-300 dark:text-[#2a2a3e]'>|</span>
                    <span className='inline-flex items-center gap-1 text-gray-500 dark:text-[#9ca3b8]'>
                      <User size={13} />
                      <span className='text-[#2f2f3b] dark:text-white font-medium bg-blue-50 dark:bg-[#1a1a2e] px-2 py-1 rounded-full'>
                        {product.genero}
                      </span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Specs */}
            <div className='border-t border-gray-100 dark:border-[#2a2a3e] pt-6'>
              <h2 className='text-lg font-bold text-[#2f2f3b] dark:text-white mb-3'>
                Descripción del producto
              </h2>
              <p className='text-gray-600 dark:text-[#9ca3b8] leading-relaxed'>
                {product.description}
              </p>
            </div>

            {/* Certifications */}
            {product.certifications.length > 0 && (
              <div className='border-t border-gray-100 dark:border-[#2a2a3e] pt-6 '>
                <h2 className='text-lg font-bold text-[#2f2f3b] dark:text-white mb-3 flex items-center gap-2'>
                  <Award size={20} className='text-[#504aff]' />
                  Certificaciones
                </h2>
                <div className='flex flex-wrap gap-2'>
                  {product.certifications.map((cert) => (
                    <div
                      key={cert.id}
                      className='group relative inline-flex items-center gap-1.5 bg-[#504aff]/5 text-[#504aff] text-sm font-semibold px-4 py-2 rounded-full border border-[#504aff]/20 hover:bg-[#504aff]/10 transition-colors cursor-pointer'
                      data-tip={cert.description}
                    >
                      <Shield size={14} />
                      {cert.name}
                      {cert.description && (
                        <div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-[#2a2a3e] shadow-lg text-gray-700 dark:text-[#c8c8d8] text-xs font-normal p-3 rounded-lg opacity-0 invisible md:group-hover:opacity-100 md:group-hover:visible transition-all duration-200 z-10'>
                          {cert.description}
                          <div className='absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white'></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trust indicators */}
            <div className='grid grid-cols-3 gap-3 py-4 border-t border-b border-gray-100 dark:border-[#2a2a3e]'>
              <div className='flex flex-col items-center text-center gap-2'>
                <div className='w-10 h-10 bg-[#504aff]/10 rounded-full flex items-center justify-center'>
                  <Shield size={18} className='text-[#504aff]' />
                </div>
                <span className='text-xs text-gray-600 dark:text-[#9ca3b8] font-medium'>
                  Certificado
                  <br />
                  internacionalmente
                </span>
              </div>
              <div className='flex flex-col items-center text-center gap-2'>
                <div className='w-10 h-10 bg-[#504aff]/10 rounded-full flex items-center justify-center'>
                  <Truck size={18} className='text-[#504aff]' />
                </div>
                <span className='text-xs text-gray-600 dark:text-[#9ca3b8] font-medium'>
                  Envío a<br />
                  todo Ecuador
                </span>
              </div>
              <div className='flex flex-col items-center text-center gap-2'>
                <div className='w-10 h-10 bg-[#504aff]/10 rounded-full flex items-center justify-center'>
                  <Headphones size={18} className='text-[#504aff]' />
                </div>
                <span className='text-xs text-gray-600 dark:text-[#9ca3b8] font-medium'>
                  Soporte
                  <br />
                  técnico
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className='space-y-3'>
              <a
                href={`https://wa.me/593992526658?text=Hola, me interesa saber información acerca del producto: ${product.name}, modelo: ${product.model} y marca: ${product.brand}`}
                target='_blank'
                className='w-full bg-[#504aff] text-white font-semibold py-4 px-8 rounded-xl hover:bg-[#3f3bcc] transition-all duration-300 shadow-lg shadow-[#504aff]/30 hover:shadow-xl hover:shadow-[#504aff]/40 hover:-translate-y-0.5 flex items-center justify-center gap-3'
              >
                {isCotizando ? (
                  <>
                    <span className='loading loading-spinner loading-sm'></span>
                    Procesando...
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Cotizar Ahora
                  </>
                )}
              </a>
              <p className='text-xs text-gray-400 dark:text-[#6b7280] text-center'>
                Te responderemos en menos de 24 horas por WhatsApp
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
