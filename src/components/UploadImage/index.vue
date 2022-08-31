<template>
  <div>
    <!--
      1.action
          必传 需要给一个后端接口地址, elementui会帮你发送请求
      我们不需要它自动发请求, 我们将来自己发送请求, 此时给空 不让他报错

      2.file-list
          文件列表数组
      3.list-type:
          文件列表的类型 (照片墙形式)
      4.on-preview
          当你点击预览的+号时, 会自动触发, 接收一个函数, 会把点击的图片文件作为参数传递
      5.limit
          限制用户上传图片数量
      6. on-remove
          当你点击垃圾篓的时候会自动触发
          会接收一个函数, 函数会有两个参数: file, fileList
          file: 是被删除的那个文件对象
          fileList: 返回最新的文件列表 (结构中的列表, 不是数据中的列表)
      7. http-request
        覆盖默认的上传行为，可以自定义上传的实现
        接收的是一个函数 函数接收一个参数: 对象 (obj.file -- 就是要上传的文件对象)
        一旦配置了自定义上传, 当选择一张图片时, 默认会以本地预览的形式展示图片
        类似于: blob:http://localhost:8888/bc04f586-b0c1-48bd-9102-46f7ddf32926
        临时生成一个本地图片用于预览, 增强用户体验
      8. on-change
        文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
        接收的是一个函数 function(file, fileList)
      9. before-upload
        图片文件在真正上传之前触发, 接收的是一个函数   function(file)
        一般用于校验图片的格式或者图片的大小...
    -->
    <el-upload
      :class="{disabled: isDisabled}"
      action=""
      list-type="picture-card"
      :limit="limit"
      :file-list="fileList"
      :http-request="handleUpload"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleReomve"
      :on-change="handleChange"
      :before-upload="handleBeforeUpload"
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
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDiGXYImzvay5wJQHsCG8k59vRgeKlvnPk',
  SecretKey: '6vSijUyB7nCKCn7AwRfcIiqhHbeRwA8p'
})
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
      fileList: [],
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
    },
    // 2.该组件的所有文件是否都上传成功
    isUploadAll() {
      return this.fileList.every(item => item.status === 'success')
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
      // console.log(file, fileList)
      this.fileList = [...fileList]
    },
    // 3.覆盖默认行为,自定义上传文件
    handleUpload(obj) {
      // 3.0 从本地数组中找到上传的对象
      const uid = obj.file.uid
      const file = this.fileList.find(item => item.uid === uid)
      // 将status修改为uploading
      file.status = 'uploading'
      // 3.1 调用腾讯云接口的函数，实现文件上传
      cos.putObject({
        Bucket: 'hrsass-1258151064', /* 必须 */
        Region: 'ap-shanghai', /* 存储桶所在地域，必须字段 */
        Key: `HRSass-${+new Date()}-${obj.file.name}`, /* 必须, 存储桶中图片的名称 */
        StorageClass: 'STANDARD',
        Body: obj.file, // 上传文件对象
        // 获取文件上传进度
        onProgress: (progressData) => {
          // console.log(progressData)
          // 将上传进度传给file中
          file.percentage = parseInt(progressData.percent * 100)
        }
      }, (err, data) => {
        if (err) {
          // ! 腾讯云中是fun形式的函数，如果要用到this，需要改成箭头函数，让this指向上层函数的实例
          this.$message.warning('图片上传失败，请稍后再试~')
          return
        }
        // 3.2 更新status和url
        // 增加用户体验使用延时器延迟更改状态
        setTimeout(() => {
          file.status = 'success'
        }, 500)
        // 更新img中src路径为存储桶中地址
        file.url = 'https://' + data.Location
        this.$message.success('头像上传成功~')
      })
    },
    // 4.当文件操作时
    handleChange(file, fileList) {
      // 同步到本地的数组中
      this.fileList = [...fileList]
    },
    // 5. 文件上传前处理图片大小 上传前进行校验
    handleBeforeUpload(file) {
      // console.log(file.size)
      // 将文件大小转为MB
      const isLs2M = file.size / 1024 / 1024 <= 2
      if (!isLs2M) {
        // 提示用户
        this.$message.warning('请您上传2MB以下的图片')
        return false
      }
      // 如果小于2MB通过校验
      return true
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
