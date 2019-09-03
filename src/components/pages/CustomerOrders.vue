<template>
  <div class="container">
    <loading :active.sync="isLoading"></loading>
    <div class="row mt-5">
      <div class="col-md-4 mb-4" v-for="item in filterEnabledProduct" :key="item.id">
        <div class="card border-0 shadow-sm h-100">
          <div
            style="height: 150px; background-size: cover; background-position: center"
            :style="{'background-image': `url(${item.imageUrl})`}"
          ></div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{item.category}}</span>
            <h5 class="card-title">
              <a href="#" class="text-dark">{{item.title}}</a>
            </h5>
            <p class="card-text">{{item.content}}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <!-- 只顯示原價 -->
              <div class="h5" v-if="!item.price">原價 {{item.origin_price}} 元</div>
              <!-- 顯示原價及優惠價 -->
              <del class="h6" v-if="item.price">原價 {{item.origin_price}} 元</del>
              <div class="h5" v-if="item.price">現在只要 {{item.price}} 元</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm"
              @click="getProduct(item.id)"
            >
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
              查看更多
            </button>
            <button
              type="button"
              class="btn btn-outline-danger btn-sm ml-auto"
              @click="addToCart(item.id)"
            >
              <i class="fas fa-spinner fa-spin" v-if="status.cartLoadingItem === item.id"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- product Modal -->
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">{{product.title}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="product.imageUrl" class="img-fluid" alt />
            <blockquote class="blockquote mt-3">
              <p class="mb-0">{{product.content}}</p>
              <footer class="blockquote-footer text-right">{{product.description}}</footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h4" v-if="!product.price">{{product.origin_price}} 元</div>
              <div class="h6" v-if="product.price">原價 {{product.origin_price}} 元</div>
              <div class="h4" v-if="product.price">現在只賣 {{product.price}} 元</div>
            </div>
            <select name id class="form-control mt-3" v-model="product.num">
              <option value="0" selected disabled>請選擇數量</option>
              <option :value="num" v-for="num in 10" :key="num">選購 {{num}} {{product.unit}}</option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計
              <strong>{{product.num * product.price}}</strong> 元
            </div>
            <button
              type="button"
              class="btn btn-primary"
              @click="addToCart(product.id, product.num)"
            >加到購物車</button>
          </div>
        </div>
      </div>
    </div>
    <hr>
    <!-- Cart -->
    <div class="row justify-content-center align-items-center" v-if="cart.final_total !== 0">
      <div class="col-12 col-md-10 col-lg-7 col-xl-5">
        <table class="table">
          <thead>
            <th></th>
            <th>品名</th>
            <th>數量</th>
            <th>單價</th>
          </thead>
          <tbody>
            <!-- 當 cart.carts 有值後，才會跑 tr -->
            <template v-if="cart.carts">
              <tr v-for="(item) in cart.carts" :key="item.id">
                <td class="align-middle">
                  <button type="button" class="btn btn-outline-danger btn-sm" @click="daleteCartItem(item.id)">
                    <i class="far fa-trash-alt"></i>
                  </button>
                </td>
                <td class="align-middle">
                  {{ item.product.title }}
                  <div class="text-success" v-if="item.coupon">
                    已套用優惠券
                  </div>
                </td>
                <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
                <td class="align-middle text-right">{{ item.final_total }}</td>
              </tr>
            </template>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="text-right">總計</td>
              <td class="text-right">{{ cart.total }}</td>
            </tr>
            <tr v-if="cart.total !==  cart.final_total">
              <td colspan="3" class="text-right text-success">折扣價</td>
              <td class="text-right text-success">{{ cart.final_total }}</td>
            </tr>
          </tfoot>
        </table>
        <div class="input-group mb-1 input-group-sm">
          <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="coupon_code" @input="couponErrorMessage = ''"/>
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">套用優惠碼</button>
          </div>
        </div>
        <small class="d-block ml-1 mb-5 text-danger">{{couponErrorMessage}}</small>
      </div>
    </div>
    <hr>
    <!-- user 資訊 -->
    <div class="my-5 row justify-content-center">
      <form class="col-md-6" @submit.prevent="createOrder">
        <div class="form-group">
          <label for="useremail">Email</label>
          <input type="email" class="form-control" name="email" id="useremail"
            v-model="form.user.email" placeholder="請輸入 Email" required>
          <span class="text-danger"></span>
        </div>
        <div class="form-group">
          <label for="username">收件人姓名</label>
          <input type="text" class="form-control" name="name" id="username"
            v-model="form.user.name" placeholder="輸入姓名">
          <span class="text-danger"></span>
        </div>
        <div class="form-group">
          <label for="usertel">收件人電話</label>
          <input type="tel" class="form-control" id="usertel" v-model="form.user.tel" placeholder="請輸入電話">
        </div>
        <div class="form-group">
          <label for="useraddress">收件人地址</label>
          <input type="text" class="form-control" name="address" id="useraddress" v-model="form.user.address"
            placeholder="請輸入地址">
          <span class="text-danger">地址欄位不得留空</span>
        </div>
        <div class="form-group">
          <label for="comment">留言</label>
          <textarea name="" id="comment" class="form-control" cols="30" rows="10" v-model="form.message"></textarea>
        </div>
        <div class="text-right">
          <button class="btn btn-danger">送出訂單</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  data () {
    return {
      products: [],
      product: {},
      isLoading: false,
      status: {
        // 判斷哪個元素正在 Loading (存放產品 ID)
        loadingItem: '',
        cartLoadingItem: '',
        deleteLoading: ''
      },
      cart: {},
      coupon_code: '',
      couponErrorMessage: '',
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: ''
        },
        message: ''
      }
    }
  },
  methods: {
    getProducts (page = 1) {
      const self = this
      const api = `${process.env.API_PATH}/api/${process.env.CUSTONE_PATH}/products?page=${page}`
      self.isLoading = true
      self.$http.get(api).then((response) => {
        if (response.data.success) {
          console.log(response.data)
          self.products = response.data.products
          self.isLoading = false
        }
      })
    },
    // 取得資料後，再將 Modal 打開
    getProduct (id) {
      const self = this
      const api = `${process.env.API_PATH}/api/${process.env.CUSTONE_PATH}/product/${id}`
      self.status.loadingItem = id
      self.$http.get(api).then((response) => {
        if (response.data.success) {
          $('#productModal').modal('show')
          self.product = { ...response.data.product }
          // 將 num 改為預設值
          self.product.num = 0
          // 讀取完後，恢復空字串
          self.status.loadingItem = ''
        }
      })
    },
    // 傳入產品 ID 及 數量 (數量可使用預設值)
    addToCart (id, qty = 1) {
      const self = this
      const api = `${process.env.API_PATH}/api/${process.env.CUSTONE_PATH}/cart`
      self.status.cartLoadingItem = id
      const cart = {
        product_id: id,
        qty
      }
      self.$http.post(api, { 'data': cart }).then((response) => {
        if (response.data.success) {
          // 關閉 Modal
          $('#productModal').modal('hide')
          console.log(response.data)
          // 讀取完後，恢復空字串
          self.status.cartLoadingItem = ''
          // 加入購物車後，重新取得購物車資料
          self.getCart()
        }
      })
    },
    getCart () {
      const self = this
      const api = `${process.env.API_PATH}/api/${process.env.CUSTONE_PATH}/cart`
      self.isLoading = true
      self.$http.get(api).then((response) => {
        if (response.data.success) {
          self.cart = response.data.data
          console.log('cart', self.cart)
          self.isLoading = false
        }
      })
    },
    daleteCartItem (id) {
      const self = this
      const api = `${process.env.API_PATH}/api/${process.env.CUSTONE_PATH}/cart/${id}`
      // 先清空，再取值，能讓 loading 效果持續
      self.status.deleteLoading = ''
      self.status.deleteLoading = id
      self.$http.delete(api).then((response) => {
        if (response.data.success) {
          console.log('delete', response.data)
          self.getCart()
        }
      })
    },
    addCouponCode () {
      const self = this
      const api = `${process.env.API_PATH}/api/${process.env.CUSTONE_PATH}/coupon`
      self.isLoading = true
      const coupon = {
        code: self.coupon_code
      }
      self.$http.post(api, { 'data': coupon }).then((response) => {
        console.log('coupon', response.data)
        if (response.data.success) {
          // 取回後，更新購物車的折扣價
          self.getCart()
        } else {
          self.couponErrorMessage = response.data.message
        }
        self.isLoading = false
        self.coupon_code = ''
      })
    },
    createOrder () {
      const self = this
      const api = `${process.env.API_PATH}/api/${process.env.CUSTONE_PATH}/order`
      const order = self.form
      self.isLoading = true
      self.$http.post(api, { 'data': order }).then((response) => {
        console.log('order', response.data)
        if (response.data.success) {
          console.log('訂單已建立', response.data)
          self.isLoading = false
          self.getCart()
        }
      })
    }
  },
  created () {
    this.getProducts()
    this.getCart()
  },
  computed: {
    filterEnabledProduct () {
      const self = this
      return self.products.filter((item) => {
        return item.is_enabled === 1
      })
    }
  }
}
</script>

<style>
</style>
