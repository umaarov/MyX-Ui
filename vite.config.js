import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        host: '0.0.0.0',
        port: 5173,
        proxy: {

            '/api': {
                target: 'http://10.30.8.132:8000',
                // target: 'http://10.50.11.116:8000/',
                changeOrigin: true,
                secure: false,
                // rewrite: (path) => path.replace(/^\/api/, '/api'),
            },
        },
    },
})
