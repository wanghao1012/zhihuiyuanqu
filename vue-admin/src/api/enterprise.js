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

/**
 * 获取所在行业列表
 * @returns
 */
export const getIndustryListApi = () => {
  return request.get('/park/industry')
}

/**
 *上传合同
 * @param {*} data
 * @returns
 */
export const uploadApi = data => {
  return request({
    url: '/upload',
    method: 'POST',
    data
  })
}

/**
 * 新增企业
 * @param {*} data
 * @returns
 */
export function addExterpriseListApi(data) {
  return request({
    url: '/park/enterprise',
    method: 'POST',
    data
  })
}

/**
 * 获取单个企业详情
 * @param {*} id
 * @returns
 */
export const getEnterpriseApi = id => {
  return request({
    url: `/park/enterprise/${id}`,
    method: 'get'
  })
}

/**
 * 修改企业信息
 * @param {*} data
 * @returns
 */
export const editEnterpriseApi = data => {
  return request({
    url: '/park/enterprise',
    method: 'PUT',
    data
  })
}

/**
 * 删除企业
 * @param {*} id
 * @returns
 */
export const delEnterpriseApi = id => {
  return request({
    url: `/park/enterprise/${id}`,
    method: 'DELETE'
  })
}
