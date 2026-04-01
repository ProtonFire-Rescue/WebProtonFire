import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Shield,
  Truck,
  Headphones,
  Award,
  User,
  Share2,
  Link,
  X
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
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const thumbsRef = useRef<HTMLDivElement>(null)
  const shareMenuRef = useRef<HTMLDivElement>(null)

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

  const getShareUrl = () => typeof window !== 'undefined' ? window.location.href : ''
  const getShareText = () => `${product.name} - ${product.brand} | PROTON Fire & Rescue`

  const handleShare = async () => {
    const url = getShareUrl()
    const text = getShareText()
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: product.name, text, url })
      } catch {}
    } else {
      setShowShareMenu((prev) => !prev)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl())
      setCopied(true)
      setTimeout(() => { setCopied(false); setShowShareMenu(false) }, 1500)
    } catch {}
  }

  const shareToWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(getShareText() + ' ' + getShareUrl())}`, '_blank')
    setShowShareMenu(false)
  }

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`, '_blank', 'width=600,height=400')
    setShowShareMenu(false)
  }

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`, '_blank', 'width=600,height=400')
    setShowShareMenu(false)
  }

  // Close share menu on outside click
  useEffect(() => {
    if (!showShareMenu) return
    const handleClickOutside = (e: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target as Node)) {
        setShowShareMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showShareMenu])

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
                    {`Este producto pertenece a la categoría de productos en "${category}"`}
                    <div className='absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white'></div>
                  </div>
                </a>
              ))}
            </div>

            {/* Title & Brand */}
            <div>
              <div className='flex items-start justify-between gap-3'>
                <h1 className='text-3xl md:text-4xl font-bold text-[#2f2f3b] dark:text-white mb-3'>
                  {product.name}
                </h1>
                <div className='relative shrink-0' ref={shareMenuRef}>
                  <button
                    onClick={handleShare}
                    className='w-10 h-10 rounded-full border border-gray-200 dark:border-[#2a2a3e] bg-white dark:bg-[#12121e] hover:bg-gray-50 dark:hover:bg-[#1a1a2e] flex items-center justify-center transition-colors group'
                    aria-label='Compartir producto'
                    title='Compartir'
                  >
                    <Share2 size={18} className='text-gray-500 dark:text-[#9ca3b8] group-hover:text-[#504aff] transition-colors' />
                  </button>
                  {showShareMenu && (
                    <div className='absolute right-0 top-12 w-56 bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-[#2a2a3e] rounded-xl shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-2'>
                      <button
                        onClick={shareToWhatsApp}
                        className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-[#c8c8d8] hover:bg-gray-50 dark:hover:bg-[#12121e] transition-colors'
                      >
                        <svg className='w-5 h-5 text-[#25D366]' viewBox='0 0 24 24' fill='currentColor'><path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z'/></svg>
                        WhatsApp
                      </button>
                      <button
                        onClick={shareToFacebook}
                        className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-[#c8c8d8] hover:bg-gray-50 dark:hover:bg-[#12121e] transition-colors'
                      >
                        <svg className='w-5 h-5 text-[#1877F2]' viewBox='0 0 24 24' fill='currentColor'><path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/></svg>
                        Facebook
                      </button>
                      <button
                        onClick={shareToLinkedIn}
                        className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-[#c8c8d8] hover:bg-gray-50 dark:hover:bg-[#12121e] transition-colors'
                      >
                        <svg className='w-5 h-5 text-[#0A66C2]' viewBox='0 0 24 24' fill='currentColor'><path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'/></svg>
                        LinkedIn
                      </button>
                      <div className='border-t border-gray-100 dark:border-[#2a2a3e] my-1'></div>
                      <button
                        onClick={handleCopyLink}
                        className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-[#c8c8d8] hover:bg-gray-50 dark:hover:bg-[#12121e] transition-colors'
                      >
                        {copied ? (
                          <><Check size={18} className='text-green-500' /> <span className='text-green-600 dark:text-green-400 font-medium'>Enlace copiado</span></>
                        ) : (
                          <><Link size={18} className='text-gray-400' /> Copiar enlace</>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
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
