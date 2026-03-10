<script setup>
import { onMounted, ref, reactive, watch, computed} from 'vue'
let notes = ref([]);
let notesData = reactive({
  totalNotes : 0,
  createdToday : 0,
  createdThisWeek : 0,
  createdThisMonth : 0,
  lastNoteTime : '',
});

let todo = ref([]);
let todosData = reactive({
  totaltodos : 0,
  completedTodos : 0,
  unCompletedTodos : 0,
  pendingTodos : 0,
  lastTodoTime : '',
  createdToday: 0,
  createdThisWeek: 0,
  createdThisMonth: 0,
});

let projectObject = ref([]);
const props = defineProps({
  projectId: String
});

const getProjectStars = computed(() => {
  const completedTodos = todosData.completedTodos || 0;
  const totalTodos = todosData.totaltodos || 0;
  const totalNotes = notesData.totalNotes || 0;
  let stars = 0;
  if (totalTodos > 0) {
    const p = (completedTodos / totalTodos) * 100;
    if (p >= 90) stars = 3;   
    else if (p >= 70) stars = 3;
    else if (p >= 50) stars = 2;
    else if (p >= 30) stars = 1;
  }

const notesAreEnough = totalNotes > 0;
  if (notesAreEnough && stars < 5) {
    if(totalNotes <= 5) {
      stars += 0; 
    } else if(totalNotes <= 25){
      stars += 1;
    } else if(totalNotes >= 25){
      stars += 2;
    }
  }
  return stars;
});

const todoCompletionPercentage = computed(() => {
  if(!todosData.totaltodos) return 0;
  return Math.round(
    (todosData.completedTodos / todosData.totaltodos) * 100
  );
});

const getTodoStars = computed(() => {
  const p = todoCompletionPercentage.value;
  if (p >= 90) return 5;
  if (p >= 70) return 4;
  if (p >= 50) return 3;
  if (p >= 30) return 2;
  if (p > 0) return 1;
  return 0;
});

//watch for changes in prop to load notes
watch(
    () => props.projectId,
    () => {
      loadCurrentProject();
      if(notes.value.length > 0) loadNotesData();
      if(todo.value.length > 0) loadTodoData();
});

const loadCurrentProject = () => {
    projectObject.value = JSON.parse(localStorage.getItem('project' + props.projectId));
    notes.value = projectObject.value.notes;
    todo.value = projectObject.value.todo;
}

//suggestions make it HIGH PRIORITY TODOS HERE FILTER AND ADD IN THE COMPONENT TOO
const loadTodoData = () => {
  let currentWeekDates = getDates('week');
  let currentMonthDates = getDates('month');
  let todaytodos = [];
  let thisWeekTodos = [];
  let thisMonthTodos = [];
  // today todo
  const todayDate = new Date().toISOString().split('T')[0];
  todaytodos = todo.value.filter((todo)=> {
    return todo.createdAt.split(' ')[0] == todayDate;
  });
  todosData.createdToday = todaytodos.length;
  //this week todos
  thisWeekTodos = todo.value.filter((todo) => {
    return currentWeekDates.includes(todo.createdAt.split(' ')[0]);
  });
  todosData.createdThisWeek = thisWeekTodos.length;

  //this month todos
  thisMonthTodos = todo.value.filter((todo) => {
    return currentMonthDates.includes(todo.createdAt.split(' ')[0]);
  });
  todosData.createdThisMonth = thisMonthTodos.length;

  todosData.totaltodos = todo.value.length;
  todosData.completedTodos = todo.value.filter(t => t.isCompleted == true).length;
  todosData.unCompletedTodos = todo.value.filter(t => t.isCompleted == false).length;
  todosData.pendingTodos = todosData.unCompletedTodos;
  let lastTodo = todo.value[todo.value.length - 1];
  todosData.lastTodoTime = convertToTime(lastTodo.createdAt);
}

