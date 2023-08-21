<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">一体杆名称：</span>
      <el-input v-model="form.poleName" clearable placeholder="请输入一体杆名称" class="search-main" @clear="search" />
      <span class="search-label">一体杆编号：</span>
      <el-input v-model="form.poleNumber" clearable placeholder="请输入一体杆编号" class="search-main" @clear="search" />
      <span class="search-label">处置状态：</span>
      <el-select v-model="form.handleStatus" placeholder="请选择处置状态">
        <el-option v-for="item in statuaList" :key="item.id" :value="item.id" :label="item.name" />
      </el-select>
      <el-button type="primary" class="search-btn" @click="search">查询</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="warningList">
        <el-table-column type="index" label="序号" />
        <el-table-column label="一体杆名称" prop="poleName" />
        <el-table-column label="一体杆编号" prop="poleNumber" />
        <el-table-column label="故障类型" prop="errorType" />
        <el-table-column label="处置状态" prop="handleStatus" :formatter="formDate" />
        <el-table-column label="告警时间" prop="warningTime" />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button size="mini" type="text" disabled>派单</el-button>
            <el-button size="mini" type="text" @click="$router.push(`/lookWarn/${scope.row.id}`)">查看</el-button>
            <el-button size="mini" type="text" @click="delWarningList(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        layout="total, prev, pager, next"
        :total="total"
      />
    </div>
  </div>
</template>

<script>
import { getWarningListApi, delWarningListApi } from '@/api/rodWarn'
export default {
  data() {
    return {
      form: {
        page: 1,
        pageSize: 10,
        poleName: '',
        poleNumber: '',
        handleStatus: null
      },
      warningList: [], // 存放警告列表
      total: 0,
      statuaList: [
        { id: null, name: '全部' },
        { id: 0, name: '未派单' },
        { id: 1, name: '已派单' },
        { id: 2, name: '已接单' },
        { id: 3, name: '已完成' }
      ]
    }
  },
  created() {
    this.getWarningList()
  },
  methods: {
    // 获取警告列表
    async getWarningList() {
      const res = await getWarningListApi(this.form)
      console.log(res)
      this.warningList = res.data.rows
      this.total = res.data.total
    },
    // 搜索
    search() {
      this.form.page = 1
      this.getWarningList()
    },
    // 格式化表单内容
    formDate(row, column, cellValue, index) {
      const data = {
        0: '未派单',
        1: '已派单',
        2: '已接单',
        3: '已完成'
      }
      return data[cellValue]
    },
    delWarningList(id) {
      this.$confirm('此操作将永久删除该警告, 是否继续?', '提示').then(async() => {
        const res = await delWarningListApi(id)
        console.log(res)
        this.getWarningList()
        this.$message.success('删除成功')
      }).catch(err => {
        console.log(err)
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
