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
