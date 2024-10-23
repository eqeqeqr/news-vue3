
<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import { debounce } from 'lodash'; // 导入防抖函数

const chartDom1 = ref(null);
const chartDom2 = ref(null);
let chartInstance1 = null;
let chartInstance2 = null;
const xAxisData1 = ref([]);
const seriesData1 = ref([]);
const xAxisData2 = ref([]);
const seriesData2 = ref([]);

const timeData = ref('1');
const startTime = ref('');
const endTime = ref('');
let isLoading = ref(false); // 加载状态标识

import { statisticsArticleService,statisticsArticleNumberService,statisticsArticleExportService } from '@/api/statistics';
import { ElMessage } from 'element-plus';
// 调用导出服务并处理文件下载
const downloadReport = async () => {
    try {
        const response = await statisticsArticleExportService();
        // 创建一个 URL 对象，并创建一个下载链接
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '业务数据报表.xlsx'); // 设置下载文件的名称
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url); // 清理 URL 对象
    } catch (error) {
        console.error('Error downloading file:', error);
    }
}
const clearTime = () => {
    startTime.value = '';
    endTime.value = '';
};

const updateTime = (num) => {
    const now1 = new Date();
    const now2 = new Date();
    const formattedTime1 = now1.toISOString().replace('T', ' ').substring(0, 19);
    endTime.value = formattedTime1;
    now2.setDate(now2.getDate() - num);
    const formattedTime2 = now2.toISOString().replace('T', ' ').substring(0, 19);
    startTime.value = formattedTime2;
};

const createChart1 = () => {
    if (chartInstance1) chartInstance1.clear(); // 清空图表数据
    chartInstance1 = echarts.init(chartDom1.value);
    const option1 = {
        title: { text: '角色文章统计柱状图' },
        tooltip: {},
        xAxis: { data: xAxisData1.value },
        yAxis: {},
        series: [{ name: '数据系列1', type: 'bar', data: seriesData1.value }]
    };
    chartInstance1.setOption(option1);
};

const createChart2 = () => {
    if (chartInstance2) chartInstance2.clear(); // 清空图表数据
    chartInstance2 = echarts.init(chartDom2.value);
    const option2 = {
        title: { text: '文章数量统计折线图' },
        tooltip: {},
        xAxis: { data: xAxisData2.value },
        yAxis: {},
        series: [{ name: '数据系列2', type: 'line', data: seriesData2.value }]
    };
    chartInstance2.setOption(option2);
};

const statisticsArticle = async () => {
    if (isLoading.value) return; // 如果正在加载，直接返回
    isLoading.value = true; // 设置加载状态
    clearTime();
    updateTime(timeData.value);

    let params = { startTime: startTime.value, endTime: endTime.value };
    let result1 = await statisticsArticleService(params);
    xAxisData1.value = result1.data.roleNameList;
    seriesData1.value = result1.data.articleCountList;
    let result2 = await statisticsArticleNumberService(params);
    xAxisData2.value = result2.data.dateList;
    seriesData2.value = result2.data.articleNumberList;

    await nextTick(); // 确保DOM已经渲染完成
    createChart1();
    createChart2();

    isLoading.value = false; // 加载完成，解除加载状态
};

const flushed = debounce(() => {
    statisticsArticle();
}, 300); // 防抖处理，避免多次快速点击

onMounted(async () => {
    await statisticsArticle();
});

onUnmounted(() => {
    if (chartInstance1) chartInstance1.dispose();
    if (chartInstance2) chartInstance2.dispose();
});
</script>
<template>
    <el-card class="page-container">
        <el-tabs v-model="timeData" stretch class="demo-tabs" @tab-click="flushed">
            <el-tab-pane label="当天" name="1" style="color: gray;">当天</el-tab-pane>
            <el-tab-pane label="近七" name="7" style="color: gray;">近一周</el-tab-pane>
            <el-tab-pane label="近三十天" name="30" style="color: gray;">近一月</el-tab-pane>
            <el-tab-pane label="近一年" name="365" style="color: gray;">近一年</el-tab-pane>
            <el-tab-pane label="近30天数据导出" name="31"><el-button style="float: right;" type="primary" @click="downloadReport">导出数据</el-button></el-tab-pane>
            
        </el-tabs> 
       
        <div class="custom-style" style="margin-bottom: 10px;"></div>
        <div ref="chartDom1" style="width: 35vw; height: 80vh; float: left;"></div>
        <div ref="chartDom2" style="width: 35vw; height: 80vh; float: right;"></div>
    </el-card>
</template>

<style scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;
    display: flex; /* 使用 Flexbox 来横向排列子元素 */
    gap: 20px; /* 可选：在两个图表之间添加间距 */
}

.demo-tabs > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}
</style>
