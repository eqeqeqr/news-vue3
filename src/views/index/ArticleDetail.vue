<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { indexArticleDetailService } from '@/api/index.js'
import axios from 'axios';

const route = useRoute()
const article = ref({})

// Fetch article details
const articleDetail = async () => {
  const result = await indexArticleDetailService(route.params.id)
  article.value = result.data
  console.log(result.data)
}
articleDetail()
const returnIndex = () => {
  window.history.back()
}
</script>

<template>         
  <el-card class="news-template" style="position:  relative;">  
 <el-link type="info" :underline="false" @click="returnIndex" style="position:  absolute;left: 14px ;top: 14px;font-size: 20px;">
                        ← 返回
</el-link>
    <div class="news-content">
      <div class="header-content" >
        <h2>{{ article.title }}</h2>
        <p class="sub-title">来源：{{ article.createUserName }}</p>
      </div>
      <el-row style="margin: 0; padding: 0;">
        <el-col :span="24" style="width: 505;height: 284;" v-if="article.coverImg">
          <el-image 
            
            style="width: 100%; height: auto; margin: 10px 0;"
            :src="article.coverImg?article.coverImg:''"
          />
        </el-col>
        <el-col :span="24">
          <p class="news-text" style="font-family: 'Roboto', sans-serif; font-size: 18px; font-weight: bold;;">
            {{ article.createUserName }} 报道：
            <div v-html="article.content"></div>
            <p class="news-date" style="font-size: 16px;">发布时间：{{ article.createTime }}</p>  
          </p>
      
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>



<style lang="scss" scoped>
.news-template {
  
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  width: 93vw;
  height: 100vh;
  margin-bottom: 0px;
  .news-content {
    display: flex;
    flex-direction: column; /* 垂直布局 */
    align-items: center;
    width: 50vw;
    max-height: 90vh; /* 最大高度为视口高度的 90% */
    background-color: #f5f5f5; /* 可选背景色 */
    border: black 1px solid;
    padding: 20px; /* 内容周围的内边距 */
    box-sizing: border-box; /* 包含内边距和边框的总宽度和高度 */
    overflow: auto; /* 启用水平和垂直滚动 */
    overflow: hidden; /* 隐藏滚动条 */
    .header-content {
      text-align: center;
      margin-bottom: 20px; /* Adjust spacing between header and image */
      
      h2 {
        font-size: 24px;
        margin: 0;
      }

      .sub-title {
        font-size: 16px;
        color: #888;
      }
    }

    .news-text {
      text-overflow: ellipsis;
      line-height: 1.5em; /* Line height */
      max-height: 4.5em; /* Maximum height for text */
      margin: 0; /* Remove default margin */
      padding: 0; /* Remove default padding */
      font-size: 14px; /* Font size */
      color: #333; /* Font color */
    }

    .news-date {
      font-size: 12px;
      color: #aaa;
      text-align: right;
      margin-top: 10px;
    }
  }
  .news-content::-webkit-scrollbar {
    display: none; /* 隐藏滚动条 */
  }
  
  .news-content {
    overflow: auto; /* 允许滚动 */
  }
}
</style>
