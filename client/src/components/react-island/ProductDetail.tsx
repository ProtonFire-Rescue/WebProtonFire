import { useState } from "react";
import { Check, ChevronRight, ShoppingCart, Shield, Truck, Headphones } from "lucide-react";
import type { ProductView } from "../../types/types";

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
        <nav className="flex items-center text-sm text-gray-400">
          <a href="/" className="hover:text-[#504aff] transition-colors">
            Inicio
          </a>
          <ChevronRight size={14} className="mx-2" />
          <a href="/catalogo" className="hover:text-[#504aff] transition-colors">
            Catálogo
          </a>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-[#2f2f3b] font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      {/* Main Product Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 relative group">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
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
                      ? "border-[#504aff] shadow-md shadow-[#504aff]/20"
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

            {/* Categories badges */}
            <div className="flex flex-wrap gap-2">
              {product.categories.map((category) => (
                <span key={category} className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">
                  <Check size={12} />
                  {category}
                </span>
              ))}
            </div>

            {/* Title & Brand */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#2f2f3b] mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-500">Marca: <span className="text-[#2f2f3b] font-medium">{product.brand}</span></span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">Modelo: <span className="text-[#2f2f3b] font-medium">{product.model}</span></span>
              </div>
            </div>

            {/* Specs */}
            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-lg font-bold text-[#2f2f3b] mb-3">
                Descripción del producto
              </h2>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-3 py-4 border-t border-b border-gray-100">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 bg-[#504aff]/10 rounded-full flex items-center justify-center">
                  <Shield size={18} className="text-[#504aff]" />
                </div>
                <span className="text-xs text-gray-600 font-medium">Certificado<br/>internacionalmente</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 bg-[#504aff]/10 rounded-full flex items-center justify-center">
                  <Truck size={18} className="text-[#504aff]" />
                </div>
                <span className="text-xs text-gray-600 font-medium">Envío a<br/>todo Ecuador</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 bg-[#504aff]/10 rounded-full flex items-center justify-center">
                  <Headphones size={18} className="text-[#504aff]" />
                </div>
                <span className="text-xs text-gray-600 font-medium">Soporte<br/>técnico</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="space-y-3">
              <a
                href={`https://wa.me/593982487322?text=Hola, me interesa saber información acerca del producto: ${product.name}, modelo: ${product.model} y marca: ${product.brand}`}
                target="_blank"
                className="w-full bg-[#504aff] text-white font-semibold py-4 px-8 rounded-xl hover:bg-[#3f3bcc] transition-all duration-300 shadow-lg shadow-[#504aff]/30 hover:shadow-xl hover:shadow-[#504aff]/40 hover:-translate-y-0.5 flex items-center justify-center gap-3"
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
              <p className="text-xs text-gray-400 text-center">
                Te responderemos en menos de 24 horas por WhatsApp
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
