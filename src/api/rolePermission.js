import request from '@/util/request.js'
//获取全部角色权限信息
export const rolePermissionListService=(params)=>{
    return request.get('/rolePremission/pageList',{params:params})
}
//添加角色权限信息
export const rolePermissionAddService=(rolePermissionData)=>{
    return request.post('/rolePremission',rolePermissionData)
}
//删除角色权限信息
export const rolePermissionDeleteService=(roleId,permissionId)=>{
    return request.delete('/rolePremission',{params:{roleId:roleId,permissionId:permissionId}})
}