import Vue from 'vue'
import 'babel-polyfill'
import AppLayout from './components/AppLayout'
import router from './router'
import './global-components'
import VueFetch from './plugins/fetch'

new Vue({
  el: '#app',
  render: h => h(AppLayout),
  router,
})

Vue.use(VueFetch, {
  baseUrl: 'http://localhost:3000',
})
