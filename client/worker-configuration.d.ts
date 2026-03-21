export {};

declare global {
  interface Env {
    RESEND_API_KEY?: string;
  }

  namespace App {
    interface Locals {
      runtime?: {
        env: Env;
      };
    }
  }
}
