import request from '@/utils/request'

/**
 * 获取月卡列表信息
 * @param {*} params 参数
 * @returns
 */
export const getCardListApi = (params) => {
  return request({
    url: '/parking/card/list',
    method: 'get',
    params
  })
}

/**
 * 获取单个月卡详情
 * @param {*} id
 * @returns
 */
export const getCardApi = id => {
  return request({
    url: `/parking/card/${id}`,
    method: 'get'
  })
}

/**
 *  编辑月卡信息
 * @param {*} data
 * @returns
 */
export const editCardApi = data => {
  return request({
    url: '/parking/card/edit',
    method: 'put',
    data
  })
}

/**
 * 添加月卡
 * @param {*} data 参数
 * @returns
 */
export const addCardListApi = data => {
  return request({
    url: '/parking/card',
    method: 'post',
    data })
}

/**
 * 删除功能
 * @param {*} ids  参数可以使一个id也可以是多个id
 * @returns
 */
export const delCardListApi = (ids) => {
  return request({
    url: `/parking/card/${ids}`,
    method: 'delete'
  })
}
