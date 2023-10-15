// 获取园区信息

import request from '@/utils/request'

/**
 * 获取园区信息
 * @returns
 */
export function getParkInfoApi () {
  return request({
    url: '/park/statistics/info'
  })
}
