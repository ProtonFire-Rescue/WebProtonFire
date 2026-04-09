import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useCallback, useRef } from "react"

export function ImageCarrousel({images, name}: {images: any[], name: string}) {
  const [currentIndex, setCurrentIndex] = useState(0)
    const thumbsRef = useRef<HTMLDivElement>(null)
    const selectedImage = images[currentIndex]?.url || ''

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
    return (
          <div className='space-y-4 min-w-0'>
            {/* Main Image */}
            <div className='aspect-[4/2] sm:aspect-square bg-gray-50 dark:bg-[#12121e] rounded-2xl overflow-hidden border border-gray-100 dark:border-[#2a2a3e] relative group'>
              <img
                src={selectedImage}
                alt={name}
                className='w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105'
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      goToImage(
                        (currentIndex - 1 + images.length) %
                        images.length
                      )
                    }
                    className='absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 dark:bg-[#1a1a2e]/80 hover:bg-white dark:hover:bg-[#1a1a2e] shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                    aria-label='Imagen anterior'
                  >
                    <ChevronLeft size={20} className='text-gray-700' />
                  </button>
                  <button
                    onClick={() =>
                      goToImage((currentIndex + 1) % images.length)
                    }
                    className='absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 dark:bg-[#1a1a2e]/80 hover:bg-white dark:hover:bg-[#1a1a2e] shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                    aria-label='Siguiente imagen'
                  >
                    <ChevronRight size={20} className='text-gray-700' />
                  </button>
                  <div className='absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full'>
                    {currentIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails with navigation */}
            <div
              ref={thumbsRef}
              className='flex gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-hide'
            >
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => goToImage(index)}
                  className={`shrink-0 w-14 h-14 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${currentIndex === index
                      ? 'border-[#155DFC] shadow-md shadow-[#155DFC]/20'
                      : 'border-gray-200 dark:border-[#2a2a3e] hover:border-gray-300 dark:hover:border-[#155DFC]/50'
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
    )
}