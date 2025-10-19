// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import history from 'connect-history-api-fallback'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,    
    port: 5173,    
    middlewareMode: false,
  },
  // configuración extra para que React Router maneje las rutas
  configureServer(server) {
    server.middlewares.use(
      history({
        index: '/index.html', // redirige cualquier 404 a index.html
      })
    )
  }
})
