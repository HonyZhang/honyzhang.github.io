import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'prismjs/themes/prism-tomorrow.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router)  // 使用路由
app.mount('#app')  // 挂载应用

// 创建 link 元素
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = import.meta.env.VITE_ICONFONT_API_URL;  // 外链地址

// 将 link 元素添加到 head
document.head.appendChild(link);
