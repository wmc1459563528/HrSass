<template>
  <div class="dashboard-container">
    <div class="app-container">
      <h2>
        首页
      </h2>
      <!--
  :on-success="handleSuccess" 上传成功时 触发这个解析函数
  :before-upload="beforeUpload" 上传前 触发这个校验函数
 -->
      <upload-excel :on-success="handleSuccess" :before-upload="beforeUpload" />

      <el-button
        v-loading="downloadLoading"
        style="margin:0 0 20px 20px;"
        type="primary"
        icon="el-icon-document"
        @click="handleDownload"
      >
        Excel导出
      </el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Dashboard',
  data() {
    return {
      downloadLoading: false
    }
  },
  methods: {
    /**
     * 文件上传之前校验
     * 返回值: true(通过校验)/false(没有通过校验)
     */
    beforeUpload(file) {
      // 1. 限制上传文件的大小(<1MB)
      // 计算机中默认文件的单位大小就是字节(B)
      // 1GB = 1024MB 1MB = 1024KB  1KB = 1024B
      const isLt3M = file.size / 1024 / 1024 < 3

      // 2. 判断: 如果文件大小<3MB, 通过校验
      if (isLt3M) {
        return true
      }

      // 3. 提示用户
      this.$message({
        message: '请上传不要超过3MB大小的文件',
        type: 'warning'
      })
      // 4. 没有通过校验
      return false
    },
    handleSuccess({ results, header }) {
      console.log(results, header)
    },
    handleDownload() {
      this.downloadLoading = true
      /*
        引入文件的方式:
        1) import Export2Excel from '@/vendor/Export2Excel' 立即执行
        2) import('@/vendor/Export2Excel') 懒加载执行 只有外部的函数被调用时才执行
        疑问: 是不是每点击一次按钮就导入一次呢?
        答案: 不会 import('xxx')会有缓存, 第一次导入之后, 后端都是去读取缓存
      */
      import('@/vendor/Export2Excel').then(excel => {
        // 1. 准备数据
        const tHeader = ['姓名', '性别', '年龄', '爱好']
        const data = [
          ['潘子', '男', 60, '卖酒'],
          ['嘎子', '男', 30, '叔, 你兜不住, 让我来卖']
        ]
        // 2. 导出excel
        excel.export_json_to_excel({
          header: tHeader, // 表头
          data, // 表内容
          filename: '101-员工表', // 文件名称
          autoWidth: true, // 是否定宽
          bookType: 'xlsx' // 文件类型
        })
      })
      this.downloadLoading = false
    }

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
