import { defineAction, ActionError } from "astro:actions";
import { z } from "zod";
import { Resend } from "resend";
import EmailSend from "../components/react-island/EmailSend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const server = {
  send: defineAction({
    accept: "form",
    input: z.object({
      name: z.string(),
      email: z.string().email(),
      asunto: z.string(),
      message: z.string(),
      phone: z.string()
    }),
    handler: async ({name, email, asunto, message, phone}) => {
      const { data, error } = await resend.emails.send({
        from: "ProtonFire <onboarding@resend.dev>",
        to: ["tecnologia@protonfire.com"],
        subject: asunto,
        react: EmailSend({ name, email, asunto, message, phone }),
      });
      if (error) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
        
      }
      return data;
    },
  }),
};
