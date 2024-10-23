import request from '@/util/request.js'
//获取所有角色
export const roleListService=function(){
    return request.get('/role')
}
//获取分页角色
export const rolePageService=function(parmas){
    return request.get('/role/pageList',{params:parmas})
}
//添加角色
export const roleAddService=function(parmas){
    return request.post('/role',parmas)
}
//删除角色
export const roleDeleteService=function(id){
    return request.delete(`/role?id=${id}`)
}
//修改角色
export const roleUpdateService=function(parmas){
    return request.put('/role',parmas)
}