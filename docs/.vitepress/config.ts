import {defineConfig} from 'vitepress'

export default defineConfig({
  locales: {
    root: {
      label: '简体中文',
      title: 'Hony',
      description: '展示我的项目与技术分享。',
      themeConfig: {
        // 中文的导航栏配置
        nav: [
          {text: '主页', link: '/'},
          {text: '项目', link: '/projects'},
          {text: '关于我', link: '/about'}
        ],
        sidebar: [
          {text: '快速开始', link: '/guide/'}
        ]
      }
    },
    en: {
      label: 'English',
      title: 'Hony',
      description: 'Showcasing my projects and technical insights.',
      themeConfig: {
        nav: [
          {text: 'Home', link: '/'},
          {text: 'About', link: '/about'},
          {text: 'HonyUI', link: 'https://honyzhang.github.io/honyui/'} // 添加项目链接
        ],
        sidebar: [
          {text: 'Home', link: '/'},
          {text: 'About', link: '/about'},
          {text: 'HonyUI Project', link: 'https://honyzhang.github.io/honyui/'} // 添加项目链接
        ],
      },
    }
  },
  // 基础路径
  base: '/',
  head: [
    ['link', {rel: 'stylesheet', href: '/styles/home.scss'}] // 引入自定义样式
  ],
})
