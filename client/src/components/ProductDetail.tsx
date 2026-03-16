import { useState } from "react";
import { Check, ChevronRight, ShoppingCart } from "lucide-react";
import type { ProductView } from "../types";

interface ProductDetailProps {
  product: ProductView;
  relatedProducts: ProductView[];
  onCotizar?: (productId: string) => void;
  onBack?: () => void;
}

export default function ProductDetail({
  product,
  relatedProducts,
  onCotizar,
}: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]?.url || "");
  const [isCotizando, setIsCotizando] = useState(false);

  const handleCotizar = () => {
    setIsCotizando(true);
    onCotizar?.(product.id.toString());
    setTimeout(() => setIsCotizando(false), 2000);
  };
  

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto mt-30 px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center text-sm text-gray-500">
          <a href="/" className="hover:text-[#504aff] transition-colors">
            Inicio
          </a>
          <ChevronRight size={16} className="mx-2" />
          <a href="/catalogo" className="hover:text-[#504aff] transition-colors">
            Catálogo
          </a>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-gray-700 font-medium">{product.name}</span>
        </nav>
      </div>

      {/* Main Product Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-contain p-8"
              />
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((image) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(image.url)}
                  className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === image.url
                      ? "border-[#504aff]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right - Product Info */}
          <div className="space-y-6">

            {/* Title & Brand */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">Marca: {product.brand}</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">Modelo: {product.model}</span>
                <span className="text-gray-400">|</span>
                <span className="flex items-center gap-1 text-green-600">
                  <Check size={16} />
                  {product.category}
                </span>
              </div>
            </div>

            {/* Specs */}
            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Especificaciones de Materiales y Capas
              </h2>
              <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Descripción</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
                
              </div>
            </div>

            {/* CTA Button */}
            <a
              href={`https://wa.me/593982487322?text=Hola, me interesa saber información acerca del producto: ${product.name}, modelo: ${product.model} y marca: ${product.brand}`}
              target="_blank"
              className="w-full bg-[#504aff] text-white font-semibold py-4 px-8 rounded-xl hover:bg-[#3f3bcc] transition-colors shadow-lg shadow-[#504aff]/30 flex items-center justify-center gap-3"
            >
              {isCotizando ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Procesando...
                </>
              ) : (
                <>
                  <ShoppingCart size={20} />
                  Cotizar Ahora
                </>
              )}
            </a>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Productos relacionados
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedProducts.map((item) => (
              <a
                key={item.id}
                href={`/producto/${item.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-3/4 bg-gray-100 overflow-hidden">
                  <img
                    src={item.images[0].url}
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
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
