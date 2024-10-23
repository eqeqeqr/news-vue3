
<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'

import { ref } from 'vue'

//文章分类数据模型
const categorys = ref([
    {
        "id": 3,
        "categoryName": "美食",
        "categoryAlias": "my",
        "createTime": "2023-09-02 12:06:59",
        "updateTime": "2023-09-02 12:06:59"
    },
    {
        "id": 4,
        "categoryName": "娱乐",
        "categoryAlias": "yl",
        "createTime": "2023-09-02 12:08:16",
        "updateTime": "2023-09-02 12:08:16"
    },
    {
        "id": 5,
        "categoryName": "军事",
        "categoryAlias": "js",
        "createTime": "2023-09-02 12:08:33",
        "updateTime": "2023-09-02 12:08:33"
    }
])

//用户搜索时选中的角色
const roles=ref('')
const roleId=ref('')
import { roleListService } from '@/api/role';
const roleList=async function(){
    let result=await roleListService()
    roles.value=result.data;
}
roleList()
//用户搜索时选中的权限
const permissions=ref('')
const permissionId=ref('')
import { permissionListService } from '@/api/permission';
const permissionList=async function(){
    let result=await permissionListService()
    permissions.value=result.data;
}
permissionList()
//文章列表数据模型
const permissionDataModal = ref([
   
])

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(5)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    rolePermissionList()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    rolePermissionList()
}
// 获取角色权限列表
import { rolePermissionListService } from '@/api/rolePermission';
const rolePermissionList=async function(){
    let parmas={
        pageNum:pageNum.value,
        pageSize:pageSize.value,
        roleId:roleId.value,
        permissionId:permissionId.value
    }
    let result=await rolePermissionListService(parmas)
    permissionDataModal.value=result.data.items;
    total.value=result.data.total;
}
rolePermissionList()
const clearData=function(){
    roleId.value=''
    permissionId.value=''
    rolePermissionList()
}

import {Plus} from '@element-plus/icons-vue'
//控制抽屉是否显示
const visibleDrawer = ref(false)
//添加表单数据模型
const permissionData = ref({
    roleId:'',
    permissionId:''
})

const showRolePermission= function(){
    visibleDrawer.value=true
}
import { rolePermissionAddService } from '@/api/rolePermission';
import { ElMessage } from 'element-plus'
import { useNavMenuStore   } from '@/stores/navMenu';
const navMenu = useNavMenuStore();

const addRolePermission=async function(){
  
    let result=await rolePermissionAddService(permissionData.value)
    ElMessage.success("添加成功")
    navMenu.add()
    //刷新列表
    rolePermissionList()
    //抽屉消失
    visibleDrawer.value=false;
}
import { rolePermissionDeleteService } from '@/api/rolePermission';
import { ElMessageBox } from 'element-plus'
const deleteRolePerssion=async function(row){
     //提示框
     ElMessageBox.confirm(
    '你确认要删除该角色权限吗?',
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
        //删除按钮
        let result=await rolePermissionDeleteService(row.roleId,row.permissionId)
        
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      navMenu.sub()
       //刷新列表
       rolePermissionList()


    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '用户取消删除',
      })
    })
}
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>角色权限管理：</span>
                <div class="extra">
                    <el-button type="primary" @click="showRolePermission">添加角色权限</el-button>
                </div>
            </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="角色：">
                <el-select placeholder="请选择" style="width: 220PX;" v-model="roleId">
                    <el-option 
                        v-for="r in roles" 
                        :key="r.id" 
                        :label="r.name"
                        :value="r.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="菜单权限：">
                <el-select placeholder="请选择" style="width: 220PX;" v-model="permissionId">
                    <el-option 
                        v-for="p in permissions" 
                        :key="p.id" 
                        :label="p.name"
                        :value="p.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="rolePermissionList">搜索</el-button>
                <el-button @click="clearData">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table :data="permissionDataModal" style="width: 100%">
            <el-table-column label="角色ID" prop="roleId"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="权限ID" prop="permissionId"> </el-table-column>
            <el-table-column label="权限名称" prop="permissionName"></el-table-column>
            <el-table-column label="最后修改时间" prop="updateTime"></el-table-column>
            <el-table-column label="最后修改人" prop="updateUserName"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <!-- <el-button :icon="Edit"  circle plain type="primary"></el-button> -->
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteRolePerssion(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5 ,10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
    </el-card>



<!-- 抽屉 -->
        <el-drawer v-model="visibleDrawer" title="添加角色权限" direction="rtl" size="50%">
            <!-- 添加文章表单 -->
            <el-form :model="permissionData" label-width="100px" >
         
                <el-form-item label="角色：">
                <el-select placeholder="请选择" style="width: 220PX;" v-model="permissionData.roleId">
                    <el-option 
                        v-for="r in roles" 
                        :key="r.id" 
                        :label="r.name"
                        :value="r.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="菜单权限：">
                <el-select placeholder="请选择" style="width: 220PX;" v-model="permissionData.permissionId">
                    <el-option 
                        v-for="p in permissions" 
                        :key="p.id" 
                        :label="p.name"
                        :value="p.id">
                    </el-option>
                </el-select>
            </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addRolePermission()">提交</el-button>

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



