<template>
  <div class="upload-excel">
    <!--
        前端中常见的一个操作: 隔山打牛
        点击按钮 --- 去触发上边input的click事件 --- 打开文件上传的对话框
       -->
    <!-- 按钮盒子 -->
    <div class="btn-upload">
      <el-button :loading="loading" size="mini" type="primary" @click="handleUpload">
        点击上传
      </el-button>
    </div>

    <!--
      input标签:
      type: file 上传文件
      accept: 限制上传文件的类型 .xlsx, .xls
      细节: 这个上传文件的被隐藏了 display:none  z-index:-9999
      作用: 按钮需要它的功能, 但是不需要它的样式
     -->
    <!-- 隐藏的文件选择框 -->
    <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">

    <!-- 拖拽的盒子 -->
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      <i class="el-icon-upload" />
      <span>将文件拖到此处</span>
    </div>
  </div>
</template>

<script>
// 引入XLSX
import XLSX from 'xlsx'

export default {
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function// eslint-disable-line
  },
  data() {
    return {
      loading: false,
      // 存储excel数据对象
      excelData: {
        header: null, // 表头
        results: null // 表内容
      }
    }
  },
  methods: {
    /**
     * 生成数据函数
     * header: 表头数据
     * results: 表内容数据
     */
    generateData({ header, results }) {
      // 1. 赋值
      this.excelData.header = header
      this.excelData.results = results
      // 2. 如果外部有传onSuccess函数, 调用该函数, 并返回结果
      this.onSuccess && this.onSuccess(this.excelData)
    },
    /**
     * 拖拽文件进入该区域并松手时触发
     */
    handleDrop(e) {
      // 1. 兼容性处理(阻止冒泡和阻止默认事件)
      e.stopPropagation()
      e.preventDefault()

      // 2. 如果文件还在上传, 直接结束并返回
      // 说明: 该组件只支持单文件处理, 不支持同时解析多个excel文件
      if (this.loading) return

      // 3. 获取拖拽进入的文件数组
      const files = e.dataTransfer.files
      // 4. 该组件只支持单文件上传, 判断
      if (files.length !== 1) {
        this.$message.error('只支持单文件上传!')
        return
      }
      // 5. 从文件数组中取出第一个文件
      const rawFile = files[0]

      // 6. 判断上传文件的类型
      if (!this.isExcel(rawFile)) {
        this.$message.error('只支持上传 .xlsx, .xls, .csv 后缀的文件')
        return false
      }

      // 7. 调用上传文件的函数(开始真正去解析上传文件中的内容)
      this.upload(rawFile)

      // 2. 兼容性处理(阻止冒泡和阻止默认事件)
      e.stopPropagation()
      e.preventDefault()
    },
    /**
     * 兼容性处理
     */
    handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    /**
     处理点击上传文件
     */
    handleUpload() {
      // 触发上传文件标签中的点击事件
      this.$refs['excel-upload-input'].click()
    },
    /**
     * 上传标签的域发生变化时调用
     */
    handleClick(e) {
      // 获取上传的文件数组
      const files = e.target.files
      const rawFile = files[0] // only use files[0]
      if (!rawFile) return
      // 调用了上传文件的函数
      this.upload(rawFile)
    },
    /**
     * 解析上传的excel文件
     * rawFile: 上传的单文件(excel)
     */
    upload(rawFile) {
      // 1. 兼容性处理(修复了不能选择相同的excel文件)
      this.$refs['excel-upload-input'].value = null

      // 2. 如果外部使用时没有传函数(beforeUpload)
      if (!this.beforeUpload) {
        // 2.1 直接调用读取文件内容的函数
        this.readerData(rawFile)
        return
      }
      // 3. 如果外部使用时有传递函数(beforeUpload)
      // 调用外部传递进来的函数并把上传的文件传递出去
      // 并接收外部函数传递的结果: true / false
      const before = this.beforeUpload(rawFile)
      // 外部函数告知验证通过
      if (before) {
        // 调用读取文件内容的函数
        this.readerData(rawFile)
      }
    },
    /**
     * 调用三方框架开始解析excel文件中的内容
     * rawFile: 上传的excel文件
     */
    readerData(rawFile) {
      // 1.开始解析excel文件中的内容
      this.loading = true
      // 2. 把解析操作封装成一个promise并返回
      return new Promise((resolve, reject) => {
        // 2.1 创建一个文件阅读对象
        const reader = new FileReader()
        // 2.3 当文件中的内容被加载完毕时调用
        reader.onload = e => {
          // 2.3.1 读取文件的内容(二进制数据流)
          const data = e.target.result
          // 2.3.2 调用三方库解析内容
          const workbook = XLSX.read(data, { type: 'array' }) // 读取工作簿
          const firstSheetName = workbook.SheetNames[0] // 读取第一个工作表
          const worksheet = workbook.Sheets[firstSheetName]

          const header = this.getHeaderRow(worksheet) // 读取工作表中的表头数据
          const results = XLSX.utils.sheet_to_json(worksheet) // 读取工作表中的内容数据
          // 2.3.3 调用生成数据函数
          this.generateData({ header, results })
          // 2.3.4 excel文件已经解析完毕
          this.loading = false
          // 2.3.5 告知外部成功解析
          resolve()
        }
        // 2.2 确定该文件阅读对象以二进制流形式读取本地文件
        reader.readAsArrayBuffer(rawFile)
      })
    },
    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    /**
     * 判断是否是excel表格文件
     */
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>

<style scoped lang="scss">
.upload-excel {
  display: flex;
  justify-content: center;
  margin-top: 100px;
  .excel-upload-input {
    display: none;
    z-index: -9999;
  }
  .btn-upload,
  .drop {
    border: 1px dashed #bbb;
    width: 350px;
    height: 160px;
    text-align: center;
    line-height: 160px;
  }
  .drop {
    padding-top: 20px;
    line-height: 80px;
    color: #bbb;
    i {
      font-size: 60px;
      display: block;
    }
  }
}
</style>
