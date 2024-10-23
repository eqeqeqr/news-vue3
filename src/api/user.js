//导入request.js工具
import request from '@/util/request.js'

//注册接口函数
export const userRegisterService=function(registerData){
    //借助UrlSearchParams完成x-www-form-urlencoded参数格式
    const params=new URLSearchParams()
    for(let key in registerData){
        params.append(key,registerData[key])
    }
    return request.post('/user/register',params);
}
//登录接口函数
export const userLoginService=function(loginData){
    //借助UrlSearchParams完成x-www-form-urlencoded参数格式
    const params=new URLSearchParams()
    for(let key in loginData){
        params.append(key,loginData[key])
    }
    return request.post('/user/login',params);
}
//获取用户信息
export const userInfoService=()=>{
    return request.get('/user/userInfo')
}
//修改个人信息
export const userInfoUpdateService=(userInfoData)=>{
    return request.put('/user/update',userInfoData)
}
 //修改头像
 export const userAvatarUpdateService=(avatarUrl)=>{
    const params=new URLSearchParams();
    params.append('avatarUrl',avatarUrl)
    return request.patch('/user/updateAvatar',params)
 }
//修改密码
export const userPasswordUpdateService=(passwordData)=>{
    return request.patch('/user/updatePwd',passwordData)
}
//获取全部用户
export const userListService=function(){
    return request.get('/user/list')
}
//获取验证码
export const userVerifyCodeService=function(email){
    //x-www-form-urlencoded参数格式
    const params = new URLSearchParams();
    params.append('email', email);
    return request.post('/user/sendEmail',params)
}
//忘记密码设置新密码
export const userForgetPasswordService=function(forgetData){
    return request.patch('/user/forgetPwd',forgetData)
}