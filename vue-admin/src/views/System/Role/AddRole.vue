<template>
  <div class="add-role">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()"><i class="el-icon-arrow-left" />返回</span>
        <span>|</span>
        <span>{{ id?'编辑角色':'添加角色' }}</span>
      </div>
      <div class="right">
        黑马程序员
      </div>
    </header>
    <main class="add-main">
      <div class="step-container">
        <el-steps direction="vertical" :active="activeStep">
          <el-step title="角色信息" />
          <el-step title="权限信息" />
          <el-step title="检查并完成" />
        </el-steps>
      </div>
      <div v-show="activeStep===1" class="form-container">
        <div class="title">角色信息</div>
        <div class="form">
          <el-form ref="roleForm" class="form-box" :model="roleForm" :rules="roleRules">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="roleForm.roleName" />
            </el-form-item>
            <el-form-item label="角色描述" prop="remark">
              <el-input v-model="roleForm.remark" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-show="activeStep===2" class="form-container">
        <div class="title">权限配置</div>
        <div class="tree-wrapper">
          <div v-for="item in treeList" :key="item.id" class="tree-item">
            <div class="tree-title">{{ item.title }}</div>
            <!-- show-checkbox展示复选框 -->
            <!--  default-expand-all默认展开 -->
            <!-- check-strictly 解除父子级的关联 -->
            <el-tree
              ref="tree"
              show-checkbox
              check-strictly
              default-expand-all
              node-key="id"
              :props="{label: 'title'}"
              :data="item.children"
            />
          </div>
        </div>
      </div>

      <div v-show="activeStep === 3" class="form-container">
        <div class="title">检查并完成</div>
        <div class="form">
          <div class="info">
            <div class="form-item">角色名称：{{ roleForm.roleName }}</div>
            <div class="form-item">角色描述：{{ roleForm.remark }}</div>
            <div class="form-item">角色权限：</div>
            <div class="tree-wrapper">
              <div v-for="item in treeList" :key="item.id" class="tree-item">
                <div class="tree-title">{{ item.title }}</div>
                <el-tree
                  ref="diabledTree"
                  :data="item.children"
                  show-checkbox
                  check-strictly
                  default-expand-all
                  node-key="id"
                  :props="{ label: 'title',disabled:()=>true}"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button v-show="activeStep!==1" @click="prev">上一步</el-button>
        <el-button v-show="activeStep!==3" type="primary" @click="next">下一步</el-button>
        <el-button v-show="activeStep===3" type="primary" @click="createRoleUser">确认添加</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { getTreeListApi, createRoleUserApi, getRoleDetailApi, updateRoleApi } from '@/api/role'
export default {
  data() {
    return {
      activeStep: 1,
      roleForm: {
        roleName: '',
        remark: '',
        perms: []
      },
      roleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入描述名称', trigger: 'blur' }
        ]
      },
      treeList: []
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  mounted() {
    this.getTreeList()
    if (this.id) {
      this.getRoleDetail()
    }
  },
  methods: {
    async getRoleDetail() {
      const res = await getRoleDetailApi(this.id)
      // console.log(res)
      this.roleForm = res.data
      // 回显
      this.$refs.tree.forEach((item, index) => {
        item.setCheckedKeys(this.roleForm.perms[index])
      })
    },
    // 获取权限列表
    async getTreeList() {
      const res = await getTreeListApi()
      // console.log(res)
      this.treeList = res.data
    },
    // 上一步
    prev() {
      if (this.activeStep === 1) return
      this.activeStep--
    },
    // 下一步
    next() {
      if (this.activeStep === 3) return
      // 验证第一步
      if (this.activeStep === 1) {
        this.$refs.roleForm.validate(flag => {
          if (!flag) return
          this.activeStep++
        })
      } else if (this.activeStep === 2) {
        const treeComponentList = this.$refs.tree
        // 点击下一步之前先清空
        this.roleForm.perms = []
        treeComponentList.forEach(tree => {
          // console.log(tree.getCheckedKeys())
          this.roleForm.perms.push(tree.getCheckedKeys())
        })
        // 判断用户是否选择了权限
        if (this.roleForm.perms.flat().length <= 0) {
          this.$message.error('请选择权限')
          return
        }
        // 第三步的回显
        this.$refs.diabledTree.forEach((item, index) => {
          // console.log(item)
          // 回显
          item.setCheckedKeys(this.roleForm.perms[index])
        })

        this.activeStep++
      }
    },
    // 确认添加
    async createRoleUser() {
      if (this.id) {
        delete this.roleForm.userTotal
        await updateRoleApi(this.roleForm)
        this.$message.success('修改成功')
      } else {
        await createRoleUserApi(this.roleForm)
        // console.log(res)
        this.$message.success('添加成功')
      }
      this.$router.back()
    }
  }
}
</script>
<style scoped lang="scss">
.add-role {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    height: 64px;
    line-height: 64px;
    font-size: 16px;
    font-weight: bold;
    background-color: #fff;

    .left {
      span {
        margin-right: 4px;
      }

      .arrow {
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    position: fixed;
    top: 64px;
    bottom: 88px;
    width: 100%;
    overflow-y: auto;
    background: #f4f6f8;
    padding: 20px 230px;
    display: flex;
    .step-container {
      height: 400px;
      width: 200px;
    }
    .form-container {
      flex:1;
      background-color: #fff;
      overflow-y: auto;
      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }
      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;
        .el-form {
          display: flex;
          flex-wrap: wrap;
        }
        .info{
          font-size:14px;
          color:#666;
          .form-item{
            margin-bottom:20px;
          }
        }
      }
      .form-box{
        width: 600px;
        display: flex;
        flex-direction: column;
      }
    }
  }

  .add-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 24px 50px;
    color: #000000d9;
    font-size: 14px;
    background: #fff;
    text-align: center;
    z-index: 10001;
  }
  .tree-wrapper {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .tree-item {
        flex: 1;
        padding: 0px 4px;
        text-align: center;
        .tree-title {
          background: #f5f7fa;
          text-align: center;
          padding: 10px 0;
          margin-bottom: 12px;
        }
      }
    }
}
</style>
