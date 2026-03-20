import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { actions, isInputError } from "astro:actions";
import { OctagonXIcon } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  asunto: string;
  message: string;
  phone: string;
}

interface ContactFormProps {
  onSuccess?: () => void;
}

export default function ContactForm({ onSuccess }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("asunto", data.asunto);
      formData.append("message", data.message);
      formData.append("phone", data.phone);
      
      const result = await actions.send(formData);
      
      if (result.error) {
        if (isInputError(result.error)) {
          // Handle field-specific validation errors
          Object.entries(result.error.fields).forEach(([field, messages]) => {
            setError(field as keyof FormData, {
              type: "manual",
              message: messages?.[0] || "Invalid input",
            });
          });
          toast.error("Por favor corrige los errores en el formulario");
        } else {
          toast.error(result.error.message || "Error al enviar el mensaje");
        }
      } else {
        toast.success("¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.");
        reset();
        onSuccess?.();
      }
    } catch (error) {
      toast.error("Error inesperado al enviar el formulario");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-[#2f2f3b] mb-2">
          Nombres y Apellidos *
        </label>
        <input
          {...register("name", { required: "El nombre es obligatorio" })}
          type="text"
          id="name"
          className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-[#504aff] focus:border-transparent transition-all ${
            errors.name ? "border-red-500 focus:ring-red-200" : "border-gray-200"
          }`}
          placeholder="Nombres y apellidos..."
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-2 flex gap-1 items-center animate-pulse"><OctagonXIcon width={15} /> {errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-[#2f2f3b] mb-2">
          Email *
        </label>
        <input
          {...register("email", {
            required: "El email es obligatorio",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Email inválido",
            },
          })}
          type="email"
          id="email"
          className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-[#504aff] focus:border-transparent transition-all ${
            errors.email ? "border-red-500 focus:ring-red-200" : "border-gray-200"
          }`}
          placeholder="Email..."
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-2 flex gap-1 items-center animate-pulse"><OctagonXIcon width={15} /> {errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="asunto" className="block text-sm font-semibold text-[#2f2f3b] mb-2">
          Asunto *
        </label>
        <input
          {...register("asunto", { required: "El asunto es obligatorio" })}
          type="text"
          id="asunto"
          className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-[#504aff] focus:border-transparent transition-all ${
            errors.asunto ? "border-red-500 focus:ring-red-200" : "border-gray-200"
          }`}
          placeholder="Asunto..."
        />
        {errors.asunto && (
          <p className="text-red-500 text-xs mt-2 flex gap-1 items-center animate-pulse"><OctagonXIcon width={15} /> {errors.asunto.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-[#2f2f3b] mb-2">
          Teléfono *
        </label>
        <input
          {...register("phone", { required: "Falto tu número telefonico, agregalo para hablar contigo" })}
          type="string"
          id="phone"
          className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-[#504aff] focus:border-transparent transition-all ${
            errors.phone ? "border-red-500 focus:ring-red-200" : "border-gray-200"
          }`}
          placeholder="0922211..."
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-2 flex gap-1 items-center animate-pulse"><OctagonXIcon width={15} /> {errors.phone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-[#2f2f3b] mb-2">
          Mensaje *
        </label>
        <textarea
          {...register("message", { required: "El mensaje es obligatorio" })}
          id="message"
          rows={4}
          className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-[#504aff] focus:border-transparent transition-all resize-none ${
            errors.message ? "border-red-500 focus:ring-red-200" : "border-gray-200"
          }`}
          placeholder="Tu mensaje..."
        />
        {errors.message && (
          <p className="text-red-500 text-xs mt-2 flex gap-1 items-center animate-pulse"><OctagonXIcon width={15} /> {errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#504aff] text-white font-semibold py-4 px-8 rounded-full hover:bg-[#3f3bcc] transition-colors shadow-lg shadow-[#504aff]/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Enviando..." : "Contactanos"}
      </button>
    </form>
  );
}
