<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">一体杆名称：</span>
      <el-input v-model="from.poleName" clearable placeholder="请输入一体杆名称" class="search-main" @clear="searchRodManageList" />
      <span class="search-label">一体杆编号：</span>
      <el-input v-model="from.poleNumber" clearable placeholder="请输入一体杆编号" class="search-main" @clear="searchRodManageList" />
      <span class="search-label">运行状态：</span>
      <el-select v-model="from.poleStatus" placeholder="请输入运行状态">
        <el-option
          v-for="item in status"
          :key="item.id"
          :value="item.id"
          :label="item.name"
        />
      </el-select>
      <el-button type="primary" class="search-btn" @click="searchRodManageList">查询</el-button>
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary" @click="editRodManage(null)">添加一体杆</el-button>
      <el-button @click="delRodManageList">批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">

      <el-table style="width: 100%" :data="rodManageList" @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column type="index" label="序号" :index="indexMthod" />
        <el-table-column label="一体杆名称" prop="poleName" />
        <el-table-column label="一体杆编号" prop="poleNumber" />
        <el-table-column label="一体杆IP" prop="poleIp" />
        <el-table-column label="安装区域" prop="areaName" />
        <el-table-column label="一体杆类型" prop="poleType" :formatter="typeStatus" />
        <el-table-column label="运行状态" prop="poleStatus" :formatter="formStatus" />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button size="mini" type="text" @click="editRodManage(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="delRodManage(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="page-container">
      <el-pagination
        :current-page.sync="from.page"
        :page-size="from.pageSize"
        layout="total, prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 添加一体杆 -->
    <el-dialog
      :title="title"
      :visible="dialogVisible"
      width="580px"
      @close="closeDialog"
    >
      <div class="form-container">
        <el-form ref="addFrom" :model="addFrom" :rules="addFromRules">
          <el-form-item label="一体杆名称" prop="poleName">
            <el-input v-model="addFrom.poleName" placeholder="请输入一体杆名称" />
          </el-form-item>
          <el-form-item label="一体杆编号" prop="poleNumber">
            <el-input v-model="addFrom.poleNumber" placeholder="请输入一体杆编号" />
          </el-form-item>
          <el-form-item label="一体杆IP" prop="poleIp">
            <el-input v-model="addFrom.poleIp" placeholder="请输入一体杆IP" />
          </el-form-item>
          <el-form-item label="一体杆区域" prop="areaId">
            <el-select v-model="addFrom.areaId" placeholder="请选择一体杆区域" label="180px">
              <el-option
                v-for="item in areaList"
                :key="item.areaId"
                :label="item.areaName"
                :value="item.areaId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="一体杆类型" prop="poleType">
            <el-select v-model="addFrom.poleType" placeholder="请选择一体杆类型" label="180px">
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.name==='入口'?'entrance':'export'"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini" @click="dialogVisible=false">取 消</el-button>
        <el-button size="mini" type="primary" @click="addRodManageList">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getRodManageListApi, addRodManageListApi, getAreaListApi, editRodManageListApi, delRodManageListApi } from '@/api/rodmanage'
