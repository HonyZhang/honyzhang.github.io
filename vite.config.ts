import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import {resolve} from 'path'
import Markdown from 'vite-plugin-md'
import markdownItPrism from 'markdown-it-prism';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItTocDoneRight from 'markdown-it-toc-done-right';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/', // 适用于 GitHub Pages
    plugins: [
        vue({
            include: [/\.vue$/, /\.md$/] // 支持 .md 文件
        }),
        Markdown({
            markdownItOptions: {
                // markdown-it 配置项
                html: true,
                linkify: true,
                typographer: true
            },
            markdownItUses: [
                markdownItPrism,
                markdownItAnchor,
                [markdownItTocDoneRight, {level: [2, 3], listType: 'ul'}]
            ],
            wrapperClasses: 'markdown-body'
        }),
        vueDevTools()
    ],
    resolve: {
        alias: {
            "@": resolve(__dirname, "src")  // 使用 __dirname 拼接 src 目录路径
        }
    },
    server: {
        proxy: {
            '/bingApi': {
                target: 'https://www.bing.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/bingApi/, '')
            }
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use '@/styles/responsive-width.scss' as *;`
            }
        }
    }
})
