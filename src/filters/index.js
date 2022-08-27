/**
 * 此文件封装了所有过滤器的函数
 * @param {string} value 传入的值 默认为前边的值
 * @param {string} str 日期格式
 * @returns
 */
// import dayjs from 'dayjs'
export const formatData = (value, str = 'YYYY年MM月DD日') => {
  const dayjs = require('dayjs')
  return dayjs(value).format(str)
}
