import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// ✅ Correct Tailwind setup for Vite + React
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
