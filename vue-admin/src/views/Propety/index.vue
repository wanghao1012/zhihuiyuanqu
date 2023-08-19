<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">企业名称：</span>
      <el-input v-model="propertyfeeForm.enterpriseName" clearable placeholder="请输入内容" class="search-main" @clear="search" />
      <span class="search-label">缴费时间：</span>
      <el-date-picker
        v-model="date"
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
      />
      <el-button type="primary" class="search-btn" @click="search">查询</el-button>
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary" @click="open">添加账单</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="enterpriseList">
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="账单编号" prop="billNumber" />
        <el-table-column label="企业名称" prop="enterpriseName" />
        <el-table-column label="租赁楼宇" prop="buildingName" />
        <el-table-column
          label="物业费(元/m²)"
          prop="propertyFeePrice"
        />
        <el-table-column label="账单金额(元)" prop="paymentAmount" />
        <el-table-column label="缴费时间" prop="createTime" />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        :current-page="propertyfeeForm.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="propertyfeeForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 添加楼宇 -->
    <el-dialog
      title="添加账单"
      width="580px"
      height="350px"
      :visible="dialogVisible"
      @close="closeDialog"
    >
      <!-- 表单接口 -->
      <div class="form-container">
        <el-form ref="addForm" :model="addForm" :rules="addRules">
          <el-form-item label="选择租户" prop="enterpriseId">
            <el-select v-model="addForm.enterpriseId" placeholder="请选择租户">
              <el-option
                v-for="item in lesseeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="租赁楼宇" prop="buildingId">
            <el-select v-model="addForm.buildingId" placeholder="请选择租赁楼宇">
              <el-option
                v-for="item in LeaseholdPremises"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="缴费日期" prop="paydate">
            <el-date-picker
              v-model="addForm.paydate"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="缴费金额" prop="paymentAmount">
            <el-input v-model="addForm.paymentAmount" placeholder="请输入缴费金额" />
          </el-form-item>
          <el-form-item label="选择支付方式" prop="paymentMethod">
            <el-select v-model="addForm.paymentMethod" placeholder="请选择支付方式">
              <el-option
                v-for="item in paymentList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="addPropetyList">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getPropetyListApi, addPropetyListApi, getLesseeListApi, getLeaseholdPremisesApi } from '@/api/propety'
export default {
  data() {
    return {
      propertyfeeForm: {
        page: 1, // 页码
        pageSize: 10, // 每页数量
        enterpriseName: '', // 企业名称
        start: '',
        end: ''
      },
      date: '',
      // 存放获取到的企业列表
      enterpriseList: [],
      total: 0,
      dialogVisible: false, // 弹框开关
      lesseeList: [], // 租户列表
      LeaseholdPremises: [], // 租赁楼宇
      paymentList: [
        { id: 1, name: '微信' },
        { id: 2, name: '支付宝' },
        { id: 3, name: '现金' }
      ],
      // 添加账单表单
      addForm: {
        enterpriseId: '',
        buildingId: '',
        paydate: '', // 缴费日期
        paymentAmount: '', // 缴费金额
        paymentMethod: ''
      },
      addRules: {
        enterpriseId: [{ required: true, message: '请选择企业', trigger: 'change' }],
        buildingId: [{ required: true, message: '请选择楼宇', trigger: 'change' }],
        paydate: [{ required: true, message: '请选择缴费日期', trigger: 'change' }],
        paymentAmount: [{ required: true, message: '请输入缴费金额', trigger: 'blur' }],
        paymentMethod: [{ required: true, message: '请选择支付方式', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getPropetyList()
  },
  methods: {
    // 获取企业列表 渲染数据
    async getPropetyList() {
      const res = await getPropetyListApi(this.propertyfeeForm)
      console.log(res)
      this.enterpriseList = res.data.rows
      this.total = res.data.total
    },
    // 当每页条数发生改变的时候
    handleSizeChange(val) {
      this.propertyfeeForm.pageSize = val
      this.propertyfeeForm.page = 1
      this.getPropetyList() // 重新渲染数据
    },
    // 当页码发生改变时
    handleCurrentChange(val) {
      this.propertyfeeForm.page = val
      this.getPropetyList() // 重新渲染数据
    },
    // 序号
    indexMethod(index) {
      return index + 1 + (this.propertyfeeForm.page - 1) * this.propertyfeeForm.pageSize
    },
    // 搜索
    search() {
      this.propertyfeeForm.page = 1
      this.propertyfeeForm.start = this.date[0]
      this.propertyfeeForm.end = this.date[1]
      this.getPropetyList()
    },
    // 点击添加弹框
    open() {
      this.dialogVisible = true
      this.getLesseeList()
    },
    // 关闭弹框
    closeDialog() {
      this.dialogVisible = false
      this.addForm = {
        enterpriseId: '',
        buildingId: '',
        paydate: '', // 缴费日期
        paymentAmount: '', // 缴费金额
        paymentMethod: ''
      }
    },
    // 获取所有租户及租赁楼宇列表
    async getLesseeList() {
      // 租户信息
      const res = await getLesseeListApi()
      // console.log(res)
      this.lesseeList = res.data
      // 租赁楼宇
      const lease = await getLeaseholdPremisesApi()
      // console.log(lease)
      this.LeaseholdPremises = lease.data
    },
    // 添加企业列表
    addPropetyList() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          this.addForm.startTime = this.addForm.paydate[0]
          this.addForm.endTime = this.addForm.paydate[1]
          delete this.addForm.paydate
          const res = await addPropetyListApi(this.addForm)
          console.log(res)
          this.getPropetyList()
          this.$message.success('添加成功')
          this.closeDialog()
        }
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
.el-form{
  .el-form-item{
    .el-select{
      width: 350px;
    }
    .el-input{
      width: 350px;
    }
  }
}
</style>
