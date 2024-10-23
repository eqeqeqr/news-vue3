
<script setup>
import {
    Edit,
    Delete,
    Search,
    CircleClose
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

//用户搜索时选中的分类id
const categoryId=ref('')

//用户搜索时选中的发布状态
const searchContent=ref('')

//文章列表数据模型
const articles = ref([
    {
        "id": 5,
        "title": "陕西旅游攻略",
        "content": "兵马俑,华清池,法门寺,华山...爱去哪去哪...",
        "coverImg": "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
        "state": "草稿",
        "categoryId": 2,
        "createTime": "2023-09-03 11:55:30",
        "updateTime": "2023-09-03 11:55:30"
    },
    {
        "id": 5,
        "title": "陕西旅游攻略",
        "content": "兵马俑,华清池,法门寺,华山...爱去哪去哪...",
        "coverImg": "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
        "state": "草稿",
        "categoryId": 2,
        "createTime": "2023-09-03 11:55:30",
        "updateTime": "2023-09-03 11:55:30"
    },
    {
        "id": 5,
        "title": "陕西旅游攻略",
        "content": "兵马俑,华清池,法门寺,华山...爱去哪去哪...",
        "coverImg": "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
        "state": "草稿",
        "categoryId": 2,
        "createTime": "2023-09-03 11:55:30",
        "updateTime": "2023-09-03 11:55:30"
    },
])

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(4)//每页条数

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
import {indexCategoryService, indexArticleService} from '@/api/index.js';


const articleCategoryList=async()=>{
    let result =await indexCategoryService()
    categorys.value=result.data
}
articleCategoryList()
//显示文章列表
const articleList=async ()=>{
    let params={
        pageNum:pageNum.value,
        pageSize:pageSize.value,
        categoryId:categoryId.value?categoryId.value:null,
        searchContent:searchContent.value?searchContent.value:null
    }
    let result=await indexArticleService(params);
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

import '@vueup/vue-quill/dist/vue-quill.snow.css'


const clearData=()=>{
    categoryId.value='';
    searchContent.value='';
    articleList()
}

</script>

<template>
    <div style="margin-bottom: 50px;">
                <el-form-item style="float: left;width: 50vw;height: 10px;" >
                <el-input  placeholder="请输入搜索内容" style="width: 50vw; height: 5vh; border-radius: 30px; padding: 0 20px;" v-model="searchContent">
                </el-input>
            </el-form-item style="float: left;width: 50vw;height: 10px;" >
                <el-form-item>
                    <el-button :icon="Search" @="articleList()" size="large" style="color: black;font-size: 20px;font-weight: bolder;" round>搜索</el-button>
                    <el-button @click="clearData" :icon="CircleClose" size="large" style="color: black;font-size: 20px;font-weight: bolder;" round>重置</el-button>
                </el-form-item>
    </div>
           
        <el-form inline >
            <el-tabs v-model="categoryId" stretch class="demo-tabs" @click="articleList()">
                <el-tab-pane
                key=""
                label="全部"
                name=""
                >
            </el-tab-pane>
                <el-tab-pane
                style="--el-font-size-base: 80px;"
                v-for="c in categorys"
                :key="c.id"
                :label="c.categoryName"
                :name="c.id"
                
                >
            </el-tab-pane>
            </el-tabs>

        </el-form>

        <router-link :to="'/index/detail/'+article.id" v-for="article in articles" style="text-decoration: none;">
            <el-card class="news-template">  
                    <template #header>
                    <div class="header-content">
                        <h2>{{ article.title }}</h2>
                        <p class="sub-title">来源：{{ article.createUserName }}</p>
                    </div>
                    </template>
                    <div class="news-content">
                    <el-row style="margin: 0;padding: 0;">
                        <el-col :span="24"  v-if="article.coverImg">
                        <el-image 
                            style="width: 100%;height: 20vh;margin: 10px;"
                            :src="article.coverImg?article.coverImg:''"
                        />
                        </el-col>
                        <el-col :span="24">
                        <p class="news-text" >
                            {{article.createUserName}}报道：
                            <div  v-html="article.content"></div>
                        </p>
                        <p class="news-date">发布时间：{{ article.createTime }}</p>
                        </el-col>
                    </el-row>
                    </div>
            </el-card>
        </router-link>
  
 

 <!-- 分页条 -->
 <el-pagination
    v-model:current-page="pageNum"
    v-model:page-size="pageSize"
    :page-sizes="[4, 8, 16, 32]"
    layout=" total,sizes, prev, pager, next"
    background
    :total="total"
    :hide-on-single-page="true"
    @size-change="onSizeChange"
    @current-change="onCurrentChange"
    style="position: fixed; bottom: 0; left: 0; width: 100%; margin: 0; justify-content: flex-end; background-color: #fff; z-index: 1000;" 
/>
</template>
<style lang="scss" scoped>

.news-template {
    margin: 10px;
    margin-bottom: 0;
    padding: 20px;
    padding-bottom: 0;
    width: 20vw;
    height: 60vh;
    float: left;
  .header-content {
    text-align: center;
    margin-bottom: 15px;
    
    h2 {
      font-size: 24px;
      margin: 0;
    }

    .sub-title {
      font-size: 16px;
      color: #888;
    }
  }

  .news-content {
    .news-text {
        display: -webkit-box;
        display: -webkit-box; /* 用于 Webkit 浏览器 */
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 3; /* Webkit 浏览器特有属性 */
        line-clamp: 3; /* 标准属性（实验性） */
        display: -webkit-box; /* Webkit 浏览器特有 */
        -webkit-box-orient: vertical; /* Webkit 浏览器特有 */
        overflow: hidden; /* 溢出隐藏 */
        text-overflow: ellipsis; /* 溢出部分显示省略号 */
        line-height: 1.5em; /* 行高 */
        max-height: 4.5em; /* 行高 * 行数 */
        margin: 0; /* 取消默认外边距 */
        padding: 0; /* 取消默认内边距 */
        font-size: 14px; /* 设置字体大小 */
        color: #333; /* 设置字体颜色 */
    }

    .news-date {
      font-size: 12px;
      color: #aaa;
      text-align: right;
      margin-top: 10px;
    }
  }
  
}


</style>




