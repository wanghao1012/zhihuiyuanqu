import request from '@/utils/request'

/**
 *获取企业列表
 * @param {*} params
 * @returns
 */
export const getEnterpriseListApi = params => {
  return request({
    url: '/park/enterprise',
    method: 'get',
    params
  })
}
