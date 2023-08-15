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

