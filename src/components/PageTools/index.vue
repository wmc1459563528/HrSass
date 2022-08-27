<template>
  <el-card>
    <div class="page-tools">
      <div class="left">
        <div v-if="$slots.left" class="tips">
          <i class="el-icon-info" />
          <!-- 左边插槽 -->
          <slot name="left" />
        </div>
      </div>
      <div class="right">
        <!-- 右边插槽 -->
        <slot name="right" />

      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'PageTools'
}
</script>

<style lang="scss" scoped>
.page-tools {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .tips {
    line-height: 34px;
    padding: 0px 15px;
    border-radius: 5px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
    // font-size: 12px;
    i {
      margin-right: 10px;
      color: #409eff;
    }
  }
}
</style>
