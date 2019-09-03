import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/pages/Login'
import Dashboard from '@/components/Dashboard'
import Products from '@/components/pages/Products'
import Coupons from '@/components/pages/Coupons'
import Orders from '@/components/pages/Orders'
import CustomerOrders from '@/components/pages/CustomerOrders'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '*',
      redirect: 'login'
    },
    // {
    //   path: '/HelloWorld',
    //   name: 'HelloWorld',
    //   component: HelloWorld,
    //   meta: { requiresAuth: true }
    // },
    {
      /* path 盡可能打小寫 */
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/admin',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: 'products',
          name: 'Products',
          component: Products,
          meta: { requiresAuth: true }
        },
        {
          path: 'coupons',
          name: 'Coupons',
          component: Coupons,
          meta: { requiresAuth: true }
        },
        {
          path: 'orders',
          name: 'Orders',
          component: Orders,
          meta: { requiresAuth: true }
        }
      ]
    },
    {
      path: '/',
      component: Dashboard,
      children: [
        {
          path: 'customer_order',
          name: 'CustomerOrders',
          component: CustomerOrders
        }
      ]
    }
  ]
})
