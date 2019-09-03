<template>
  <div>
    <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">後台管理</a>
      <input
        class="form-control form-control-dark w-100"
        type="text"
        placeholder="Search"
        aria-label="Search"
      />
      <ul class="navbar-nav px-3">
        <li class="nav-item text-nowrap">
          <a class="nav-link" href="#" @click.prevent="signout">登出</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  created () {
    // const api = `${process.env.API_PATH}/api/user/check`
    // /* 由於 this.$http 並不在 Vue 中，所以用 axios 取代 */
    // this.$http.post(api).then((response) => {
    //   console.log('check', response.data)
    //   if (response.data.success) {
    //     console.log(response.data)
    //   } else {
    //   }
    // })
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

<style>
</style>
