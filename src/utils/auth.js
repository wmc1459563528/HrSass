// 1. 使用插件来运用cookie
import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-token-101'

/**
 * 从本地获取token
 * @returns
 */
export function getToken() {
  return Cookies.get(TokenKey)
}

/**
 * 往本地存储token
 * @param {*} token
 * @returns
 */
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

/**
 * 从本地移除存储的token
 * @returns
 */
export function removeToken() {
  return Cookies.remove(TokenKey)
}
