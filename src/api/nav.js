import request from '@/util/request.js'
//获取导航栏数据
export const navPermissionListService=function(){
  return  request.get('/rolePremission')
}