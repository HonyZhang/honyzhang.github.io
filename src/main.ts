import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)  // 使用路由
app.mount('#app')  // 挂载应用