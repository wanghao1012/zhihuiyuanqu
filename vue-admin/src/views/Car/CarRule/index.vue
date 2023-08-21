<template>
  <div class="rule-container">
    <div class="create-container">
      <el-button type="primary" @click="openDialog">增加停车计费规则</el-button>
      <el-button @click="exportExcel">导出Excel</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table :data="ruleList" style="width: 100%">
        <el-table-column label="序号" type="index" :index="indexMethod" />
        <el-table-column label="计费规则编号" prop="ruleNumber" />
        <el-table-column label="计费规则名称" prop="ruleName" />
        <el-table-column label="免费时长(分钟)" prop="freeDuration" />
        <el-table-column label="收费上线(元)" prop="chargeCeiling" />
        <el-table-column label="计费方式" prop="chargeType" :formatter="formData" />
        <el-table-column label="计费规则" prop="ruleNameView" />
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="scope">
            <el-button size="mini" type="text" @click="edit(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="delCarRuleList(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination
      :current-page="params.page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="params.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 弹框 -->
    <el-dialog :visible="dialogVisible" width="680px" :title="title" :close-on-click-modal="false" @close="closeDialog">
      <!-- 表单接口 -->
      <div class="form-container">
        <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-position="top">
          <el-form-item label="计费规则编号" prop="ruleNumber">
            <el-input v-model="addForm.ruleNumber" />
          </el-form-item>
          <el-form-item label="计费规则名称" prop="ruleName">
            <el-input v-model="addForm.ruleName" />
          </el-form-item>
          <el-form-item label="计费方式" prop="chargeType">
            <el-radio-group v-model="addForm.chargeType" size="small">
              <el-radio label="duration" border>时长收费</el-radio>
              <el-radio label="turn" border>按次收费</el-radio>
              <el-radio label="partition" border>分段收费</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="flex-container" style="display:flex;justify-content:space-between">
            <el-form-item label="免费时长">
              <el-input v-model="addForm.freeDuration" />
            </el-form-item>
            <el-form-item label="收费上限">
              <el-input v-model="addForm.chargeCeiling" />
            </el-form-item>
          </div>
          <el-form-item label="计费规则" required>
            <!-- 按时长收费区域 -->
            <div v-if="addForm.chargeType === 'duration'" class="duration" style="display: flex">
              每
              <el-form-item prop="durationTime" class="w-150">
                <el-input v-model="addForm.durationTime" class="input-box" />
              </el-form-item>
              小时
              <el-form-item prop="durationPrice" class="w-150">
                <el-input
                  v-model="addForm.durationPrice"
                  class="input-box"
                />
              </el-form-item>
              元
            </div>
            <!-- 按次收费区域 -->
            <div v-if="addForm.chargeType === 'turn'" class="turn" style="display: flex">
              每次
              <el-form-item prop="turnPrice">
                <el-input
                  v-model="addForm.turnPrice"
                  class="input-box"
                  style="width: 150px"
                />
              </el-form-item>
              元
            </div>
            <!-- 按分段收费区域 -->
            <div v-if="addForm.chargeType === 'partition'" class="partition">
              <div class="item" style="display: flex;">
                <el-form-item prop="partitionFrameTime">
                  <el-input
                    v-model="addForm.partitionFrameTime"
                    class="input-box"
                    style="width: 100px"
                  />
                </el-form-item>
                小时内,每小时收费
                <el-form-item prop="partitionFramePrice">
                  <el-input
                    v-model="addForm.partitionFramePrice"
                    class="input-box"
                    style="width: 100px"
                  />
                </el-form-item>
                元
              </div>
              <div class="item" style="display: flex; margin: 30px auto 0">
                每增加
                <el-form-item prop="partitionIncreaseTime">
                  <el-input
                    v-model="addForm.partitionIncreaseTime"
                    class="input-box"
                    style="width: 120px"
                  />
                </el-form-item>
                小时,增加
                <el-form-item prop="partitionIncreasePrice">
                  <el-input
                    v-model="addForm.partitionIncreasePrice"
                    class="input-box"
                    style="width: 120px"
                  />
                </el-form-item>
                元
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini" @click="closeDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="addRuleList">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { utils, writeFileXLSX } from 'xlsx'
import { getRuleListApi, createRuleApi, delCarRuleListApi, lookEditRuleApi, editCardApi } from '@/api/cardRule'
export default {
  name: 'Building',
  data() {
    return {
      title: '新增规则',
      ruleList: [], // 存放计费规则的列表
      params: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      dialogVisible: false, // 控制弹框关闭打开
      addForm: {
        ruleNumber: '', // 计费规则编号
        ruleName: '', // 计费规则名称
        chargeType: 'duration', // 计费规则类型 duration / turn / partition
        chargeCeiling: null,
        freeDuration: null,
        // 时长计费独有字段
        durationTime: null, // 时长计费单位时间
        durationPrice: null, // 时长计费单位价格
        durationType: 'hour',
        // 按次收费独有字段
        turnPrice: null,
        // 分段计费独有字段
        partitionFrameTime: null, // 段内时间
        partitionFramePrice: null, // 段内费用
        partitionIncreaseTime: null, // 超出时间
        partitionIncreasePrice: null // 超出费为收费价钱

      }, // 计费规则表单对象
      addFormRules: {
        ruleNumber: [
          {
            required: true,
            message: '请输入规则编号',
            trigger: 'blur'
          }
        ],
        ruleName: [
          {
            required: true,
            message: '请输入规则名称',
            trigger: 'blur'
          }
        ],
        chargeType: [
          {
            required: true,
            message: '请选择收费类型',
            trigger: 'blur'
          }
        ],
        durationTime: [{ required: true, message: '请输入时间', trigger: 'blur' }],
        durationPrice: [{ required: true, message: '请输入金额', trigger: 'blur' }],
        turnPrice: [{ required: true, message: '请输入次数', trigger: 'blur' }],
        partitionFrameTime: [{ required: true, message: '请输入段内时间', trigger: 'blur' }],
        partitionFramePrice: [{ required: true, message: '请输入段内费用', trigger: 'blur' }],
        partitionIncreaseTime: [{ required: true, message: '请输入超出时间', trigger: 'blur' }],
        partitionIncreasePrice: [{ required: true, message: '请输入超出金额', trigger: 'blur' }]

      } // 计费规则校验规则对象

    }
  },
  watch: {
    'addForm.chargeType'(val) {
      // console.log(val)
      // 当切换计费规则时 清空全部表单的校验提升
      this.$refs.addForm.clearValidate(['durationTime', 'durationPrice', 'turnPrice', 'partitionFrameTime', 'partitionFramePrice', 'partitionIncreaseTime', 'partitionIncreasePrice'])
    }
  },
  created() {
    this.getRuleList()
  },
  methods: {
    // 导出Excel表格
    async exportExcel() {
      // 创建一个新的工作簿
      const workbook = utils.book_new()
      const res = await getRuleListApi(this.params)
      // 表头英文字段key
      const tableHeaderKeys = ['ruleNumber', 'ruleName', 'freeDuration', 'chargeCeiling', 'chargeType', 'ruleNameView']
      // 表头中文字段value
      const tableHeaderValues = ['计费规则编号', '计费规则名称', '免费时长(分钟)', '收费上线(元)', '计费方式', '计费规则']
      // 以excel表格的顺序调整后端数据
      const list = res.data.rows.map(item => {
        const obj = {}
        tableHeaderKeys.forEach(key => {
          obj[key] = item[key]
        })
        return obj
      })
      // 创建一个工作表 要求一个对象数组格式
      const worksheet = utils.json_to_sheet(list)

      // 把工作表添加到工作簿  Data为工作表名称
      utils.book_append_sheet(workbook, worksheet, 'Data')
      // 改写表头
      utils.sheet_add_aoa(worksheet, [tableHeaderValues], { origin: 'A1' })
      // 导出方法进行导出
      writeFileXLSX(workbook, '哈哈哈.xlsx')
    },
    // 获取计费规则列表
    async getRuleList() {
      const res = await getRuleListApi(this.params)
      // console.log(res)
      this.ruleList = res.data.rows
      this.total = res.data.total
    },
    // 序号
    indexMethod(index) {
      return (this.params.page - 1) * this.params.pageSize + index + 1
    },
    // 计费方式
    formData(row, column, cellValue, index) {
      // console.log(row, column, cellValue, index)
      // console.log(cellValue)
      const data = {
        duration: '时长收费',
        turn: '按次收费',
        partition: '分段收费'
      }
      return data[cellValue]
    },
    //  当前页条数发生改变时
    handleSizeChange(val) {
      this.params.pageSize = val
      this.params.page = 1
      this.getRuleList()
    },
    // 页码发生改变时
    handleCurrentChange(val) {
      this.params.page = val
      this.getRuleList()
    },
    // 打开弹框
    openDialog() {
      this.dialogVisible = true
      this.title = '新增规则'
      // this.$refs.addForm.resetFields()
    },
    // 关闭弹框
    closeDialog() {
      this.dialogVisible = false
      this.$refs.addForm.resetFields()
      this.addForm = {
        ruleNumber: '', // 计费规则编号
        ruleName: '', // 计费规则名称
        chargeType: 'duration', // 计费规则类型 duration / turn / partition
        chargeCeiling: null,
        freeDuration: null,
        // 时长计费独有字段
        durationTime: null, // 时长计费单位时间
        durationPrice: null, // 时长计费单位价格
        durationType: 'hour',
        // 按次收费独有字段
        turnPrice: null,
        // 分段计费独有字段
        partitionFrameTime: null, // 段内时间
        partitionFramePrice: null, // 段内费用
        partitionIncreaseTime: null, // 超出时间
        partitionIncreasePrice: null // 超出费为收费价钱

      }
    },
    // 添加或修改
    addRuleList() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          // console.log(11)
          if (this.addForm.id) {
            const res = await editCardApi(this.addForm)
            console.log(res)
            this.$message.success('修改成功')
          } else {
            const res = await createRuleApi(this.addForm)
            console.log(res)
            this.$message.success('添加成功')
          }
          this.getRuleList()
          this.closeDialog()
        }
      })
    },
    // 删除
    delCarRuleList(id) {
      this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示').then(async() => {
        const res = await delCarRuleListApi(id)
        console.log(res)
        this.$message.success('删除成功')
        this.getRuleList()
      }).catch(err => {
        console.log(err)
      })
    },
    // 修改
    async edit(id) {
      this.title = '修改规则'
      this.dialogVisible = true
      // console.log(id)
      const res = await lookEditRuleApi(id)
      console.log(res)
      // const {} = res.data
      this.addForm = res.data
    }
  }
}
</script>

<style lang="scss" scoped>
.rule-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  padding-bottom: 20px;

  .search-label {
    width: 100px;
  }

  .search-main {
    width: 220px;
    margin-right: 10px;
  }
}
.create-container{
  margin: 10px 0px;
}
.page-container{
  padding:4px 0px;
  text-align: right;
}
.form-container{
  padding:0px 80px;
}
.el-pagination{
  text-align: right;
}
</style>
