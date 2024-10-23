
<script setup>
import {
    Edit,
    Delete,
    Promotion
} from '@element-plus/icons-vue'

import { ref, watch } from 'vue'

//文章分类数据模型
const categorys = ref([
    {
        "id": 3,
        "categoryName": "美食",
        "categoryAlias": "my",
        "createTime": "2023-09-02 12:06:59",
        "updateTime": "2023-09-02 12:06:59"
    },
])

//用户搜索时选中的分类id
const categoryId=ref('')

//用户搜索时选中的发布状态
const state=ref('')

//文章列表数据模型
const articles = ref([
  
])

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(5)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    articleList()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    articleList()
}
//分类回显
import {articleDeleteService,articleUpdateService,articleCategoryListService, articleListService,articleAddService} from '@/api/article.js';


const articleCategoryList=async()=>{
    let result =await articleCategoryListService()
    categorys.value=result.data
}
articleCategoryList()
//显示文章列表
const articleList=async ()=>{
    let params={
        pageNum:pageNum.value,
        pageSize:pageSize.value,
        categoryId:categoryId.value?categoryId.value:null,
        state:state.value?state.value:null
    }
    let result=await articleListService(params);
    //渲染视图
    total.value=result.data.total;
    articles.value=result.data.items;
    //处理数据
    for(let i=0;i<articles.value.length;i++){
        let article=articles.value[i]
        for (let j = 0; j < categorys.value.length; j++) {
           if (article.categoryId=== categorys.value[j].id){
            article.categoryName=categorys.value[j].categoryName;
           }
        }
    }
}
articleList()

import {Plus} from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
//控制抽屉是否显示
const visibleDrawer = ref(false)
//添加表单数据模型
const articleModel = ref({
    title: '',
    categoryId: '',
    coverImg: '',
    content:'',
    state:''
})

//导入token
import { useTokenStore } from '@/stores/token';
const TokenStore=useTokenStore()

const uploadSuccess=(result)=>{
    articleModel.value.coverImg=result.data;
    console.log(result.data)
}
//添加文章
import { ElMessage } from 'element-plus';
const addArticle=async (clickState)=>{
    //把发布状态赋值到数据模型
    articleModel.value.state=clickState;
    //调用接口
    let result=await articleAddService(articleModel.value)
    ElMessage.success("添加成功")
    //抽屉消失
    // 清空数据
    articleModel.value = {}
    visibleDrawer.value=false;
 
    //刷新列表
    articleList()
}
const title=ref('添加文章')
const showUpdate=function(row){
    visibleDrawer.value=true;title.value='编辑文章'
    articleModel.value.id=row.id;
    articleModel.value.categoryId=row.categoryId
    articleModel.value.title=row.title
    articleModel.value.state=row.state
    articleModel.value.content=row.content
    articleModel.value.coverImg=row.coverImg
}
const updateArticle=async (clickState)=>{
    articleModel.value.state=clickState
    let result =await articleUpdateService(articleModel.value)
    ElMessage.success("修改成功")
    articleModel.value = {}
    //刷新列表
    articleList()
    //抽屉消失
    visibleDrawer.value=false;
    
}
import { ElMessageBox } from 'element-plus';

const deleteArticle =(row)=>{
    //提示框
    ElMessageBox.confirm(
    '你确认要删除该分类信息吗?',
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
        //删除按钮
     let result= await  articleDeleteService(row.id)
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      //刷新列表
      articleList()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '用户取消删除',
      })
    })
}
//添加文章
const add=function(){
    articleModel.value = {}
    title.value='添加文章'   
    visibleDrawer.value=true;
}
//ai
const mainContent = ref()
const answerContent = ref()
import { openAIService,closeAIService } from '@/api/index';
//倒计时
const countdown = ref(0)

