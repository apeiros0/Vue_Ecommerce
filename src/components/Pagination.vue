<template>
  <div>
    <nav class="d-flex justify-content-center" aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :class="{ 'disabled': !pagination.has_pre }">
          <a
            class="page-link"
            href="#"
            aria-label="Previous"
            @click.prevent="getPage(pagination.current_page - 1)"
          >
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </a>
        </li>
        <li
          class="page-item"
          v-for="page in pagination.total_pages"
          :key="page"
          :class="{ 'active': page === pagination.current_page }"
        >
          <a class="page-link" href="#" @click.prevent="getPage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ 'disabled': !pagination.has_next }">
          <a
            class="page-link"
            href="#"
            aria-label="Next"
            @click.prevent="getPage(pagination.current_page + 1)"
          >
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  // 使用 computed 解決
  props: ['pageData'],

  // 直接綁定 props 資料
  //   props: {
  //     pagination: {
  //       type: Object
  //     }
  //   },
  methods: {
    getPage (page) {
      this.$emit('getPage', page)
    }
  },
  computed: {
    /* Vue 無法在 props 更新時，即時更新綁定的 data 屬性，會造成 props 雖然更新，但 data 卻無法更新的情況 (重新整理時，data 可能還會無法綁定資料) */
    pagination () {
      return this.$props.pageData
    }
  }
}
</script>

<style>
</style>
