//定义store
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMenuStore = defineStore("menu",()=> {
    const menuList=ref([])
    const setMenuList=(data)=>{
        menuList.value=data
    }
     return{ menuList,setMenuList}

},{persist: true})