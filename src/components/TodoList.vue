<script setup>
import { onMounted, ref, reactive, watch } from 'vue'

let allTodoNotes = ref([]);
let editTodoId = ref();
let viewTodoModal = ref(false);
const props = defineProps({
  projectId: String
});

let viewTodoData = reactive({
      heading: "",
      text: "",
});

//watch for changes in prop to load notes
watch(
    () => props.projectId,
    () => {
        renderTodo();
});

let addTodoModal = ref(false);
let addTodoNote = reactive({
    todoId: 0,
    heading: "",
    text: "",
    createdAt: null,
});

const addTodo = () => {
    let projectObject = JSON.parse(localStorage.getItem('project' + props.projectId));
    let newTodo = {
        todoId: projectObject.todo.length + 1,
        heading: addTodoNote.heading,
        text: addTodoNote.text,
        createdAt: new Date().toISOString(),
    };
    projectObject.todo.push(newTodo);
    //set the project object back again
    localStorage.setItem('project' + props.projectId, JSON.stringify(projectObject));
    addTodoModal.value = false;
    renderTodo();
}

const renderTodo = () => {
    let projectObject = JSON.parse(localStorage.getItem('project' + props.projectId));
    allTodoNotes.value.splice(0, allTodoNotes.value.length, ...projectObject.todo);
    console.log(allTodoNotes);
}

const viewNote = (todoId) => {
    //get note
     editTodoId.value = todoId;
     let projectObject = JSON.parse(localStorage.getItem('project' + props.projectId));
     let Todo = projectObject.todo.find(todo => todo.todoId === todoId);
     viewTodoData.heading = Todo.heading;
     viewTodoData.text = Todo.text;
     viewTodoModal.value = true;
}

const updateNote = () => {
  let projectObject = JSON.parse(localStorage.getItem('project' + props.projectId));
  let editTodo = projectObject.todo.find(todo => todo.todoId === editTodoId.value);
  editTodo.heading = viewTodoData.heading;
  editTodo.text = viewTodoData.text;
  //store the note
  localStorage.setItem('project' + props.projectId, JSON.stringify(projectObject));
  viewTodoModal.value = false;
  renderTodo();
}

onMounted(() => {
    renderTodo();
});
</script>

<template>
     <div class="flex justify-end me-6">
     <button @click="addTodoModal = !addTodoModal" class="p-1 bg-blue-500 text-white rounded cursor-pointer">+</button>
    </div>
    <h2 class="text-lg font-bold mb-2" v-show="allTodoNotes.length > 0">Todo List</h2>
    <!-- div to render todo list -->
        <div class=" flex flex-col items-center gap-2 max-h-[77vh] w-[84vw] overflow-y-auto" v-if="allTodoNotes.length > 0">
          <div @click="viewNote(value.todoId)" class="relative bg-blue-200 w-[25%] h-20 rounded-xl cursor-pointer ms-2 truncate p-2" v-for="(value, index) in allTodoNotes">
              <p class="truncate">{{value.heading}}</p>
              <hr>
              <p class="truncate">{{value.text}}</p>
              <span class="absolute text-[60%] truncate right-2 bottom-0 text-gray-700">{{value.createdAt}}</span>
            </div>
      </div>
      <div v-else>
         <p class="text-center"> No data available </p>
      </div>
         <!-- modal to show the note -->
         <div v-show="addTodoModal"
             class="fixed inset-0 flex justify-center items-center bg-gray bg-opacity-30 backdrop-blur-sm z-50"
             @click.self="addTodoModal = false">
              <div class="relative bg-blue-100 p-6 h-[24vh] w-[40vw] rounded shadow-lg" @click.stop>
              <h2 class="text-lg font-bold mb-2">Todo</h2>
              <input v-model="addTodoNote.heading" placeholder="Heading..." class="w-full border rounded mb-2 p-1"></input>
              <textarea v-model="addTodoNote.text" placeholder="Text..." class="w-full h-[30%] border rounded mb-2 p-1"></textarea>
              <button @click="addTodo()" class="bg-blue-600 text-white px-4 py-1 rounded cursor-pointer">Create</button>
          </div>
        </div>

          <!-- modal to show the note -->
          <div v-show="viewTodoModal"
             class="fixed inset-0 flex justify-center items-center bg-gray bg-opacity-30 backdrop-blur-sm z-50"
             @click.self="viewTodoModal = false">
              <div class="relative bg-blue-100 p-6 h-[40vh] w-[50vw] rounded shadow-lg" @click.stop>
              <h2 class="text-lg font-bold mb-2">Todo</h2>
              <input v-model="viewTodoData.heading" placeholder="Heading..." class="w-full border rounded mb-2 p-1"></input>
              <textarea v-model="viewTodoData.text" placeholder="Text..." class="w-full h-[70%] border rounded mb-2 p-1"></textarea>
              <button @click="updateNote()" class="bg-blue-600 text-white px-4  py-1 rounded cursor-pointer">Update</button>
          </div>
        </div>
</template>