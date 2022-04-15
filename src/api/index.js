/*
 * @Date: 2022-04-15 10:52:31
 * @Author: winterchen
 * @Description: TODO
 * @Version: 1.0
 * @LastEditTime: 2022-04-15 13:39:57
 */
import { request } from "./request.js";


// 登录模块
let url = "/user"
let url1 = "/share"
const UserService = {
  login(data) {
    return request.post(`${url}/login`, data);
  },
  register(data) {
    return request.post(`${url}/register`, data);
  },
  logout(data) {
    return request.post('/user/logout', data);
  }
};
export const api = {
  ...UserService
};
