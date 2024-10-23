
<script setup>
import { User, Lock ,Message} from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
//控制注册与登录表单的显示， 默认显示注册
const isRegister = ref(false)
const isLogin = ref(true)
const isForget=ref(false)
// 定义注册数据模型
const registerData=ref({
    username: '',
    password: '',
    rePassword: '',
    code:'',
    email:''
})
// 定义登录数据模型
const loginData=ref({
    username: '',
    password: '',
})
// 定义表单校验规则
const validatePass=function(rule,value,callback){
    if(value===''){
        callback(new Error('请再次确认密码'))
    }else if(value!==registerData.value.password){
        callback(new Error('请确保两次输入的密码一样'))

    } else{
        callback()
    }
}
// 定义表单校验规则
const validatePass2=function(rule,value,callback){
    if(value===''){
        callback(new Error('请再次确认密码'))
    }else if(value!==forgetData.value.new_pwd){
        callback(new Error('请确保两次输入的密码一样'))

    } else{
        callback()
    }
}
const rules={
     code:[
    { required: true, message: '请输入验证码', trigger: 'blur' },
    ],
    username:[
        { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 16, message: '长度为 5 - 16非空字符', trigger: 'blur' },
],
    password:[
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 5, max: 16, message: '长度为 5 - 16非空字符', trigger: 'blur' },
    ],
   
    rePassword:[{ validator: validatePass, trigger: 'blur' },
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 5, max: 16, message: '长度为 5 - 16非空字符', trigger: 'blur' },
    ],

    new_pwd:[
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 5, max: 16, message: '长度为 5 - 16非空字符', trigger: 'blur' },
    ],
    re_pwd:[{ validator: validatePass2, trigger: 'blur' },
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 5, max: 16, message: '长度为 5 - 16非空字符', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
    ]
    
}
//调用后台接口,完成注册

import { userRegisterService  } from '@/api/user.js';
const register=async function(){
    //registerData是一个响应式对象,需要使用value获取值
   let result= await userRegisterService(registerData.value)
//    if(result.code===0){
//     //成功了
//     alert(result.msg?result.msg:"注册成功")
//    }else{
//     //s失败了
//     alert("注册失败")
//    }
   //alert(result.message?result.message:"注册成功")
   ElMessage.success(result.message==='操作成功'?"注册成功":result.message)
   //跳转到登录首页 借助路由完成
  
}

//调用后台接口,完成登录
import { useRouter } from 'vue-router';
const router= useRouter();

import { useTokenStore } from '@/stores/token';
const tokenStore=useTokenStore()
import { userLoginService  } from '@/api/user.js';
const login=async function(){
    //loginData是一个响应式对象,需要使用value获取值
   let result= await userLoginService(loginData.value)
//    if(result.code===0){
//     //成功了
//     console.log(result)
//     alert(result.message?result.message:"登录成功")
//    }else{
//     //失败了
//     alert("登录失败")
//    }
 //  alert(result.msg?result.message:"登录成功")
 ElMessage.success(result.message==='操作成功'?"登录成功":result.message)
    //跳转到首页 借助路由完成
   
    tokenStore.setToken(result.data)//存token
    getUserInfo()
    router.push('/index')
}
import { userInfoService } from '@/api/user';
import  useUserInfoStore  from '@/stores/userInfo.js';
const userInfoStore=useUserInfoStore()
const getUserInfo=async function(){
        //调用接口
    let result =await userInfoService()
    //数据存储到pinia中
    userInfoStore.setInfo(result.data)
}

// 清空数据
const clearRLData=function(){
    registerData.value={
        username: '',
        password: '',
        rePassword: ''
    }
    loginData.value={
        username: '',
        password: '',
    }
}

//倒计时
const countdown = ref(0)

const startCountdown= function () {
    countdown.value = 60; // 设置倒计时时间（秒）
    const timer = setInterval(() => {
        if (countdown.value > 0) {
            countdown.value--;
        } else {
          clearInterval(timer); // 倒计时结束时清除定时器
        }
    }, 1000);
}
import { userVerifyCodeService  } from '@/api/user.js';
const getVerifyCode=async function (email) {
      if (countdown.value === 0&&email) { 
        // 这里你可以调用发送验证码的 API
         startCountdown(); // 开始倒计时
        // 发送验证码逻辑
        let result=await userVerifyCodeService(email)
        ElMessage.success("发送成功")

      }
    }
//忘记密码
const active = ref(1)
const allowNext=ref(false)

const offsets=ref(3)
const forgetData = ref({
    step:'',
    new_pwd:'',
    re_pwd:'',
    email:'',
    code:'',
    username:''
})
import{userForgetPasswordService}from '@/api/user.js'
const userForgetPassword=async function(){
    allowNext.value=false
    let result=await userForgetPasswordService(forgetData.value)
    allowNext.value=true
    ElMessage.success("下一步")
}
const next = async () => {
    if(active.value===4){
        forgetData.value='';
        allowNext.value=false;
    }

    forgetData.value.step=active.value
    await userForgetPassword()
    if(allowNext.value){
        active.value++;
    }  
}
const previous = () => {
    if(active.value>1){
        active.value--
    }
}
const returnLogin=function(){
    offsets.value=3
    active.value=1
    allowNext.value=false
    forgetData.value={}
}



