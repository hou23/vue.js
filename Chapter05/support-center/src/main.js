import Vue from 'vue'
import 'babel-polyfill'
import AppLayout from './components/AppLayout'
import router from './router'
import './global-components'
import VueFetch, {$fetch} from './plugins/fetch'
import state from './state'
import VueState from './plugins/state'
import * as filters from './filters'

Vue.use(VueFetch, {
  baseUrl: 'http://localhost:3000/',
})
Vue.use(VueState, state)

for (const key in filters) {
  Vue.filter(key, filters[key])
}

async function main() {
  try {
    state.user = await $fetch('user')
  } catch (e) {
    console.warn(e)
  }
  new Vue({
    el: '#app',
    data: state,
    router,
    render: h => h(AppLayout),
  })
}

main()
