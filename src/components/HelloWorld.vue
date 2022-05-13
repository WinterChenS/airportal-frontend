<template>
  <div class="hello">
    <img class="logo" alt="Vue logo" src="../assets/logo.png">
    <el-upload class="upload-demo" :show-file-list="false" action="" :http-request="e => upload(e)"
      :file-list="fileList" :before-upload="beforeUpload" :on-change="handleChange">

      <el-popover placement="top-start" title="更多上传" width="200" offset=-180 visible-arrow=false trigger="hover">
        <!--<p>更多上传</p>-->
        <div style="text-align: left; margin: 0">
          <el-button type="primary" size="mini" @click="dialogContentVisible = true">文本</el-button>
        </div>
        <el-button class="upload-button" size="small" type="primary" slot="reference">发送</el-button>
      </el-popover>
    </el-upload>
    <el-row>
      <el-button class="receive-button" @click="receiveFile" plain>接收</el-button>
    </el-row>
    <el-dialog title="" :showClose="false" :visible.sync="dialogTableVisible" custom-class="app-dialog-box" center>
      <div class="file-list">
        {{ fileList[0].name }}
      </div>
      <el-form :model="form" :rules="rules" ref="form" label-width="80px" class="app-form">
        <el-form-item label="密码" prop="pass">
          <el-input v-model="form.pass" autocomplete="off" size="mini"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="下载次数" prop="maxGetCount">
              <el-input v-model="form.maxGetCount" max="4" min="1" type="number" size="mini" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保留时间" prop="expire">
              <el-input v-model="form.expire" type="number" max="48" min="1" size="mini" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="uploadFile('form')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="" :showClose="false" :visible.sync="dialogContentVisible" custom-class="app-dialog-box" center>
      <el-form :model="contentForm" :rules="contentRules" ref="contentForm" label-width="80px" class="app-form">
        <el-form-item label="" prop="content">
          <el-input type="textarea" :rows="10" placeholder="请输入内容" v-model="contentForm.content" size="medium"
            :clearable="true">
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input v-model="contentForm.pass" autocomplete="off" size="mini"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="下载次数" prop="maxGetCount">
              <el-input v-model="contentForm.maxGetCount" max="4" min="1" type="number" size="mini" placeholder="">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保留时间" prop="expire">
              <el-input v-model="contentForm.expire" type="number" max="48" min="1" size="mini" placeholder="">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogContentVisible = false">取 消</el-button>
        <el-button type="primary" @click="uploadContent">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="取件" :visible.sync="tackCodeFormVisible" center>
      <el-form :model="takeForm" :rules="takeRules" label-width="80px" class="app-form" ref="takeForm">
        <el-form-item label="">
          <el-input v-model="takeForm.code" :clearable="true" autocomplete="off" placeholder="取件码"></el-input>
        </el-form-item>
        <el-form-item label="" v-show="needPass">
          <el-input v-model="takeForm.pass" :clearable="true" autocomplete="off" placeholder="密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="takeFileForm('takeForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="取件" :visible.sync="takeContentVisible" center>
      <el-input type="textarea" :rows="10" placeholder="" v-model="content" size="medium" :clearable="true">
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-clipboard:copy="content" v-clipboard:success="onCopy">复 制</el-button>
      </div>
    </el-dialog>
    <el-dialog title="" :visible.sync="uploadSuccess" width="30%" center>
      <p class="popup-title">文件已成功发送</p>
      <p>您的取件码</p>
      <p id="receive-code">{{ tackCode }}</p>
      <p>接收文件时，请输入该6位数取件码</p>
      <p>您也可以 <a type="primary" v-clipboard:copy="downloadUrl" v-clipboard:success="onCopy">复制分享连接
        </a>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="uploadSuccess = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="上传中.." :visible.sync="uploadProcessVisible" center>
      <el-progress :percentage="percentage" :color="customColorMethod"></el-progress>
    </el-dialog>
    <el-dialog title="取件" :visible.sync="takeContentVisible">
      <el-input type="textarea" :rows="10" placeholder="" v-model="content" size="medium" :clearable="true">
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-clipboard:copy="content" v-clipboard:success="onCopy">复 制</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
import {
  request
} from "../api/request.js";
import { v4 as uuidv4 } from 'uuid';



export default {
  data () {

    var validateMaxGetCount = (rule, value, callback) => {
      if (value > 4) {
        callback(new Error("最大只能4个"));
      } else {
        callback();
      }
    };
    var validatorExpire = (rule, value, callback) => {
      if (value > 48) {
        callback(new Error("最多只保留48小时"));
      } else {
        callback();
      }
    };
    var validatorCode = (rule, value, callback) => {
      if (value === null || value === undefined || value === "" || value.length !== 6) {
        callback(new Error("错误的取件码"));
      } else {
        callback();
      }
    };
    var validateContent = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error("内容不能为空"));
      } else {
        callback();
      }
    }
    return {
      rules: {
        maxGetCount: [{
          validator: validateMaxGetCount,
          trigger: "blur"
        }, { required: true, message: "最大提取次数不能为空", trigger: "blur" }],
        expire: [{
          validator: validatorExpire,
          trigger: "blur"
        }, { required: true, message: "最大保存时间不能为空", trigger: "blur" }]
      },
      contentRules: {
        content: [{
          validator: validateContent,
          trigger: "blur"
        }, { required: true, message: "分享的内容不能为空", trigger: "blur" }],
        maxGetCount: [{
          validator: validateMaxGetCount,
          trigger: "blur"
        }, { required: true, message: "最大提取次数不能为空", trigger: "blur" }],
        expire: [{
          validator: validatorExpire,
          trigger: "blur"
        }, { required: true, message: "最大保存时间不能为空", trigger: "blur" }]
      },
      takeRules: {
        code: [{
          validator: validatorCode,
          trigger: "blur"
        }, { required: true, message: "取件码不能为空", trigger: "blur" }]
      },
      fileList: [{
        name: 'food.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }, {
        name: 'food2.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }],
      dialogTableVisible: false,
      form: {
        pass: '',
        maxGetCount: '2',
        expire: '12'
      },
      formLabelWidth: '120px',
      file: null,
      uploadSuccess: false,
      tackCode: "",
      downloadUrl: "",
      tackCodeFormVisible: false,
      takeForm: {
        code: ""
      },
      needPass: false,
      content: '',
      takeContentVisible: false,
      dialogContentVisible: false,
      contentForm: {
        content: '',
        pass: '',
        maxGetCount: '2',
        expire: '12'
      },
      uploadProcessVisible: false,
      percentage: 10,
      fileSize: 0,
      out5M: false,
      fileInfo: {},
      fileB: null,
      taskList: 0
    };
  },
  created () {
    console.log(this.$route.query);
    var query = this.$route.query;
    if (query !== null && query.takeCode != null) {
      var takeCode = query.takeCode;
      this.tackCodeFormVisible = true;
      if (takeCode.length < 6) {
        this.$message.error("文件不存在")
      }
      this.takeForm.code = takeCode.substring(0, 6);
    }
  },
  methods: {
    async upload (e) {
      let formData = new FormData()
      formData.append("file", e.file)
      console.log(formData)
      this.file = formData;
      this.fileB = e.file;
    },
    handleChange (file, fileList) {
      this.hasFile();
      this.fileList = fileList.slice(-3);
    },
    hasFile () {
      this.dialogTableVisible = true;
    },
    beforeUpload (file) {
      this.fileSize = file.size;
      this.out5M = file.size / 1024 / 1024 > 5;
      // const isLt2M = file.size / 1024 / 1024 < 500;
      this.fileInfo = file;
      // if (!isLt2M) {
      //   this.$message.error('上传文件大小大小不能超过 500MB!');
      //   return isLt2M;
      // }
    },
    multipartUpload (chunkUploadUrls, chunkSize) {
      return new Promise((resolve1) => {
        var list = [];
        let uploadNum = 0;
        for (var item of chunkUploadUrls) {
          //分片开始位置
          let start = (item.partNumber) * chunkSize
          //分片结束位置
          let end = Math.min(this.fileSize, start + chunkSize)
          //取文件指定范围内的byte，从而得到分片数据
          let _chunkFile = this.fileB.slice(start, end)
          console.log("开始上传第" + uploadNum + "个分片")

          let pro = new Promise((resolve) => {
            this.$api.multipartUpload(item.uploadUrl, _chunkFile).then(res => {
              console.log(res, "res=")
              console.log("完成上传第" + uploadNum + "个分片")
              // list.push(this.taskList);
              uploadNum++;
              this.taskList++;
              this.percentage = Math.floor((uploadNum / chunkUploadUrls.length) * 100)
              resolve(this.taskList++);
              if (this.percentage <= 80) {
                this.percentage += 10;
              }
            });
          });
          list.push(pro);
        }
        resolve1(list);
      });



    },
    uploadFile (formName) {
      console.log(formName);
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.out5M) {//大于5m使用分片上传
            this.dialogTableVisible = false;
            this.uploadProcessVisible = true;
            const chunkSize = 5 * 1024 * 1024;
            var uploadFileName = uuidv4() + "." + this.fileInfo.name.substring(this.fileInfo.name.lastIndexOf('.') + 1);;
            console.log(uploadFileName);
            const chunkCount = Math.ceil(this.fileSize / chunkSize);
            console.log(this.fileInfo);
            this.$api.createMultipartUpload(uploadFileName, chunkCount).then(async res => {
              console.log("当前文件上传情况：初次上传 或 断点续传")
              console.log(res.data);
              if (res.code === 1) {
                var chunkUploadUrls = res.data.chunks;

                var wait = await this.multipartUpload(chunkUploadUrls, chunkSize);
                Promise.all(wait)
                  .then(resultList => {
                    const completeDate = { uploadId: res.data.uploadId, fileName: this.fileInfo.name, uploadName: uploadFileName, chunkSize: chunkCount, fileSize: this.fileSize, contentType: this.fileInfo.type, expire: this.form.expire, pass: this.form.pass, maxGetCount: this.form.maxGetCount };
                    this.$api.completeMultipartUpload(completeDate).then(res => {
                      if (res.code === 1) {
                        console.log("合并文件完毕");
                        const data = res.data;
                        this.dialogTableVisible = false;
                        this.percentage = 0;
                        this.uploadProcessVisible = false;
                        this.tackCode = data.takeCode;
                        this.downloadUrl = data.url;
                        this.uploadSuccess = true;
                      } else {
                        this.percentage = 0;
                        this.uploadProcessVisible = false;
                      }
                    })
                  });
              } else {
                this.uploadProcessVisible = false;
              }

            });
          } else {
            this.dialogTableVisible = false;
            this.uploadProcessVisible = true;
            this.percentage = 90;
            this.$api.upload(this.form, this.file).then(res => {
              if (res.code === 1) {
                const data = res.data;
                console.log(data);
                // this.uploadProcessVisible = false;
                this.tackCode = data.takeCode;
                this.downloadUrl = data.url;
                this.uploadProcessVisible = false;
                this.uploadSuccess = true;
                this.percentage = 0;
              } else {
                this.uploadProcessVisible = false;
                this.percentage = 0;
              }
            });
          }

        } else {
          return false;
        }
      });
    },
    uploadContent () {
      // console.log(formName, "form name");
      this.$refs["contentForm"].validate(valid => {
        if (valid) {
          this.$api.uploadContent(this.contentForm).then(res => {
            if (res.code === 1) {
              this.dialogContentVisible = false;
              const data = res.data;
              this.tackCode = data.takeCode;
              this.downloadUrl = data.url;
              this.uploadSuccess = true;
            }
          })
        } else {
          return false;
        }
      })
    },
    onCopy () {
      this.$message({
        message: '已成功复制到粘贴板',
        type: 'success'
      });
    },
    takeFileForm (formName) {
      //先检查文件是否有密码
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.needPass) {
            this.$api.checkPass(this.takeForm.code).then(res => {
              if (res.code === 1) {
                const data = res.data;
                if (data) {
                  //需要密码
                  console.log(data, "是否需要密码：")
                  //弹出密码输入框
                  this.needPass = true;
                } else {
                  this.needPass = false;
                  this.downloadFile(this.takeForm.code, this.takeForm.pass);
                }
              }
            })
          } else {
            this.needPass = false;
            this.downloadFile(this.takeForm.code, this.takeForm.pass);
          }
        } else {
          return false;
        }
      })


    },
    downloadFile (code, pass) {
      //先查一下文件信息
      this.$api.getFileInfo(code, pass).then(res => {
        if (res.code === 1) {
          const data = res.data;
          var type = data.type;
          this.tackCodeFormVisible = false;
          if (type === "FILE") {
            // window.location.href = this.$api.getFileDownloadUrl(code, pass);
            window.open(this.$api.getFileDownloadUrl(code, pass)); // 跳转到新的域名
            window.history.back(-1); // 返回到上一页（在当前窗口 ）
            this.tackCodeFormVisible = false;
          } else {
            this.$api.take(code, pass).then(res => {
              if (res.code === 1) {
                this.content = res.data;
                this.takeContentVisible = true;
                this.tackCodeFormVisible = false;
              }
            })
          }
        }
      })

    },
    receiveFile () {
      this.tackCodeFormVisible = true;
      // this.$refs["takeForm"].resetFields();
    },
    customColorMethod (percentage) {
      return '#67c23a';
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.hello {
  top: 100px;

  .upload-button {
    width: 224px;
    height: 49px;
    border-radius: 10px;
    font-size: 15px;
  }

  .receive-button {
    margin-top: 15px;
    width: 224px;
    height: 49px;
    border-radius: 10px;
    font-size: 15px;
  }

  .logo {
    margin-bottom: 100px;
  }

}

.file-list {
  height: 50px;
  width: calc(100% - 14px);
  text-align: left;
  background: #ccc;
  line-height: 50px;
  padding-left: 15px;
  margin-bottom: 15px;
}

.app-form {
  ::v-deep .el-form-item {
    margin-bottom: 0;
  }
}

.app-dialog-box {
  border-radius: 10px;
}

.popup-title {
  font-size: 20px;
  margin-top: 0px;
  color: #0c0c0c;
}

#receive-code {
  font-size: 30px;
  margin-top: 10px;
  margin-bottom: 10px;
  color: #0c0c0c;
}
</style>
