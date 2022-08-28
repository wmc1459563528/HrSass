<template>
  <!--
  :on-success="handleSuccess" 上传成功时 触发这个解析函数
  :before-upload="beforeUpload" 上传前 触发这个校验函数
 -->
  <upload-excel :on-success="handleSuccess" :before-upload="beforeUpload" />
</template>

<script>
import { reqAddEmployeeBatch } from '@/api/employees'
export default {
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
      // console.log(results, header)
      // todo 如果this.$route.query.type里为emp时调用批量新增员工
      if (this.$route.query.type === 'emp') {
        this.handleEmpBatch(results)
      }
    },
    // todo 将批量添加员工抽离到一个函数
    async handleEmpBatch(results) {
      // 1. 中英文对照表
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      // 定义一个新数组
      const newArr = []
      // 遍历初始数组
      results.forEach(item => {
        // 定义一个新对象
        const obj = {}
        // 遍历对象
        // ! 核心：根据同一个key从两个对象中取值，组合形成新对象的键值对
        for (const key in item) {
          // 生成英文键
          const englishKey = userRelations[key]
          // !特殊处理：Excel存储的日期是从1900年1月1日开始 按天数来计算的，也就是说1900年1月1日在Excel中是1 需要将入职时间和转正时间转换一下
          if (englishKey === 'timeOfEntry' || englishKey === 'correctionTime') {
            obj[englishKey] = this.formatExcelDate(item[key], '-')
          } else {
            // 给新对象添加属性和属性值
            obj[englishKey] = item[key]
          }
        }
        // console.log(obj)
        // 将转换过后的对象添加到数组中去
        newArr.push(obj)
      })
      // console.log(newArr)
      // 发起网络请求，并将数组传入
      await reqAddEmployeeBatch(newArr)
      // 提示用户
      this.$message.success('批量导入员工成功~')
      // todo 跳转到员工列表(因为是全局组件，用this.$router.back可能会造成混乱)
      this.$router.push('/employees')
    },
    // 2. 转换excel中的日期
    formatExcelDate(numb, format) {
      const time = new Date(numb * 24 * 3600000 + 1) // 毫秒
      // Excel存储的日期是从1900年1月1日开始计算的 而js是从1970年开始计算的，所以要减70
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + (month < 10 ? '0' + month : month) + format + (date < 10 ? '0' + date : date)
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }

  }
}
</script>

<style>

</style>
