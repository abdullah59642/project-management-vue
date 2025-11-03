<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Notes from '../components/Notes.vue'
import TodoList from '../components/TodoList.vue'

const route = useRoute()
let projectId = ref(route.params.id);
let projectName = ref('');
let showNotesComp = ref(true);
let showTodoListComp = ref(false);
let currentActiveComponent = ref('notes');
let activeTab = reactive({
    active: "cursor-pointer bg-blue-500 rounded-xl m-2 px-2",
    notActive: "cursor-pointer",
});

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
<h1 class="ms-2 font-bold">{{projectName}}</h1>
<div class="flex justify-center">
    <div class="flex gap-8 bg-gray-100 ps-8 rounded-xl w-[60vw]">
        <button @click="toggleComponents('notes')" :class="currentActiveComponent == 'notes' ? activeTab.active : activeTab.notActive">Notes</button>
        <button @click="toggleComponents('todo')" :class="currentActiveComponent == 'todo' ? activeTab.active : activeTab.notActive">Todo List</button>
    </div>
</div>

<div v-if="showNotesComp">
<Notes :projectId="route.params.id" />
</div>
<div v-if="showTodoListComp">
<TodoList :projectId="route.params.id" />
</div>
</template>