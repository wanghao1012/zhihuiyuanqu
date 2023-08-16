import request from '@/utils/request'

/**
 * 获取月卡列表信息
 * @param {*} params 参数
 * @returns
 */

export const getCardListApi = (params) => {
  return request({
    url: '/parking/card/list',
    method: 'get',
    params
  })
}

/**
 * 添加月卡
 * @param {*} data 参数
 * @returns
 */
export const addCardListApi = data => {
  return request({
    url: '/parking/card',
    method: 'post',
    data })
}
