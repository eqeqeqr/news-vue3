//定制请求的实例

//导入axios  npm install axios
import axios from 'axios';
//定义一个变量,记录公共的前缀  ,  baseURL
// const baseURL = 'http://localhost:8080';
const baseURL = '/api';
const instance = axios.create({baseURL})
import { ElMessage } from 'element-plus'
import { useTokenStore } from '@/stores/token';
// import {useRouter} from '@/router';
// const router=useRouter()
import router  from '@/router/index.js';
//添加请求拦截器
instance.interceptors.request.use(
    (config)=>{
        //添加请求前的回调

        //添加token
        const tokenStore=useTokenStore();
        //判断有没有token
        if(tokenStore.token){
            config.headers.Authorization=tokenStore.token
        }
        return config;
    },
    (err)=>{
            //请求错误的回调
            Promise.reject(err)
    }
)
//添加响应拦截器
instance.interceptors.response.use(
    result=>{
          // 判断响应类型
          if (result.config.responseType === 'blob') {
            return result; // 返回原始 blob 响应
        }
        //判断业务状态码
        if(result.data.code===0){
        return result.data;//返回的是后台给到的code data message
        }
        //操作失败
        //alert(result.data.message?result.data.message:'服务异常')
        ElMessage.error(result.data.message?result.data.message:'服务异常')
        if(result.data.message==='当前用户无权限'){
            router.push('/backend')
        }
        ////异步的状态转化成失败的状态
        return Promise.reject(result.data)
    },
    err=>{
        //判断响应状态码，如果是401则未登录提示请登录，并跳转到登录界面
        if(err.response.status===401){
            ElMessage.error('请先登录')
            router.push('/login')
        }else{
            ElMessage.error('服务异常')
        }
        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)

export default instance;