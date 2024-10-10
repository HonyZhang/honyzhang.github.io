import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import Home from '../views/Home/index.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        // 通过 props 传递参数给 Home 组件
        props: {
            avatarSrc: '/home/avatar.png'
        }
    },
    {
        path: '/blogs/:componentName',
        name: 'Blogs',
        component: () => import('../blogs/index.vue'),
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
