
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
    Operation
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import useUserInfoStore from '@/stores/userInfo'
import { useTokenStore } from '@/stores/token';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
const userInfoStore = useUserInfoStore()
const tokenStore = useTokenStore()
const router = useRouter()
const loginState=ref(false)
import { ElMessage, ElMessageBox } from 'element-plus'
const handleCommand = (command) => {
    switch(command){
        case '/backend':
        router.push(command)
            break;
        case 'logout':
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
            }
            break;
        case '/login':
           router.push(command)
            break;
    }
}
const checkLogin=()=>{
    if(!tokenStore.token){
        loginState.value=false
    }else{
        console.log(tokenStore.token)
        console.log(userInfoStore.info)
        loginState.value=true
    }
}
checkLogin()
</script>

<template>
    <el-container class="layout-container">
        <!-- 右侧主区域 -->
        <el-container>
            <!-- 头部区域 -->
            <el-header style="background-color: red;height: 10vh;">
                <div><strong style="font-size: 50px;color: aliceblue;margin-left: 50px">首页</strong></div>
                <el-dropdown placement="bottom-end" @command="handleCommand" v-if="loginState">
                    <span class="el-dropdown__box">
                        <el-avatar :src="userInfoStore.info.userPic?userInfoStore.info.userPic:avatar" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="/backend" :icon="User">服务中心</el-dropdown-item>
                            <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-dropdown placement="bottom-end" @command="handleCommand" v-else>
                    <span class="el-dropdown__box">
                        <el-avatar :src="userInfoStore.info.userPic?userInfoStore.info.userPic:avatar" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="/login" :icon="User">登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <!-- 中间区域 -->
            <el-main style="margin-bottom: 0px;padding-bottom: 0;"> 
                   <router-view/>
            </el-main>

        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
    height: 100vh;


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


