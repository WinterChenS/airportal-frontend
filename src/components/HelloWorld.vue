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
    <el-dialog title="" :showClose="false" :visible.sync="dialogTableVisible" custom-class="app-dialog-box">
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

    <el-dialog title="" :showClose="false" :visible.sync="dialogContentVisible" custom-class="app-dialog-box">
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


    <el-dialog title="取件" :visible.sync="tackCodeFormVisible">
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
    <el-dialog title="取件" :visible.sync="takeContentVisible">
      <el-input type="textarea" :rows="10" placeholder="" v-model="content" size="medium" :clearable="true">
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-clipboard:copy="content" v-clipboard:success="onCopy">复 制</el-button>
      </div>
    </el-dialog>
    <el-dialog title="" :visible.sync="uploadSuccess" width="30%">
      <p class="popup-title">文件已成功发送</p>
      <p>您的取件码</p>
      <p id="receive-code">{{ tackCode }}</p>
      <p>接收文件时，请输入该6位数取件码</p>
      <p>您也可以 <a class="link" v-clipboard:copy="downloadUrl" v-clipboard:success="onCopy">复制下载链接</a>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="uploadSuccess = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="" :visible.sync="uploadProcessVisible">
      <el-progress :percentage="percentage" :color="customColorMethod"></el-progress>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="uploadProcessVisible = false">确 定</el-button>
      </div>
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
      if (value.length !== 6) {
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
    };
  },
  methods: {
    async upload (e) {
      let formData = new FormData()
      formData.append("file", e.file)
      console.log(formData)
      this.file = formData;
    },
    handleChange (file, fileList) {
      this.hasFile();
      this.fileList = fileList.slice(-3);
    },
    hasFile () {
      this.dialogTableVisible = true;
    },
    beforeUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 500;
      if (!isLt2M) {
        this.$message.error('上传文件大小大小不能超过 500MB!');
        return isLt2M;
      }
    },
    uploadFile (formName) {
      console.log(formName);
      this.$refs[formName].validate(valid => {
        if (valid) {
          const config = {
            onUploadProgress: progressEvent => {
              // progressEvent.loaded:已上传文件大小
              // progressEvent.total:被上传文件的总大小
              this.percentage = Number((progressEvent.loaded / progressEvent.total * 100).toFixed(2))
            }
          }
          this.dialogTableVisible = false;
          this.uploadProcessVisible = true;
          this.$api.upload(this.form, this.file).then(res => {
            if (res.code === 1) {
              const data = res.data;
              console.log(data);
              this.uploadProcessVisible = false;
              this.uploadSuccess = true;
              this.tackCode = data.takeCode;
              this.downloadUrl = data.url;
            } else {
              this.uploadProcessVisible = false;
            }
          });
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
              this.uploadSuccess = true;
              this.tackCode = data.takeCode;
              this.downloadUrl = data.url;
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
          if (type === "FILE") {
            window.location.href = this.$api.getFileDownloadUrl(code, pass);
          } else {
            this.$api.take(code, pass).then(res => {
              if (res.code === 1) {
                this.content = res.data;
                this.takeContentVisible = true;
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
      if (this.percentage < 30) {
        return '#909399';
      } else if (this.percentage < 70) {
        return '#e6a23c';
      } else {
        return '#67c23a';
      }
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
