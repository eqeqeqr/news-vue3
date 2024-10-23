//导入路由
import {createRouter, createWebHistory} from 'vue-router'
//导入组件
import LoginVue from '@/views/Login.vue'
import LayoutVue from '@/views/Layout.vue'
import IndexVue from '@/views/Index.vue'
import ArticleIndexVue from '@/views/index/ArticleIndex.vue'
import ArticleDetialVue from '@/views/index/ArticleDetail.vue'
import ArticleCategoryVue from '@/views/article/ArticleCategory.vue'   
import ArticleManageVue from '@/views/article/ArticleManage.vue'
import UserInfoVue from '@/views/user/UserInfo.vue'
import UserAvatarVue from '@/views/user/UserAvatar.vue'
import UserResetPasswordVue from '@/views/user/UserResetPassword.vue'
import PermissionVue from '@/views/permission/Permission.vue'
import RoleVue from '@/views/permission/Role.vue'
import RolePermissionVue from '@/views/permission/RolePermission.vue'
import UserRoleVue from '@/views/permission/UserRole.vue'
import ArticleStatistics from '@/views/statistics/ArticleStatistics.vue'

//定义路由关系
const allMenus = [
            {  path:'/backend/article/category',component:ArticleCategoryVue},
            {  path:'/backend/article/manage',component:ArticleManageVue},
            {  path:'/backend/user/info',component:UserInfoVue},
            {  path:'/backend/user/avatar',component:UserAvatarVue},
            {  path:'/backend/user/resetPassword',component:UserResetPasswordVue},
            {  path:'/backend/permission',component:PermissionVue},
            {  path:'/backend/role',component:RoleVue},
            {  path:'/backend/userRole',component:UserRoleVue},
            {  path:'/backend/rolePermission',component:RolePermissionVue},
            {  path:'/backend/statistics',component:ArticleStatistics},
]

const routes=[
    {path:'/',redirect:'/index'},
    {path:'/login',component:LoginVue},
    {
        path:'/backend',
        component:LayoutVue,
        redirect:'/backend/user/info',
        children:allMenus
    },
    {path:'/index',component:IndexVue,redirect:'/index/article',
        children:[
            {path:'/index/article',component:ArticleIndexVue},
            {path:'/index/detail/:id',component:ArticleDetialVue},
]},
    {path:'/A',component:import('@/views/index/A.vue')}
]

//创建路由器

const router=createRouter({
    history:createWebHistory(),
    routes:routes,

})

export default router
