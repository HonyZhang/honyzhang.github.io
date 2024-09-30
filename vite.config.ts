import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import {resolve} from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/', // 适用于 GitHub Pages
    plugins: [vue(), vueDevTools()],
    resolve: {
        alias: {
            "@": resolve(__dirname, "src")  // 使用 __dirname 拼接 src 目录路径
        }
    },
    server: {
        proxy: {
            '/api': {
                target: 'https://www.bing.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    }
})
