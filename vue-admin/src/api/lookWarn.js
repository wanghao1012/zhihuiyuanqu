import request from '@/utils/request'

/**
 * 获取警告详情
 * @param {*} id
 * @returns
 */
export const getParticularsApi = id => {
  return request({
    url: `/pole/warning/${id}`,
    method: 'get'
  })
}
