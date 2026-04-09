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
      
      {/* Main Product Section */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16'>
        <div className='grid lg:grid-cols-2 gap-6 lg:gap-12'>
          

          {/* Right - Product Info */}
          <div className='space-y-6 min-w-0'>

            {/* CTA Button */}
            
          </div>
        </div>
      </section>
    </div>
  )
}
