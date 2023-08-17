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
