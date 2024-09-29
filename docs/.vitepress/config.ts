import { defineConfig } from 'vitepress'

export default defineConfig({
    title: 'Hony Zhang\'s Website',
    description: 'Welcome to my personal website',
    base: '/', // 基础路径
    themeConfig: {
        nav: [
            { text: 'Home', link: '/' },
            { text: 'About', link: '/about' },
            { text: 'HonyUI', link: 'https://honyzhang.github.io/honyui/' } // 添加项目链接
        ],
        sidebar: [
            { text: 'Home', link: '/' },
            { text: 'About', link: '/about' },
            { text: 'HonyUI Project', link: 'https://honyzhang.github.io/honyui/' } // 添加项目链接
        ]
    }
})
