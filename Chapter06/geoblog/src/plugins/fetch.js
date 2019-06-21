import router from '../router'

let baseUrl

export default {
  install(Vue, options) {
    console.log('Installed!', options)

    baseUrl = options.baseUrl

    Vue.prototype.$fetch = $fetch
  }
}

export async function $fetch(url, options) {
  const finalOptions = Object.assign({}, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  }, options)
  const response = await fetch(`${baseUrl}${url}`, finalOptions)
  if (response.ok) {
    const data = await response.json()
    return data
  } else if (response.status === 403) {
    // todo
    // 如果会话不再有效就登出
  } else {
    const message = await response.text()
    const error = new Error(message)
    error.response = response
    throw error
  }
}
