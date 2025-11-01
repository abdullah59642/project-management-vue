<script setup>
import {onMounted, ref} from 'vue'
import { useAuthStore } from '@/stores/authState';
import { toast } from 'vue3-toastify'

const authStore = useAuthStore();
let userName = ref('');
let cUserName = ref('');

function changeUserName(){
    if(cUserName.value.trim() !== ""){
        localStorage.setItem('userName', cUserName.value); 
        userName.value = localStorage.getItem('userName'); 
        authStore.userName = userName.value;
        toast.success('Username changed');
        cUserName.value = '';
    }
}

onMounted(() => {
   userName.value = localStorage.getItem('userName');   
});
</script>

<template>
<div class="flex items-center flex-col">
    <div class="w-[40%] pt-8">
        <h1 class="text-3xl mb-2">Profile</h1>
        <div class="flex flex-col">
                <p class="text-sm">Change your Username:</p>
                <input v-model="cUserName" type="password" :placeholder="userName" class="border border-gray-400 p-1 rounded w-[50%] mb-1"/>
                <button @click="changeUserName()" class="hover:bg-blue-600 cursor-pointer rounded bg-blue-400 text-white w-17">Change</button>
        </div>
    </div>
</div>
</template>