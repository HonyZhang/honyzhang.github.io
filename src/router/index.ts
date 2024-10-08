import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import Home from '../views/Home/index.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        // 通过 props 传递参数给 Home 组件
        props: {
            avatarSrc: '/home/avatar.png',
            title: '哈哈，被你发现了！',
            description: '这里主要记录一些我的想法，希望你能喜欢。',
            buttonText: '了解更多'
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
