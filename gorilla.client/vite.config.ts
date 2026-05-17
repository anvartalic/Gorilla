import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'
import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs'

// Assuming these variables are declared above in your original file,
// keeping them here so your local server variables don't break.
const target = 'http://localhost:5000'
const env = process.env
const keyFilePath = './certs/key.pem'
const certFilePath = './certs/cert.pem'

export default defineConfig(({ command }) => {
    // 1. Moving the opening brace right next to 'return' fixes the TypeScript error!
    return {
        plugins: [
            react(),
            command === 'serve' ? mkcert() : null
        ].filter(Boolean),
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        // 2. Only run the proxy and local https setup when running 'npm run dev' locally
        server: command === 'serve' ? {
            proxy: {
                '^/weatherforecast': {
                    target,
                    secure: false
                }
            },
            port: parseInt(env.DEV_SERVER_PORT || '50246'),
            https: {
                key: fs.readFileSync(keyFilePath),
                cert: fs.readFileSync(certFilePath),
            }
        } : {} // Returns an empty object on Vercel so it safely ignores local file reads
    }
})
