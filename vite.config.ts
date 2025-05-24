import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Configuración Vite.
 * 
 * {@link https://vite.dev/config/}
 */
export default defineConfig({
  plugins: [react()],
})
