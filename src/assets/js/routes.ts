import Home from '../../pages/Home.vue'
import About from '../../pages/About.vue'
import Login from '../../pages/Login.vue'
import Signup from '../../pages/Signup.vue'
import Terms from '../../pages/Terms.vue'
import Privacy from '../../pages/Privacy.vue'

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', component: Home },
    { path: '/about/', component: About },
    { path: '/login/', component: Login },
    { path: '/signup/', component: Signup },
    { path: '/terms/', component: Terms },
    { path: '/privacy/', component: Privacy },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router