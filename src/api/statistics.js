import request from '@/util/request.js'
//获取数据
export const statisticsArticleService=(params)=>{
    return request.get('/statistic/statisticsBar',{params:params})
}

export const statisticsArticleNumberService=(params)=>{
    return request.get('/statistic/statisticsLine',{params:params})
}
export const statisticsArticleExportService=()=>{
    return request.get('/statistic/export', {
        responseType: 'blob'  // 确保将响应类型设置为 blob
    })
}