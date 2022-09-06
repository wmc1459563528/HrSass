<template>
  <el-dropdown @command="handleCommand">
    <span class="el-dropdown-link">
      <svg-icon style="fill: white;font-size:20px" icon-class="language" />
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh" :disabled="$i18n.locale === 'zh'">简体中文</el-dropdown-item>
      <el-dropdown-item command="en" :disabled="$i18n.locale === 'en'">EN</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  methods: {
    handleCommand(command) {
      // 将语言类型存储到本地
      Cookies.set('language', command)
      this.$i18n.locale = command // 改变locale中的值
      this.$message.success('切换语言成功')
    }
  }
}
</script>

<style>

</style>