const startCountdown= function () {
    countdown.value = 60; // 设置倒计时时间（秒）
    const timer = setInterval(() => {
        if (countdown.value > 0) {
            countdown.value--;
        } else {
          clearInterval(timer); // 倒计时结束时清除定时器
        }
    }, 1000);
}
const openAssist = async () => {
    if(countdown.value==0){
        startCountdown()
        let params={
            question:mainContent.value
        }
        answerContent.value="用户:<br/>"+mainContent.value
        mainContent.value=''
        let result=await openAIService(params)
        countdown.value=0;
        answerContent.value="新闻助手:<br/>"+result.data
      
    }
}
const closeAssist = async () => {
    mainContent.value=''
    answerContent.value=''
    let result=await closeAIService()
    answerContent.value=result.data
}
watch(()=>visibleDrawer.value,async ()=>{
    await closeAssist()
})
//机器人
import {onMounted, computed } from 'vue';
  import lottie from 'lottie-web';
  
      const isModalVisible = ref(false);
      const botElement = ref(null);
  
      // 显示弹出框
      const openOrcloseAssistant = () => {
        isModalVisible.value = !isModalVisible.value;
      };
  
      // 隐藏弹出框
 
      // 在组件挂载后加载 Lottie 动画
      const loadAnimation=() => {
        lottie.loadAnimation({
          container: document.getElementById('bot'),
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: 'https://lottie.host/88bfb662-82e5-473e-8a5b-cda643605394/HXy7TpLV9k.json' // 确保路径正确
        });
    }
    onMounted(() => {
        botElement.value = document.getElementById('bot');
        botElement.value.style.left = 'calc(100% - 80px)';  // 距离右边50px
        botElement.value.style.top = 'calc(100vh - 530px)';  // 距离底部20px
       loadAnimation() 
    });
    let isDragging = false;
    let startX, startY, initialX, initialY;
    const startDrag = (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialX = botElement.value.offsetLeft;
      initialY = botElement.value.offsetTop;

      document.addEventListener('mousemove', doDrag);
      document.addEventListener('mouseup', stopDrag);
            // 防止文本选择
      document.body.style.userSelect = 'none';
    };
    const doDrag = (e) => {
      if (isDragging) {
        const currentX = e.clientX;
        const currentY = e.clientY;

        const dx = currentX - startX;
        const dy = currentY - startY;

        botElement.value.style.left = `${initialX + dx}px`;
        botElement.value.style.top = `${initialY + dy}px`;
      }
    };
    const stopDrag = () => {
      isDragging = false;
      document.removeEventListener('mousemove', doDrag);
      document.removeEventListener('mouseup', stopDrag);
      document.body.style.userSelect = '';
      
    };
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章管理</span>
                <div class="extra">
                    <el-button type="primary" @click="add">添加文章</el-button>
                </div>
            </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="文章分类：">
                <el-select style="width: 220px;" placeholder="请选择" v-model="categoryId">
                    <el-option 
                        v-for="c in categorys" 
                        :key="c.id" 
                        :label="c.categoryName"
                        :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="发布状态：">
                <el-select style="width: 220px;" placeholder="请选择" v-model="state">
                    <el-option label="已发布" value="已发布"></el-option>
                    <el-option label="草稿" value="草稿"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="articleList()">搜索</el-button>
                <el-button @click="categoryId='';state=null">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table :data="articles" style="width: 100%">
            <el-table-column label="文章标题" width="400" prop="title"></el-table-column>
            <el-table-column aria-disabled="false" label="分类id" prop="categoryId" ></el-table-column>
            <el-table-column label="分类" prop="categoryName" ></el-table-column>
            <el-table-column label="发表时间" prop="createTime"> </el-table-column>
            <el-table-column label="角色" prop="roleName"> </el-table-column>
            <el-table-column label="状态" prop="state"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="showUpdate(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteArticle(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
             <div v-show="visibleDrawer"
                            style="font-size: 12px;color: brown;font-weight: bolder;position: absolute;bottom: 20px;right: 50px;z-index: 9999;width: 50px; height: 50px; cursor: pointer;"
                            @click="openOrcloseAssistant"
                            id="bot"
                            @mousedown="startDrag"
                        >新闻助手<br/>点击开启</div>          
        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[5, 10 ,15, 20]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
    </el-card>
     
<!-- 抽屉 -->
        <el-drawer v-model="visibleDrawer" :title="title" direction="rtl" size="50%">
            <!-- 添加文章表单 -->
            <el-form :model="articleModel" label-width="100px" >
                <el-form-item label="文章标题" >
                    <el-input v-model="articleModel.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="文章分类">
                    <el-select placeholder="请选择" v-model="articleModel.categoryId">
                        <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文章封面">
                        <!-- 
                            auto-upload:设置是否自动上传
                            action：设置服务器接口路径
                            name：设置上传的文件名
                            headers:设置上传的请求头
                            on-success：设置上传成功的回调函数
                        -->
                    <el-upload class="avatar-uploader" 
                        :auto-upload="true" 
                        :show-file-list="false"
                        action="/api/upload"
                        name="file"
                        :headers="{'Authorization':TokenStore.token}"
                        :on-success="uploadSuccess"
                    >
                        <img v-if="articleModel.coverImg" :src="articleModel.coverImg" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                    <div v-if="isModalVisible" style="position: relative;;margin-left: 5px;width: 400px;height: 178px;float: right;border: 2px solid brown;">
                        <div v-html="answerContent" style="color: brown;height: 100%; overflow-y: auto;">
                    </div>
                        <el-form-item style="position: absolute;bottom: 0;left: 0;float: left;" >
                        <el-input  placeholder="我是新闻助手,请输入主要内容" style="width: 350px;" v-model="mainContent">
                        </el-input>
                        <el-button type="primary" size="default" style="width: 50px;" :icon="Promotion" @click="openAssist" >{{ countdown > 0 ? `${countdown}`:null}}</el-button>
                     </el-form-item >
                    </div>
                </el-form-item>
                <el-form-item label="文章内容">
                    <div class="editor">
                        <quill-editor
                            theme="snow"
                            v-model:content="articleModel.content"
                            contentType="html"
                            >
                          </quill-editor>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="title=='添加文章'?addArticle('已发布'):updateArticle('已发布');">发布</el-button>
                    <el-button type="info" @click="title=='添加文章'?addArticle('草稿'):updateArticle('草稿');">草稿</el-button>
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




