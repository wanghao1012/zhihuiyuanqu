<template>
  <div class="add-card">
    <header class="add-header">
      <el-page-header :content="$route.query.id?'编辑月卡':'增加月卡'" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">车辆信息</div>
        <div class="form">
          <el-form ref="params" label-width="100px" :rules="rules" :model="params">
            <el-form-item label="车主姓名" prop="personName">
              <el-input v-model="params.personName" />
            </el-form-item>
            <el-form-item label="联系方式" prop="phoneNumber">
              <el-input v-model="params.phoneNumber" />
            </el-form-item>
            <el-form-item label="车辆号码" prop="carNumber">
              <el-input v-model="params.carNumber" />
            </el-form-item>
            <el-form-item label="车辆品牌" prop="carBrand">
              <el-input v-model="params.carBrand" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">最新一次月卡缴费信息</div>
        <div class="form">
          <el-form ref="feeForm" label-width="100px" :model="feeForm" :rules="feeRules">
            <el-form-item label="有效日期" prop="payTime">
              <el-date-picker
                v-model="feeForm.payTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
            <el-form-item label="支付金额" prop="paymentAmount">
              <el-input v-model="feeForm.paymentAmount" />
            </el-form-item>
            <el-form-item label="支付方式" prop="paymentMethod">
              <el-select v-model="feeForm.paymentMethod">
                <el-option
                  v-for="item in payMethodList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>

    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="add">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { addCardListApi, getCardApi, editCardApi } from '@/api/card'
export default {
  data() {
    // 单独校验车牌号
    const validaeCarNumber = (rule, value, callback) => {
      const plateNumberRegex = /^[\u4E00-\u9FA5][\da-zA-Z]{6}$/
      if (plateNumberRegex.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的车牌号'))
      }
    }
    return {
      // 车辆信息表单数据
      params: {
        personName: '', // 车主姓名
        phoneNumber: '', // 联系方式
        carNumber: '', // 车牌号
        carBrand: '' // 车辆品牌
      },
      rules: {
        personName: [
          { required: true, message: '请输入车主姓名', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ],
        carNumber: [
          { required: true, message: '请输入车牌号', trigger: 'blur' },
          {
            validator: validaeCarNumber, trigger: 'blur'
          }
        ],
        carBrand: [
          { required: true, message: '请输入车辆品牌', trigger: 'blur' }
        ]
      },
      // 缴费信息表单数据
      feeForm: {
        payTime: '', // 支付时间
        paymentAmount: null, // 支付金额
        paymentMethod: '' // 支付方式
      },
      feeRules: {
        payTime: [
          { required: true,
            message: '请选择支付时间' }
        ],
        paymentAmount: [
          {
            required: true,
            message: '请输入支付金额',
            trigger: 'blur'
          }
        ],
        paymentMethod: [
          {
            required: true,
            message: '请选择支付方式',
            trigger: 'change'
          }]
      },
      // 支付方式列表
      payMethodList: [
        {
          id: 'Alipay',
          name: '支付宝'
        },
        {
          id: 'WeChat',
          name: '微信'
        },
        {
          id: 'Cash',
          name: '线下'
        }
      ]
    }
  },
  created() {
    this.getCard()
  },
  methods: {
    // 获取单个月卡信息
    async getCard() {
      // 判断用户是否点击的是编辑 (判断路由地址是否带有id)
      if (this.$route.query.id) {
        const res = await getCardApi(this.$route.query.id)
        // 数据回显
        console.log(res)
        // 回填车辆信息表单
        const { carInfoId, personName, phoneNumber, carNumber, carBrand } = res.data
        this.params = {
          personName, phoneNumber, carNumber, carBrand, carInfoId
        }

        // 回填缴费信息表单
        const { rechargeId, cardStartDate, cardEndDate, paymentAmount, paymentMethod } = res.data.rechargeList[0]
        this.feeForm = {
          rechargeId,
          paymentAmount,
          paymentMethod,
          payTime: [cardStartDate, cardEndDate]
        }
      }
    },
    // 添加月卡
    add() {
      this.$refs.params.validate((valid) => {
        if (valid) {
          this.$refs.feeForm.validate(async isOK => {
            if (isOK) {
              // 当两个表单的数据都符合要求时才发送请求
              const data = {
                ...this.params,
                ...this.feeForm,
                // 单独处理时间
                cardStartDate: this.feeForm.payTime[0],
                cardEndDate: this.feeForm.payTime[1]
              }
              // 删除多余的字段
              delete data.payTime
              // alert('成立')
              if (this.$route.query.id) {
                // 发送请求
                await editCardApi(data)
                // console.log(res)
                // 提示新增成功
                this.$message.success('修改成功')
              } else {
                // 发送请求
                await addCardListApi(data)
                // console.log(res)
                // 提示新增成功
                this.$message.success('新增成功')
              }
              // 返回上一页
              this.$router.back()
            }
          })
        }
      })
    },
    // 重置表单
    resetForm() {
      this.$refs.params.resetFields()
      this.$refs.feeForm.resetFields()
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
