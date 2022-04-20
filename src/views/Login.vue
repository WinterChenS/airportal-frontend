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
            v-show="radio1==='登录'"
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            >
              <el-form-item label="用户名" prop="username">
                <el-input v-model="ruleForm.userName" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="ruleForm.pass" placeholder="" show-password></el-input>
              </el-form-item>
              <el-form-item class="btns">
                <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
              </el-form-item>
            </el-form>
            <el-form 
            :model="registerForm"
            :rules="registerRules"
            ref="registerForm"
            v-show="radio1==='注册'"
            >
              <el-form-item label="昵称" prop="nikeName">
                <el-input v-model="registerForm.nikeName" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="registerForm.email" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="用户名" prop="username">
                <el-input v-model="registerForm.userName" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="registerForm.pass" placeholder="" show-password></el-input>
              </el-form-item>
              <el-form-item class="btns">
                <el-button type="primary" @click="submitRegisterForm('registerForm')">注册</el-button>
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
        var validateEmail = (rule, value, callback) => {
            const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)*@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
            if (regEmail.test(value)) {
                // 合法的邮箱
                callback();
            } else {
                callback(new Error('请输入合法的邮箱'));
            }
        };
        var validateNikeName = (rule, value, callback) => {
            if(value.length < 1) {
                callback(new Error("昵称不能少于一个字符"));
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
            registerRules: {
                userName: [{
                    validator: validateUsername,
                    trigger: "blur"
                }],
                pass: [{
                    validator: validatePassword,
                    trigger: "blur"
                }],
                nickName: [{
                    validator: validateNikeName,
                    trigger: "blur"
                }],
                email: [{
                    validator: validateEmail,
                    trigger: "blur"
                }]
            },
            radio1: '登录',
            registerForm: {
                nickname: "",
                userName: "",
                pass: "",
                email: ""
            }
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
        submitRegisterForm(formName) {
            sessionStorage.clear()
            sessionStorage.clear()
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$api.register(this.registerForm).then(res => {
                        debugger
                        if (res.code === 1) {
                            const data = res.object;
                            sessionStorage.setItem("token", res.data.token);
                            
                                    this.$message({
                                        type: "success",
                                        message: "注册成功!"
                                    });
                                    sessionStorage.setItem("user", JSON.stringify(res.data));
                                    this.radio1='登录'
                                    // todo: 回填用户名
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
    align-items: center;
    justify-content: center;
    height: 80vh;
}
</style>
