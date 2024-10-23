<script setup>
import { ref } from 'vue'

const passwordData = ref({
    old_pwd:'',
    new_pwd:'',
    re_pwd:''
})
const rules = {
    old_pwd: [
        { required: true, message: '请输入原密码', trigger: 'blur' },
        {
            pattern: /^\S{5,16}$/,
            message: '昵称必须是5-16位的非空字符串',
            trigger: 'blur'
        }
    ],
    new_pwd: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        {
            pattern: /^\S{5,16}$/,
            message: '昵称必须是5-16位的非空字符串',
            trigger: 'blur'
        }
    ],
    re_pwd: [
        { required: true, message: '请再次输入新密码', trigger: 'blur' },
        {
            pattern: /^\S{5,16}$/,
            message: '昵称必须是5-16位的非空字符串',
            trigger: 'blur'
        }
    ],
}
//修改密码
import { userPasswordUpdateService } from '@/api/user';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useTokenStore } from '@/stores/token';
import useUserInfoStore from '@/stores/userInfo';


const tokenStore=useTokenStore()
const userInfoStore=useUserInfoStore()
const router=useRouter()
const updatePasswod=async function(){
    let result =await userPasswordUpdateService(passwordData.value)
    tokenStore.removeToken()
    userInfoStore.removeInfo()
    router.push('/login')
    ElMessage.success("修改成功,请重新登录")
}

</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>基本资料</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="passwordData" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="原密码" prop="old_pwd">
                        <el-input v-model="passwordData.old_pwd" type="password" placeholder="请输入原密码" ></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="new_pwd">
                        <el-input v-model="passwordData.new_pwd" type="password" placeholder="请输入新密码"></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码" prop="re_pwd">
                        <el-input v-model="passwordData.re_pwd" type="password" placeholder="请再次输入新密码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updatePasswod">提交修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>