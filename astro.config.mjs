// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Site 100% estático: cada página vira um .html pronto no build.
// format 'file' gera /novenas.html (servido como /novenas pelo .htaccess),
// mantendo exatamente as URLs atuais, sem barra no final.
export default defineConfig({
  site: 'https://catolicosorantes.com.br',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
    // CSS dentro do HTML: o navegador desenha a página sem esperar outro arquivo (melhora o LCP no celular)
    inlineStylesheets: 'always',
  },
  compressHTML: true,
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  integrations: [react()],
  vite: {
    // Mantém os nomes de variáveis que o projeto já usa (.env do Lovable)
    envPrefix: ['PUBLIC_', 'VITE_'],
  },
});
