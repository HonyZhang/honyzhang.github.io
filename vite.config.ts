import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/', // 适用于 GitHub Pages
    plugins: [vue()]
})
