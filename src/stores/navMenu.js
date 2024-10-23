//定义store
import { defineStore } from "pinia";

import { ref } from "vue";
export const useNavMenuStore = defineStore("navMenuCount", () => {
  //定义数据
  const navMenuCount = ref(0);
  //定义方法
  const setNavMenu = (data) => {
    navMenuCount.value = data;
  };
  const sub= () => {
    navMenuCount.value = navMenuCount.value-1;
  };
  const add= () => {
    navMenuCount.value = navMenuCount.value+1;
  };
  return { navMenuCount, setNavMenu ,sub,add};
},{persist:true});