import { createApp } from 'vue'
import router from './routes'
import App from '../../App.vue'
import '../css/index.css'

createApp(App).use(router).mount('#app')
