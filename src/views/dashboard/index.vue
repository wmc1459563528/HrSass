<template>
  <div class="dashboard-container">
    <!-- 1. 获取token -->
    <div class="dashboard-text">从state中获取: {{ $store.state.user.token }}</div>
    <div class="dashboard-text">从getters中获取: {{ $store.getters.token }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
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
