    import { ChevronRight } from "lucide-react";
import { useState } from "react";

const destacados = [
    {
        name: "f-500",
        title: "F-500 Agente encapsulador",
        description: "El F500 es una innovadora tecnología para el combate de incendios y control de riesgos: es la 3ra. y última generación de agentes supresores de fuego. No es una espuma (aunque la complementa y fortalece), es un agente encapsulador acuoso que enfría y controla la temperatura del siniestro de manera más efectiva y rápida.",
        image: "/images/f-500.webp"
    },
    {
        name: "Flaim",
        title: "FLAIM FTS",
        description: "FLAIM FTS es un sistema inmersivo de capacitación para bomberos que combina escenarios de incendios virtuales de alta fidelidad con equipos estándar de la industria para brindar experiencias de capacitación que se sienten reales.",
        image: "/images/flaim.webp"
    }
]



export default function Destacados() {
    const [selectedProduct, setSelectedProduct] = useState(0);
    
    return (
        <section className="flex flex-col gap-0 md:gap-10 items-start justify-between w-full md:w-350 mx-auto h-auto md:h-full">
            {/*CTA change destacados*/}
            <div className="flex gap-2 p-2 bg-gray-100 rounded-full justify-center items-center mx-auto">
                {destacados.map((item, index) => (
                    <button
                        key={item.name}
                        className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                            selectedProduct === index
                                ? 'bg-[#504aff] text-white shadow-md shadow-[#504aff]/20'
                                : 'text-gray-600 hover:text-[#504aff] hover:bg-white'
                        }`}
                        onClick={() => setSelectedProduct(index)}
                    >
                        {item.title.split(' ')[0]}
                    </button>
                ))}
            </div>
            <div className="flex flex-col-reverse justify-center items-center md:flex-row gap-9 p-5 my-10 w-auto md:w-250 lg:w-350 md:h-87.5 mx-auto">
                {/* Description */}
                <div className="flex flex-col gap-9 justify-center">
                    <h2 className="text-3xl font-bold text-[#2f2f3b] dark:text-white">{destacados[selectedProduct].title}</h2>
                    <p className="w-75 md:w-125 lg:w-150 text-gray-600 dark:text-gray-300 leading-relaxed">{destacados[selectedProduct].description}</p>
                    <div>
                        <a className="btn border-0 inline-flex w-full md:w-auto h-13.75 text-[15px] items-center gap-2 bg-[#504aff] text-white font-semibold px-8 py-4 rounded-[30px] hover:bg-[#3f3bcc] justify-center shadow-md shadow-[#504aff]/20 hover:shadow-lg hover:shadow-[#504aff]/30 hover:-translate-y-0.5 transition-all duration-300 shrink-0" href={`/productos/${destacados[selectedProduct].name.toLowerCase()}`}>
                            <div className="flex items-center justify-center text-[15px]">
                                <span>Explora más</span><ChevronRight width={20}/>
                            </div>
                        </a>
                    </div>
                </div>
                {/* Image */}
                <div className="w-full md:w-117.5 h-50 md:h-110.5 rounded-[40px] md:rounded-[66px] overflow-hidden shadow-2xl">
                    <img src={destacados[selectedProduct].image} alt={destacados[selectedProduct].name} className="object-cover w-full h-full transition-transform duration-700 hover:scale-105" loading="lazy"/>
                </div>
            </div>
        </section>
    );
}