let loadNotesData = () => {
  let currentWeekDates = getDates('week');
  let currentMonthDates = getDates('month');
  let todayNotes = [];
  let thisWeekNotes = [];
  let thisMonthNotes = [];
  //total notes
  notesData.totalNotes = projectObject.value.notes.length;
  const todayDate = new Date().toISOString().split('T')[0];
  todayNotes = notes.value.filter((note)=> {
    return note.createdAt.split(' ')[0] == todayDate;
  });
  notesData.createdToday = todayNotes.length;
  //this weeks notes
  thisWeekNotes = notes.value.filter((note) => {
    return currentWeekDates.includes(note.createdAt.split(' ')[0]);
  });
  notesData.createdThisWeek = thisWeekNotes.length;
  //this month notes
  thisMonthNotes = notes.value.filter((note) => {
    return currentMonthDates.includes(note.createdAt.split(' ')[0]);
  });
  notesData.createdThisMonth = thisMonthNotes.length;
  //get last note time
  let lastNote = projectObject.value.notes[projectObject.value.notes.length - 1];
  notesData.lastNoteTime = convertToTime(lastNote.createdAt);
}


const convertToTime = (dateString) => {
  const [datePart, timePart] = dateString.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute, second] = timePart.split(':').map(Number);
  // Create a Date in local time
  const past = new Date(year, month - 1, day, hour, minute, second);
  const now = new Date();
  // Calculate difference in seconds
  const diffSec = Math.floor((now.getTime() - past.getTime()) / 1000);
  if (diffSec < 60) return `${diffSec} second(s) ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute(s) ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} hour(s) ago`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay} day(s) ago`;
  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth} month(s) ago`;
  const diffYear = Math.floor(diffMonth / 12);
  return `${diffYear} years ago`;
};

const getDates = (value) => {
  if(value == 'week'){
    const today = new Date();
    const currentDay = new Date(today);
    const day = currentDay.getDay(); // 0 (Sun) - 6 (Sat)
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const startOfWeek = new Date(currentDay);
    startOfWeek.setDate(currentDay.getDate() + diffToMonday);
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date.toISOString().split('T')[0]);
    }
    return weekDates;
  } else {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const monthDates = [];
    for (
      let date = new Date(startOfMonth);
      date <= endOfMonth;
      date.setDate(date.getDate() + 1)
    ) {
      monthDates.push(date.toISOString().split('T')[0]);
    }
    return monthDates;
  }
};

onMounted(() => {
  loadCurrentProject();
  if(notes.value.length > 0) loadNotesData();
  if(todo.value.length > 0) loadTodoData();
});
</script>

<template>
<h2 class="text-md font-bold mb-2" >Project Progress</h2>
<div class="flex items-center sm:items-start sm:flex-row space-y-3 flex-col sm:justify-between sm:p-4  sm:h-[calc(100vh-180px)]">
  <div class="rounded-xl bg-gray-300 min-h-[20vh] sm:h-[50%] w-[73%] sm:w-[25%] overflow-y-auto pb-3">
    <h3 class="text-center text-sm sm:text-sm truncate mt-2">Notes Progress</h3>
    <div v-if="notes.length > 0">
      <div class="flex flex-col ms-4 text-xs sm:text-sm mt-4">
       <span class="truncate">Total notes: {{notesData.totalNotes}}</span>
       <span class="truncate">Created today: {{notesData.createdToday}}</span>
       <span class="truncate">Created this week: {{notesData.createdThisWeek}} </span>
       <span class="truncate">Created this month: {{notesData.createdThisMonth}} </span>
       <span class="truncate">Last note created: {{notesData.lastNoteTime}} </span>
      </div>
    </div>
    <div v-else>
      <div class="flex justify-center mt-10">
      <span class="text-xs truncate text-center">No notes found </span>
      </div>
    </div>
  </div>

  <div class="rounded-xl bg-gray-300 min-h-[20vh] sm:h-[50%] w-[73%] sm:w-[25%] overflow-y-auto pb-3">
    <h3 class="text-center text-sm sm:text-sm truncate mt-2">Todo Progress</h3>
    <div v-if="todo.length > 0">
    <!-- rating -->
    <div class="flex items-center justify-center space-x-1 cursor-pointer">
    <svg
          v-for="i in 5"
          :key="i"
          class="w-5 h-5"
          :class="i <= getTodoStars ? 'text-yellow-500 outline-1' : 'text-gray-200 outline-1'"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
      <path d="M12 2.25l2.94 6.1 6.73.98-4.87 4.74 1.15 6.7L12 17.9l-6.02 3.17 1.15-6.7-4.87-4.74 6.73-.98L12 2.25z"/>
    </svg>
  </div>
      <!-- end rating -->
      <div class="flex flex-col ms-4 text-xs sm:text-sm mt-4">
          <span class="truncate">Total Todos: {{todosData.totaltodos}}</span>
          <span class="truncate">Pending Todos: {{todosData.pendingTodos}} </span>
          <span class="truncate">Completed todos: {{todosData.completedTodos}}</span>
          <span class="truncate">Uncompleted Todos: {{todosData.unCompletedTodos}} </span>
          <span class="truncate">Created today: {{todosData.createdToday}} </span>
          <span class="truncate">Created this week: {{todosData.createdThisWeek}} </span>
          <span class="truncate">Created this month: {{todosData.createdThisMonth}} </span>
          <span class="truncate">Last todo created: {{todosData.lastTodoTime}} </span>
        </div>
      </div>
      <div v-else>
        <div class="flex justify-center mt-10">
          <span class="text-xs truncate text-center">No Todo found </span>
       </div>
      </div>
  </div>

