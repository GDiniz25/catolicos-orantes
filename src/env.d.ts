/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  readonly VITE_SUPABASE_PROJECT_ID?: string;
  /** "true" mostra o botão Entrar com Google no Caminho da Fé */
  readonly PUBLIC_LOGIN_GOOGLE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
