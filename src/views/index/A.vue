<script setup>
  import { ref, onMounted, computed } from 'vue';
  import lottie from 'lottie-web';
  
      const isModalVisible = ref(false);
      const botElement = ref(null);
  
      // 显示弹出框
      const openOrcloseAssistant = () => {
        isModalVisible.value = !isModalVisible.value;
      };
  
      // 隐藏弹出框
 
      // 在组件挂载后加载 Lottie 动画
      onMounted(() => {
        lottie.loadAnimation({
          container: document.getElementById('bot'),
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: 'https://lottie.host/88bfb662-82e5-473e-8a5b-cda643605394/HXy7TpLV9k.json' // 确保路径正确
        });
      });
  
      // 计算弹出框的位置
      const modalStyle = computed(() => {
        if (!botElement.value) return {};
        const rect = botElement.value.getBoundingClientRect();
        return {
          position: 'absolute',
          top: `${rect.bottom + window.scrollY}px`, // 距离顶部
          left: `${rect.left + window.scrollX}px`, // 距离左侧
          width: '200px', // 弹出框的宽度
          zIndex: 1000
        };
      });


  </script>
  
<template>
    <div>
      <!-- 点击的 div -->
      <div
        style="width: 50px; height: 50px; cursor: pointer;"
        @click="openOrcloseAssistant"
        id="bot"
      ></div>
      
      <!-- 弹出框 -->
      <div v-if="isModalVisible" class="modal" :style="modalStyle">
        <div class="modal-content">
          <span class="close" @click="openOrcloseAssistant">&times;</span>
          <p>这是弹出框的内容！</p>
        </div>
      </div>
    </div>
  </template>
  
  
  <style>
  /* 弹出框样式 */
  .modal {
    background-color: rgba(0, 0, 0, 0.1); /* 半透明背景 */
  }
  
  .modal-content {
    background-color: #fff;
    padding: 10px;
    border-radius: 4px;
    position: relative;
  }
  
  .close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 18px;
    cursor: pointer;
  }
  </style>
  