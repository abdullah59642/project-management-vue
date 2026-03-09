<script setup>
import {ref} from 'vue'
import {useAuthStore} from '@/stores/authState'
import { toast } from 'vue3-toastify'

const authStore = useAuthStore();
let email = ref('');
let password = ref('');

const handleLogin = () => {
    if(email.value !== "" && password.value !== ""){
        authStore.userLogin(email.value, password.value);
    } else {
        
    }
}
</script>
<template>
<div v-show="!authStore.isUserLoggedIn" class="flex justify-center">
    <div class="flex flex-col items-center rounded-2xl h-[60vh] w-[99vw]
        lg:h-[60vh] lg:w-[60vw]">
        <h2 class="text-xl font-bold pt-6">Sign In</h2>
        <div class="flex flex-col w-[50%]
        sm:w-[38%]
        md:w-[32%]
        lg:w-[30%] ">
            <span>Email</span>
            <input v-model="email" type="text" class="border h-7 border-gray-400 p-2 rounded"/>
        </div>
        <div class="flex flex-col w-[50%]
        sm:w-[38%]
        md:w-[32%]
        lg:w-[30%] ">
            <span>Password</span>
            <input v-model="password" type="password" class="border h-7 border-gray-400 p-2 rounded"/>
        </div>
        <button @click="handleLogin()" class="mt-4 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-medium rounded w-[20%] sm:w-[15%] md:w-[12%] lg:w-[10%] py-[0.3%]">Sign In</button>
    </div>
</div>
</template>