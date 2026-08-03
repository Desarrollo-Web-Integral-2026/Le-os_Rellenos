import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Separa las dependencias grandes de terceros (React, React Router) en
    // su propio chunk — el navegador las cachea independientemente del
    // código de la app, así que un deploy nuevo de tu código no obliga a
    // re-descargar React completo si no cambió.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'vendor';
            }
          }
        }
      },
    },
    // Advierte si algún chunk crece demasiado — ayuda a detectar
    // regresiones de tamaño de bundle antes de que afecten RNF2 en el futuro.
    chunkSizeWarningLimit: 300,
  },
})
