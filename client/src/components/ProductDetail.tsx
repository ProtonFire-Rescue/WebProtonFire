import { useState } from "react";
import { Check, ChevronRight, ShoppingCart } from "lucide-react";
import type { ProductView } from "../types/types";

interface ProductDetailProps {
  product: ProductView;
  onCotizar?: (productId: string) => void;
  onBack?: () => void;
}

export default function ProductDetail({
  product,
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
                {
                  product.categories.map((category) => (
                    <span className="flex items-center gap-1 text-green-600">
                      <Check size={16} />
                      {category}
                    </span>
                  ))
                }
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
    </div>
  );
}
