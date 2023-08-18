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
      <el-button type="primary">添加账单</el-button>
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
      title="添加楼宇"
      width="580px"
    >
      <!-- 表单接口 -->
      <div class="form-container">
        <!-- <el-form ref="addForm" :model="addForm" :rules="addFormRules">
          <el-form-item label="楼宇名称" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="楼宇层数" prop="floors">
            <el-input v-model="addForm.floors" />
          </el-form-item>
          <el-form-item label="在管面积" prop="area">
            <el-input v-model="addForm.area" />
          </el-form-item>
          <el-form-item label="物业费" prop="propertyFeePrice">
            <el-input v-model="addForm.propertyFeePrice" />
          </el-form-item>
        </el-form> -->
      </div>
      <template #footer>
        <el-button size="mini">取 消</el-button>
        <el-button size="mini" type="primary">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getPropetyListApi } from '@/api/propety'
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
      total: 0
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
