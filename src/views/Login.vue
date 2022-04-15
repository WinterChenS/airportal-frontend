<template>
    <div class="login">
        <div class="login-box">
        <div>
            <el-radio-group v-model="radio1">
            <el-radio-button label="登录"></el-radio-button>
            <el-radio-button label="注册"></el-radio-button>
            <el-radio-button label="重置"></el-radio-button>
            </el-radio-group>
        </div>
            <el-form 
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            >
              <el-form-item label="用户名" prop="username">
                <el-input v-model="ruleForm.userName" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="ruleForm.pass" placeholder=""></el-input>
              </el-form-item>
              <el-form-item class="btns">
                <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
              </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import qs from "qs";
import {
    request
} from "../api/request.js";

var interval = null
export default {

    data() {
        var validateUsername = (rule, value, callback) => {
            if (value.trim() === "") {
                callback(new Error("请输入用户名"));
            } else {
                callback();
            }
        };
        var validatePassword = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error("密码不能少于6位"));
            } else {
                callback();
            }
        };
        return {
            ruleForm: {
                userName: "",
                pass: ""
            },
            rules: {
                userName: [{
                    validator: validateUsername,
                    trigger: "blur"
                }],
                pass: [{
                    validator: validatePassword,
                    trigger: "blur"
                }]
            },
            radio1: '登录',
        };
    },
    mounted() {
    

    },
    methods: {
       
        submitForm(formName) {
            sessionStorage.clear()
            sessionStorage.clear()
            this.$refs[formName].validate(valid => {
                if (valid) {

                    this.$api.login(this.ruleForm).then(res => {
                        if (res.code === 1) {
                            const data = res.object;
                            sessionStorage.setItem("token", res.data.token);
                            
                                    this.$message({
                                        type: "success",
                                        message: "登陆成功!"
                                    });
                                    sessionStorage.setItem("user", JSON.stringify(res.data));
                                    this.$router.push("/");
                            
                            
                                }
                            });
                } else {
                    return false;
                }
            });
        },
        openDownFile() {
            // this.$refs.helpDialog.init();
        },
        download(key) {
            // this.$refs.helpDialog.download(key);
        },
        changeInput() {
            this.$refs.passwordFocus.focus()
        },
        changePos() {
            let width = document.documentElement.clientWidth;
            let height = document.documentElement.clientHeight;
            this.Hoffset = this.$refs.thediv.offsetHeight;
            this.Woffset = this.$refs.thediv.offsetWidth;
            this.$refs.thediv.style.left = (this.xPos + document.body.scrollLeft + document.documentElement.scrollLeft) +
                "px";
            this.$refs.thediv.style.top = (this.yPos + document.body.scrollTop + document.documentElement.scrollTop) + "px";
            if (this.yon) {
                this.yPos = this.yPos + this.step;
            } else {
                this.yPos = this.yPos - this.step;
            }
            if (this.yPos < 0) {
                this.yon = 1;
                this.yPos = 0;
            }
            if (this.yPos >= (height - this.Hoffset)) {
                this.yon = 0;
                this.yPos = (height - this.Hoffset);
            }
            if (this.xon) {
                this.xPos = this.xPos + this.step;
            } else {
                this.xPos = this.xPos - this.step;
            }
            if (this.xPos < 0) {
                this.xon = 1;
                this.xPos = 0;
            }
            if (this.xPos >= (width - this.Woffset)) {
                this.xon = 0;
                this.xPos = (width - this.Woffset);
            }
        },
        clearFdAd() {
            clearInterval(interval)
        },
        starFdAd() {
            interval = setInterval(this.changePos, 20)
        },
        closeFrame() {
            interval = null
            this.frameShow = false
        },
        async getSysPopUpWindowInfoFn() {
            let res1 = await this.$api.getFloatWindowSetting()
            let code = res1.object.code
            let res = {}
            if (code === "1") {
                res = await this.$api.getCountryNotice();
            } else {
                res = await this.$api.getSysPopUpWindowInfo();
            }
            if (res.object.popUpWindowContent && res.object.popUpWindowTitle) {
                this.frameShow = true
                this.popUpWindowForm = {
                    popUpWindowContent: res.object.popUpWindowContent,
                    popUpWindowTitle: res.object.popUpWindowTitle
                }
                interval = setInterval(this.changePos, 20)
            } else {
                this.frameShow = false
                clearInterval(interval)
            }
        },
        getSystemTitleAndBackgroundImg() {
            this.$api.getSystemTitleAndBackgroundImg().then((res) => {
                if (res.code === 1) {
                    this.loginTitle = res.object.systemTitleLogo || '';
                    this.loginBackgroundImg = res.object.backgroundImg || '';
                    this.loginFrameImg = res.object.loginFrameImg || '';
                    this.loginBoxImg = res.object.loginBoxImg || '';
                    // this.loginBoxImg = res.object.systemTitleLogo || '';
                    let iconImg= res.object.labelIcon || '/ewell.ico';

                    document.querySelector('link[type="image/x-icon"]').href=iconImg;

                    if (res.object.systemTitleName) {
                        document.title = res.object.systemTitleName
                    }
                }
            })
        }
    },
    beforeDestroy() {
        this.$once('hook:beforeDestroy', () => {
            clearInterval(interval)
            this.frameShow = false
        })
    }
}
</script>

<style lang="scss" scoped>
.login {
    display: flex;
    flex-direction: column;
    
    .login-box {
        height: 100px;
        justify-content: center; /* 水平居中 */
        align-items: center;     /* 垂直居中 */
        height: calc(100vh - 80px);
        width: calc(100vh - 680px);
    }
}
</style>
