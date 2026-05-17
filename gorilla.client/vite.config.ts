import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(() => {
    return {
        // Completely remove mkcert from the plugins array here
        plugins: [
            react()
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        }
        // We completely remove the "server" block. 
        // Vercel handles serving and production routing automatically.
    }
})
