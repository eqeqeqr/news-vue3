import request from '@/util/request.js'
//获取全部权限
export const permissionListService=function(){
    return request.get('/permission')
}
//获取父类菜单
export const permissionParentService=function(){
    return request.get('/permission/parentList')
}
//获取分页权限
export const permissionPageService=(params)=>{
    return request.get('/permission/pageList',{params:params})
}
//添加权限
export const permissionAddService=(params)=>{
    return request.post('/permission',params)
}
//删除
export const permissionDeleteService=(id)=>{
    return request.delete(`/permission?id=${id}`)
}
//获取父子菜单
export const permissionParentChildService=function(){
    return request.get('/permission/showList')
}