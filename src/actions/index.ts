import { ActionError, defineAction } from 'astro:actions';
import { Resend } from 'resend';
import { z } from 'astro:schema';
import EmailSend from '../components/EmailSend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const server = {
  send: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Invalid email'),
      asunto: z.string().min(1, 'Subject is required'),
      message: z.string().min(1, 'Message is required'),
    }),
    handler: async ({name, email, asunto, message}) => {
      const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: ['tecnologia@protonfire.com'],
        subject: asunto,
        react: EmailSend({ name, email, asunto, message }),
      });

      if (error) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }

      return data;
    },
  }),
};