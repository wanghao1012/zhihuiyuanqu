<template>
  <div class="role-container">
    <div class="left-wrapper">
      <div
        v-for="(item,index) in roleList"
        :key="item.roleId"
        class="role-item"
        :class="{active: index === activeIndex}"
        @click="changeRole(index)"
      >
        <div class="role-info">
          <svg-icon :icon-class="index === activeIndex ? 'user-active' : 'user'" class="icon" />
          {{ item.roleName }}
        </div>
        <div class="more">
          <el-dropdown>
            <span class="el-dropdown-link">
              <svg-icon icon-class="more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="$router.push(`/roleAdd?id=${item.roleId}`)">编辑角色</el-dropdown-item>
              <el-dropdown-item @click.native="delRoleUser(item.roleId)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <el-button class="addBtn" size="mini" @click="$router.push('/roleAdd')">添加角色</el-button>
    </div>
    <div class="right-wrapper">
      <el-tabs v-model="activeName">
        <el-tab-pane label="功能权限" name="tree">
          <div class="tree-wrapper">
            <div v-for="item in treeList" :key="item.id" class="tree-item">
              <!-- title -->
              <div class="tree-title">{{ item.title }}</div>
              <!-- 树形结构 -->
              <el-tree
                ref="tree"
                :props="{label:'title'}"
                :data="item.children"
                show-checkbox
                :default-expand-all="true"
                node-key="id"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`成员(${total})`" name="user">
          <div class="user-wrapper">
            <el-table
              :data="roleUserList"
              style="width: 100%"
            >
              <el-table-column
                type="index"
                width="250"
                label="序号"
              />
              <el-table-column
                prop="name"
                label="员工姓名"
              />
              <el-table-column
                prop="userName"
                label="登录账号"
              />
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getRoleListApi } from '@/api/employee'
import { getTreeListApi, getRoleDetailApi, getRoleUserApi, delRoleUserApi } from '@/api/role'
export default {
  name: 'Role',
  data() {
    return {
      treeList: [], // 权限树形列表
      roleList: [],
      activeIndex: 0, // 存储当前点击的是哪个菜单
      activeName: 'tree', // 默认打开tree
      total: 0,
      roleUserList: [],
      params: {
        page: 1,
        pageSize: 10
      }
    }
  },
  // 生命周期里先以第一项roleId获取
  async created() {
    // 先获取角色列表和可选权限列表  这两个数据是异步的
    await this.getRoleList()
    await this.getTreeList()

    // 再获取当前角色下的权限列表
    this.changeRole(0)
  },
  methods: {
    // 组件中获取功能权限列表
    async getTreeList() {
      const res = await getTreeListApi()
      console.log(res)
      this.treeList = res.data
      this.addDisabledProp(this.treeList)
    },
    // 禁用复选框  递归函数
    addDisabledProp(treeList) {
      treeList.forEach(item => {
        item.disabled = true
        // 递归调用
        if (item.children) {
          this.addDisabledProp(item.children)
        }
      })
    },
    // 获取角色列表
    async getRoleList() {
      const res = await getRoleListApi()
      // console.log(res)
      this.roleList = res.data
    },
    // 点击切换类名
    changeRole(index) {
      this.activeIndex = index
      const roleId = this.roleList[index].roleId
      // 获取角色的回显权限数据
      this.getRoleDetail(roleId)
      // 获取角色的成员数据
      this.getRoleUserApi(roleId, this.params)
    },
    // 获取角色对应的权限
    async  getRoleDetail(roleId) {
      const res = await getRoleDetailApi(roleId)
      console.log(res)
      const perms = res.data.perms
      // console.log(this.perms)
      this.$refs.tree.forEach((tree, index) => {
        tree.setCheckedKeys(perms[index])
      })
    },
    // 获取当前角色下的成员数据列表
    async  getRoleUserApi(id) {
      const res = await getRoleUserApi(id)
      console.log(res)
      this.roleUserList = res.data.rows
      this.total = res.data.total
    },
    async  delRoleUser(id) {
      this.$confirm('是否确认删除当前角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delRoleUserApi(id)
        this.getRoleList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.role-container {
  display: flex;
  font-size: 14px;
  background-color: #fff;
  padding:20px;
  .left-wrapper {
    width: 200px;
    border-right: 1px solid #e4e7ec;
    padding: 4px;
    text-align: center;

    .role-item {
      position: relative;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      cursor: pointer;

      &.active {
        background: #edf5ff;
        color: #4770ff;
      }
    }

    .role-info {
      display: flex;
      align-items: center;

      .icon {
        margin-right: 10px;
      }
    }

    .more {
      display: flex;
      align-items: center;
    }
    .addBtn{
      width: 100%;
      margin-top: 20px;
    }
  }

  .right-wrapper {
    flex: 1;

    .tree-wrapper {
      display: flex;
      justify-content: space-between;

      .tree-item {
        flex: 1;
        border-right: 1px solid #e4e7ec;
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

    ::v-deep .el-tabs__nav-wrap {
      padding-left: 20px;
    }

    .user-wrapper{
      padding:20px;
    }
  }
}
</style>