export default {
  data() {
    const validatePort1 = (rule, value, callback) => {
      const reg =
        /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
      if (value === '') {
        callback(new Error('请输入IP地址'))
      } else if (value !== '' && reg.test(value) === false) {
        callback(new Error('请输入正确格式IP如(11.11.11.11)'))
      } else {
        callback()
      }
    }
    return {
      total: 0, // 总条数
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
        }],
      addFrom: {
        poleName: '',
        poleNumber: '',
        poleIp: '',
        areaId: '',
        poleType: ''
      },
      addFromRules: {
        poleName: [{ required: true, message: '请输入一体杆名称', trigger: 'blur' }],
        poleNumber: [{ required: true, message: '请输入一体杆编号', trigger: 'blur' }],
        poleIp: [
          { required: true, message: '请输入一体杆IP', trigger: 'blur' },
          {
            required: true,
            message: validatePort1.Error,
            validator: validatePort1,
            trigger: 'blur'

          }
        ],
        areaId: [{ required: true, message: '请选择一体杆区域', trigger: 'blur' }],
        poleType: [{ required: true, message: '请输入一体杆类型', trigger: 'blur' }]
      },
      dialogVisible: false,
      title: '添加一体杆',
      areaList: [], // 存放区域列表
      typeList: [
        { id: 0, name: '入口' },
        { id: 1, name: '出口' }
      ], // 存放类型列表
      delList: [] // 存放要批量删除的列表
    }
  },
  created() {
    this.getRodManageList()
    this.getAreaList()
  },
  methods: {
    // 获取一体杆列表
    async getRodManageList() {
      const res = await getRodManageListApi(this.from)
      // console.log(res)
      this.rodManageList = res.data.rows
      this.total = res.data.total
    },
    // 序号
    indexMthod(index) {
      return this.from.pageSize * (this.from.page - 1) + index + 1
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
    },
    // 分页跳转
    handleCurrentChange(val) {
      this.from.page = val
      this.getRodManageList()
    },
    // 添加
    async addRodManageList() {
      this.$refs.addFrom.validate(async isOK => {
        if (isOK) {
          if (this.addFrom.id) {
            const res = await editRodManageListApi(this.addFrom)
            console.log(res)
            this.$message.success('修改成功')
          } else {
            const res = await addRodManageListApi(this.addFrom)
            console.log(res)
            this.$message.success('添加成功')
          }
          this.getRodManageList() // 重新渲染数据
          this.closeDialog() // 关闭弹框
        }
      })
    },
    // 关闭弹框
    closeDialog() {
      this.dialogVisible = false
      this.$refs.addFrom.resetFields()
    },
    // 获取一体杆区域
    async   getAreaList() {
      const res = await getAreaListApi()
      console.log(res)
      this.areaList = res.data
    },
    // 搜索
    searchRodManageList() {
      this.from.page = 1
      this.getRodManageList()
    },
    // 修改
    editRodManage(row) {
      // console.log(row)
      this.dialogVisible = true
      if (row !== null) {
        this.title = '编辑一体杆'
        const { id, areaId, poleType, poleName, poleIp, poleNumber } = row
        this.addFrom = { id, areaId, poleType, poleName, poleIp, poleNumber }
      } else {
        this.title = '添加一体杆'
        this.addFrom = {
          areaId: '',
          poleType: '',
          poleName: '',
          poleIp: '',
          poleNumber: ''
        }
      }
    },
    // 删除
    delRodManage(id) {
      // console.log(id)
      this.$confirm('确定删除吗', '温馨提示').then(async() => {
        // 提示框
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        // 发送请求
        const res = await delRodManageListApi(id)
        console.log(res)
        // 当这也数据删完时跳转到上一页
        if (this.rodManageList.length === 1 && this.params.page > 1) {
          this.from.page--
        }
        this.getRodManageList() // 渲染页面
      }).catch((error) => {
        console.log(error)
      }
      )
    },
    handleSelectionChange(val) {
      // console.log(val)
      this.delList = val.map(item => item.id).join(',')
      // console.log(this.delList)
    },
    // 批量删除
    delRodManageList(id) {
      // console.log(id)
      if (this.delList.length === 0) {
        return this.$message.warning('没有要删除的数据')
      }

      this.$confirm('确定要删除吗', '温馨提示').then(async() => {
      //  提示删除成功
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        // 当这也数据删完时跳转到上一页
        if (this.rodManageList.length === 1 && this.params.page > 1) {
          this.from.page--
        }
        const res = await delRodManageListApi(this.delList)
        console.log(res)

        this.getRodManageList() // 渲染页面
      }).catch((error) => {
        console.log(error)
      }
      )
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
