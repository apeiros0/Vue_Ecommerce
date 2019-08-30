// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
/* 把第三方套件往上放 */
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
/* 自己撰寫的往下放 */
import App from './App'
import router from './router'
import './bus'
import CurrencyFilter from './filters/currency'

Vue.use(VueAxios, axios)

Vue.config.productionTip = false

axios.defaults.withCredentials = true

/* eslint-disable no-new */
Vue.component('Loading', Loading)

Vue.filter('currency', CurrencyFilter)

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const api = `${process.env.API_PATH}/api/user/check`
    /* 由於 this.$http 並不在 Vue 中，所以用 axios 取代 */
    axios.post(api).then((response) => {
      console.log('check', response.data)
      if (response.data.success) {
        next()
      } else {
        next({
          path: '/login'
        })
      }
    })
  } else {
    next()
  }
})
