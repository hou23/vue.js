import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production', // 防止在mutation中使用异步调用

  state() {
    return {
      user: null,
    }
  },

  mutations: {
    user: (state, user) => {
      state.user = user
    }
  },

  getters: {
    user: state => state.user,
    userPicture: () => null,
  },

  actions: {
    login({commit}) {
      const userData = {
        profile: {
          displayName: 'Mr Cat',
        },
      }
      commit('user', userData)
    },
    logout({commit}) {
      commit('user', null)
    }
  },

})

export default store
