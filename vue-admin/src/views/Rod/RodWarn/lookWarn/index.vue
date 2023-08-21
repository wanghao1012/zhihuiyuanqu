<template>
  <div class="add-card">
    <header class="add-header">
      <el-page-header content="警告详情" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">警告详情</div>
        <div class="form">
          <el-form label-width="100px">
            <el-form-item label="告警时间:">
              <span>{{ params.warningTime }}</span>
            </el-form-item>
            <el-form-item label="一体杆名称:">
              <span>{{ params.poleName }}</span>
            </el-form-item>
            <el-form-item label="告警区域:">
              <span>{{ params.areaName }}</span>
            </el-form-item>
            <el-form-item label="一体杆编号:">
              <span>{{ params.poleNumber }}</span>
            </el-form-item>
            <el-form-item label="故障类型:">
              <span>{{ params.errorType }}</span>
            </el-form-item>
            <el-form-item label="处置状态:">
              <span>{{ formData(params.handleStatus) }}</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">警告处理</div>
        <div class="form">
          <el-form label-width="100px">
            <el-form-item label="处理人:">
              <span>{{ params.handleUser }}</span>
            </el-form-item>
            <el-form-item label="联系方式:">
              <span>{{ params.phonenumber }}</span>
            </el-form-item>
            <el-form-item label="处理结果:">
              <span>{{ params.handleResult }}</span>
            </el-form-item>
            <el-form-item label="完成时间:">
              <span>{{ params.handleTime }}</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { getParticularsApi } from '@/api/lookWarn'
export default {
  data() {
    return {
      params: {}
    }
  },
  created() {
    this.getParticulars()
  },
  methods: {
    async getParticulars() {
      const res = await getParticularsApi(this.$route.params.id)
      console.log(res)
      this.params = res.data
    },
    // 格式化内容
    formData(row) {
      const res = {
        0: '未派单', 1: '已派单', 2: '已接单', 3: '已完成'
      }
      return res[row]
    }
  }
}
</script>

<style scoped lang="scss">
.add-card {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 64px;
    background-color: #fff;

    .left {
      span {
        margin-right: 4px;
      }
      .arrow{
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    background: #f4f6f8;
    padding: 20px 130px;

    .form-container {
      background-color: #fff;

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

          .el-form-item {
            width: 50%;
          }
        }
      }
    }
    .preview{
      img{
        width: 100px;
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
  }
}
</style>
