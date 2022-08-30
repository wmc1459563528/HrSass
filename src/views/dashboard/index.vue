<template>
  <div class="dashboard-container">
    <div class="app-container">
      <h2>
        首页
      </h2>
      <upload-image :limit="2" />
    </div>
  </div>
</template>

<script>

export default {
  name: 'Dashboard',

  data() {
    return {

    }
  },
  methods: {

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
