<template>
  <div class="employee-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">员工姓名：</div>
      <el-input clearable placeholder="请输入内容" class="search-main" />
      <el-button type="primary">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary">添加员工</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="employeeList">
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="员工姓名" width="180" prop="name" />
        <el-table-column label="登录账号" width="180" prop="userName" />
        <el-table-column label="联系方式" width="180" prop="phonenumber" />
        <el-table-column label="角色" width="180" prop="roleName" />
        <el-table-column label="状态">
          <template #default="scope">
            {{ fromDate(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column label="添加时间" prop="createTime" />
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="scope">
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
            <el-button size="mini" type="text">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        :current-page="from.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="from.pageSize"
        layout="total,  prev, pager, next,sizes"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 添加员工 -->
  </div>
</template>

<script>
import { getEmployeeListApi } from '@/api/employee'
export default {
  name: 'Employee',
  data() {
    return {
      employeeList: [], // 存放员工列表
      from: {
        name: '',
        page: 1,
        pageSize: 10
      },
      total: 0 // 总数据数
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    // 获取员工列表
    async getEmployeeList() {
      const res = await getEmployeeListApi(this.from)
      console.log(res)
      this.employeeList = res.data.rows
      this.total = res.data.total
    },
    // 判断员工状态
    fromDate(status) {
      const MAP = {
        0: '未启用',
        1: '启用'
      }
      return MAP[status]
    },
    // 序号
    indexMethod(index) {
      return this.from.pageSize * (this.from.page - 1) + index + 1
    },
    // 每页条数发生改变时
    handleSizeChange(val) {
      this.from.page = 1
      this.from.pageSize = val
      this.getEmployeeList() // 重新渲染页面
    },
    // 当页数发生改变时
    handleCurrentChange(val) {
      this.from.page = val
      this.getEmployeeList() // 重新渲染页面
    }
  }
}
</script>

<style lang="scss" scoped>
.employee-container {
  padding: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  ;
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
</style>
