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

/**
 * 创建规则
 * @returns
 */
export function createRuleApi(data) {
  return request({
    url: '/parking/rule',
    method: 'POST',
    data
  })
}

/**
 * 删除计费规则
 * @param {*} id
 * @returns
 */
export const delCarRuleListApi = id => {
  return request({
    url: `/parking/rule/${id}`,
    method: 'DELETE'
  })
}

/**
 * 查看单个计费规则详情
 * @param {*} id
 * @returns
 */
export const lookEditRuleApi = id => {
  return request({
    url: `/parking/rule/${id}`
  })
}

/**
 * 修改计费规则
 * @param {*} data
 * @returns
 */
export const editCardApi = data => {
  return request({
    url: '/parking/rule',
    method: 'PUT',
    data
  })
}
