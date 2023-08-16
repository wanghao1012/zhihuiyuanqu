<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <el-input v-model="params.name" clearable placeholder="请输入内容" class="search-main" />
      <el-button type="primary" @click="inquire">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/exterpriseAdd')">添加企业</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="exterpriseList">
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="企业名称" width="320" prop="name" />
        <el-table-column label="联系人" prop="contact" />
        <el-table-column
          label="联系电话"
          prop="contactNumber"
        />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" type="text">添加合同</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text" @click="editRent(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        :current-page="params.page"
        :page-sizes="[10,20,50,100]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { getEnterpriseListApi, delEnterpriseApi } from '@/api/enterprise'
export default {
  data() {
    return {
      exterpriseList: [], // 存放企业信息的列表
      params: {
        name: '', // 企业名称
        page: 1, // 页数
        pageSize: 10 // 每页条数
      },
      total: 0
    }
  },
  created() {
    this.getEnterpriseList()
  },
  methods: {
    // 获取企业列表
    async getEnterpriseList() {
      const res = await getEnterpriseListApi(this.params)
      console.log(res)
      this.exterpriseList = res.data.rows
      this.total = res.data.total
    },
    // 每页条数
    handleSizeChange(val) {
      this.params.pageSize = val
      this.params.page = 1
      this.getEnterpriseList()
    },
    // 当前页数
    handleCurrentChange(val) {
      this.params.page = val
      this.getEnterpriseList()
    },
    // 序号
    indexMethod(index) {
      // 前面所有页数和每页条数的乘积  加上  index +1  就是序号
      return (this.params.page - 1) * this.params.pageSize + index + 1
    },
    // 查询
    inquire() {
      this.params.page = 1
      this.getEnterpriseList()
    },
    // 编辑跳转
    editRent(id) {
      this.$router.push({
        path: '/exterpriseAdd',
        query: {
          id
        }
      })
    },
    // 删除
    del(id) {
      this.$confirm('确认删除该企业吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delEnterpriseApi(id)
        if (this.exterpriseList.length === 1 && this.params.page > 1) {
          this.params.page--
        }
        this.getEnterpriseList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.department-container {
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
