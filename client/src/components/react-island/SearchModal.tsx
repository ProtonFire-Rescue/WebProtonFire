import { useState, useEffect, useRef, useCallback } from 'react'
import { productUrl } from '../../utils/slugify'

interface Product {
  id: number
  slug: string
  name: string
  model: string
  brand: string
  category: string
  image: string
}

const BACKEND_URL =
  (import.meta as any).env?.VITE_BACKEND_URL ??
  'https://webprotonfire-production.up.railway.app'

const SEARCH_QUERY =
  'fields[0]=name&fields[1]=slug' +
  '&populate[categories][fields][0]=name' +
  '&populate[brand][fields][0]=name' +
  '&populate[model][fields][0]=name' +
  '&populate[images][fields][0]=url' +
  '&sort[0]=createdAt:desc'

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)
  const [error, setError] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const fetchProducts = useCallback(async () => {
    if (fetched) return
    setLoading(true)
    setError(false)
    try {
      const res = await fetch(`${BACKEND_URL}/api/productos?${SEARCH_QUERY}`)
      if (!res.ok) throw new Error('fetch error')
      const { data } = await res.json()
      const mapped: Product[] = data.map((p: any) => {
        const cats = (p.categories ?? []).map((c: any) => c.name)
        return {
          id: p.id,
          slug: p.slug,
          name: p.name,
          model: p.model?.name ?? '',
          brand: p.brand?.name ?? '',
          category: cats[0] ?? 'Otros',
          image: p.images?.[0]?.url ?? '',
        }
      })
      setProducts(mapped)
      setFetched(true)
    } catch {
      setError(true)
      setFetched(true)
    } finally {
      setLoading(false)
    }
  }, [fetched])

  const open = () => {
    setIsOpen(true)
    fetchProducts()
  }

  const close = useCallback(() => {
    setIsOpen(false)
    setQuery('')
  }, [])

  // Focus input on open + lock body scroll
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 60)
      document.body.style.overflow = 'hidden'
      return () => clearTimeout(timer)
    } else {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) close()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  const trimmed = query.trim()
  const filtered =
    trimmed.length >= 1
      ? products.filter(
          (p) =>
            p.name.toLowerCase().includes(trimmed.toLowerCase()) ||
            p.brand.toLowerCase().includes(trimmed.toLowerCase()) ||
            p.model.toLowerCase().includes(trimmed.toLowerCase()) ||
            p.category.toLowerCase().includes(trimmed.toLowerCase())
        )
      : []

  const showResults = trimmed.length >= 1

  return (
    <>
      {/* ── Trigger button ── */}
      <button
        onClick={open}
        aria-label='Buscar productos'
        title='Buscar productos'
        className='flex items-center justify-center w-9 h-9 rounded-full text-[#afafaf] dark:text-white/80 hover:text-[#155DFC] dark:hover:text-[#155DFC] hover:bg-[#155DFC]/10 transition-all duration-200'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='18'
          height='18'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          aria-hidden='true'
        >
          <circle cx='11' cy='11' r='8' />
          <path d='m21 21-4.3-4.3' />
        </svg>
      </button>

      {/* ── Modal overlay ── */}
      {isOpen && (
        <div
          ref={overlayRef}
          className='fixed inset-0 z-[200] flex flex-col items-center justify-start pt-20 sm:pt-28 px-4'
          role='dialog'
          aria-modal='true'
          aria-label='Buscar productos'
        >
          {/* Backdrop */}
          <div
            className='absolute inset-0 bg-black/60 backdrop-blur-sm'
            onClick={close}
            aria-hidden='true'
          />

          {/* Panel */}
          <div className='relative w-full max-w-2xl bg-white dark:bg-[#12121e] rounded-2xl shadow-2xl shadow-black/30 overflow-hidden flex flex-col max-h-[70vh]'>
            {/* Search input row */}
            <div className='flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-[#2a2a3e]'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='shrink-0 text-[#155DFC]'
                aria-hidden='true'
              >
                <circle cx='11' cy='11' r='8' />
                <path d='m21 21-4.3-4.3' />
              </svg>

              <input
                ref={inputRef}
                type='search'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Buscar por nombre, marca o categoría...'
                aria-label='Buscar productos'
                className='flex-1 bg-transparent text-[#2f2f3b] dark:text-white placeholder-gray-400 dark:placeholder-[#6b7280] text-base outline-none'
              />

              {/* Clear button */}
              {query && (
                <button
                  onClick={() => setQuery('')}
                  aria-label='Limpiar búsqueda'
                  className='shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-[#2a2a3e] text-gray-500 dark:text-[#9ca3b8] hover:bg-gray-200 dark:hover:bg-[#3a3a4e] transition-colors'
                >
                  <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
                    <path d='M18 6 6 18' /><path d='m6 6 12 12' />
                  </svg>
                </button>
              )}

              {/* Close button */}
              <button
                onClick={close}
                aria-label='Cerrar búsqueda'
                className='shrink-0 flex items-center gap-1.5 text-xs text-gray-400 dark:text-[#6b7280] hover:text-gray-600 dark:hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a2a3e]'
              >
                <span className='hidden sm:inline'>Cerrar</span>
                <kbd className='hidden sm:inline px-1.5 py-0.5 bg-gray-100 dark:bg-[#2a2a3e] rounded text-[10px] font-mono'>Esc</kbd>
              </button>
            </div>

            {/* Results area */}
            <div className='overflow-y-auto flex-1'>
              {/* Loading */}
              {loading && (
                <div className='flex items-center justify-center py-16 gap-3 text-[#6b7280] dark:text-[#9ca3b8]'>
                  <svg className='animate-spin w-5 h-5 text-[#155DFC]' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' aria-hidden='true'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z' />
                  </svg>
                  <span className='text-sm'>Cargando productos...</span>
                </div>
              )}

              {/* Error */}
              {!loading && error && (
                <div className='flex flex-col items-center justify-center py-14 px-6 text-center'>
                  <p className='text-sm text-gray-500 dark:text-[#9ca3b8]'>No se pudo conectar con el catálogo. Intenta de nuevo.</p>
                </div>
              )}

              {/* Initial hint (no query yet) */}
              {!loading && !error && !showResults && (
                <div className='flex flex-col items-center justify-center py-14 px-6 text-center gap-2'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' className='text-gray-300 dark:text-[#3a3a4e] mb-1' aria-hidden='true'>
                    <circle cx='11' cy='11' r='8' /><path d='m21 21-4.3-4.3' />
                  </svg>
                  <p className='text-sm text-gray-400 dark:text-[#6b7280]'>Escribe para buscar en el catálogo</p>
                </div>
              )}

              {/* No results */}
              {!loading && !error && showResults && filtered.length === 0 && (
                <div className='flex flex-col items-center justify-center py-14 px-6 text-center gap-3'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' className='text-gray-300 dark:text-[#3a3a4e]' aria-hidden='true'>
                    <circle cx='11' cy='11' r='8' /><path d='m21 21-4.3-4.3' /><path d='M8 11h6' />
                  </svg>
                  <p className='text-base font-medium text-[#2f2f3b] dark:text-white'>No se encontraron productos relacionados</p>
                  <p className='text-sm text-gray-400 dark:text-[#6b7280]'>
                    Intenta con otro término o{' '}
                    <a href='/catalogo/all' onClick={close} className='text-[#155DFC] hover:underline font-medium'>
                      explora el catálogo completo
                    </a>
                  </p>
                </div>
              )}

              {/* Results list */}
              {!loading && !error && showResults && filtered.length > 0 && (
                <div>
                  <p className='px-5 pt-3 pb-1 text-xs text-gray-400 dark:text-[#6b7280] font-medium'>
                    {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
                  </p>
                  <ul role='listbox' aria-label='Resultados de búsqueda'>
                    {filtered.slice(0, 10).map((product) => (
                      <li key={product.id} role='option' aria-selected='false'>
                        <a
                          href={productUrl(product.category, product.slug)}
                          onClick={close}
                          className='flex items-center gap-4 px-5 py-3 hover:bg-gray-50 dark:hover:bg-[#1a1a2e] transition-colors group'
                        >
                          {/* Thumbnail */}
                          <div className='shrink-0 w-12 h-12 rounded-xl bg-gray-100 dark:bg-[#0b0b12] overflow-hidden flex items-center justify-center border border-gray-100 dark:border-[#2a2a3e]'>
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className='w-full h-full object-contain p-1'
                                loading='lazy'
                                width={48}
                                height={48}
                              />
                            ) : (
                              <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='text-gray-300 dark:text-[#3a3a4e]' aria-hidden='true'>
                                <rect width='18' height='18' x='3' y='3' rx='2' /><circle cx='9' cy='9' r='2' /><path d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21' />
                              </svg>
                            )}
                          </div>

                          {/* Info */}
                          <div className='flex-1 min-w-0'>
                            <p className='text-sm font-semibold text-[#2f2f3b] dark:text-white truncate group-hover:text-[#155DFC] transition-colors'>
                              {product.name}
                            </p>
                            <p className='text-xs text-gray-400 dark:text-[#6b7280] truncate'>
                              {[product.brand, product.model].filter(Boolean).join(' · ')}
                            </p>
                          </div>

                          {/* Category badge */}
                          <span className='shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#155DFC]/10 text-[#155DFC] uppercase tracking-wide'>
                            {product.category}
                          </span>

                          {/* Arrow */}
                          <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='shrink-0 text-gray-300 dark:text-[#3a3a4e] group-hover:text-[#155DFC] transition-colors' aria-hidden='true'>
                            <path d='m9 18 6-6-6-6' />
                          </svg>
                        </a>
                      </li>
                    ))}
                  </ul>

                  {/* Ver todos */}
                  {filtered.length > 0 && (
                    <div className='px-5 py-3 border-t border-gray-100 dark:border-[#2a2a3e]'>
                      <a
                        href={`/catalogo/all`}
                        onClick={close}
                        className='flex items-center justify-between w-full text-sm text-[#155DFC] font-medium hover:underline'
                      >
                        <span>Ver todos los productos en el catálogo</span>
                        <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
                          <path d='m9 18 6-6-6-6' />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
