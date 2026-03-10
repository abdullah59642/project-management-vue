<script setup>
import { onMounted, ref, reactive, watch, computed } from 'vue'
const currentPage = ref(1)
const pageSize = ref(7)
let allTodoNotes = ref([]);
let editTodoId = ref();
let viewTodoModal = ref(false);
let status = ref('');

const totalPages = computed(() => {
  return Math.ceil(allTodoNotes.value.length / pageSize.value)
})

const paginatedTodos = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return allTodoNotes.value.slice(start, end)
})

const baseBtnClass = 'rounded cursor-pointer p-1'; 
const activeBtnClass = "bg-blue-500 hover:bg-blue-500";
const inActiveBtnClass = "bg-blue-300 hover:bg-blue-500";
const props = defineProps({
  projectId: String
});

const completedBtnClass = computed(() => [
  baseBtnClass,
  status.value == 'completed' ? activeBtnClass : inActiveBtnClass,
]);

const inCompletedBtnClass = computed(() => [
  baseBtnClass, 
  status.value == 'not-completed' ? activeBtnClass : inActiveBtnClass,
]);

let viewTodoData = reactive({
      heading: "",
      text: "",
      isCompleted: false,
});

//watch for changes in prop to load notes
watch(
    [status, () => props.projectId],
    () => {
        renderTodo(status.value);
});

let addTodoModal = ref(false);
let addTodoNote = reactive({
    todoId: 0,
    heading: "",
    text: "",
    isCompleted: false,
    createdAt: null,
});

const updateCompletedStatus = (todoId) => {
  const todo = allTodoNotes.value.find(t => t.todoId === todoId);
  todo.isCompleted = !todo.isCompleted;  

  let projectObject = JSON.parse(localStorage.getItem('project' + props.projectId));
  let Todo = projectObject.todo.find(todo => todo.todoId === todoId);
  Todo.isCompleted = !Todo.isCompleted;
  localStorage.setItem('project' + props.projectId, JSON.stringify(projectObject));
}

