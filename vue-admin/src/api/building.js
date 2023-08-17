import request from '@/utils/request'

/**
 * 获取楼宇列表
 * @param {*} params
 * @returns
 */
export const getParkBuildingListApi = params => {
  return request({
    url: '/park/building',
    method: 'get',
    params
  })
}

/**
 * 新增楼宇
 * @param {*} data
 * @returns
 */
export const addParkBuildingApi = data => {
  return request({
    url: '/park/building',
    method: 'post',
    data
  })
}

/**
 * 删除楼宇(租赁中的不允许删除)
 * @param {*} id
 * @returns
 */
export const delConfirmApi = id => {
  return request({
    url: `/park/building/${id}`,
    method: 'delete'
  })
}

/**
 * 修改楼宇
 * @param {*} data
 * @returns
 */
export const editConfirmApi = data => {
  return request({
    url: '/park/building',
    method: 'put',
    data
  })
}
