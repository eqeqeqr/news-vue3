import request from '@/util/request.js'
//获取用户角色信息
export const userRoleListService=function(params){
    return request.get('/userRole',{params:params})
}
//修改用户角色
export const userRoleUpdateService=function(params){
    return request.put('/userRole',params)
}
//删除用户角色
export const userRoleDeleteService=function(userId,roleId){
    return request.delete('/userRole',{
        params:{
         userId:userId,
         roleId:roleId   
        }
    })
}
//添加
export const userRoleInsertService=function(params){
    return request.post('/userRole',params)
}