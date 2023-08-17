import request from '@/utils/request'

/**
 * 获取员工列表
 * @param {*} params
 * @returns
 */
export const getEmployeeListApi = params => {
  return request({
    url: '/park/sys/user',
    method: 'get',
    params
  })
}

/**
 * 获取所有角色列表
 * @returns
 */
export const getRoleListApi = () => {
  return request.get('/park/sys/role')
}

/**
 * 添加员工
 * @param {*} data
 * @returns
 */
export const addEmployeeListApi = data => {
  return request({
    url: '/park/sys/user',
    method: 'post',
    data
  })
}

export const delEmployeeListApi = id => {
  return request({
    url: `/park/sys/user/${id}`,
    method: 'DELETE'
  })
}
