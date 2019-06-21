export default function (resources) {
  return {
    data() {
      // 初始化所有数据，以便vue设置它们的响应属性
      let initData = {
        remoteDataLoading: 0,
      }
      initData.remoteErrors = {}
      for (const key in resources) {
        initData[key] = null
        initData.remoteErrors[key] = null
      }
      return initData
    },
    computed: {
      remoteDataBusy() {
        return this.$data.remoteDataLoading !== 0
      },
      hasRemoteErrors() {
        return Object.keys(this.$data.remoteErrors).some(
          key => this.$data.remoteErrors[key]
        )
      }
    },
    methods: {
      async fetchResource(key, url) {
        this.$data.remoteDataLoading++
        this.$data.remoteErrors[key] = null
        try {
          this.$data[key] = await this.$fetch(url)
        } catch (e) {
          this.$data.remoteErrors[key] = e
        }
        this.$data.remoteDataLoading--
      }
    },
    created() {
      for (const key in resources) {
        let url = resources[key]
        // 如果值是一个函数，侦听它的结果
        if (typeof url === 'function') {
          this.$watch(url, (val) => {
            this.fetchResource(key, val)
          }, {
            immediate: true,
          })
        } else {
          this.fetchResource(key, url)
        }
      }
    }
  }
}
