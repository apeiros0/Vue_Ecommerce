<template>
  <div>
    <a href="#" class="btn btn-primary" @click.prevent="signout">Sign Out</a>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {}
  },
  methods: {
    signout () {
      const api = `${process.env.API_PATH}/logout`
      const self = this
      this.$http.post(api).then((response) => {
        console.log(response.data)
        /* 直接傳入 api 就能出發 logout 事件 */
        if (response.data.success) {
          /* 回到首頁 */
          self.$router.push('/login')
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
