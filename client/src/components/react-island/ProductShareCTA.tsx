import { useState, useRef, useEffect } from 'react'
import {
  ShoppingCart,
  Share2,
  Link,
  X
} from 'lucide-react'
import type { ProductView } from '../../types/types'

interface ProductShareCTAProps {
  product: ProductView
}

export default function ProductShareCTA({ product }: ProductShareCTAProps) {
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const shareMenuRef = useRef<HTMLDivElement>(null)

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
    <div className='space-y-3'>
      <div className='flex gap-3'>
        <a
          href={`https://wa.me/593992526658?text=Hola, me interesa saber información acerca del producto: ${product.name}, modelo: ${product.model} y marca: ${product.brand}`}
          target='_blank'
          rel='noopener noreferrer'
          className='flex-1 bg-[#155DFC] text-white font-semibold py-4 px-8 rounded-xl hover:bg-[#114ACA] transition-all duration-300 shadow-lg shadow-[#155DFC]/30 hover:shadow-xl hover:shadow-[#155DFC]/40 hover:-translate-y-0.5 flex items-center justify-center gap-3'
        >
          <ShoppingCart size={20} />
          Cotizar Ahora
        </a>

        <div className='relative' ref={shareMenuRef}>
          <button
            onClick={handleShare}
            aria-label='Compartir producto'
            aria-expanded={showShareMenu}
            className='h-full px-4 rounded-xl border-2 border-[#155DFC]/30 text-[#155DFC] hover:bg-[#155DFC]/10 transition-all duration-300 flex items-center justify-center'
          >
            <Share2 size={20} />
          </button>

          {showShareMenu && (
            <div
              role='menu'
              className='absolute right-0 bottom-full mb-2 w-52 bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-[#2a2a3e] shadow-xl rounded-xl overflow-hidden z-50'
            >
              <div className='flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-[#2a2a3e]'>
                <span className='text-sm font-semibold text-[#2f2f3b] dark:text-white'>Compartir</span>
                <button
                  onClick={() => setShowShareMenu(false)}
                  aria-label='Cerrar menú'
                  className='text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors'
                >
                  <X size={14} />
                </button>
              </div>
              <div className='p-2 space-y-1'>
                <button
                  role='menuitem'
                  onClick={shareToWhatsApp}
                  className='w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-[#c8c8d8] hover:bg-gray-100 dark:hover:bg-[#2a2a3e] transition-colors flex items-center gap-3'
                >
                  <span className='text-green-500 font-bold text-base leading-none'>W</span>
                  WhatsApp
                </button>
                <button
                  role='menuitem'
                  onClick={shareToFacebook}
                  className='w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-[#c8c8d8] hover:bg-gray-100 dark:hover:bg-[#2a2a3e] transition-colors flex items-center gap-3'
                >
                  <span className='text-blue-600 font-bold text-base leading-none'>f</span>
                  Facebook
                </button>
                <button
                  role='menuitem'
                  onClick={shareToLinkedIn}
                  className='w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-[#c8c8d8] hover:bg-gray-100 dark:hover:bg-[#2a2a3e] transition-colors flex items-center gap-3'
                >
                  <span className='text-blue-700 font-bold text-base leading-none'>in</span>
                  LinkedIn
                </button>
                <button
                  role='menuitem'
                  onClick={handleCopyLink}
                  className='w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-[#c8c8d8] hover:bg-gray-100 dark:hover:bg-[#2a2a3e] transition-colors flex items-center gap-3'
                >
                  <Link size={14} className='text-gray-500' />
                  {copied ? '¡Enlace copiado!' : 'Copiar enlace'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className='text-sm text-gray-400 dark:text-[#6b7280] text-center'>
        Te responderemos en menos de 24 horas por WhatsApp
      </p>
    </div>
  )
}
