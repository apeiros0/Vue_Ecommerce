import Vue from 'vue'

Vue.prototype.$bus = new Vue()

// AlertMessage
// self.$bus.$emit('message:push')
// 自定義名稱 'messsage:push'
// message (String): 傳入參數 (錯誤訊息)
// status (String): 樣式，預設值為 warning
