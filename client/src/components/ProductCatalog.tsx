import { useState, useMemo, useEffect } from 'react';
import { getBrands, getCategories } from '../utils/server';

interface Product {
  id: number;
  name: string;
  model: string;
  brand: string;
  category: string;
  image: string;
}

interface ProductCatalogProps {
  initialProducts?: Product[];
  categories?: string[];
  brands?: string[];
}




export default function ProductCatalog({ initialProducts = [], categories, brands }: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedBrand, setSelectedBrand] = useState('Todos');
  const [priceSort, setPriceSort] = useState<'none' | 'asc' | 'desc'>('none');
  const [categoriesList, setCategoriesList] = useState<string[]>(['Todos'])
  const [brandList, setBrandList] = useState<string[]>(['Todos'])

  useEffect(() => {
    setCategoriesList(['Todos', ...categories || []])
    setBrandList(['Todos', ...brands || []])
  }, [categories, brands]);

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query)
      );
    }

   

    // Filter by category
    if (selectedCategory !== 'Todos') {
      result = result.filter((p) =>
        p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by brand
    if (selectedBrand !== 'Todos') {
      result = result.filter((p) => p.brand === selectedBrand);
    }

    // Sort by price (using id as proxy for price demo)
    if (priceSort !== 'none') {
      result.sort((a, b) => {
        const priceA = a.id;
        const priceB = b.id;
        return priceSort === 'asc' ? priceA - priceB : priceB - priceA;
      });
    }

    return result;
  }, [initialProducts, searchQuery, selectedCategory, selectedBrand, priceSort]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Todos');
    setSelectedBrand('Todos');
    setPriceSort('none');
  };

  const hasActiveFilters =
    searchQuery || selectedCategory !== 'Todos' || selectedBrand !== 'Todos' || priceSort !== 'none';

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Filters */}
      <div className='relative w-64'>
        <aside className="sticky top-5 mb-10 w-full lg:w-64 shrink-0">
        <h3 className="text-lg font-semibold text-[#2f2f3b] mb-6">Filtros</h3>

        {/* Search in sidebar for mobile */}
        <div className="mb-6 lg:hidden">
          <h4 className="text-sm font-medium text-gray-500 mb-3">Buscar</h4>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full px-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-[#504aff] focus:border-transparent transition-all text-sm"
          />
        </div>

        {/* Categoría Filter */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-500 mb-3">Categoría</h4>
          <div className="flex flex-wrap gap-2">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-sm border rounded-full transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#504aff] text-white border-[#504aff]'
                    : 'border-gray-200 text-gray-600 hover:border-[#504aff] hover:text-[#504aff]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Marca Filter */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-500 mb-3">Marca</h4>
          <div className="flex flex-wrap gap-2">
            {brandList.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-4 py-2 text-sm border rounded-full transition-colors ${
                  selectedBrand === brand
                    ? 'bg-[#504aff] text-white border-[#504aff]'
                    : 'border-gray-200 text-gray-600 hover:border-[#504aff] hover:text-[#504aff]'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Precio Filter */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-500 mb-3">Precio</h4>
          <div className="flex gap-2">
            <button
              onClick={() => setPriceSort(priceSort === 'desc' ? 'none' : 'desc')}
              className={`flex-1 px-4 py-2 text-sm rounded-full transition-colors ${
                priceSort === 'desc'
                  ? 'bg-[#504aff] text-white'
                  : 'bg-[#2f2f3b] text-white hover:bg-[#504aff]'
              }`}
            >
              Caro
            </button>
            <button
              onClick={() => setPriceSort(priceSort === 'asc' ? 'none' : 'asc')}
              className={`flex-1 px-4 py-2 text-sm rounded-full transition-colors ${
                priceSort === 'asc'
                  ? 'bg-[#504aff] text-white'
                  : 'bg-[#2f2f3b] text-white hover:bg-[#504aff]'
              }`}
            >
              Más barato
            </button>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="w-full px-4 py-2 text-sm bg-[#2f2f3b] text-white rounded-full hover:bg-[#504aff] transition-colors"
          >
            Restablecer
          </button>
        )}
      </aside>

      </div>

      {/* Products Grid */}
      <div className="flex-1">
        {/* Desktop Search */}
        <div className="hidden lg:block max-w-xl mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Valor"
              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-full focus:ring-2 focus:ring-[#504aff] focus:border-transparent transition-all text-gray-600"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#2f2f3b]">Todos los Productos</h3>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          {filteredProducts.length} productos encontrados
        </p>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">No se encontraron productos con los filtros seleccionados</p>
            <button
              onClick={resetFilters}
              className="px-6 py-2 bg-[#504aff] text-white rounded-full hover:bg-[#3f3bcc] transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="relative aspect-3/4 overflow-hidden bg-gray-50 p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-[#2f2f3b] text-sm mb-1 uppercase tracking-wide">
                    {product.name}
                  </h4>
                  <p className="text-xs text-gray-400 mb-1">{product.model}</p>
                  <p className="text-xs text-[#504aff] font-medium mb-3">
                    Marca: {product.brand}
                  </p>
                  <a
                    href={`/producto/${product.id}`}
                    data-astro-prefetch="hover"
                    className="w-full bg-[#2f2f3b] text-white text-sm font-medium p-2 rounded-lg hover:bg-[#504aff] transition-colors"
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
  );
}
