import request from '@/util/request.js'
//访问index文章
export const indexArticleService=function(params){
    return request.get('/index/article',{params:params})
}
//访问index文章分类
export const indexCategoryService=function(params){
    return request.get('/index/category',{params:params})
}
export const indexArticleDetailService=function(id){
    return request.get('/index/detail/'+id)
}
//ai助手
export const openAIService=function(params){
    return request.get('/ai/openAI',{params:params})
}
export const closeAIService=function(){
    return request.get('/ai/closeAI')
}