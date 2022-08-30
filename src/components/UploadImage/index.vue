<template>
  <div>
    <!--
      action 必传 需要给一个后端接口地址, elementui会帮你发送请求
      我们不需要它自动发请求, 我们将来自己发送请求, 此时给空 不让他报错

      file-list 文件列表数组
      list-type: 文件列表的类型 (照片墙形式)
      on-preview 当你点击预览的+号时, 会自动触发, 接收一个函数, 会把点击的图片文件作为参数传递
    -->
    <el-upload
      :class="{disabled: isDisabled}"
      action=""
      list-type="picture-card"
      :file-list="fileList"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleReomve"
      :http-request="handleRequest"
      :limit="limit"
    >
      <i class="el-icon-plus" />
    </el-upload>

    <el-dialog
      title="图片预览"
      :visible="dialogVisible"
      @close="dialogVisible = false"
    >
      <img :src="dialogImageUrl" style="width: 100%;">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ImageUpload',
  props: {
    // 1. 外部告知能展示几张图片
    limit: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      // 1. 上传文件列表
      fileList: [
        { url: 'https://img1.baidu.com/it/u=4216761644,15569246&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500' },
        { url: 'https://img0.baidu.com/it/u=18497219,172601761&fm=253&fmt=auto&app=138&f=PNG?w=519&h=500' }
      ],
      // 2. 图片预览对话框显示/隐藏
      dialogVisible: false,
      // 3. 用于展示的图片地址,
      dialogImageUrl: ''
    }
  },
  computed: {
    // 1. 动态控制上传按钮的显示和隐藏
    isDisabled() {
      // 如果文件列表的个数 >= 外部传入的限制个数, 就应该隐藏
      return this.fileList.length >= this.limit
    }
  },
  methods: {
    // 1. 图片预览
    handlePictureCardPreview(file) {
      // console.log(file)
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 2.点击垃圾桶删除图片
    handleReomve(file, fileList) {
      // 不建议，因为可能会造成污染
    //   this.fileList = fileList
      console.log(file, fileList)
      this.fileList = [...fileList]
    },
    // 3.覆盖默认行为,自定义上传文件
    handleRequest() {
      console.log('自定义上传文件')
    }
  }
}
</script>

<style lang="scss" scoped>
  .disabled {
    // 深度穿透选择器
    ::v-deep {
      .el-upload--picture-card{
        display: none;
      }
    }
  }
</style>
