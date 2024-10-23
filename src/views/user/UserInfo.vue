<script setup>
import { ref } from 'vue'
import useUserInfoStore from '@/stores/userInfo';
const userInfoStore=useUserInfoStore();

const userInfo = ref({...userInfoStore.info})
const rules = {
    nickname: [
        { required: true, message: '请输入用户昵称', trigger: 'blur' },
        {
            pattern: /^\S{2,10}$/,
            message: '昵称必须是2-10位的非空字符串',
            trigger: 'blur'
        }
    ],
    email: [
        { required: true, message: '请输入用户邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
    ]
}
//修改个人信息
import { userInfoUpdateService } from '@/api/user';
import { ElMessage } from 'element-plus';
const updateUserInfo=async ()=>{
    let result =await userInfoUpdateService(userInfo.value);
    ElMessage.success("修改成功")
    //修改pinia的信息
    userInfoStore.setInfo(userInfo.value)
    showTable.value=false
}


import { computed } from 'vue'
import {
  Iphone,
  Location,
  Message,
  OfficeBuilding,
  Tickets,
  User,
  UserFilled,
} from '@element-plus/icons-vue'


const size = ref('large')

const iconStyle = computed(() => {
  const marginMap = {
    large: '8px',
    default: '6px',
    small: '4px',
  }
  return {
    marginRight: marginMap[size.value] || marginMap.default,
  }
})
const blockMargin = computed(() => {
  const marginMap = {
    large: '32px',
    default: '28px',
    small: '24px',
  }
  return {
    marginTop: marginMap[size.value] || marginMap.default,
  }
})
// 头像
const src =ref('https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg')
const showTable=ref(false)
const showUserInfo=()=>{
   showTable.value=!showTable.value
}

</script>
<template>
    <el-card class="page-container" style="height: 100vh;">
        <el-dialog v-model="showTable" :title="title" width="30%">
        <template #header v-if="showTable">
            <div class="header">
                <span>基本资料</span>
            </div>
        </template>
        <el-row v-if="showTable" style="width: 50vw;">
            <el-col :span="12">
                <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="登录名称" >
                        <el-input v-model="userInfo.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="用户昵称" prop="nickname">
                        <el-input v-model="userInfo.nickname"></el-input>
                    </el-form-item>
                    <el-form-item label="用户邮箱" prop="email">
                        <el-input v-model="userInfo.email"></el-input>
                    </el-form-item>
                    <el-form-item label="地址" prop="email">
                        <el-input v-model="userInfo.address"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateUserInfo">提交修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-dialog>
        <!-- 新的样式 -->
        <el-radio-group v-model="size">
  </el-radio-group>

  <el-descriptions
    class="margin-top"
    title="基本资料"
    :column="2"
    :size="size"
    border
  >

  <template #extra>
      <el-button type="primary" @click="showUserInfo" style="width: 150px;">操作</el-button>
    </template>  
    <el-descriptions-item>
      <template #label>
        <div class="cell-item" style="height: 200px">
          <el-icon :style="iconStyle">
            <UserFilled />
          </el-icon>
          头像
        </div>
      </template>
    <div class="demo-image__placeholder" >
    <div class="block">
      <el-image :src="userInfo.userPic?userInfo.userPic:src" />
        </div>
    </div>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <user />
          </el-icon>
          昵称
        </div>
      </template>
      {{ userInfo.nickname }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <user />
          </el-icon>
          用户名
        </div>
      </template>
      {{ userInfo.username }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <Message />
          </el-icon>
          邮箱
        </div>
      </template>
      {{ userInfo.email }}
    </el-descriptions-item>

    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <office-building />
          </el-icon>
          地址
        </div>
      </template>
      {{ userInfo.address }}
    </el-descriptions-item>
  </el-descriptions>
    </el-card>

   

 
    
</template>

<style scoped>
.el-descriptions {
  margin-top: 20px;
}
.cell-item {
  display: flex;
  align-items: center;
  height: 60px;
}
.margin-top {
  margin-top: 20px;
}
/* 图片 */

.demo-image__placeholder .el-image {
  padding: 0 5px;
  max-width: 300px;
  max-height: 200px;
}



</style>