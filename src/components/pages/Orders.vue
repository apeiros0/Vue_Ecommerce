<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <table class="table mt-5">
      <thead>
        <tr>
          <th width="120">購買時間</th>
          <th>Email</th>
          <th>購買款項</th>
          <th width="120">應付金額</th>
          <th width="100">是否付款</th>
          <!-- <th width="100">修改訂單</th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in orders" :key="item.id" :class="{'text-danger': item.is_paid === false}">
          <td>{{ item.create_at | timeFormat }}</td>
          <td>{{ item.user.email }}</td>
          <td>
            <template v-for="product in filterProducts">
              <div class="row no-gutters" v-if="product.order_id === item.id" :key="product.id">
                <div class="col-12 col-lg-2 mr-1">
                  <span>{{ product.title }}</span>
                </div>
                <div class="col-12 col-lg-4">
                  <span>數量：{{ product.qty }}</span>
                </div>
              </div>
            </template>
          </td>
          <td class="text-right">
            <span v-if="item.total">{{ item.total | currency }}</span>
            <span v-else>{{ 0 | currency }}</span>
          </td>
          <td>
            <span v-if="item.is_paid === true" class="text-success">已付款</span>
            <span v-else class="text-danger">未付款</span>
          </td>
          <!-- <td>
            <button class="btn btn-outline-primary btn-sm" @click="openModal(item)">修改</button>
          </td> -->
        </tr>
      </tbody>
    </table>
    <Pagination :pagination="pagination" @getPage="getOrders"></Pagination>
  </div>
</template>

<script>
// import $ from 'jquery'
import Pagination from '../Pagination'
export default {
  name: 'Orders',
  data () {
    return {
      isLoading: false,
      orders: [],
      products: [],
      pagination: {}
    }
  },
  created () {
    this.getOrders()
    this.getProducts()
  },
  methods: {
    getOrders (page = 1) {
      const api = `${process.env.API_PATH}/api/${process.env.CUSTONE_PATH}/admin/orders?page=${page}`
      const self = this
      self.isLoading = true
      self.$http.get(api).then((response) => {
        console.log('orders', response.data)
        if (response.data.success) {
          self.isLoading = false
          self.orders = response.data.orders
          self.pagination = { ...response.data.pagination }
        }
      })
    },
    getProducts () {
      const api = `${process.env.API_PATH}/api/${process.env.CUSTONE_PATH}/admin/products`
      const self = this
      this.$http.get(api).then((response) => {
        self.products = response.data.products
      })
    },
    // openModal (order) {
    //   this.tempOrder = Object.assign({}, order)
    //   $('#orderModal').modal('show')
    // },
    // processing
    updateOrders (orderId) {
      const api = `${process.env.API_PATH}/api/${process.env.CUSTONE_PATH}/admin/order/${orderId}`
      const self = this
      self.$http.put(api, { 'data': {} }).then((response) => {
        if (response.data.success) {
          console.log(response.data)
        }
      })
    }
  },
  computed: {
    filterProducts () {
      // const self = this
      let tempArray = []
      // const orderProductArray = []
      /*
        重組 orders 的產品資料
        order_id (訂單編號)
        product_id (產品 ID)
        qty (產品數量)
      */
      // self.orders.forEach((item) => {
      //   item.products.forEach((productItem) => {
      //     orderProductArray.push({
      //       order_id: item.id,
      //       product_id: productItem.product_id,
      //       qty: productItem.qty
      //     })
      //   })
      // })
      // 根據產品 ID 取得產品名稱
      // orderProductArray.forEach((item) => {
      //   self.products.forEach((productItem) => {
      //     if (item.product_id === productItem.id) {
      //       tempArray.push(
      //         Object.assign({}, item, { title: productItem.title })
      //       )
      //     }
      //   })
      // })
      return tempArray
    }
  },
  components: {
    Pagination
  }
}
</script>

<style scoped>
</style>
