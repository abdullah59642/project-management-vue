<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import Notes from '../components/Notes.vue'
import TodoList from '../components/TodoList.vue'
import { useRoute } from 'vue-router'
import {useProjectStore} from '@/stores/projectStore'

const route = useRoute()
let projectStore = useProjectStore();
let projectId = ref(route.params.id);
let projectName = ref('');
let showNotesComp = ref(true);
let showTodoListComp = ref(false);
let currentActiveComponent = ref('notes');
let activeTab = reactive({
    active: "cursor-pointer bg-blue-500 rounded-xl m-2 px-2",
    notActive: "cursor-pointer",
});
let showProjectDeleteModal = ref(false);

watch(() => route.params.id,
    (newVal) => {
        projectId.value = newVal;
        renderAllProjectData();
    }
);

let toggleComponents = (comp) => {
    showNotesComp.value = false;
    showTodoListComp.value = false;
    currentActiveComponent.value = comp;
    switch (comp) {
        case 'notes':
            showNotesComp.value = true;
            break;
        case 'todo':
            showTodoListComp.value = true;
            break;
    }
}

let renderAllProjectData = () => {
    //get project Name
    let currentProject = JSON.parse(localStorage.getItem('project' + projectId.value));
    projectName.value = currentProject.name;
}

onMounted(() => {
    renderAllProjectData();
});
</script>

<template>
    <div class="flex">
        <h1 class="ms-2 font-bold">{{projectName}}</h1>
        <button @click="showProjectDeleteModal = !showProjectDeleteModal" class="ml-auto mr-10 text-xs bg-red-600 rounded-xl p-1 hover:bg-red-900 cursor-pointer">Delete Project</button>
    </div>
<div class="flex justify-center">
    <div class="flex gap-8 bg-gray-100 ps-8 rounded-xl w-[60vw]">
        <button @click="toggleComponents('notes')" :class="currentActiveComponent == 'notes' ? activeTab.active : activeTab.notActive">Notes</button>
        <button @click="toggleComponents('todo')" :class="currentActiveComponent == 'todo' ? activeTab.active : activeTab.notActive">Todo List</button>
    </div>
</div>

<div v-show="showProjectDeleteModal" @click.self="showProjectDeleteModal = false" class="fixed inset-0 flex justify-center items-center bg-gray bg-opacity-30 backdrop-blur-sm z-50">
    <div class="relative bg-blue-100 p-6 w-[25vw] shadow-lg rounded-xl" @click.stop>
        <h4>Are you sure to delete project "{{ projectName }}"</h4>
        <div class="flex justify-center space-x-2 mt-2">
            <button @click="projectStore.deleteProject(projectId)" class="bg-red-500 rounded-sm px-1 hover:bg-red-800 cursor-pointer">Yes</button>
            <button @click="showProjectDeleteModal = false" class="bg-gray-500 rounded-sm px-1 hover:bg-gray-600 cursor-pointer">No</button>
        </div>
    </div>
</div>

<div v-if="showNotesComp">
<Notes :projectId="route.params.id" />
</div>
<div v-if="showTodoListComp">
<TodoList :projectId="route.params.id" />
</div>
</template>