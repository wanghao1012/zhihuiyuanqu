import request from '@/utils/request'

/**
 * 获取tree权限列表
 * @returns
 */
export function getTreeListApi() {
  return request({
    url: '/park/sys/permision/all/tree'
  })
}

/**
 * 获取当前角色权限点列表
 * @returns
 */
export function getRoleDetailApi(roleId) {
  return request({
    url: `/park/sys/role/${roleId}`
  })
}

/**
 * 获取关联的角色成员列表
 * @param {*} roleId
 * @param {*} params
 * @returns
 */
export function getRoleUserApi(roleId, params) {
  return request({
    url: `/park/sys/roleUser/${roleId}`,
    method: 'get',
    params
  })
}

/**
 * 创建角色
 * @returns
 */
export function createRoleUserApi(data) {
  return request({
    url: `/park/sys/role`,
    method: 'POST',
    data
  })
}

/**
 * 修改角色
 * @param {*} data
 * @returns
 */
export const updateRoleApi = (data) => {
  return request({
    url: '/park/sys/role',
    method: 'PUT',
    data
  })
}

/**
 * 删除角色
 * @returns
 */
export function delRoleUserApi(roleId) {
  return request({
    url: `/park/sys/role/${roleId}`,
    method: 'DELETE'
  })
}
