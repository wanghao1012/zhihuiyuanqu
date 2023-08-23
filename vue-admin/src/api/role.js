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
