<template>
  <div class="card-container">
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary" @click="open">添加区域</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="areaList" @cell-mouse-enter="handleCellMouseEnter">
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="区域名称" prop="areaName" />
        <el-table-column label="车位数(个)" prop="spaceNumber" />
        <el-table-column label="区域面积" prop="areaProportion" />
        <el-table-column label="计费规则" prop="ruleName" />
        <el-table-column label="备注" prop="remark" />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="delCardAreaList(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="page-container">
      <el-pagination
        :current-page="form.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="form.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 添加修改弹出框 -->
    <el-dialog
      :title="title"
      :visible="dialogVisible"
      width="580px"
      @close="closeDialog"
    >
      <div class="form-container">
        <el-form ref="addFrom" :model="addFrom" :rules="addRules">
          <el-form-item label="区域名称" prop="areaName">
            <el-input v-model="addFrom.areaName" placeholder="请输入区域名称" />
          </el-form-item>
          <el-form-item label="车位数(个)" prop="spaceNumber">
            <el-input v-model.number="addFrom.spaceNumber" placeholder="请输入车位数" />
          </el-form-item>
          <el-form-item label="面积（㎡）" prop="areaProportion">
            <el-input v-model.number="addFrom.areaProportion" placeholder="请输入面积" />
          </el-form-item>
          <el-form-item label="关联计费规则" prop="ruleId">
            <el-select v-model="addFrom.ruleId" placeholder="请选择计费规则" label="180px">
              <el-option
                v-for="item in relevanceList"
                :key="item.ruleId"
                :label="item.ruleName"
                :value="item.ruleId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="addFrom.remark"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini" @click="dialogVisible=false">取 消</el-button>
        <el-button size="mini" type="primary" @click="addCardAreaList">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getCardAreaListApi, getRelevanceListApi, addCardAreaListApi, editCardAreaListApi, delCardAreaListApi } from '@/api/cardArea'
export default {
  data() {
    return {
      form: {
        page: 1,
        pageSize: 10
      },
      total: 0, // 总数
      areaList: [], // 存放区域列表
      dialogVisible: false,
      addFrom: {
        areaName: '',
        spaceNumber: '',
        areaProportion: '',
        ruleId: '',
        remark: ''
      },
      addRules: {
        areaName: [
          { required: true, message: '请输入区域名称', trigger: 'blur' }
        ],
        spaceNumber: [
          { required: true, message: '请输入车位数', trigger: 'blur' },
          { type: 'number', message: '车位数必须为数字值' }
        ],
        areaProportion: [
          { required: true, message: '请输入面积', trigger: 'blur' },
          { type: 'number', message: '面积必须为数字值' }
        ],
        ruleId: [
          { required: true, message: '请选择规则', trigger: 'change' }
        ]
      },
      relevanceList: [],
      title: '添加区域'
    }
  },
  async created() {
    this.getCardAreaList()
    const res = await getRelevanceListApi()
    console.log(res)
    this.relevanceList = res.data
  },
  methods: {
    async getCardAreaList() {
      const res = await getCardAreaListApi(this.form)
      console.log(res)
      this.areaList = res.data.rows
      this.total = res.data.total
    },
    // 每页条数发生改变时
    handleSizeChange(val) {
      // console.log(val)
      this.form.pageSize = val
      this.form.page = 1
      this.getCardAreaList()
    },
    // 页码发生改变时
    handleCurrentChange(val) {
      // console.log(val)
      this.form.page = val
      this.getCardAreaList()
    },
    indexMethod(index) {
      return (this.form.page - 1) * this.form.pageSize + index + 1
    },
    handleCellMouseEnter(row, column, cell, event) {
      // 在鼠标进入单元格时触发的操作
      // console.log(row, column, cell, event)
    },
    open() {
      this.dialogVisible = true
      this.title = '添加区域'
    },
    closeDialog() {
      this.dialogVisible = false
      // 清空
      this.$refs.addFrom.resetFields()
      // 强制清空
      this.addFrom = {
        areaName: '',
        spaceNumber: '',
        areaProportion: '',
        ruleId: '',
        remark: ''
      }
    },
    edit(row) {
      this.title = '编辑区域'
      console.log(row)
      this.dialogVisible = true
      const { id, areaName, spaceNumber, areaProportion, ruleId, remark } = row
      this.addFrom = { id, areaName, spaceNumber, areaProportion, ruleId, remark }
    },
    // 添加或修改区域
    addCardAreaList() {
      this.$refs.addFrom.validate(async(valid) => {
        if (valid) {
          if (this.addFrom.id) {
            const res = await editCardAreaListApi(this.addFrom)
            console.log(res)
            this.$message.success('修改成功')
          } else {
            const res = await addCardAreaListApi(this.addFrom)
            console.log(res)
            this.$message.success('添加成功')
          }
          this.getCardAreaList()
          this.closeDialog()
        }
      })
    },
    // 删除区域
    delCardAreaList(id) {
      this.$confirm('此操作将永久删除该区域, 是否继续?', '提示').then(async() => {
        const res = await delCardAreaListApi(id)
        console.log(res)
        this.$message.success('删除成功')
        this.getCardAreaList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.card-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  padding-bottom: 20px;
  .search-main {
    width: 220px;
    margin-right: 10px;
  }
  .search-btn{
    margin-left:20px;
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
</style>
