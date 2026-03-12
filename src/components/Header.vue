<script setup>
import { RouterLink } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import {useProjectStore} from '@/stores/projectStore'
import {useAuthStore} from '@/stores/authState'

let projectStore = useProjectStore();
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
     <div class="flex bg-blue-500 h-10 items-center text-white px-4 justify-between">
      <div class="flex items-center gap-3">
          <button
            v-if="projectStore.isPhoneScreen"
            @click="projectStore.openSideBarOnPhone = !projectStore.openSideBarOnPhone"
            class="flex flex-col justify-center items-center w-8 h-8 space-y-1"
          >
            <span class="block w-6 h-0.5 bg-white"></span>
            <span class="block w-6 h-0.5 bg-white"></span>
            <span class="block w-6 h-0.5 bg-white"></span>
          </button>
        <RouterLink @click="projectStore.selectedProjectKey = ''" class="text-xs sm:text-sm cursor-pointer" to="/"> Project Management VUE</RouterLink>
      </div>

      <div class="flex items-center gap-3">
        <RouterLink v-show="!authStore.isUserLoggedIn" class="hover:text-yellow-300" to="/login">Login</RouterLink>
        <span v-show="authStore.isUserLoggedIn" class="text-xs">
        {{ authStore.userName }}
      </span>
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
                class="block px-4 py-0.5 hover:bg-gray-100 text-sm
                "
                @click="dropDown = false"
              >
                About
              </RouterLink>
              <RouterLink 
                to="/settings" 
                class="block px-4 py-0.5 hover:bg-gray-100 text-sm"
                @click="dropDown = false"
              >
                Settings
              </RouterLink>
              <a 
                href="#" 
                class="block px-4 py-0.5 hover:bg-gray-100 text-sm 
                "
                @click="dropDown = false; authStore.LogOutUser()"
              >
                Logout
              </a>
            </div>
        </div>
    </div>
  </div>
</template>