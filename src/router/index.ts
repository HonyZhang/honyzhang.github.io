import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import Home from '../views/Home/index.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        // 通过 props 传递参数给 Home 组件
        props: {
            title: '欢迎来到张翔的个人网站',
            subtitle: '前端开发工程师',
            description: '专注于高效与美观的 Web 应用开发。',
            buttonText: '了解更多'
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
