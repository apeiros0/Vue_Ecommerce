<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="text-right mt-3">
      <button class="btn btn-primary" @click="openModal(true)">建立新的產品</button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">分類</th>
          <th>產品名稱</th>
          <th width="120">原價</th>
          <th width="120">售價</th>
          <th width="100">是否啟用</th>
          <th width="120">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td>{{ item.category }}</td>
          <td>{{ item.title }}</td>
          <td class="text-right">{{ item.origin_price | currency }}</td>
          <td class="text-right">{{ item.price | currency }}</td>
          <td>
            <!-- 產品啟用 === 1 -->
            <span v-if="item.is_enabled === 1" class="text-success">啟用</span>
            <span v-else class="text-danger">未啟用</span>
          </td>
          <td>
            <div class="btn-group" role="group" aria-label="Basic example">
              <button
                class="btn btn-outline-primary btn-sm"
                data-toggle="modal"
                data-target="#editModal"
                @click="openModal(false, item)">編輯</button>
              <button
                class="btn btn-danger btn-sm"
                data-toggle="modal"
                data-target="#deleteModal"
                @click="openModal(false, item, true)">刪除</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <Pagination :pagination="pagination" @getPage="getProducts"></Pagination>

    <!-- Add & Edit Modal -->
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span v-if="isNew">新增產品</span>
              <span v-else>編輯產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="image">輸入圖片網址</label>
                  <input
                    type="text"
                    class="form-control"
                    id="image"
                    placeholder="請輸入圖片連結"
                    v-model="tempProduct.imageUrl"
                  />
                </div>
                <div class="form-group">
                  <label for="customFile">
                    或 上傳圖片
                    <i class="fas fa-spinner fa-pulse" v-if="status.fileUpLoading"></i>
                  </label>
                  <input type="file" id="customFile" class="form-control" ref="files" @change="uploadFile" />
                </div>
                <img
                  class="img-fluid"
                  alt
                  :src="tempProduct.imageUrl"
                />
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    placeholder="請輸入標題"
                    v-model="tempProduct.title"
                  />
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input
                      type="text"
                      class="form-control"
                      id="category"
                      placeholder="請輸入分類"
                      v-model="tempProduct.category"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input
                      type="unit"
                      class="form-control"
                      id="unit"
                      placeholder="請輸入單位"
                      v-model.number="tempProduct.unit"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="origin_price">原價</label>
                    <input
                      type="number"
                      class="form-control"
                      id="origin_price"
                      placeholder="請輸入原價"
                      v-model.number="tempProduct.origin_price"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input
                      type="number"
                      class="form-control"
                      id="price"
                      placeholder="請輸入售價"
                      v-model.number="tempProduct.price"
                    />
                  </div>
                </div>
                <hr />

                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea
                    type="text"
                    class="form-control"
                    id="description"
                    placeholder="請輸入產品描述"
                    v-model="tempProduct.description"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea
                    type="text"
                    class="form-control"
                    id="content"
                    placeholder="請輸入產品說明內容"
                    v-model="tempProduct.content"
                  ></textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="is_enabled"
                      v-model.number="tempProduct.is_enabled"
                      :true-value="1"
                      :false-value="0"
                    />
                    <label class="form-check-label" for="is_enabled">是否啟用</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="updateProduct">確認</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Delete Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">刪除 {{tempProduct.title}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否要刪除 {{tempProduct.title}} ?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="deleteProduct">確認</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import Pagination from '../Pagination'

export default {
  data () {
    return {
      products: [],
      /* 要送出的欄位內容 */
      tempProduct: {},
      isNew: false,
      isLoading: false,
      status: {
        fileUpLoading: false
      },
      pagination: {},
      page: 1
    }
  },
  components: {
    Pagination
  },
  created () {
    this.getProducts()
  },
  methods: {
    getProducts (page = 1) {
      this.page = page
      const api = `${process.env.API_PATH}/api/${process.env.CUSTONE_PATH}/admin/products?page=${page}`
      const self = this
      self.isLoading = true
      this.$http.get(api).then((response) => {
        console.log(response.data)
        self.products = response.data.products
        console.log('products', self.products)
        self.isLoading = false
        self.pagination = response.data.pagination
      })
    },
    openModal (isNew, item, isDelete = false) {
      if (isNew) {
        this.tempProduct = {}
        this.isNew = true
      } else {
        /* assign 是避免 by reference (避免參照到同一個 item) */
        this.tempProduct = Object.assign({}, item)
        this.isNew = false
      }

      if (isDelete) {
        $('#deleteModal').modal('show')
      } else {
        $('#productModal').modal('show')
      }
    },
    updateProduct () {
      let api = `${process.env.API_PATH}/api/${process.env.CUSTONE_PATH}/admin/product`
      let APIMethod = 'post'
      const self = this
      if (!self.isNew) {
        api = `${process.env.API_PATH}/api/${process.env.CUSTONE_PATH}/admin/product/${self.tempProduct.id}`
        APIMethod = 'put'
      }
      /* product 的第一個 post 行為，要加上 tempProduct */
      /* $http[APIMethod] 使用 object 方式決定 API method */
      this.$http[APIMethod](api, { 'data': self.tempProduct }).then((response) => {
        console.log(response.data)
        if (response.data.success) {
          /* 建立完產品資料後，關閉 Modal，並重新取得產品資料 */
          $('#productModal').modal('hide')
          self.getProducts(self.page)
        } else {
          $('#productModal').modal('hide')
          self.getProducts(self.page)
          self.$bus.$emit('message:push', '更新失敗', 'danger')
        }
      })
    },
    deleteProduct () {
      let api = `${process.env.API_PATH}/api/${process.env.CUSTONE_PATH}/admin/product/${this.tempProduct.id}`
      const self = this
      this.$http.delete(api).then((response) => {
        console.log(response.data)
        if (response.data.success) {
          /* 建立完產品資料後，關閉 Modal，並重新取得產品資料 */
          $('#deleteModal').modal('hide')
          self.getProducts(this.page)
        } else {
          $('#deleteModal').modal('hide')
          self.getProducts(self.page)
          self.$bus.$emit('message:push', response.data.message, 'danger')
        }
      })
    },
    uploadFile () {
      console.log(this)
      /* 定義已經上傳的檔案 */
      const uploadedFile = this.$refs.files.files[0]
      const self = this
      const formData = new FormData()
      formData.append('file-to-upload', uploadedFile)
      const api = `${process.env.API_PATH}/api/${process.env.CUSTONE_PATH}/admin/upload`
      self.status.fileUpLoading = true
      this.$http.post(api, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        console.log(response.data)
        if (response.data.success) {
          // self.tempProduct.imageUrl = response.data.imageUrl
          // console.log(self.tempProduct)
          self.$set(self.tempProduct, 'imageUrl', response.data.imageUrl)
          self.status.fileUpLoading = false
        } else {
          let errorMessage = response.data.message
          if (typeof response.data.message === 'object') {
            errorMessage = response.data.message.message
          }
          this.$bus.$emit('message:push', errorMessage, 'danger')
          self.status.fileUpLoading = false
        }
      })
    }
  }
}
</script>
<style scoped></style>
