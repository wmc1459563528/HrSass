<template>
  <div class="dashboard-container">
    <div class="app-container">
      <h2>
        首页
        <svg-icon icon-class="dashboard" />
        <!-- 过滤器的使用 -->
        <p>{{ price | fnName }}</p>
        <p>{{ price1 | fnName }}</p>
        <p>{{ price2 | fnName }}</p>
        <p>{{ price3 | fnName }}</p>

      </h2>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  filters: {
    fnName(value) {
      return '￥' + value.toFixed(2)
    }
  },
  data() {
    return {
      price: 100,
      price1: 100.345,
      price2: 100.23,
      price3: 100.436325345
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