<div class="rounded-xl mb-5 bg-gray-300 min-h-[20vh] sm:h-[50%] w-[73%] sm:w-[25%] overflow-y-auto pb-3">
    <h3 class="text-center text-sm sm:text-sm truncate mt-2">Project Progress</h3>
    <div v-if="todo.length > 0 || notes.length > 0">
      <!-- project stars -->
      <div class="flex items-center justify-center space-x-1 cursor-pointer">
    <svg
          v-for="i in 5"
          :key="i"
          class="w-5 h-5"
          :class="i <= getProjectStars ? 'text-yellow-500 outline-1' : 'text-gray-200 outline-1'"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
      <path d="M12 2.25l2.94 6.1 6.73.98-4.87 4.74 1.15 6.7L12 17.9l-6.02 3.17 1.15-6.7-4.87-4.74 6.73-.98L12 2.25z"/>
    </svg>
    </div>
    <!-- end project stars -->
    <div class="flex flex-col ms-4 text-xs sm:text-sm">
      <span class="truncate underline">Project Notes:</span>
      <span class="truncate ">Total notes: {{notesData.totalNotes}}</span>
       <span class="truncate ">Created today: {{notesData.createdToday}}</span>
       <span class="truncate ">Created this week: {{notesData.createdThisWeek}} </span>
       <span class="truncate ">Created this month: {{notesData.createdThisMonth}} </span>
       <span class="truncate mb-2 ">Last note created: {{notesData.lastNoteTime}} </span>
    </div>
    <div class="flex flex-col ms-4 text-xs sm:text-sm">
      <span class="truncate underline">Project Todos:</span>
      <span class="truncate">Total Todos: {{todosData.totaltodos}}</span>
       <span class="truncate">Pending Todos: {{todosData.pendingTodos}} </span>
       <span class="truncate">Completed todos: {{todosData.completedTodos}}</span>
       <span class="truncate">Uncompleted Todos: {{todosData.unCompletedTodos}} </span>
       <span class="truncate">Created today: {{todosData.createdToday}} </span>
       <span class="truncate">Created this week: {{todosData.createdThisWeek}} </span>
       <span class="truncate">Created this month: {{todosData.createdThisMonth}} </span>
       <span class="truncate">Last todo created: {{todosData.lastTodoTime}} </span>
    </div>
    </div>
    <div v-else>
      <div class="flex justify-center mt-10">
     <span class="text-xs truncate text-center">No Progress Available</span>
     </div>
    </div>
  </div>
</div>
</template>