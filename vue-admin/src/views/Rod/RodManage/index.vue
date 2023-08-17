<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">一体杆名称：</span>
      <el-input v-model="from.poleName" clearable placeholder="请输入一体杆名称" class="search-main" />
      <span class="search-label">一体杆编号：</span>
      <el-input v-model="from.poleNumber" clearable placeholder="请输入一体杆编号" class="search-main" />
      <span class="search-label">运行状态：</span>
      <el-select v-model="from.poleStatus" placeholder="请输入运行状态">
        <el-option
          v-for="item in status"
          :key="item.id"
          :value="item.id"
          :label="item.name"
        />
      </el-select>
      <el-button type="primary" class="search-btn">查询</el-button>
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary">添加一体杆</el-button>
      <el-button>批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="rodManageList">
        <el-table-column type="index" label="序号" :index="indexMthod" />
        <el-table-column label="一体杆名称" prop="poleName" />
        <el-table-column label="一体杆编号" prop="poleNumber" />
        <el-table-column label="一体杆IP" prop="poleIp" />
        <el-table-column label="安装区域" prop="areaName" />
        <el-table-column label="一体杆类型" prop="poleType" :formatter="typeStatus" />
        <el-table-column label="运行状态" prop="poleStatus" :formatter="formStatus" />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        layout="total, prev, pager, next"
        :total="0"
      />
    </div>
    <!-- 添加一体杆 -->
    <el-dialog
      title="添加一体杆"
      width="580px"
    >
      <!-- 表单接口 -->
      <template #footer>
        <el-button size="mini">取 消</el-button>
        <el-button size="mini" type="primary">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getRodManageListApi } from '@/api/rodmanage'
export default {
  data() {
    return {
      rodManageList: [], // 存放一体杆列表
      from: {
        page: 1,
        pageSize: 10,
        poleName: '',
        poleNumber: '',
        poleStatus: null
      },
      // 状态
      status: [
        {
          id: null,
          name: '全部'
        },
        {
          id: 0,
          name: '正常'
        },
        {
          id: 1,
          name: '异常'
        }]
    }
  },
  created() {
    this.getRodManageList()
  },
  methods: {
    // 获取一体杆列表
    async getRodManageList() {
      const res = await getRodManageListApi(this.from)
      console.log(res)
      this.rodManageList = res.data.rows
    },
    // 序号
    indexMthod(index) {
      return index + 1
    },
    // 一体杆类型
    typeStatus(status) {
      // console.log(status)
      const data = {
        entrance: '入口',
        export: '出口',
        center: '中心'
      }
      return data[status.poleType]
    },
    // 一体杆运行状态
    formStatus(status) {
      const data = {
        0: '正常',
        1: '异常'
      }
      return data[status.poleStatus]
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
