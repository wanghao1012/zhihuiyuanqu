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

/**
 * 删除员工
 * @param {*} id
 * @returns
 */
export const delEmployeeListApi = id => {
  return request({
    url: `/park/sys/user/${id}`,
    method: 'DELETE'
  })
}

/**
 * 修改员工
 * @param {*} data
 * @returns
 */
export const editEmployeeApi = data => {
  return request({
    url: '/park/sys/user',
    method: 'put',
    data
  })
}

/**
 * 重置密码
 * @param {*} id
 * @returns
 */
export const resetPasswordApi = id => {
  return request({
    url: '/park/sys/user/resetPwd',
    method: 'put',
    data: { id }
  })
}
