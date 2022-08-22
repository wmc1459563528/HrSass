<template>
  <el-dialog title="添加子部门" :visible="isshow" @close="handleCloce">
    <!-- 匿名插槽 -->
    <template #default>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item prop="name" label="部门名称">
          <el-input
            v-model="form.name"
            style="width: 80%"
            placeholder="1-10个字符"
          />
        </el-form-item>
        <el-form-item prop="code" label="部门编码">
          <el-input
            v-model="form.code"
            style="width: 80%"
            placeholder="1-10个字符"
          />
        </el-form-item>
        <el-form-item prop="manager" label="部门负责人">
          <el-select
            v-model="form.manager"
            style="width: 80%"
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item prop="introduce" label="部门介绍">
          <el-input
            v-model="form.introduce"
            style="width: 80%"
            placeholder="1-300个字符"
            type="textarea"
            :rows="3"
          />
        </el-form-item> </el-form></template>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <template #footer>
      <el-button>取 消</el-button>
      <el-button type="primary">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  props: {
    isshow: {
      type: Boolean,
      default: false
    },
    // 父级部门的数据
    nodeData: {
      type: Object,
      default: () => {}
    },
    // 整体部门的对象数组
    deptsList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    /**
     * 自定义校验-所有的部门的部门名称不能相同
     */
    const checkName = (rules, value, callback) => {
    //   console.log(value, this.nodeData.id, this.deptsList)
    // 1. 根据父级部门的id, 找到该部门下的所有子部门
      const childList = this.deptsList.filter(item => item.pid === this.nodeData.id)
      //   console.log(childList)
      // 2. 判断输入的新部门名称是否和数组中部门的名称同名
      const flag = childList.some(item => item.name === value)
      // 3. 告知外部校验的结果
      flag ? callback(new Error('同级部门下已经有该部门')) : callback()
    }
    /**
     * 自定义校验-所有的部门的部门编码不能相同
     */
    const checkCode = (rules, value, callback) => {
      const flag = this.deptsList.some(item => item.code === value)
      flag ? callback(new Error('公司已经有相同的部门编码')) : callback()
    }
    return {
      form: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          // 必填校验
          { required: true, message: '请输入部门名称', trigger: ['blur', 'change'] },
          //   长度校验
          { min: 1, max: 10, message: '部门名称只能是1-10位', trigger: ['blur', 'change'] },
          // 自定义校验部门名称
          { validator: checkName, trigger: 'blur' }
        ],
        code: [
          // 必填校验
          { required: true, message: '请输入部门编码', trigger: ['blur', 'change'] },
          //   长度校验
          { min: 1, max: 10, message: '部门编码只能是1-10位', trigger: ['blur', 'change'] },
          // 自定义校验部门名称
          { validator: checkCode, trigger: 'blur' }
        ],
        manager: [
          // 必填校验
          { required: true, message: '请输入部门负责人', trigger: ['blur', 'change'] }
        ],
        introduce: [
          // 必填校验
          { required: true, message: '请输入部门介绍', trigger: ['blur', 'change'] },
          //   长度校验
          { min: 1, max: 300, message: '部门介绍只能是1-300位', trigger: ['blur', 'change'] }
        ]

      }
    }
  },
  methods: {
    handleCloce() {
      this.$emit('CloseDept')
      //   console.log('========')
      //   关闭时重置表单数据
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style></style>