const addTodo = () => {
    const now = new Date();
    let projectObject = JSON.parse(localStorage.getItem('project' + props.projectId));
    let newTodo = {
        todoId: projectObject.todo.length + 1,
        heading: addTodoNote.heading,
        text: addTodoNote.text,
        isCompleted: false,
        createdAt: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`,
    };
    projectObject.todo.push(newTodo);
    //set the project object back again
    localStorage.setItem('project' + props.projectId, JSON.stringify(projectObject));
    addTodoModal.value = false;
    //reset status
    status.value = "";
    //reset values after closing the modal
    addTodoNote.heading = '';
    addTodoNote.text = '';
    renderTodo();
}

const renderTodo = (status) => {
    let projectObject = JSON.parse(localStorage.getItem('project' + props.projectId));
    if(status == 'completed'){
      allTodoNotes.value.splice(0, allTodoNotes.value.length, ...projectObject.todo.filter((o) => {
        return o.isCompleted == true;
      }))
    } else if(status == 'not-completed'){
      allTodoNotes.value.splice(0, allTodoNotes.value.length, ...projectObject.todo.filter((o) => {
        return o.isCompleted == false;
      }));
    } else {
      allTodoNotes.value.splice(0, allTodoNotes.value.length, ...projectObject.todo);
    }
}

const viewNote = (todoId) => {
    //get note
     editTodoId.value = todoId;
     let projectObject = JSON.parse(localStorage.getItem('project' + props.projectId));
     let Todo = projectObject.todo.find(todo => todo.todoId === todoId);
     viewTodoData.heading = Todo.heading;
     viewTodoData.text = Todo.text;
     viewTodoData.isCompleted = Todo.isCompleted;
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
    renderTodo(status.value);
});
</script>

<template>
     <div class="flex justify-end me-6">
      <div class="flex text-xs gap-x-2 mt-3">
        <button @click="status = status == 'completed' ? '' : 'completed'" :class="completedBtnClass">Completed</button>
        <button @click="status = status == 'not-completed' ? '' : 'not-completed'" :class="inCompletedBtnClass">Incomplete</button>
        <button 
        @click="addTodoModal = !addTodoModal"
        class="ms-1 h-[2.4vh] w-[3vh] flex items-center justify-center p-0 bg-blue-500 text-white rounded cursor-pointer">
        +
      </button>
    </div>

    </div>
    <h2 class="text-lg font-bold mb-2" v-show="allTodoNotes.length > 0">Todo List</h2>
        <!-- div to render todo list -->
        <div class="flex flex-col items-center gap-2 h-[70vh] w-[84vw] overflow-y-auto" v-if="allTodoNotes.length > 0">
          <div @click="viewNote(value.todoId)" class="relative w-[70%] sm:w-[60%] lg:w-[49%] xl:w-[40%] h-18 sm:h-20 rounded-xl cursor-pointer ms-2 truncate p-2"
           :class="value.isCompleted ? 'bg-gray-400 opacity-70' : 'bg-blue-200'" v-for="(value, index) in paginatedTodos">
           <span @click.stop="updateCompletedStatus(value.todoId)" class="absolute top-0.5 right-0.5 w-5 h-5 rounded-full border-2 border-gray-600" title="Mark as completed"></span>
           <p class="truncate">{{ value.heading ? value.heading : '-' }}</p>
              <hr>
              <p class="truncate">{{value.text}}</p>
              <span class="absolute text-[60%] truncate right-2 bottom-0 text-gray-700">{{value.createdAt.split(' ')[0]}}</span>
            </div>
        </div>

      <div v-else>
         <p class="text-center mt-5"> No todo available </p>
      </div>
            <!-- pagination starts -->
      <div v-if="allTodoNotes.length > 0" class="flex justify-center h-10 w-[84vw]">
            <div
              v-if="totalPages > 1"
              class="flex justify-center items-center gap-2">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-2 bg-blue-400 rounded disabled:opacity-50 hover:bg-blue-600 cursor-pointer">
                Prev
              </button>
              <span class="text-sm">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="px-2 bg-blue-400 rounded disabled:opacity-50 hover:bg-blue-600 cursor-pointer">
                Next
              </button>
            </div>
        </div>
      <!-- pagination ends -->
         <!-- modal to show the note -->
         <div v-show="addTodoModal"
             class="fixed inset-0 flex justify-center items-center h-full bg-gray bg-opacity-30 backdrop-blur-sm z-50"
             @click.self="addTodoModal = false">
          <div class="relative bg-blue-100 p-6 h-[30vh] w-[80vw] rounded shadow-lg
            sm:relative sm:bg-blue-100 sm:p-6 sm:h-[36vh] sm:w-[65vw] sm:rounded sm:shadow-lg
            lg:w-[60vw]
            xl:w-[50vw]" @click.stop>
              <h2 class="text-lg font-bold mb-2">Todo</h2>
              <input v-model="addTodoNote.heading" placeholder="Heading..." class="w-full border rounded mb-2 p-1 outline-black"></input>
              <textarea v-model="addTodoNote.text" placeholder="Text..." class="w-full h-[35%] border rounded mb-2 p-1 outline-black"></textarea>
              <button @click="addTodo()" class="bg-blue-600 text-white px-4 py-1 rounded cursor-pointer">Create</button>
          </div>
        </div>
          <!-- modal to show the note -->
          <div v-show="viewTodoModal"
             class="fixed inset-0 flex justify-center items-center bg-gray bg-opacity-30 backdrop-blur-sm z-50"
             @click.self="viewTodoModal = false">
              <div class="relative pb-10 p-6 h-[40vh] w-[80vw] sm:w-[50vw] rounded shadow-lg"
              :class="viewTodoData.isCompleted ? 'bg-gray-400 opacity-70' : 'bg-blue-100'" @click.stop>
              <h2 class="text-lg font-bold mb-2">Todo</h2>
              <input v-model="viewTodoData.heading" placeholder="Heading..." class="w-full border rounded mb-2 p-1"></input>
              <textarea v-model="viewTodoData.text" placeholder="Text..." class="w-full h-[70%] border rounded mb-2 p-1"></textarea>
              <button @click="updateNote()" class="bg-blue-600 text-white px-3 rounded cursor-pointer">Update</button>
          </div>
        </div>
</template>