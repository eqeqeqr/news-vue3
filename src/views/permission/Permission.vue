
<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import {
  Management,
  Promotion,
  Lock,
  Tools,
  UserFilled,
  User,
  Crop,
  EditPen
} from '@element-plus/icons-vue';
import { ref } from 'vue'


//用户搜索时选中的分类id
const permissionName=ref('')



//文章列表数据模型
const permissions = ref([
    {
        "id": '',
        "name": "",
        "createTime": "",
        "createUser": "",
        "createUserName":''
    },
  
])
const parentPermissions = ref([
    {
        "id": '',
        "name": "",
        "createTime": "",
        "createUser": "",
        "createUserName":''
    },
  
])
//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(3)//每页条数
const iconList = ref([
{ name: 'Management', component: Management },
      { name: 'Promotion', component: Promotion },
      { name: 'Lock', component: Lock },
      { name: 'Tools', component: Tools },
      { name: 'UserFilled', component: UserFilled },
      { name: 'User', component: User },
      { name: 'Crop', component: Crop },
      { name: 'EditPen', component: EditPen }
    ])
//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    permissionList()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    permissionList()
}
import { permissionPageService ,permissionParentService} from '@/api/permission'
const permissionParent=async function(){
    let result=await permissionParentService()
    parentPermissions.value=result.data
}
permissionParent()
const permissionList=async function(){
    
    let params={
        pageNum:pageNum.value,
        pageSize:pageSize.value,
        name:permissionName.value?permissionName.value:null
    }

    let result=await permissionPageService(params)
    permissions.value=result.data.items
    total.value=result.data.total
  
}
permissionList()
const clearData=function(){
    
    permissionName.value=''
    permissionList()
    
}
//
const permissionModel=ref({
    name:'',
    parentId:null,
    url:'',
    icon:'',
})
const dialogVisible=ref(false)
const title=ref('添加权限菜单')
// 
const showDialog=function(){
    dialogVisible.value=true;
}
import { permissionAddService,permissionDeleteService } from '@/api/permission'
import  { ElMessage,ElMessageBox }from 'element-plus'

const addPermissionMenu=async function(){
    
    let result=await permissionAddService(permissionModel.value)
   
    ElMessage.success("添加成功")
    dialogVisible.value=false;
    permissionList()
}
const deletePermissionMenu=async function(row){
//提示框
ElMessageBox.confirm(
    '你确认要删除该菜单吗?',
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
        //删除按钮
        let result=await permissionDeleteService(row.id)
        
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
 
       //刷新列表
     permissionList()


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
                <span>权限菜单</span>
                <div class="extra">
                    <el-button type="primary" @click="showDialog">添加菜单</el-button>
                </div>
            </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item>
            <el-input 
                    placeholder="请输入" 
                    style="width: 220px;" 
                    v-model="permissionName">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="permissionList">搜索</el-button>
                <el-button @click="clearData">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table :data="permissions" style="width: 100%">
            <el-table-column label="权限菜单ID" prop="id"></el-table-column>
            <el-table-column label="菜单名称" prop="name"></el-table-column>
            <el-table-column label="创建人" prop="createUserName"> </el-table-column>
            <el-table-column label="访问路径" prop="url"> </el-table-column>
            <el-table-column label="图标" prop="icon"> </el-table-column>
            <el-table-column label="创建时间" prop="createTime"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <!-- <el-button :icon="Edit" circle plain type="primary"></el-button> -->
                    <el-button :icon="Delete" circle plain type="danger" @click="deletePermissionMenu(row)"></el-button>
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


    <!-- 添加分类弹窗 -->
<el-dialog v-model="dialogVisible" :title="title" width="30vw"  style="height: 50vh;color: black;font-size: large;">
    <el-form :model="permissionModel" :rules="rules"  label-width="100px" style="padding-right: 30px">
        <el-form-item label="菜单名称" prop="name"  >
            <el-input v-model="permissionModel.name" style="height: 100%;"  minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="父菜单" prop="weight"  >
            <el-select placeholder="请选择"  v-model="permissionModel.parentId">
                    <el-option 
                    v-for="pp in parentPermissions" 
                        :key="pp.id" 
                        :label="pp.name"
                        :value="pp.id"
                        style="width: 20vw;font-size: large;color:black;">
                        
                    </el-option>
                </el-select>
        </el-form-item>
        <el-form-item label="访问路径" prop="url" >
            <el-input v-model="permissionModel.url" style="height: 100%;font-size: large;color:black;" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="父菜单" prop="icon" >
            <el-select placeholder="请选择"  v-model="permissionModel.icon">
                    <el-option 
                    v-for="icon in iconList" 
                        :key="icon.name" 
                        :label="icon.name"
                        :value="icon.name"
                        style="width: 20vw;height: 50px;"
                        >
                        <p style="font-size: large;color:black;">
                         <el-icon>
                        <component :is="icon.component" />
                        </el-icon> 
                        {{ icon.name }}
                        </p>
                    </el-option>
                </el-select>
        </el-form-item>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false;clearData" >取消</el-button>
            <el-button type="primary" @click="addPermissionMenu"> 确认 </el-button>
        </span>
    </template>
</el-dialog>

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

</style>