</script>
<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg" >
        </el-col>
        <el-col :span="6" :offset="offsets" class="form">
            <el-card style="height: 80vh;width: 42vw;" v-if="isForget">
                <template #header>忘记密码？</template>
                <el-steps style="width: 40vw;" :active="active" finish-status="success">
                <el-step title="输入账号" > </el-step>
                <el-step title="身份验证" ></el-step>
                <el-step title="重置密码" ></el-step>
                <el-step title="已完成" ></el-step>
                </el-steps>
            <!-- 找回密码表单 -->
            <el-form ref="form" size="large" autocomplete="off"  :model="forgetData" :rules="rules" >
                <el-form-item v-show="active===4">
                    <h1>密码重置成功</h1>
                </el-form-item>
                <el-form-item prop="username" v-show="active===1" style="margin-right: 20px;" label="账号">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="forgetData.username"></el-input>
                </el-form-item>
                <el-form-item prop="new_pwd" v-show="active===3" style="margin-right: 20px;"  label="新密码">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="forgetData.new_pwd"></el-input>
                </el-form-item>
                
                <el-form-item prop="re_pwd" v-show="active===3"style="margin-right: 20px;"  label="确认密码">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入再次密码" v-model="forgetData.re_pwd"></el-input>
                </el-form-item>
                <el-form-item prop="email" v-show="active===2" style="margin-right: 20px;"  label="邮箱">
                    <el-input :prefix-icon="Message" type="email" style="float: left;width: 70%;" placeholder="请输入邮箱" v-model="forgetData.email">
                    </el-input>
                    <el-button  class="button" type="primary" style="float: left;width: 25%;margin-left: 5%" auto-insert-space @click="getVerifyCode(forgetData.email)" >   {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}</el-button>
                </el-form-item>
                <el-form-item prop="code" v-show="active===2" style="margin-right: 20px;"  label="验证码">
                    <el-input :prefix-icon="Lock" type="code" placeholder="请输入验证码" v-model="forgetData.code"></el-input>
                </el-form-item>
            </el-form>
            <!-- 找回密码表单结束 -->
            <el-button style="margin-top: 12px;width: 74px;" @click="previous" :disabled="active === 4">上一步</el-button>
            <el-button style="margin-top: 12px;width: 74px;" @click="next"  :disabled="active === 4">下一步</el-button>
            <el-button style="margin-top: 12px;width: 74px;float: right;" @click=";returnLogin();isForget=false;isLogin=true;isRegister=false">返回</el-button>
          
            </el-card>
            <!-- 注册表单 -->
            <el-form ref="form" size="large" autocomplete="off" v-if="isRegister" :model="registerData" :rules="rules" >
                <el-form-item>
                    <h1>注册</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item prop="rePassword">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入再次密码" v-model="registerData.rePassword"></el-input>
                </el-form-item>
                <el-form-item prop="email">
                    <el-input :prefix-icon="Message" type="email" style="float: left;width: 70%;" placeholder="请输入邮箱" v-model="registerData.email">
                   
                    </el-input>
                    <el-button  class="button" type="primary" style="float: left;width: 25%;margin-left: 5%" auto-insert-space @click="getVerifyCode(registerData.email)" >   {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}</el-button>
                </el-form-item>
                <el-form-item prop="code">
                    <el-input :prefix-icon="Lock" type="code" placeholder="请输入验证码" v-model="registerData.code"></el-input>
                </el-form-item>
                <!-- 注册按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary"  auto-insert-space @click="register()">
                        注册
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isForget=false;isLogin=true;isRegister=false;clearRLData()">
                        ← 返回
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- 登录表单 -->
            <el-form ref="form" size="large" autocomplete="off" :model="loginData" :rules="rules" v-if="isLogin" >
                <el-form-item>
                    <h1>登录</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="loginData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="loginData.password"></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox>记住我</el-checkbox>
                        <el-link type="primary" :underline="false" @click="isForget=true;isLogin=false;isRegister=false;offsets=1;active=1">忘记密码？</el-link>
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="login()">登录</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isForget=false;isLogin=false;isRegister=true;clearRLData()">
                        注册 →
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
/* 样式 */
.login-page {
    height: 100vh;
    background-color: #fff;

    .bg {
        position: relative; /* 确保子元素可以使用 z-index */
        z-index: 1; /* 确保背景图在底层 */
        background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
            url('@/assets/login_bg.jpg') no-repeat center / cover;
        border-radius: 0 20px 20px 0;
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>


