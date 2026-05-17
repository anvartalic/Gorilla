import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs'

// Only import mkcert if we are NOT deploying on Vercel
const mkcertPlugin = !process.env.VERCEL
    ? (await import('vite-plugin-mkcert')).default
    : null

const target = 'http://localhost:5000'
const env = process.env
const keyFilePath = './certs/key.pem'
const certFilePath = './certs/cert.pem'

export default defineConfig(({ command }) => {
    const isVercel = !!process.env.VERCEL
    const useDevServer = command === 'serve' && !isVercel

    return {
        plugins: [
            react(),
            // Dynamically inject the plugin execution only when working locally
            useDevServer && mkcertPlugin ? mkcertPlugin() : null
        ].filter(Boolean),
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        // Completely omit the server configuration when building on Vercel
        server: useDevServer ? {
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
        } : {}
    }
})
