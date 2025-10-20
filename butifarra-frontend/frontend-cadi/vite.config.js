// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss()
  ],
  server: {
    // Estas opciones aseguran que el servidor sea accesible
    // y corra en el puerto correcto.
    host: true,    
    port: 5174,
  },
});
