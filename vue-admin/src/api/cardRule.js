import request from '@/utils/request'

/**
 * 获取计费规则的列表
 * @param {*} params
 * @returns
 */
export const getRuleListApi = params => {
  return request({
    url: '/parking/rule/list',
    method: 'get',
    params
  })
}
