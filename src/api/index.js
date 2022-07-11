/*
 * @Date: 2022-04-15 10:52:31
 * @Author: winterchen
 * @Description: TODO
 * @Version: 1.0
 * @LastEditTime: 2022-06-30 14:44:35
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
    return request.post(`${url}/logout`, data);
  },
  check() {
    return request.get(`${url}/check`, null);
  }
};

const ShareService = {
  upload(query, data) {
    return request.uploadFile(`${shareUrl}/upload/file`, query, data);
  },
  uploadContent(data) {
    return request.post(`${shareUrl}/upload/content`, data);
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
  },
  listCurrent() {
    return request.get(`${shareUrl}/list/current`);
  },
  createMultipartUpload(fileName, chunkSize) {
    return request.post(`${shareUrl}/multipart/create`, {fileName: fileName, chunkSize: chunkSize});
  },
  async multipartUpload(uploadUrl, chunkData) {
    return await request.put(uploadUrl, chunkData);
  },
  completeMultipartUpload(data) {
    return request.post(`${shareUrl}/multipart/complete`, data);
  },
  remove(takeCode) {
    return request.post(`${shareUrl}/remove/${takeCode}`, null);
  }
};

export const api = {
  ...UserService,
  ...ShareService
};
