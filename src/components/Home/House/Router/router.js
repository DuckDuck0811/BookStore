import { createRouter, createWebHistory } from 'vue-router'
import House from '../House.vue'
import NewBook from '../MainContent/NewBook.vue'


const routes = [
  { path: '/', name: 'Home', component: House },
  { path: '/new-book', name: 'NewBook', component: NewBook },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
