
<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'


import { ref } from 'vue'



//用户搜索时选中的分类id
const roleNames=ref('')

//用户搜索时选中的发布状态
const roleWeights=ref('')

//文章列表数据模型
const roles = ref([
   {
    id:'1',
    name:'as',
    createTime:"",
    updateTime:"",
    weight:'3',
    createUser:'',
    createUserName:'',
    updateUser:'',
    updateUserName:'',
   }
])

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(5)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    rolePage()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    rolePage()
}



//添加分类表单校验
const rules = {
    name: [
        { required: true, message: '请输入角色名称', trigger: 'blur' },
    ],
    weight: [
        { required: true, selectKey: '请输入分选择权重', trigger: 'blur' },
    ]
}


import { rolePageService } from '@/api/role';
const rolePage=async function(){
    let parmas={
        pageNum:pageNum.value,
        pageSize:pageSize.value,
        roleName:roleNames.value?roleNames.value:null,
        roleWeight:roleWeights.value?roleWeights.value:null,
    }
    let result = await rolePageService(parmas)
    roles.value=result.data.items
    total.value=result.data.total
}
rolePage()


import {Plus} from '@element-plus/icons-vue'
//控制抽屉是否显示
const dialogVisible = ref(false)
//添加表单数据模型
const roleModel = ref( {
    id:'',
    name:'',
    weight:'',

   })
const showAddRole=()=>{
    title.value='添加角色'
    dialogVisible.value=true
}
import { roleAddService } from '@/api/role';
import { ElMessage, ElMessageBox } from 'element-plus'
const addRole=async ()=>{
    let result =await roleAddService(roleModel.value)
    ElMessage.success("添加成功")
    clearData()
    rolePage()
    dialogVisible.value=false
}
//清空数据
const clearData=()=>{
    roleNames.value=''
    roleWeights.value=''
    roleModel.value={
        name:'',
        weight:'',
    }
    rolePage()
}
import { roleDeleteService } from '@/api/role';
const deleteRole=async (row)=>{
     //提示框
     ElMessageBox.confirm(
    '你确认要删除该角色吗?',
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
        //删除按钮
        let result =await roleDeleteService(row.id)
        
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
 
       //刷新列表
      rolePage()


    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '用户取消删除',
      })
    })
 }
    //弹窗title
const title=ref('')


//修改
const showDialog=function(row){
  
    dialogVisible.value=true
    title.value='修改角色' 
    roleModel.value.name=row.name
    roleModel.value.weight=row.weight
    roleModel.value.id=row.id
 
}
import { roleUpdateService } from '@/api/role';
const updateRole=async ()=>{
    let result =await roleUpdateService(roleModel.value)
    ElMessage.success("修改成功")
    //修改pinia的信息
    roleModel.value={
        name:'',
        weight:'',
    }
    dialogVisible.value=false
    rolePage()
}

</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章管理</span>
                <div class="extra">
                    <el-button type="primary" @click="showAddRole">添加文章</el-button>
                </div>
            </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="角色名称：">
                <el-input 
                    placeholder="请输入" 
                    style="width: 220px;" 
                    v-model="roleNames">
                </el-input>
            </el-form-item>

            <el-form-item label="权重：" >
                <el-select placeholder="请选择"   style="width: 220px;"  v-model="roleWeights">
                    <el-option 
                    v-for="w in 100" 
                        :key="w" 
                        :label="w"
                        :value="w">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="rolePage">搜索</el-button>
                <el-button @click="clearData">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table :data="roles" style="width: 100%">
            <el-table-column label="角色ID" prop="id"></el-table-column>
            <el-table-column label="角色名称" prop="name"></el-table-column>
            <el-table-column label="权重" prop="weight"></el-table-column>
            <el-table-column label="创建人" prop="createUserName"> </el-table-column>
            <el-table-column label="最后修改人" prop="createUserName"> </el-table-column>
            <el-table-column label="最后修改时间" prop="updateTime"> </el-table-column>
        
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteRole(row)"></el-button>
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
<el-dialog v-model="dialogVisible" :title="title" width="30%">
    <el-form :model="roleModel" :rules="rules" label-width="100px" style="padding-right: 30px">
        <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleModel.name" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="角色权重" prop="weight">
            <el-select placeholder="请选择"  v-model="roleModel.weight">
                    <el-option 
                    v-for="w in 100" 
                        :key="w" 
                        :label="w"
                        :value="w">
                    </el-option>
                </el-select>
        </el-form-item>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false;clearData" >取消</el-button>
            <el-button type="primary" @click="title=='修改角色'?updateRole():addRole()"> 确认 </el-button>
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




