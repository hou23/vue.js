export default function (resources) {
  return {
    data() {
      let initData = {
        remoteDataLoading: 0,
      }
      for (const key in resources) {
        initData[key] = null
      }
      return initData
    },
    methods: {
      async fetchResource(key, url) {
        try {
          this.$data[key] = await this.$fetch(url)
        } catch (e) {
          console.error(e)
        }
      }
    }
  }
}
