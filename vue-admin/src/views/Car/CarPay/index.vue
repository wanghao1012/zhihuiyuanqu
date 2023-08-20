<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input v-model="from.carNumber" clearable placeholder="请输入内容" class="search-main" @clear="search" />
      <span class="search-label">缴纳状态：</span>
      <el-select v-model="from.paymentStatus" placeholder="未选择">
        <el-option v-for="item in stateList" :key="item.id" clearable :label="item.name" :value="item.id" />
      </el-select>
      <el-button type="primary" class="search-btn" @click="search">查询</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="parkingFeeList">
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="车牌号码" prop="carNumber" />
        <el-table-column label="收费类型" prop="chargeType" :formatter="formType" />
        <el-table-column label="停车总时长" prop="parkingTime" />
        <el-table-column label="缴纳费用(元)" prop="actualCharge" />
        <el-table-column label="缴纳状态" prop="paymentStatus" :formatter="formState" />
        <el-table-column label="缴纳方式" prop="paymentMethod" :formatter="formMethod" />
        <el-table-column label="缴纳时间" prop="paymentTime" />
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="page-container">
      <el-pagination
        :current-page="from.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="from.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

  </div>
</template>

<script>
import { getParkingFeeListApi } from '@/api/parkingFee'
export default {
  data() {
    return {
      from: {
        page: 1,
        pageSize: 10,
        carNumber: '',
        paymentStatus: null
      },
      // 存放停车列表
      parkingFeeList: [],
      // 缴纳状态
      stateList: [
        { id: null, name: '全部' },
        { id: 0, name: '未缴费' },
        { id: 1, name: '已缴费' }
      ],
      total: 0
    }
  },
  created() {
    this.getParkingFeeList()
  },
  methods: {
    // 渲染页面
    async getParkingFeeList() {
      const res = await getParkingFeeListApi(this.from)
      console.log(res)
      this.parkingFeeList = res.data.rows
      this.total = res.data.total
    },
    search() {
      this.from.page = 1
      this.getParkingFeeList()
    },
    // 收费类型
    formType(row, column, cellValue, index) {
      const type = {
        card: '月卡',
        temp: '临时停车'
      }
      return type[cellValue]
    },
    // 缴费状态
    formState(row, column, cellValue, index) {
      // console.log(row, column, cellValue, index)
      const state = {
        1: '已缴费',
        0: '未缴费'
      }
      return state[cellValue]
    },
    // 缴费方式
    formMethod(row, column, cellValue, index) {
      const method = {
        Alipay: '支付宝',
        WeChat: '微信',
        Cash: '线下'
      }
      return method[cellValue]
    },
    // 每页条数发生改变时
    handleSizeChange(val) {
      this.from.page = 1
      this.from.pageSize = val
      this.getParkingFeeList()
    },
    // 页码发生改变时
    handleCurrentChange(val) {
      this.from.page = val
      this.getParkingFeeList()
    },
    indexMethod(index) {
      return this.from.pageSize * (this.from.page - 1) + index + 1
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
