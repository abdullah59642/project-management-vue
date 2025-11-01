<script setup>
import { RouterLink } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import {useAuthStore} from '@/stores/authState'

const authStore = useAuthStore();
let dropDown = ref(false);
let dropDownRef = ref(null);

let handleOutsideClick = (event) => {
    if(dropDownRef.value && !dropDownRef.value.contains(event.target)){
        dropDown.value = false;
    }
}

onMounted(() => {
    document.addEventListener('click', handleOutsideClick);
   
});
</script>

<template>
  <div class="relative flex bg-blue-500 h-10 justify-end items-center text-white px-4">
    <RouterLink class="absolute left-14 cursor-pointer" to="/">Project Management VUE</RouterLink>
    <RouterLink v-show="!authStore.isUserLoggedIn" class="mr-4 hover:text-yellow-300" to="/login">Login</RouterLink>
    <span v-show="authStore.isUserLoggedIn" class="text-xs mr-2">{{ authStore.userName }}</span>
    <div v-show="authStore.isUserLoggedIn">
    <a
      class="mr-2 hover:text-yellow-300 cursor-pointer select-none"
      @click="dropDown = !dropDown"
      ref="dropDownRef">
    ▼
    </a>
    <div
      v-if="dropDown"
      class="absolute right-4 top-10 bg-white text-black rounded shadow-md py-2 w-32"
      >
      <RouterLink
        to="/about"
        class="block px-4 py-2 hover:bg-gray-100"
        @click="dropDown = false"
      >
        About
      </RouterLink>
      <RouterLink 
        to="/settings" 
        class="block px-4 py-2 hover:bg-gray-100"
        @click="dropDown = false"
      >
        Settings
      </RouterLink>
      <a 
        href="#" 
        class="block px-4 py-2 hover:bg-gray-100"
        @click="dropDown = false; authStore.LogOutUser()"
      >
        Logout
      </a>
    </div>
    </div>
  </div>
</template>