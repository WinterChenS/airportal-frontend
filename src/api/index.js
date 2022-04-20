/*
 * @Date: 2022-04-15 10:52:31
 * @Author: winterchen
 * @Description: TODO
 * @Version: 1.0
 * @LastEditTime: 2022-04-20 10:36:43
 */
import { request } from "./request.js";


// 登录模块
let url = "/user"
let shareUrl = "/share"
const UserService = {
  login(data) {
    return request.post(`${url}/login`, data);
  },
  register(data) {
    return request.post(`${url}/register`, data);
  },
  logout(data) {
    return request.post('${url}/logout', data);
  }
};

const ShareService = {
  upload(query, data) {
    return request.uploadFile(`${shareUrl}/upload/file`, query, data);
  },
  uploadContent(query) {
    return request.uploadFile(`${shareUrl}/upload/content`, query, null);
  },
  checkPass(code) {
    console.log(code, "code=")
    return request.get(`${shareUrl}/check/need-pass/${code}`, null);
  },
  take(code, pass) {
    return request.get(`${shareUrl}/take/${code}`, {pass: pass});
  },
  getFileInfo(code, pass) {
    return request.get(`${shareUrl}/info/${code}`, {pass: pass});
  },
  getFileDownloadUrl(code, pass) {
    return request.getUrl() + `${shareUrl}/take/${code}?pass=${pass}`;
  }
};

export const api = {
  ...UserService,
  ...ShareService
};
