
<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'

import { ref } from 'vue'

//文章分类数据模型
const roles = ref([
    
])
import { roleListService} from '@/api/role';
const roleList=async function(){
    let result=await roleListService()
    roles.value=result.data;
}
roleList()
//用户搜索时选中的分类id
const nickname=ref('')

//用户搜索时选中的发布状态
const roleId=ref('')

//用户角色列表数据模型
const userRoleModel = ref([])

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(5)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    userRoleList()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    userRoleList()
}

import { userRoleListService } from '@/api/userRole';

const userRoleList=async function(){
    let parmas={
        pageNum:pageNum.value,
        pageSize:pageSize.value,
        roleId:roleId.value?roleId.value:null,
        nickname:nickname.value?nickname.value:null
    }
    let result=await userRoleListService(parmas);
    total.value=result.data.total;
    userRoleModel.value=result.data.items
    console.log(result.data)
}
userRoleList()
const clearData=function(){
    roleId.value='',
    nickname.value=''
}
// 
//控制抽屉是否显示
const visibleDrawer = ref(false)
//添加表单数据模型

const userRoleUpdateModel = ref({
    userId:'',
    roleId:'',
    oldRoleId:'',
    updateUser:'',
    nickname:'',
    updateUserName:'',

})
let oldRoleId = null
const title=ref('')
const showUpdateUserRole=function(row){
    visibleDrawer.value=true;title.value="修改用户角色"
    userRoleUpdateModel.value.userId=row.userId
    userRoleUpdateModel.value.roleId=row.roleId
    userRoleUpdateModel.value.updateUser=row.updateUser
    userRoleUpdateModel.value.updateUserName=row.updateUserName
    userRoleUpdateModel.value.nickname=row.nickname
    oldRoleId=row.roleId;
    console.log(userRoleUpdateModel)
 
}
import { userRoleUpdateService ,userRoleDeleteService } from '@/api/userRole';
import { ElMessage,ElMessageBox } from 'element-plus';


const updateUserRole=async function(){
    userRoleUpdateModel.value.oldRoleId=oldRoleId
    let result=await userRoleUpdateService(userRoleUpdateModel.value);
    ElMessage.success("修改成功")
   //刷新列表
    userRoleList()
    //抽屉消失
    visibleDrawer.value=false;
}
const deleteUserRole=async function(row){
     //提示框
     ElMessageBox.confirm(
    '你确认要删除该用户角色吗?',
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
        //删除按钮
        let result =await userRoleDeleteService(row.userId,row.roleId)


        
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      userRoleList()


    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '用户取消删除',
      })
    })
  
}
// 添加
import { userListService } from '@/api/user';
const userListData=ref([])
const showUser=async function(){
    visibleDrawer.value=true;title.value="添加用户角色"
    let result=await userListService()
    userListData.value=result.data
}
import { userRoleInsertService } from '@/api/userRole';

const userRolesData=ref({
    userId:'',
    roleId:''
})
const addUserRole=async function(){
    userRolesData.value.userId=userListData.value.id
    userRolesData.value.roleId=userRoleUpdateModel.value.roleId
 
    console.log(userRolesData.value)
    let result =await userRoleInsertService(userRolesData.value)
    ElMessage.success("添加成功")
   //刷新列表
    userRoleUpdateModel.value.roleId=null
    userRoleList()
    visibleDrawer.value=false;
   
}
const clearUserRoleData=function(){
    userRoleUpdateModel.value=''
}

</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>用户角色管理</span>
                <div class="extra">
                    <el-button type="primary" @click="showUser">添加用户角色</el-button>
                </div>
            </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="用户姓名：">
                <el-input 
                    placeholder="请输入" 
                    style="width: 220px;" 
                    v-model="nickname">
                </el-input>
            </el-form-item>

            <el-form-item label="角色：">
                <el-select placeholder="请选择" style="width: 220px;" v-model="roleId">
                    <el-option 
                        v-for="c in roles" 
                        :key="c.id" 
                        :label="c.name"
                        :value="c.id">
                    </el-option>
              
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="userRoleList">搜索</el-button>
                <el-button @click="clearData">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table :data="userRoleModel" style="width: 100%">
            <el-table-column label="用户ID"  prop="userId"></el-table-column>
            <el-table-column label="姓名" prop="nickname"></el-table-column>
            <el-table-column label="角色" prop="name"> </el-table-column>
            <el-table-column label="最后修改时间" prop="updateTime"></el-table-column>
            <el-table-column label="最后修改人" prop="updateUserName"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="showUpdateUserRole(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteUserRole(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[1, 10 ,15, 20]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
    </el-card>
    <!-- 抽屉 -->
        <el-drawer v-model="visibleDrawer" :title="title" direction="rtl" size="50%">
            <!-- 添加文章表单 -->
            <el-form :model="userRoleUpdateModel" label-width="100px" >
                <el-form-item v-if="title=='修改用户角色'"  label="用户ID" >
                    <el-input  readonly  v-model="userRoleUpdateModel.userId" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item v-if="title=='添加用户角色'" label="选择用户">
               
               <el-select placeholder="请选择"  v-model="userListData.id">
               <el-option 
                   v-for="user in userListData" 
                   :key="user.id" 
                   :label="user.nickname"
                   :value="user.id">
               </el-option>
                    
                    </el-select>
                    </el-form-item>
                        <el-form-item v-if="title=='修改用户角色'" label="姓名" >
                    <el-input readonly   v-model="userRoleUpdateModel.nickname" placeholder="姓名显示"></el-input>
                </el-form-item>
                <el-form-item  label="角色">
               
                    <el-select placeholder="请选择"  v-model="userRoleUpdateModel.roleId">
                    <el-option 
                        v-for="r in roles" 
                        :key="r.id" 
                        :label="r.name"
                        :value="r.id">
                    </el-option>
              
                </el-select>
                </el-form-item>
        
                <el-form-item label="修改人" v-if="title=='修改用户角色'">
                    <el-input readonly  v-model="userRoleUpdateModel.updateUserName" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="title==='修改用户角色'?updateUserRole():addUserRole()">提交</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>


    
</template>
<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}



/* 抽屉样式 */
.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}







</style>




