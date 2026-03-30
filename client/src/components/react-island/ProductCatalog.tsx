import { useState, useMemo, useEffect } from 'react'
import { productUrl } from '../../utils/slugify'

interface Product {
  id: number
  documentId: string
  slug: string
  name: string
  model: string
  brand: string
  category: string
  categories: string[]
  image: string
  type: string
}

interface ProductCatalogProps {
  category?: string
  initialProducts?: Product[]
  categories?: string[]
  brands?: string[]
  types?: string[]
}

export default function ProductCatalog({
  category = 'all',
  initialProducts = [],
  categories,
  brands,
  types
}: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(
    category === 'all' ? 'Todos' : category
  )
  const [selectedBrand, setSelectedBrand] = useState('Todos')
  const [selectedType, setSelectedType] = useState('Todos')
  const [priceSort, setPriceSort] = useState<'none' | 'asc' | 'desc'>('none')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [categoriesList, setCategoriesList] = useState<string[]>(['Todos'])
  const [brandList, setBrandList] = useState<string[]>(['Todos'])
  const [typeList, setTypeList] = useState<string[]>(['Todos'])

  useEffect(() => {
    setCategoriesList(['Todos', ...(categories || [])])
    setBrandList(['Todos', ...(brands || [])])
    setTypeList(['Todos', ...(types || [])])
  }, [categories, brands, types])

  // Compute products filtered only by category (to derive available brands/types)
  const productsByCategory = useMemo(() => {
    if (selectedCategory === 'Todos') return initialProducts
    return initialProducts.filter((p) =>
      p.categories.some(
        (cat) => cat.toLowerCase() === selectedCategory.toLowerCase()
      )
    )
  }, [initialProducts, selectedCategory])

  const productsByType = useMemo(() => {
    if (selectedType === 'Todos') return initialProducts
    return initialProducts.filter(
      (p) => p.type.toLowerCase() === selectedType.toLowerCase()
    )
  }, [initialProducts, selectedType])

  // Available types and brands based on the selected category
  const availableTypes = useMemo(() => {
    const typesSet = new Set(
      productsByCategory.map((p) => p.type).filter(Boolean)
    )
    return ['Todos', ...Array.from(typesSet).sort()]
  }, [productsByCategory])

  const availableBrands = useMemo(() => {
    const brandsSet =
      selectedType === 'Todos'
        ? new Set(productsByCategory.map((p) => p.brand).filter(Boolean))
        : new Set(productsByType.map((p) => p.brand).filter(Boolean))

    return ['Todos', ...Array.from(brandsSet).sort()]
  }, [productsByCategory, productsByType, selectedType])

  // Reset dependent filters when they become unavailable after a category change
  useEffect(() => {
    if (selectedType !== 'Todos' && !availableTypes.includes(selectedType)) {
      setSelectedType('Todos')
    }
  }, [availableTypes, selectedType])

  useEffect(() => {
    if (selectedBrand !== 'Todos' && !availableBrands.includes(selectedBrand)) {
      setSelectedBrand('Todos')
    }
  }, [availableBrands, selectedBrand])

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts]

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.categories.some((cat) => cat.toLowerCase().includes(query)) ||
          p.brand.toLowerCase().includes(query) ||
          p.type.toLowerCase().includes(query)
      )
    }

    // Filter by category
    if (selectedCategory !== 'Todos') {
      result = result.filter((p) =>
        p.categories.some(
          (cat) => cat.toLowerCase() === selectedCategory.toLowerCase()
        )
      )
    }

    // Filter by brand
    if (selectedBrand !== 'Todos') {
      result = result.filter((p) => p.brand === selectedBrand)
    }

    // Filter by type
    if (selectedType !== 'Todos') {
      result = result.filter((p) => p.type === selectedType)
    }

    // Sort by price (using id as proxy for price demo)
    if (priceSort !== 'none') {
      result.sort((a, b) => {
        const priceA = a.id
        const priceB = b.id
        return priceSort === 'asc' ? priceA - priceB : priceB - priceA
      })
    }

    return result
  }, [
    initialProducts,
    searchQuery,
    selectedCategory,
    selectedBrand,
    selectedType,
    priceSort
  ])

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('Todos')
    setSelectedBrand('Todos')
    setSelectedType('Todos')
    setPriceSort('none')
  }

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== 'Todos' ||
    selectedBrand !== 'Todos' ||
    selectedType !== 'Todos' ||
    priceSort !== 'none'

  const activeFilterCount = [
    selectedCategory !== 'Todos',
    selectedBrand !== 'Todos',
    selectedType !== 'Todos',
    priceSort !== 'none',
    !!searchQuery
  ].filter(Boolean).length

  return (
    <div className='relative'>
      {/* ── Fixed Floating Filter Button ── */}
      <button
        onClick={() => setDrawerOpen(true)}
        className='fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#504aff] text-white pl-5 pr-6 py-3.5 rounded-full shadow-xl shadow-[#504aff]/30 hover:bg-[#3f3bcc] hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 font-semibold text-sm'
        aria-label='Abrir filtros'
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
        >
          <polygon points='22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3' />
        </svg>
        Filtros
        {activeFilterCount > 0 && (
          <span className='absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center'>
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* ── Backdrop ── */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden='true'
      />

      {/* ── Filter Drawer (slides from right) ── */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-96 bg-white dark:bg-[#12121e] shadow-2xl transform transition-transform duration-300 ease-out ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
        aria-label='Panel de filtros'
      >
        <div className='flex flex-col h-full'>
          {/* Drawer Header */}
          <div className='flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-[#2a2a3e]'>
            <h3 className='text-lg font-bold text-[#2f2f3b] dark:text-white'>Filtros</h3>
            <button
              onClick={() => setDrawerOpen(false)}
              className='p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-[#9ca3b8] hover:text-[#2f2f3b] dark:hover:text-white'
              aria-label='Cerrar filtros'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M18 6 6 18' />
                <path d='m6 6 12 12' />
              </svg>
            </button>
          </div>

          {/* Drawer Body (scrollable) */}
          <div className='flex-1 overflow-y-auto px-6 py-6 space-y-6'>
            {/* Search */}
            <div>
              <h4 className='text-sm font-medium text-gray-500 dark:text-[#9ca3b8] mb-3'>Buscar</h4>
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Buscar producto...'
                className='w-full px-4 py-2.5 border border-gray-200 dark:border-[#2a2a3e] rounded-full focus:ring-2 focus:ring-[#504aff] focus:border-transparent transition-all text-sm bg-white dark:bg-[#0b0b12] dark:text-white dark:placeholder-[#6b7280]'
              />
            </div>

            {/* Categoría Filter */}
            <div>
              <h4 className='text-sm font-medium text-gray-500 dark:text-[#9ca3b8] mb-3'>
                Categoría
              </h4>
              <div className='flex flex-wrap gap-2'>
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 text-sm border rounded-full transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[#504aff] text-white border-[#504aff]'
                        : 'border-gray-200 dark:border-[#2a2a3e] text-gray-600 dark:text-[#9ca3b8] hover:border-[#504aff] hover:text-[#504aff]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Tipo Filter */}
            <div>
              <h4 className='text-sm font-medium text-gray-500 dark:text-[#9ca3b8] mb-3'>Tipo</h4>
              <div className='flex flex-wrap gap-2'>
                {availableTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-2 text-sm border rounded-full transition-colors ${
                      selectedType === type
                        ? 'bg-[#504aff] text-white border-[#504aff]'
                        : 'border-gray-200 dark:border-[#2a2a3e] text-gray-600 dark:text-[#9ca3b8] hover:border-[#504aff] hover:text-[#504aff]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Marca Filter */}
            <div>
              <h4 className='text-sm font-medium text-gray-500 dark:text-[#9ca3b8] mb-3'>Marca</h4>
              <div className='flex flex-wrap gap-2'>
                {availableBrands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`px-4 py-2 text-sm border rounded-full transition-colors ${
                      selectedBrand === brand
                        ? 'bg-[#504aff] text-white border-[#504aff]'
                        : 'border-gray-200 dark:border-[#2a2a3e] text-gray-600 dark:text-[#9ca3b8] hover:border-[#504aff] hover:text-[#504aff]'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
            {/* 

            {/* Precio Filter */}
            {/* <div>
              <h4 className="text-sm font-medium text-gray-500 mb-3">Precio</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => setPriceSort(priceSort === 'desc' ? 'none' : 'desc')}
                  className={`flex-1 px-4 py-2 text-sm rounded-full transition-colors ${priceSort === 'desc'
                      ? 'bg-[#504aff] text-white'
                      : 'bg-[#2f2f3b] text-white hover:bg-[#504aff]'
                    }`}
                >
                  Caro
                </button>
                <button
                  onClick={() => setPriceSort(priceSort === 'asc' ? 'none' : 'asc')}
                  className={`flex-1 px-4 py-2 text-sm rounded-full transition-colors ${priceSort === 'asc'
                      ? 'bg-[#504aff] text-white'
                      : 'bg-[#2f2f3b] text-white hover:bg-[#504aff]'
                    }`}
                >
                  Más barato
                </button>
              </div> 
            </div> */}
          </div>

          {/* Drawer Footer */}
          <div className='px-6 py-4 border-t border-gray-100 dark:border-[#2a2a3e] space-y-3'>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className='w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-[#2a2a3e] text-[#2f2f3b] dark:text-white rounded-full hover:bg-gray-50 dark:hover:bg-white/5 transition-colors font-medium'
              >
                Restablecer filtros
              </button>
            )}
            <a
              href={`/catalogo/${selectedCategory}`}
              onClick={() => setDrawerOpen(false)}
              className='text-center block w-full px-4 py-3 text-sm bg-[#504aff] text-white rounded-full hover:bg-[#3f3bcc] transition-colors font-semibold shadow-md shadow-[#504aff]/20'
            >
              Ver {filteredProducts.length} productos
            </a>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div>
        {/* Search Bar */}
        <div className='max-w-xl mb-6'>
          <div className='relative'>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Buscar producto...'
              className='w-full px-4 py-3 pr-12 border border-gray-200 dark:border-[#2a2a3e] rounded-full focus:ring-2 focus:ring-[#504aff] focus:border-transparent transition-all text-gray-600 dark:text-white bg-white dark:bg-[#12121e] dark:placeholder-[#6b7280]'
            />
            <button className='absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-100 dark:bg-[#1a1a2e] rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#2a2a3e] transition-colors'>
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
                className='text-gray-500'
              >
                <circle cx='11' cy='11' r='8'></circle>
                <path d='m21 21-4.3-4.3'></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Active Filters Pills */}
        {hasActiveFilters && (
          <div className='flex flex-wrap items-center gap-2 mb-6'>
            <span className='text-xs text-gray-500 dark:text-[#9ca3b8] font-medium'>
              Filtros activos:
            </span>
            {selectedCategory !== 'Todos' && (
              <span className='inline-flex items-center gap-1 px-3 py-1 bg-[#504aff]/10 text-[#504aff] text-xs font-medium rounded-full'>
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory('Todos')}
                  className='hover:text-red-500 transition-colors'
                  aria-label={`Quitar filtro ${selectedCategory}`}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='12'
                    height='12'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M18 6 6 18' />
                    <path d='m6 6 12 12' />
                  </svg>
                </button>
              </span>
            )}
            {selectedType !== 'Todos' && (
              <span className='inline-flex items-center gap-1 px-3 py-1 bg-[#504aff]/10 text-[#504aff] text-xs font-medium rounded-full'>
                {selectedType}
                <button
                  onClick={() => setSelectedType('Todos')}
                  className='hover:text-red-500 transition-colors'
                  aria-label={`Quitar filtro ${selectedType}`}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='12'
                    height='12'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M18 6 6 18' />
                    <path d='m6 6 12 12' />
                  </svg>
                </button>
              </span>
            )}
            {selectedBrand !== 'Todos' && (
              <span className='inline-flex items-center gap-1 px-3 py-1 bg-[#504aff]/10 text-[#504aff] text-xs font-medium rounded-full'>
                {selectedBrand}
                <button
                  onClick={() => setSelectedBrand('Todos')}
                  className='hover:text-red-500 transition-colors'
                  aria-label={`Quitar filtro ${selectedBrand}`}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='12'
                    height='12'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M18 6 6 18' />
                    <path d='m6 6 12 12' />
                  </svg>
                </button>
              </span>
            )}
            {priceSort !== 'none' && (
              <span className='inline-flex items-center gap-1 px-3 py-1 bg-[#504aff]/10 text-[#504aff] text-xs font-medium rounded-full'>
                Precio:{' '}
                {priceSort === 'asc' ? 'Menor a mayor' : 'Mayor a menor'}
                <button
                  onClick={() => setPriceSort('none')}
                  className='hover:text-red-500 transition-colors'
                  aria-label='Quitar filtro de precio'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='12'
                    height='12'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M18 6 6 18' />
                    <path d='m6 6 12 12' />
                  </svg>
                </button>
              </span>
            )}
            <a
              href='/catalogo/all'
              onClick={resetFilters}
              className='block text-center text-xs text-red-500 hover:text-red-600 font-medium transition-colors ml-1'
            >
              Limpiar todo
            </a>
          </div>
        )}

        <div className='flex items-center justify-between mb-6'>
          <h3 className='text-lg font-semibold text-[#2f2f3b] dark:text-white'>
            Todos los Productos
          </h3>
          <p className='text-sm text-gray-500 dark:text-[#9ca3b8]'>
            {filteredProducts.length} productos encontrados
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className='text-center py-20'>
            <p className='text-gray-500 dark:text-[#9ca3b8] mb-4'>
              No se encontraron productos con los filtros seleccionados
            </p>
            <button
              onClick={resetFilters}
              className='px-6 py-2 bg-[#504aff] text-white rounded-full hover:bg-[#3f3bcc] transition-colors'
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className='group bg-white dark:bg-[#1a1a2e] rounded-2xl border border-gray-100 dark:border-[#2a2a3e] overflow-hidden hover:shadow-xl dark:hover:shadow-black/30 transition-all duration-300 cursor-pointer'
              >
                <div className='relative aspect-3/4 overflow-hidden bg-gray-50 dark:bg-[#12121e] p-4'>
                  <img
                    src={product.image}
                    alt={product.name}
                    className='w-full h-full object-contain group-hover:scale-105 transition-transform duration-500'
                    loading='lazy'
                  />
                  <span className='absolute top-3 left-3 bg-[#504aff]/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider'>
                    {product.category}
                  </span>
                </div>
                <div className='p-4'>
                  <h4 className='font-semibold text-[#2f2f3b] dark:text-white text-sm mb-1 uppercase tracking-wide'>
                    {product.name}
                  </h4>
                  <p className='text-xs text-gray-400 dark:text-[#6b7280] mb-1'>{product.model}</p>
                  <p className='text-xs text-[#504aff] font-medium mb-3'>
                    Marca: {product.brand}
                  </p>
                  <a
                    href={productUrl(product.category, product.slug)}
                    className='block text-center w-full bg-[#2f2f3b] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#504aff] transition-colors'
                  >
                    Ver más
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
