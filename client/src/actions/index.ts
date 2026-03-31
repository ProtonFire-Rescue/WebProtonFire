import { defineAction, ActionError } from "astro:actions";
import { z } from "zod";
import { Resend } from "resend";
import EmailSend from "@/components/react-island/EmailSend";

const email_resend = import.meta.env.EMAIL_RESEND;

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
    handler: async ({ name, email, asunto, message, phone }, context) => {
      const platformEnv = (context as any)?.platform?.env;
      const runtimeEnv = (context as any)?.locals?.runtime?.env;
      const apiKey = platformEnv?.RESEND_API_KEY ?? runtimeEnv?.RESEND_API_KEY ?? import.meta.env.RESEND_API_KEY;

      if (!apiKey) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Missing RESEND_API_KEY in server environment",
        });
      }

      const resend = new Resend(apiKey);
      const { data, error } = await resend.emails.send({
        from: "ProtonFire <onboarding@mail.protonfire.com>",
        to: [email_resend],
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
