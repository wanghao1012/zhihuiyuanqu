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

/**
 * 添加账单
 * @param {*} data
 * @returns
 */
export const addPropetyListApi = data => {
  return request({
    url: '/park/propertyfee',
    method: 'POST',
    data
  })
}

/**
 * 获取所有租户信息
 * @returns
 */
export const getLesseeListApi = () => {
  return request({
    url: '/park/all/enterprise',
    method: 'get'
  })
}

/**
 * 获取所有租赁楼宇
 * @returns
 */
export const getLeaseholdPremisesApi = () => {
  return request({
    url: '/park/all/building',
    method: 'get'
  })
}

/**
 * 删除企业列表
 * @param {*} id
 * @returns
 */
export const delPropetyListApi = id => {
  return request({
    url: `/park/propertyfee/${id}`,
    method: 'DELETE'
  })
}
