<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">楼宇名称：</div>
      <el-input v-model="searchForm.name" placeholder="请输入内容" class="search-main" />
      <el-button type="primary" @click="searchList">查询</el-button>
    </div>
    <el-button type="primary" @click="editBuilding(null)">添加楼宇</el-button>
    <!-- 表格区域 -->
    <div class="table">
      <el-table
        style="width: 100%"
        :data="buildingList"
      >
        <el-table-column
          type="index"
          label="序号"
          :index="indexMethod"
        />
        <el-table-column
          label="楼宇名称"
          width="180"
          prop="name"
        />
        <el-table-column
          label="层数"
          prop="floors"
        />
        <el-table-column
          label="在管面积(m²)"
          width="120"
          prop="area"
        />
        <el-table-column
          label="物业费(元/m²)"
          width="120"
          prop="propertyFeePrice"
        />
        <el-table-column label="状态" prop="status">
          <template #default="scope">
            {{ formatStatus(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120"
        >
          <template #default="scope">
            <el-button
              size="mini"
              type="text"
              @click="editBuilding(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="text"
              @click="delConfirm(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="page-container">
        <el-pagination
          :current-page="searchForm.page"
          :page-size="searchForm.pagesize"
          layout="total,  prev, pager, next"
          :total="total"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <!-- 添加修改楼宇弹框 -->
    <el-dialog
      :title="title"
      :visible="dialogVisible"
      width="580px"
      @close="closeDialog"
    >
      <div class="form-container">
        <el-form ref="addForm" :model="addForm" :rules="addFormRules">
          <el-form-item label="楼宇名称" prop="name">
            <el-input v-model="addForm.name" placeholder="请输入楼宇名称" />
          </el-form-item>
          <el-form-item label="楼宇层数" prop="floors">
            <el-input v-model="addForm.floors" placeholder="请输入楼宇层数" />
          </el-form-item>
          <el-form-item label="在管面积" prop="area">
            <el-input v-model="addForm.area" placeholder="请输入在管面积" />
          </el-form-item>
          <el-form-item label="物业费" prop="propertyFeePrice">
            <el-input v-model="addForm.propertyFeePrice" placeholder="请输入物业费" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini" @click="dialogVisible=false">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmAdd">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getParkBuildingListApi, addParkBuildingApi, delConfirmApi, editConfirmApi } from '@/api/building'
export default {
  name: 'Building',
  data() {
    return {
      buildingList: [], // 楼宇列表,
      // 楼宇管理表单
      searchForm: {
        name: '',
        page: 1,
        pagesize: 10
      },
      // 数据条数
      total: 0,
      dialogVisible: false, // 弹框开关
      addForm: {
        name: '',
        floors: null,
        area: null,
        propertyFeePrice: null,
        id: null
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入楼宇名称', trigger: 'blur' }
        ],
        floors: [
          { required: true, message: '请输入楼宇层数', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请输入楼宇面积', trigger: 'blur' }
        ],
        propertyFeePrice: [
          { required: true, message: '请输入楼宇物业费', trigger: 'blur' }
        ]
      },
      title: '添加楼宇'

    }
  },
  created() {
    this.getParkBuildingList()
  },
  methods: {
    // 获取楼宇列表
    async getParkBuildingList() {
      const res = await getParkBuildingListApi(this.searchForm)
      // console.log(res)
      this.buildingList = res.data.rows
      this.total = res.data.total
    },
    // 序号
    indexMethod(index) {
      return (this.searchForm.page - 1) * this.searchForm.pagesize + index + 1
    },
    // 租赁状态
    formatStatus(status) {
      const statusMap = {
        0: '闲置中',
        1: '租赁中'
      }
      return statusMap[status]
    },
    // 页码数
    handleCurrentChange(val) {
      this.searchForm.page = val
      this.getParkBuildingList() // 重新渲染
    },
    // 搜索
    searchList() {
      // 1. 重置page为1
      this.searchForm.page = 1
      // 2. 调用获取列表接口
      this.getParkBuildingList()
    },

    // 关闭
    closeDialog() {
      this.dialogVisible = false
    },
    // 修改楼宇
    editBuilding(row) {
      this.dialogVisible = true
      if (row) {
        this.title = '编辑楼宇'
        // 2. 解构必要字段 并回显数据
        const { id, area, floors, name, propertyFeePrice } = row
        this.addForm = {
          id, area, floors, name, propertyFeePrice
        }
      } else {
        this.title = '新增楼宇'
        this.addForm = {
          name: '',
          floors: null,
          area: null,
          propertyFeePrice: null
        }
      }
      console.log(this.addForm)
    },
    // 添加楼宇
    confirmAdd() {
      this.$refs.addForm.validate(async valid => {
        // console.log(valid)
        if (valid) {
          // console.log('添加')
          if (this.addForm.id) {
            // console.log('修改')
            await editConfirmApi(this.addForm)
            this.$message.success('修改成功')
          } else {
            // console.log('添加')
            await addParkBuildingApi(this.addForm)
            this.$message.success('添加成功') // 提示添加成功
            this.addForm = {} // 清空表单
          }
          // console.log(res)
          this.getParkBuildingList() // 重新渲染
          this.dialogVisible = false // 关闭弹框
        }
      })
    },
    // 删除楼宇
    async delConfirm(id) {
      this.$confirm('确认删除当前楼宇吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delConfirmApi(id)
        this.getParkBuildingList() // 重新渲染
      }).catch(() => {

      })
    }
  }
}
</script>

<style lang="scss" scoped>
.department-container{
  padding:10px;
}
.search-container{
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237,237,237,.9);;
  padding-bottom: 20px;
  .search-label{
    width:100px;
  }
  .search-main{
    width: 220px;
    margin-right: 10px;
  }
}
.page-container{
    padding:4px 0px;
    text-align: right;
  }
</style>
