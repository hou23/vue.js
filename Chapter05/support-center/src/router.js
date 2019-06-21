import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './components/Home.vue'
import FAQ from './components/FAQ.vue'
import Login from './components/Login'
import TicketsLayout from './components/TicketsLayout'
import state from "./state";
import Tickets from './components/Tickets'
import NewTicket from './components/NewTicket'
import Ticket from './components/Ticket'
import NotFound from './components/NotFound'

Vue.use(VueRouter)

const routes = [
  {path: '/', name: 'home', component: Home},
  {path: '/faq', name: 'faq', component: FAQ},
  {path: '/login', name: 'login', component: Login, meta: {guest: true}},
  {
    path: '/tickets', name: 'tickets', component: TicketsLayout, meta: {private: true}, children: [
      {path: '', name: 'tickets', component: Tickets},
      {path: 'new', name: 'new-ticket', component: NewTicket},
      {path: ':id', name: 'ticket', component: Ticket, props: route => ({id: route.params.id})},
    ]
  },
  {path: '*', component: NotFound},
]

const router = new VueRouter({
  routes,
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return {selector: to.hash}
    }
    return {x: 0, y: 0}
  }
})

router.beforeEach((to, from, next) => {
  // matched属性可以访问这个路由对象的列表
  if (to.matched.some(r => r.meta.private) && !state.user) {
    // 重定向到登陆
    next({
      name: 'login',
      params: {
        wantedRoute: to.fullPath,
      }
    })
    return
  }
  if (to.matched.some(r => r.meta.guest) && state.user) {
    next({
      name: 'home',
    })
    return
  }
  next()
})

export default router
