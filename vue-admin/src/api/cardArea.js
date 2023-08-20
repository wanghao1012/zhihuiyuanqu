import request from '@/utils/request'

/**
 * 获取区域列表
 * @param {*} params
 * @returns
 */
export const getCardAreaListApi = params => {
  return request({
    url: '/parking/area/list',
    method: 'get',
    params
  })
}

/**
 * 获取关联区域下拉列表
 * @returns
 */
export const getRelevanceListApi = () => {
  return request({
    url: '/parking/rule/dropList',
    method: 'get'
  })
}

/**
 * 添加区域
 * @param {*} data
 * @returns
 */
export const addCardAreaListApi = data => {
  return request({
    url: '/parking/area',
    method: 'post',
    data
  })
}
