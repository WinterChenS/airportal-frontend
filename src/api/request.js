/**
 * @Author:
 * @Date:   2021-11-29T14:01:12+08:00
 * @Filename: http.js
 * @Last modified by:   damonliu
 * @Last modified time: 2022-01-20T10:55:16+08:00
 */

 import axios from "axios";
 import qs from "qs";
 import {Message} from 'element-ui'
 import router from '@/router/index'
 import routers from "@/router";
 //axios.defaults.timeout = 5000;
 if (process.env.NODE_ENV == "development") {
//    axios.defaults.baseURL = process.env.VUE_APP_URL;
   axios.defaults.baseURL = "http://127.0.0.1:8080";
   // axios.defaults.baseURL = "http://192.168.150.124:7201";
 } else if (process.env.NODE_ENV == "production") {
   axios.defaults.baseURL = process.env.VUE_APP_URL;
 } else if (process.env.NODE_ENV == "test") {
   axios.defaults.baseURL = process.env.VUE_APP_URL;
 }
 

 

 //http request 拦截器
 axios.create({
   withCredentials: true
 });
 axios.interceptors.request.use(
   config => {
     config.headers["Authorization"] = sessionStorage.getItem("token");
     return config;
   },
   error => {
     return Promise.reject(error);
   }
 );
 
 let errorStatus = new Map([
   [400, { error: "错误请求" }],
   [401, { error: "未授权，请重新登录" }],
   [403, { error: "拒绝访问" }],
   [404, { error: "请求错误,未找到该资源" }],
   [405, { error: "请求方法未允许" }],
   [408, { error: "请求超时" }],
   [500, { error: "服务器端出错" }],
   [501, { error: "网络未实现" }],
   [502, { error: "网络错误" }],
   [503, { error: "服务不可用" }],
   [504, { error: "网络超时" }],
   [505, { error: "http版本不支持该请求" }],
   [-100, { error: "请退出重新登录" }],
   ["default", { error: "连接错误" }]
 ]);
 
 /**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
 const toLogin = () => {
   router.replace({
     path: '/login',
     query: {
       redirect: router.currentRoute.fullPath
     }
   });
 }
 // 响应拦截器即异常处理
 axios.interceptors.response.use(
   response => {
 
     if(response.data.code === 2001){
       //登录超时重定向
       
       window.location.href = "/login"
     }
      else if (response.data.code !== 1) {
        
        console.log(response);
        Message.error(response.data.message);
        
     }
     return response;
   },
   err => {
 
     if(err.response.status == '303'){
       routers.push('overdue')
     }else  if (err && err.response) {
       let status = err.response.status;
       let error =
         errorStatus.get(status).error ||
         errorStatus.get("default").error + err.response.status;
       Message.error(error);
     } else {
       Message.error("连接到服务器失败");
       console.log("连接到服务器失败");
     }
     return Promise.resolve(err.response);
   }
 );
 
 export const request = {
   async get(url, data) {
     try {
       let res = await axios.get(url, { params: data });
       res = res.data;
       return new Promise((resolve ,reject)=> {
         if (res.code === 1 || res.code === 303) {
             resolve(res);
         }else{
             reject(res);
         }
       });
     } catch (err) {
         console.log(err);
     }
   },
   async post(url, data) {
     try {
       let headers = { "Content-Type": "application/json;charset=UTF-8" };
       let res = await axios.post(url, data, headers);
       res = res.data;
       return new Promise(resolve => {
         if (res.code === 1 ) {
           resolve(res);
         }
         resolve(res);
       });
     } catch (err) {
       console.log(err);
     }
   },
   async uploadFile(url, query, data) {
      try {
        let headers = { "Content-Type": "multipart/form-data" };
        let res = await axios.post(url + '?' + qs.stringify(query), data, headers);
        res = res.data;
        return new Promise(resolve => {
          if (res.code === 1 ) {
            resolve(res);
          }
          resolve(res);
        });
      } catch (err) {
        console.log(err);
      }
    },
    async postForm(url, data) {
     try {
       let headers = { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" };
       let res = await axios.post(url, qs.stringify(data), headers);
       res = res.data;
       return new Promise(resolve => {
         if (res.code === 1) {
           resolve(res);
         }
       });
     } catch (err) {
       console.log(err);
     }
   },
   async patch(url, data) {
     try {
       let res = await axios.patch(url, data);
       res = res.data;
       return new Promise(resolve => {
         if (res.code === 1) {
           resolve(res);
         }
       });
     } catch (err) {
       console.log(err);
     }
   },
   async put(url, data) {
     try {
       let res = await axios.put(url, data);
       res = res.data;
       return new Promise(resolve => {
         if (res.code === 1) {
           resolve(res);
         }
       });
     } catch (err) {
       console.log(err);
     }
   },
   async delete(url, data) {
    try {
      let res = await axios.delete(url, data);
      res = res.data;
      return new Promise(resolve => {
        if (res.code === 1) {
          resolve(res);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
   //用来导出excel
   async expoertExcel(url, data){
     try {
       let res = await axios.post(url, qs.stringify(data), {responseType: 'blob', headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
       res = res.data;
       return new Promise(resolve => {
         if (res.code === 1) {
           resolve(res);
         }
       });
     } catch (err) {
       console.log(err);
     }
   },
   async getExport(data,name,type) {
     let Authorization = JSON.parse(sessionStorage.getItem("user")).token;
     var xhr = new XMLHttpRequest();
     xhr.open("GET", data, true);
     //设置请求头参数的方式,如果没有可忽略此行代码
     xhr.setRequestHeader("Authorization", `${Authorization}`);
     //设置响应类型为 blob
     xhr.send();
     xhr.responseType = "blob";
     //关键部分
     xhr.onload = function(e) {
       //如果请求执行成功
       if (this.status == 200) {
         const link = document.createElement("a");
         let blob = new Blob([this.response],type);
         link.style.display = "none";
         link.href = URL.createObjectURL(blob);
         link.download = name; //下载的文件名
         document.body.appendChild(link);
         link.click();
       }
     };
   },
   getUrl() {
     return axios.defaults.baseURL;
   }
 };
 