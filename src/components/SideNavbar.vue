<script setup>
import { ref, onMounted, computed } from 'vue'
import {useProjectStore} from '@/stores/projectStore'
import { toast } from 'vue3-toastify'
import { useRoute } from 'vue-router'
import { RouterLink } from 'vue-router'
import {useAuthStore} from '@/stores/authState'

let authStore = useAuthStore();
const route = useRoute()
let projectStore = useProjectStore();
let showProjectModal = ref(false);
let projectName = ref('');
let projectDesc = ref('');
let selectedProjectClass = 'bg-blue-600 ';
let notSelectedProjectClass = 'bg-blue-400 hover:bg-blue-600 ';
let baseProjectClass = 'p-1 mt-1 ps-4 truncate';

let createProject = () => {
  if(projectName.value.trim() == "" || projectDesc.value.trim() == ""){
    toast.error('Both fields are required');
  } else {
    let array = [projectName.value, projectDesc.value];
    let response = projectStore.addProject(...array);
    response == true ? showProjectModal.value = false : showProjectModal.value = true;
    projectName.value = '';
    projectDesc.value = '';
    //re-render projects
    projectStore.renderAllProjects();
  }
}

// const headerDynamicClass = computed(() => {
//   return projectStore.openSideBarOnPhone ? 'fixed z-100 w-[60vw] bg-blue-300 md:hidden' : 'hidden relative md:block w-[10vw] bg-blue-300';
// })

const headerDynamicClass = computed(() => {
  return `
    fixed left-0 h-full z-50 w-[70vw] bg-blue-300 
    transform transition-transform duration-300 ease-in-out
    ${projectStore.openSideBarOnPhone ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0 md:static md:w-[10vw]
  `
})

onMounted(() => {
  projectStore.phoneScreenCheck();
  window.addEventListener('resize', projectStore.phoneScreenCheck);
  projectStore.renderAllProjects();
});
</script>

<template>
   <!-- hidden  -->
   <div
    v-if="projectStore.openSideBarOnPhone"
    class="fixed inset-0 top-10 z-40 bg-black/20 backdrop-blur-sm md:hidden"
    @click="projectStore.openSideBarOnPhone = false"
  ></div>

  <div :class="headerDynamicClass" style="height: calc(100vh - 40px)">
    <!-- project modal -->
    <Teleport to="body">
      <div v-show="showProjectModal" class="flex z-100 justify-center items-center fixed inset-0 backdrop-blur-xs" @click="showProjectModal = false">
        <div class="relative flex flex-col bg-gray-400 mt-8 h-[80%] w-[95%] p-12 rounded-xl
        md:mt-8 md:h-[80%] md:w-[70%] md:p-12
        lg:mt-8 lg:h-[80%] lg:w-[50%] lg:p-12" @click.stop>
      <h1 class="text-center text-sm mt-8 mb-2
        lg:text-center lg:text-l lg:mt-8 lg:mb-2">CREATE A PROJECT</h1>
        <h1 class="text-xs md:text-s lg:text-sm">Project Name</h1>
          <input
            placeholder="Project Name..."
            v-model="projectName"
            type="text"
            class="ps-2 border-1 rounded h-8 border-gray-300"
          />
          <h1 class="text-xs md:text-s lg:text-sm">Project Description</h1>
          <textarea
            placeholder="Project Description...."
            v-model="projectDesc"
            class="p-2 h-[40%] border-1 rounded border-gray-300"
          />
          <button @click="createProject()" class="bg-blue-500 w-20 mt-2 rounded cursor-pointer hover:bg-blue-900">
            Create
          </button>
        </div>
      </div>
  </Teleport>
    <!-- add project button -->
    <div class="flex justify-end mr-2 mt-2 ">
      <div class="flex hover:bg-blue-800 justify-center rounded bg-blue-500 w-7">
        <button v-show="authStore.isUserLoggedIn" @click="showProjectModal = true" class="cursor-pointer text-xl">+</button>
      </div>
    </div>
    <h3 class="p-3 font-bold truncate">My Projects</h3>
    <!-- project list -->
     <div v-if="authStore.isUserLoggedIn">
      <div v-if="projectStore.userProjects.length > 0">
        <div v-for="(value, index) in projectStore.userProjects" class="flex flex-col mt-0 gap-1 cursor-pointer">
          <RouterLink :to="`/project/${value.projectKey}`" @click="projectStore.selectedProjectKey = value.projectKey" 
          :class="[
            baseProjectClass,
            // value.projectKey == projectStore.selectedProjectKey ? selectedProjectClass : notSelectedProjectClass,
            String(value.projectKey) === String(route.params.id)
            ? selectedProjectClass
            : notSelectedProjectClass,
          ]">
          {{ value.name }}</RouterLink>
        </div>
      </div>
      <div v-else>
        <h2 class="text-xs text-center truncate">No projects found</h2>
      </div>
    </div>
    <div v-else>
      <h2 class="text-xs text-center truncate">Login to continue</h2>
    </div>
  </div>
</template>