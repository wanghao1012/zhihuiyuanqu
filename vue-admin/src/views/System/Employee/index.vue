<template>
  <div class="employee-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">员工姓名：</div>
      <el-input clearable placeholder="请输入内容" class="search-main" />
      <el-button type="primary">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" @click="editEmployee(null)">添加员工</el-button>
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
            <el-button size="mini" type="text" @click="editEmployee(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="delEmployeeList(scope.row.id)">删除</el-button>
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
    <el-dialog
      :visible="dialogVisible"
      :title="title"
      width="480px"
      @close="closeDialog"
    >
      <!-- 表单接口 -->
      <div class="form-container">
        <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="80px">
          <el-form-item label="员工姓名" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="登录账号" prop="userName">
            <el-input v-model="addForm.userName" />
          </el-form-item>
          <el-form-item label="联系方式" prop="phonenumber">
            <el-input v-model="addForm.phonenumber" />
          </el-form-item>
          <el-form-item label="分配角色" prop="roleId">
            <el-select v-model="addForm.roleId" placeholder="请选择角色">
              <el-option
                v-for="item in roleList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="员工状态" prop="status">
            <el-radio-group v-model="addForm.status">
              <el-radio :label="0">禁用</el-radio>
              <el-radio :label="1">启用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="addEmployeeList">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeeListApi, getRoleListApi, addEmployeeListApi, delEmployeeListApi, editEmployeeApi } from '@/api/employee'
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
      total: 0, // 总数据数
      dialogVisible: false, // 控制弹框打开关闭
      roleList: [], // 角色列表
      addForm: {
        name: '',
        phonenumber: '',
        roleId: '',
        status: 1,
        userName: ''
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入登录账号', trigger: 'blur' }
        ],
        phonenumber: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请分配角色', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择员工状态', trigger: 'blur' }
        ]
      },
      title: '添加员工'
    }
  },
  created() {
    this.getEmployeeList()
    this.getRoleList()
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
    },
    // 关闭弹框
    closeDialog() {
      this.dialogVisible = false
    },
    // 添加修改员工
    addEmployeeList() {
      // 完整校验
      this.$refs.addForm.validate(async isOK => {
        if (isOK) {
          if (this.addForm.id) {
            console.log(this.addForm)
            const res = await editEmployeeApi(this.addForm)
            console.log(res)
            this.$message.success('修改成功')
          } else {
            // console.log(isOK)
            const res = await addEmployeeListApi(this.addForm)
            console.log(res)
            this.$message.success('添加成功')
            this.$refs.addForm.resetFields() // 重置表单
          }
          this.getEmployeeList() // 重新渲染列表
          this.closeDialog() // 关闭弹框
        }
      })
    },
    // 删除
    delEmployeeList(id) {
      this.$confirm('删除员工后将不可登录，确认删除吗?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delEmployeeListApi(id)
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.getEmployeeList()
      })
    },
    // 点击弹框
    editEmployee(row) {
      this.dialogVisible = true
      // 判断是否为编辑状态
      if (row) {
        console.log(row)
        this.title = '编辑员工'
        const { id, name, roleId, roleName, status, userName, phonenumber } = row
        this.addForm = { id, name, roleId, roleName, status, userName, phonenumber }
      } else {
        this.title = '添加员工'
        this.addForm = {
          name: '',
          phonenumber: '',
          roleId: '',
          status: 1,
          userName: ''
        }
      }
    },
    // 获取角色管理
    async getRoleList() {
      // 发送请求获取角色列表
      const res = await getRoleListApi()
      console.log(res)
      this.roleList = res.data
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
