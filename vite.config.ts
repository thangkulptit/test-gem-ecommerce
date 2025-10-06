import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import svgLoader from 'vite-svg-loader'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig(({ mode }) => {
    const isDeploy = mode === 'deploy'

    return {
        plugins: [vue(), tailwindcss(), svgLoader()],
        base: isDeploy ? '/test-gem-ecommerce/' : './',
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        esbuild: {
            drop: ['console', 'debugger'],
        },
        build: {
            emptyOutDir: true,
            rollupOptions: {
                external: [
                    /\.(test|spec)\.(js|ts)$/,
                    /__tests__\/?/,
                    /tests\/?/,
                ],
            },
        },
    }
})
