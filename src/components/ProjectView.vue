<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Notes from '../components/Notes.vue'
import TodoList from '../components/TodoList.vue'

const route = useRoute()
let projectId = ref(route.params.id);
let projectName = ref('');
let showNotesComp = ref(true);
let showTodoListComp = ref(false);

watch(() => route.params.id,
    (newVal) => {
        projectId.value = newVal;
        renderAllProjectData();
    }
);

let toggleComponents = (comp) => {
    showNotesComp.value = false;
    showTodoListComp.value = false;
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
<h1 class="ms-2 font-bold">{{projectName}}</h1>
<div class="flex justify-center">
    <div class="flex gap-8 bg-gray-100 ps-8 rounded-xl w-[60vw] h-[6vh]">
        <button @click="toggleComponents('notes')" class="cursor-pointer">Notes</button>
        <button @click="toggleComponents('todo')" class="cursor-pointer">Todo List</button>
    </div>
</div>

<div v-if="showNotesComp">
<Notes :projectId="route.params.id" />
</div>
<div v-if="showTodoListComp">
<TodoList :projectId="route.params.id" />
</div>
</template>