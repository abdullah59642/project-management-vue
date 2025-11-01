<script setup>
import { ref, onMounted } from 'vue'
import {useProjectStore} from '@/stores/projectStore'
import { toast } from 'vue3-toastify'
import { RouterLink } from 'vue-router'

let projectStore = useProjectStore();
let showProjectModal = ref(false);
let userProjects = ref([]);
let projectName = ref('');
let projectDesc = ref('');

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
    renderAllProjects();
  }
}

let renderAllProjects = () => {
    //first empty the projects
    userProjects.value = [];
    let i = 1;
    while(localStorage.getItem('project' + i) !== null){
      let data = localStorage.getItem('project' + i);
      let project = JSON.parse(data);
      userProjects.value.push(
        {
          name: project.name,
          projectKey: i,
        });
      i++;
  }
}

onMounted(() => {
  renderAllProjects();
});
</script>

<template>
  <div class="relative w-[10vw] bg-blue-300" style="height: calc(100vh - 40px)">
    <!-- project modal -->
    <div
      v-show="showProjectModal"
      class="flex justify-center items-center fixed inset-0 backdrop-blur-xs"
      @click="showProjectModal = false"  
    >
      <div
        class="relative flex flex-col bg-gray-400 mt-8 h-[80%] w-[50%] p-12 rounded-xl"
        @click.stop
      >
<div
  @click="showProjectModal = false"
  class="absolute top-2 right-5 text-5xl cursor-pointer 
         transition-transform duration-200 hover:scale-125 hover:text-blue-500 select-none"
>
  &times;
</div>
    <h1 class="text-center text-xl mt-8 mb-2">CREATE A PROJECT</h1>
      <h1>Project Name</h1>
        <input
          placeholder="Project Name..."
          v-model="projectName"
          type="text"
          class="ps-2 border-1 rounded h-8 border-gray-300"
        />
        <h1>Project Description</h1>
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

    <!-- add project button -->
    <div class="flex justify-end mr-2 mt-2">
      <div class="flex hover:bg-blue-800 justify-center rounded bg-blue-500 w-7">
        <button @click="showProjectModal = true" class="cursor-pointer text-xl">+</button>
      </div>
    </div>
    <h3 class="p-3 font-bold truncate">My Projects</h3>
    <!-- project list -->
    <div v-for="(value, index) in userProjects" class="flex flex-col mt-0 gap-2 cursor-pointer">
      <RouterLink :to="`/project/${value.projectKey}`" class="p-2 hover:bg-blue-400 ps-4 truncate">{{ value.name }}</RouterLink>
    </div>
  </div>
</template>