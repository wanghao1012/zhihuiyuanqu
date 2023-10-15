<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <el-input v-model="params.name" clearable placeholder="请输入内容" class="search-main" @clear="inquire" />
      <el-button type="primary" @click="inquire">查询</el-button>
    </div>
    <div class="create-container">
      <el-button v-permission="'park:enterprise:add_edit'" type="primary" @click="$router.push('/exterpriseAdd')">添加企业</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="exterpriseList" @expand-change="expandHandle">
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="企业名称" width="320" prop="name" />
        <el-table-column label="联系人" prop="contact" />
        <el-table-column
          label="联系电话"
          prop="contactNumber"
        />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button v-permission="'park:rent:add_surrender'" size="mini" type="text" @click="addRent(scope.row.id)">添加合同</el-button>
            <el-button v-permission="'park:enterprise:query'" size="mini" type="text" @click="lookRent(scope.row.id)">查看</el-button>
            <el-button v-permission="'park:enterprise:add_edit'" size="mini" type="text" @click="editRent(scope.row.id)">编辑</el-button>
            <el-button v-permission="'park:enterprise:remove'" size="mini" type="text" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
        <!-- 展开查看当前合同 -->
        <el-table-column type="expand">
          <template #default="{row}">
            <el-table :data="row.rentList">
              <el-table-column label="租赁楼宇" width="320" prop="buildingName" />
              <el-table-column label="租赁起始时间" prop="startTime">
                <template #default="rowObj">
                  {{ rowObj.row.startTime }}至{{ rowObj.row.endTime }}
                </template>
              </el-table-column>
              <el-table-column label="合同状态" prop="status">
                <template #default="scope">
                  <el-tag :type="formatInfoType(scope.row.status)">
                    {{ formatStatus(scope.row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180">
                <template #default="scope">
                  <!-- <el-button size="mini" type="text">续租</el-button> -->
                  <el-button v-permission="'park:rent:add_surrender'" size="mini" type="text" :disabled="scope.row.status === 3" @click="outRent(scope.row.id)">退租</el-button>
                  <el-button v-permission="'park:rent:remove'" size="mini" type="text" :disabled="scope.row.status !== 3" @click="delRentList(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加合同弹框 -->
      <el-dialog
        title="添加合同"
        :visible="rentDialogVisible"
        width="580px"
        @close="closeDialog"
      >
        <!-- 表单模版 -->
        <div class="form-container">
          <el-form ref="addForm" :model="rentForm" :rules="rentRules" label-position="top">
            <el-form-item label="租赁楼宇" prop="buildingId">
              <el-select v-model="rentForm.buildingId" placeholder="请选择">
                <el-option
                  v-for="item in buildList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="租赁起止日期" prop="rentTime">
              <el-date-picker
                v-model="rentForm.rentTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item label="租赁合同" prop="contractId">
              <!--action 默认上传 必选参数，上传的地址  -->
              <!-- http-request 覆盖默认的上传行为，可以自定义上传的实现 -->
              <!-- before-upload 上传文件之前的钩子-->
              <!-- limit	最大允许上传个数 -->
              <!-- on-exceed  文件超出个数限制时执行的钩子 -->
              <!--file-list  上传的文件列表方便调用清空 -->
              <!-- on-remove	文件列表移除文件时的钩子 -->
              <el-upload
                ref="upload"
                action="#"
                :http-request="uploadHandle"
                :before-upload="beforeUpload"
                :limit="1"
                :on-exceed="onExceed"

                :on-remove="onRemove"
              >
                <el-button size="small" type="primary" plain>上传合同文件</el-button>
                <div slot="tip" class="el-upload__tip">支持扩展名：.doc .docx .pdf, 文件大小不超过5M</div>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <el-button size="mini" @click="closeDialog">取 消</el-button>
          <el-button size="mini" type="primary" @click="confirmAdd">确 定</el-button>
        </template>
      </el-dialog>

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
import { getEnterpriseListApi, delEnterpriseApi, getRentBuildingListApi, uploadApi, createRentApi, getRentListApi, outRentApi, delRentListApi } from '@/api/enterprise'
export default {
  data() {
    return {
      exterpriseList: [], // 存放企业信息的列表
      params: {
        name: '', // 企业名称
        page: 1, // 页数
        pageSize: 10 // 每页条数
      },
      total: 0,
      rentDialogVisible: false, // 弹窗的开关
      // 添加合同
      rentForm: {
        buildingId: null, // 楼宇id
        contractId: null, // 合同id
        contractUrl: '', // 合同Url
        enterpriseId: null, // 企业名称
        type: 0, // 合同类型
        rentTime: [] // 合同时间
      },
      rentRules: {
        buildingId: [
          { required: true, message: '请选择楼宇', trigger: 'change' }
        ],
        rentTime: [
          { required: true, message: '请选择租赁日期', trigger: 'change' }
        ],
        contractId: [
          { required: true, message: '请上传合同文件' }
        ]
      },
      buildList: [] // 楼宇列表

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
      this.exterpriseList = res.data.rows.map((item) => {
        return {
          ...item,
          rentList: [] // 每一行补充存放合同的列表
        }
      })
      this.total = res.data.total
    },
    // 展开当前企业租赁的楼宇
    async expandHandle(row, rows) {
      console.log('展开或关闭', row, rows)
      const isExpend = rows.find(item => item.id === row.id)
      if (isExpend) {
        const res = await getRentListApi(row.id)
        // eslint-disable-next-line require-atomic-updates
        row.rentList = res.data
      }
    },
    // 格式化tag类型
    formatInfoType(status) {
      const MAP = {
        0: 'warning',
        1: 'success',
        2: 'info',
        3: 'danger'
      }
      // return 格式化之后的中文显示
      return MAP[status]
    },
    // 格式化status  判断合同是否生效
    formatStatus(type) {
      const TYPEMAP = {
        0: '待生效',
        1: '生效中',
        2: '已到期',
        3: '已退租'
      }
      return TYPEMAP[type]
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
    // 查看跳转
    lookRent(id) {
      this.$router.push({
        path: '/exterpriseDetail',
        query: {
          id
        }
      })
    },
    // 删除企业
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
    },
    // 打开弹窗
    async addRent(id) {
      this.rentDialogVisible = true
      const res = await getRentBuildingListApi()
      console.log(res)
      this.buildList = res.data

      // 把企业id存入表单对象
      this.rentForm.enterpriseId = id
    },
    // 关闭
    closeDialog() {
      this.rentDialogVisible = false
      // 重置表单
      this.$refs.addForm.resetFields() // 在这里的主要作用是清空提示语
      this.rentForm = {
        buildingId: null, // 楼宇id
        contractId: null, // 合同id
        contractUrl: '', // 合同Url
        enterpriseId: null, // 企业名称
        type: 0, // 合同类型
        rentTime: [] // 合同时间
      }
      // 调用清除上传文件的列表
      this.$refs.upload.clearFiles() // 关闭弹框时清除上传的文件列表
    },
    // 上传合同
    async uploadHandle(fileData) {
      // 1. 处理FormData
      const { file } = fileData
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'contract')
      // 2. 上传并赋值
      const res = await uploadApi(formData)
      // console.log(res)
      const { id, url } = res.data
      this.rentForm.contractId = id
      this.rentForm.contractUrl = url
      // 单独校验表单
      this.$refs.addForm.validateField('contractId')
    },
    // 移除合同后重新校验表单
    onRemove() {
      // 清空表单
      this.rentForm.contractId = ''
      this.rentForm.contractUrl = ''
      // 校验
      this.$refs.addForm.validateField('contractId')
    },
    // 上传前筛选大小及文件类型
    beforeUpload(file) {
      // 1. 校验文件类型 .doc .docx .pdf
      const typeList = [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'application/pdf']
      const fileType = typeList.includes(file.type)
      const fileSize = file.size / 1024 / 1024 < 5 // 大小小于5m
      if (fileType && fileSize) {
        return true
      } else {
        this.$message.error('上传文件只能是doc、docx、pdf格式且大小不能超过5m')
        return false
      }
    },
    // 校验上传的个数
    onExceed() {
      this.$message.warning('文件上传个数 超出限制')
    },
    // 确认提交
    confirmAdd() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          const { buildingId, contractId, contractUrl, enterpriseId, type } = this.rentForm
          await createRentApi({
            buildingId, contractId, contractUrl, enterpriseId, type,
            startTime: this.rentForm.rentTime[0],
            endTime: this.rentForm.rentTime[1]
          })
          this.$message.success('添加成功')
          // 更新列表
          this.getEnterpriseList()
          // 关闭弹框
          this.closeDialog()
        }
      })
    },
    // 退租
    async outRent(id) {
      this.$confirm('确认退租吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 1. 调用接口
        await outRentApi(id)
        // 2. 重新拉取列表
        this.getEnterpriseList()
        this.$message({
          type: 'success',
          message: '退租成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消退租'
        })
      })
    },
    // 删除租赁信息
    delRentList(id) {
      this.$confirm('确认删除吗?', '提示').then(async() => {
        const res = await delRentListApi(id)
        console.log(res)
        this.$message.success('删除成功')
        this.getEnterpriseList()
      }).catch((error) => {
        console.log(error)
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
