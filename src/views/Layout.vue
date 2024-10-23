
<script setup>
import {
    Management,
    Promotion,
    UserFilled,
    User,
    Crop,
    EditPen,
    SwitchButton,
    CaretBottom,
    Lock,
    Setting,
    Tools,
    DataAnalysis,
    DataBoard,
    Operation,
    House
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'

//调用函数 获取用户信息
import { userInfoService } from '@/api/user';
import useUserInfoStore  from '@/stores/userInfo';
import {useTokenStore}  from '@/stores/token.js';
const userInfoStore=useUserInfoStore()
const tokenStore=useTokenStore()
const getUserInfo=async function(){
        //调用接口
    let result =await userInfoService()
    //数据存储到pinia中
    userInfoStore.setInfo(result.data)

}
getUserInfo()  
import { useRouter } from 'vue-router';
const router=useRouter()
import { ElMessage,ElMessageBox } from 'element-plus';

//条目被点击后，调用的函数
const handleCommand=(command)=>{
    //判断指令
    if(command==='logout'){
        //退出登录
    //提示框
    ElMessageBox.confirm(
    '你确认要退出吗?',
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
        //退出登录
        // 清除pinia token和userinfo
        tokenStore.removeToken()
        userInfoStore.removeInfo()
        // 回到登录界面
        router.push('/login')
      ElMessage({
        type: 'success',
        message: '退出登录成功',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '用户取消退出登录',
      })
    })

    }else if(command==='index'){
        router.push('/'+command)
    }else{
        //路由
        router.push('/user/'+command)
    }
}
//分权管理
import { navPermissionListService } from '@/api/nav';
import { ref, watch } from 'vue';
const navPermissionModal=ref()
const permissionNameModel=ref([])
import { useNavMenuStore } from '@/stores/navMenu';
const navMenu=useNavMenuStore()
import {useMenuStore}from '@/stores/menu';
const menu=useMenuStore()
const navMenuList=async function(){
    let result= await navPermissionListService();
    console.log(result.data)
    navPermissionModal.value=result.data.permissions
    navPermissionModal.value.forEach(permission => {
    permissionNameModel.value.push(permission.name); // 将权限名称添加到 permissionNameModel
    });
    navMenu.setNavMenu(navPermissionModal.value.length)
    menu.setMenuList(permissionNameModel.value)
}
navMenuList()
import { permissionParentChildService } from '@/api/permission';
const permissionParentChildList=ref([])
const permissionParentChild=async function(){
    let result=await permissionParentChildService()
    permissionParentChildList.value=result.data
    console.log(result.data)
}
permissionParentChild()
watch(() => navMenu.navMenuCount,()=>{
    location.reload()
     navMenuList()
  
})
const hasMenu= function(permission){
    return  permissionNameModel.value.includes(permission)
}
const iconComponents = [
  { name: 'Management', component: Management },
  { name: 'Promotion', component: Promotion },
  { name: 'Lock', component: Lock },
  { name: 'Tools', component: Tools },
  { name: 'UserFilled', component: UserFilled },
  { name: 'User', component: User },
  { name: 'Crop', component: Crop },
  { name: 'EditPen', component: EditPen },
  { name: 'DataAnalysis', component: DataAnalysis },
  { name: 'DataBoard', component: DataBoard },
  { name: 'Operation', component: Operation }
];
 // 转换图标名称到组件
 const getIconComponent = (iconName) => {
   
  const icon = iconComponents.find(icon => icon.name === iconName);
  console.log(icon)
  return icon ? icon.component : null;
};
</script>

<template>
    <!-- elemnet-plus 中的容器 -->
    <el-container class="layout-container">
        <!-- 左侧菜单 -->
        <el-aside width="200px">
            <div class="el-aside__logo"></div>
            <!-- 菜单标签 -->
            <el-menu  active-text-color="#ffd04b"  background-color="#232323"  text-color="#fff"
                router>
                <template v-for="item in permissionParentChildList">
                <el-sub-menu  
                v-if="item.parentId === 0"
                :index="item.url"
                >
                    <template #title>
                        <el-icon>
                            <component :is="getIconComponent(item.icon)"/>
                        </el-icon>
                        <span>{{ item.name }}</span>
                    </template>
                    <el-menu-item  v-for="chilren in item.childrenList"
                        :index="chilren.url"
                        :key="chilren.url" >
                        <el-icon>
                            <component :is="getIconComponent(chilren.icon)"  />
                        </el-icon>
                        <span>{{ chilren.name }}</span>
                    </el-menu-item>
                </el-sub-menu>
            </template >
            </el-menu>
        </el-aside>
        <!-- 右侧主区域 -->
        <el-container>
            <!-- 头部区域 -->
            <el-header>
                <div>{{ userInfoStore.info.roleName }}：<strong>{{ userInfoStore.info.nickname }}</strong></div>
                <!-- 下来菜单 -->
                <!-- command:条目被点击后会触发，在时间函数上，可以声明一个参数，接收条目对应的指令 -->
                <el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <el-avatar :src="userInfoStore.info.userPic?userInfoStore.info.userPic:avatar" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item  command="index" :icon="House">首页</el-dropdown-item>
                            <!-- <el-dropdown-item v-if="hasMenu('基本资料')" command="info" :icon="User">基本资料</el-dropdown-item>
                            <el-dropdown-item v-if="hasMenu('更换头像')" command="avatar" :icon="Crop">更换头像</el-dropdown-item>
                            <el-dropdown-item v-if="hasMenu('重置密码')" command="resetPassword" :icon="EditPen">重置密码</el-dropdown-item> -->
                            <el-dropdown-item  command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <!-- 中间区域 -->
            <el-main>
                <!-- <div style="width: 1290px; height: 570px;border: 1px solid red;">
                    内容展示区
                </div> -->
                <router-view/>
            </el-main>
            <!-- 底部区域 -->
            <el-footer> ©2025 </el-footer>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
    height: 100vh;

    .el-aside {
        background-color: #232323;

        &__logo {
            height: 120px;
            background: url('@/assets/login_title.png') no-repeat center / 120px auto;
        }

        .el-menu {
            border-right: none;
        }
    }

    .el-header {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-dropdown__box {
            display: flex;
            align-items: center;

            .el-icon {
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }
}
</style>
```



