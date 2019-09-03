<template>
  <div class="container">
    <form class="form-signin" @submit.prevent="signin">
      <h1 class="h3 mb-3 font-weight-normal">Login</h1>
      <label for="inputEmail" class="sr-only">Email address</label>
      <input
        type="email"
        id="inputEmail"
        class="form-control"
        placeholder="Email address"
        required
        autofocus
        autocomplete="username"
        v-model="user.username"
        @input="loginError = false"
      />
      <label for="inputPassword" class="sr-only">Password</label>
      <input
        type="password"
        id="inputPassword"
        class="form-control"
        placeholder="Password"
        required
        autocomplete="new-password"
        v-model="user.password"
        @input="loginError = false"
      />
      <small v-if="loginError" class="d-block ml-1 mb-1 text-danger">帳號或密碼錯誤</small>
      <div class="checkbox ml-1 mb-3">
        <label>
          <input type="checkbox" value="remember-me" /> Remember me
        </label>
      </div>
      <button class="btn btn-lg btn-primary btn-block" type="submit" @keyup.enter="signin">Sign in</button>
      <p class="mt-5 mb-3 text-muted">&copy; 2017-2018</p>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      user: {
        username: '',
        password: ''
      },
      isLogin: false,
      loginError: false
    }
  },
  methods: {
    signin () {
      const api = `${process.env.API_PATH}/admin/signin`
      const self = this
      this.$http.post(api, self.user).then((response) => {
        if (response.data.success) {
          /* 轉到 products 頁 */
          self.$router.push('/admin/products')
        } else {
          self.loginError = true
          self.user.password = ''
        }
      })
    }
  },
  created () {
    // 判斷是否為登入狀態
    const self = this
    const api = `${process.env.API_PATH}/api/user/check`
    if (!self.isLogin) {
      this.$http.post(api).then((response) => {
        if (response.data.success) {
          self.$router.push('/admin/products')
          self.isLogin = true
        } else {
          self.isLogin = true
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html,
body {
  height: 100%;
}

body {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type='email'] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type='password'] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
