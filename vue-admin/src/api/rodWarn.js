import request from '@/utils/request'

/**
 * 获取警告列表
 * @param {*} params
 * @returns
 */
export const getWarningListApi = params => {
  return request({
    url: '/pole/warning/list',
    method: 'get',
    params
  })
}

/**
 * 删除警告记录
 * @param {*} id
 * @returns
 */
export const delWarningListApi = id => {
  return request({
    url: `/pole/warning/${id}`,
    method: 'delete'
  })
}
