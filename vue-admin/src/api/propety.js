import request from '@/utils/request'

/**
 * 获取所有的企业列表
 * @param {*} params
 * @returns
 */
export const getPropetyListApi = params => {
  return request({
    url: '/park/propertyfee',
    method: 'get',
    params
  })
}
