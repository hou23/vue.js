import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './components/Home.vue'
import FAQ from './components/FAQ.vue'
import Login from './components/Login'
import TicketsLayout from './components/TicketsLayout'
import state from "./state";

Vue.use(VueRouter)

const routes = [
  {path: '/', name: 'home', component: Home},
  {path: '/faq', name: 'faq', component: FAQ},
  {path: '/login', name: 'login', component: Login},
  {path: '/tickets', name: 'tickets', component: TicketsLayout, meta: {private: true}}
]

const router = new VueRouter({
  routes,
  mode: 'history',
})

router.beforeEach((to, from, next) => {
  if (to.meta.private && !state.user) {
    // 重定向到登陆
    next({
      name: 'login',
      params: {
        wantedRoute: to.fullPath,
      }
    })
    return
  }
  next()
})

export default router
