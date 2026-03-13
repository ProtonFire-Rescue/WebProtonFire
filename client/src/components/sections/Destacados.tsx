    import { ChevronRight } from "lucide-react";
    import { useState } from "react";

    const destacados = [
        {
            name: "f-500",
            title: "F-500 Agente encapsulador",
            description: "El F500 es una innovadora tecnología para el combate de incendios y control de riesgos: es la 3ra. y última generación de agentes supresores de fuego. No es una espuma (aunque la complementa y fortalece), es un agente encapsulador acuoso que enfría y controla la temperatura del siniestro de manera más efectiva y rápida.",
            image: "/images/f-500.png"
        },
        {
            name: "Flaim",
            title: "FLAIM FTS",
            description: "FLAIM FTS es un sistema inmersivo de capacitación para bomberos que combina escenarios de incendios virtuales de alta fidelidad con equipos estándar de la industria para brindar experiencias de capacitación que se sienten reales.",
            image: "/images/flaim.jpg"
        }
    ]



    export default function Destacados() {
        const [selectedProduct, setSelectedProduct] = useState(0);
        
        return (
            <section className="flex flex-col gap-0 md:gap-10 items-start justify-between w-full md:w-350 mx-auto h-auto md:h-full">
                {/*CTA change destacados*/}
                <div className="flex gap-4 p-5 bg-[#B1B1B6] w-86.5 h-14.75 rounded-[66px] justify-center items-center mx-auto">
                    <button className="btn btn-white w-32.5 h-11.70 rounded-[66px]" onClick={() => setSelectedProduct(0)}>f-500</button>
                    <button className="btn btn-white w-32.5 h-11.70 rounded-[66px]" onClick={() => setSelectedProduct(1)}>Flaim</button>
                </div>
                <div className="flex flex-col-reverse justify-center items-center md:flex-row gap-9 p-5 my-10 w-auto md:w-250 lg:w-350 md:h-87.5 mx-auto">
                    {/* Description */}
                    <div className="flex flex-col gap-9 justify-center">
                        <h2 className="text-3xl font-bold">{destacados[selectedProduct].title}</h2>
                        <p className="w-75 md:w-125 lg:w-150">{destacados[selectedProduct].description}</p>
                        <div>
                            <a className="btn border-0 inline-flex w-full md:w-auto h-13.75 text-[15px] items-center gap-2 bg-[#504aff] text-white font-semibold px-8 py-4 rounded-[30px] hover:bg-[#3f3bcc] justify-center shadow-md shadow-[#504aff]/20 hover:shadow-lg hover:shadow-[#504aff]/30 shrink-0" href={`/productos/${destacados[selectedProduct].name}`}>
                                <div className="flex items-center justify-center text-[15px]">
                                    <span>Explora más</span><ChevronRight width={20}/>
                                </div>
                            </a>
                        </div>
                    </div>
                    {/* Image */}
                    <div className="w-full md:w-117.5 h-50 md:h-110.5 rounded-[40px] md:rounded-[66px] overflow-hidden">
                        <img src={destacados[selectedProduct].image} alt={destacados[selectedProduct].name} className="object-cover w-full h-full" loading="lazy"/>
                    </div>
                </div>
            </section>
        );
    }