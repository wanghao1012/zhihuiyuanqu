import request from '@/utils/request'

/**
 * 获取停车缴费列表
 * @param {*} params
 * @returns
 */
export const getParkingFeeListApi = params => {
  return request({
    url: '/parking/payment/list',
    method: 'get',
    params
  })
}
