import request from '@/utils/request'

/**
 * 获取一体杆列表
 * @param {*} params
 * @returns
 */
export const getRodManageListApi = params => {
  return request({
    url: '/pole/info/list',
    method: 'get',
    params

  })
}

/**
 * 添加一体杆
 * @param {*} data
 * @returns
 */
export const addRodManageListApi = data => {
  return request({
    url: '/pole/info',
    method: 'post',
    data
  })
}

/**
 * 获取关联区域下拉列表
 * @returns
 */
export const getAreaListApi = () => {
  return request({
    url: '/parking/area/dropList',
    method: 'get'

  })
}
