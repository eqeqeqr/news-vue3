import request from '@/util/request.js'
import { useTokenStore } from '@/stores/token';

//查询文章分类
export const articleCategoryListService=function(){
  //  const tokenStore=useTokenStore();
    // return request.get('/category',{
    //     headers:{//在pinia中定义的响应式数据，都不需要.value
    //         'Authorization':tokenStore.token
    //     }
    // });
    return request.get('/category')
}
//查询分页文章分类{params:params}
export const pageCategoryListService=function(params){
  return request.get('/category/pageList',{params:params})
}
//文章分类添加
export const articleCategoryAddService=function(categoryData){
    return request.post('/category',categoryData)
}
//文章跟类修改
export const articleCategoryUpdateService=(categoryData)=>{
  return  request.put('/category',categoryData)
}
//文章分类删除
export const articleCategoryDeleteService=(id)=>{
   return request.delete('/category?id='+id)
}

//文章列表查询
export const articleListService=(params)=>{
   return request.get('/article',{params:params})
}
//文章添加
export const articleAddService=(articleData)=>{
  return  request.post('/article',articleData)
}
//文章修改
export const articleUpdateService=(articleData)=>{
    return request.put('/article',articleData)
}
//文章删除
export const articleDeleteService=(id)=>{
    return request.delete('/article?id='+id)
 }


