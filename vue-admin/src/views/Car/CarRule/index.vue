<template>
  <div class="rule-container">
    <div class="create-container">
      <el-button type="primary">增加停车计费规则</el-button>
      <el-button>导出Excel</el-button>
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
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
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
  </div>
</template>

<script>
import { getRuleListApi } from '@/api/cardRule'
export default {
  name: 'Building',
  data() {
    return {
      ruleList: [], // 存放计费规则的列表
      params: {
        page: 1,
        pageSize: 10
      },
      total: 0
    }
  },
  created() {
    this.getRuleList()
  },
  methods: {
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
