<script setup>
  import {ref, reactive, computed, onMounted, nextTick} from 'vue';
  import { RouterLink } from 'vue-router'
  let isContentScrollAble = ref(false);
  let allProjects = ref([]);
  //all project data 
  let projectsData = reactive({
      totalProjects: 0,
      totalTodos: 0,
      totalCompletedTodos: 0,
      totalNotes: 0,
  });
  const scrollContainer = ref(null);
  const getAllProjects = () => {
      let totalTodos = 0;
      let totalNotes = 0;
      let totalCompletedTodos = [];
      allProjects.value = [];
      let allProjectNumbers = [];
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("project")) {
          let num = parseInt(key.replace("project", ""));
          allProjectNumbers.push(num);
        }
      });
      if(allProjectNumbers.length > 0){
        allProjectNumbers.forEach(i => {
          let data = localStorage.getItem('project' + i);
          let project = JSON.parse(data);
          allProjects.value.push({
            name: project.name,
            projectKey: i,
            projectTodo: project.todo,
            projectNotes: project.notes,
            todosData: {
              totaltodos : 0,
              completedTodos : 0,
              unCompletedTodos : 0,
              pendingTodos : 0,
              lastTodoTime : 'N/A',
              createdToday: 0,
              createdThisWeek: 0,
              createdThisMonth: 0,
            },
            notesData: {
              totalNotes : 0,
              createdToday : 0,
              createdThisWeek : 0,
              createdThisMonth : 0,
              lastNoteTime : 'N/A',
            },
          });
        });
      }
      allProjects.value.forEach(p => {
        totalTodos += p.projectTodo.length;
        totalNotes += p.projectNotes.length;
        //To load TODO data
        loadTodoData(p);
        //To load NOTES data
        loadNotesData(p);
        let completed = p.projectTodo.filter(todo => todo.isCompleted == true);
        totalCompletedTodos.push(...completed);
        projectsData.totalCompletedTodos = totalCompletedTodos.length;
      });
      projectsData.totalProjects = allProjects.value.length;
      projectsData.totalNotes = totalNotes;
      projectsData.totalTodos = totalTodos;
  }

//loading notes data
let loadNotesData = (p) => {
  let currentWeekDates = getDates('week');
  let currentMonthDates = getDates('month');
  let todayNotes = [];
  let thisWeekNotes = [];
  let thisMonthNotes = [];
    if (p.projectNotes.length > 0){
      const todayDate = new Date().toISOString().split('T')[0];
      //total notes
      p.notesData.totalNotes = p.projectNotes.length;
      todayNotes = p.projectNotes.filter((note)=> {
        return note.createdAt.split(' ')[0] == todayDate;
      });
      p.notesData.createdToday = todayNotes.length;
      //this weeks notes
      thisWeekNotes = p.projectNotes.filter((note) => {
        return currentWeekDates.includes(note.createdAt.split(' ')[0]);
      });
      p.notesData.createdThisWeek = thisWeekNotes.length;
      //this month notes
      thisMonthNotes = p.projectNotes.filter((note) => {
        return currentMonthDates.includes(note.createdAt.split(' ')[0]);
      });
      p.projectNotes.createdThisMonth = thisMonthNotes.length;
      //get last note time
      let lastNote = p.projectNotes[p.projectNotes.length - 1];
      p.notesData.lastNoteTime = convertToTime(lastNote.createdAt);
   }
}

//loading todo data 
const loadTodoData = (p) => {
  let currentWeekDates = getDates('week');
  let currentMonthDates = getDates('month');
  let todayTodos = [];
  let thisWeekTodos = [];
  let thisMonthTodos = [];
  if (p.projectTodo.length > 0){
    let lastTodo = p.projectTodo[p.projectTodo.length - 1];
    p.todosData.lastTodoTime = convertToTime(lastTodo.createdAt);
    p.todosData.totaltodos = p.projectTodo.length;
    p.todosData.completedTodos = p.projectTodo.filter(t => t.isCompleted == true).length;
    p.todosData.unCompletedTodos = p.projectTodo.filter(t => t.isCompleted == false).length;
    p.todosData.pendingTodos = p.projectTodo.filter(t => t.isCompleted == false).length;
    p.todosData.createdToday = todayTodos.length;
      //this week todos
      thisWeekTodos = p.projectTodo.filter((todo) => {
        return currentWeekDates.includes(todo.createdAt.split(' ')[0]);
      });
    p.todosData.createdThisWeek = thisWeekTodos.length;
      //this month todos
      thisMonthTodos = p.projectTodo.filter((todo) => {
        return currentMonthDates.includes(todo.createdAt.split(' ')[0]);
      });
    p.todosData.createdThisMonth = thisMonthTodos.length;
  }
}

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
        date.setDate(date.getDate() + 1)) {
        monthDates.push(date.toISOString().split('T')[0]);
      }
      return monthDates;
    }
  };

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

  const checkIfScrollAble = () => {
    let scrollElement = scrollContainer.value;
    if(!scrollElement) return;
    isContentScrollAble.value = scrollElement.scrollWidth > scrollElement.clientWidth;
  }

  const scrollLeft = () => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollBy({ left: -500, behavior: 'smooth' });
    }
  }

  const scrollRight = () => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollBy({ left: 500, behavior: 'smooth' });
    }
  }

  onMounted(() => {
      getAllProjects();
      nextTick(() => {
        checkIfScrollAble();
    })
  });

  //vanilla javascript
  window.addEventListener('resize', checkIfScrollAble);
  </script>
  
<template>
      <h1 class="text-center font-bold text-xl text-s sm:text-s">Project Management VUE</h1>
      <div class="ms-3 mt-2 text-xs sm:text-sm ">This project allows you to create projects as much as you want create notes and todos and keep the track of the progress of the created projects.</div>

<!-- analytics div -->
<div class="flex justify-center mt-4">
    <div class="rounded-xl bg-red-100 w-[50vw] md:w-[22vw] p-2">
      <!-- title -->
      <h1 class="mb-1 text-xs sm:text-sm">Overall Summary:</h1>
      <!-- grid -->
      <div class="grid grid-cols-2 grid-rows-2 gap-x-4 gap-y-1 text-sm text-center">
        <div class="bg-blue-200 rounded-xl flex items-center justify-center text-xs sm:text-m">Total Projects: {{ projectsData.totalProjects }}</div>
        <div class="bg-blue-200 rounded-xl flex items-center justify-center text-xs sm:text-m">Total Notes: {{ projectsData.totalNotes }}</div>
        <div class="bg-blue-200 rounded-xl text-xs flex items-center justify-center sm:text-m">Total Todos: {{ projectsData.totalTodos }}</div>
        <div class="bg-blue-200 rounded-xl text-xs flex items-center justify-center sm:text-m">Completed Todos: {{ projectsData.totalCompletedTodos }}</div>
      </div>
  </div>
</div>

<!-- end analytics div -->
      <div class="font-bold mt-2 text-sm sm:text-s">Your Projects</div>
      <!-- projects overview div with carousel -->
       <div class="relative p-4 h-[70vh]  w-[96vw]
       md:w-[87vw]">
        <h2 v-if="allProjects.length == 0" class="text-center mt-4">No Projects Found</h2>
        <!-- Left Arrow -->
        <button 
        v-if="isContentScrollAble"
          @click="scrollLeft"
          class="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-100 z-10 cursor-pointer">
          ←
        </button>
        <!-- Scrollable Container -->
        <div
          ref="scrollContainer"
          class="flex flex-col space-y-3  w-[100%] scroll-smooth overflow-y-auto lg:overflow-y-hidden
          h-full lg:flex-row lg:space-x-2 "> 
         <div v-for="project in allProjects" :key="project.projectKey" class="rounded-xl h-full bg-blue-400 cursor-pointer ">
            <!-- Your project card content here -->
            <RouterLink  class="block h-full w-full" :to="`/project/${project.projectKey}`">
              <h3 class="truncate ps-2 pt-1 text-sm">{{ project.name }}</h3>
              <hr></hr>
            <div class="flex flex-row space-x-2  p-2 text-white 
            lg:flex-col lg:w-[100%] lg:flex-1 lg:h-[95%] lg:gap-y-1 lg:space-x-0 overflow-x-hidden">
              <!-- todo data -->
              <div class="flex bg-blue-100 p-1 text-black rounded-xl flex-col flex-1 min-w-0 
             ">
                <h2 class="text-xs mt-1 underline">Todo Progress</h2>
                <h3 class="truncate text-xs">Total Todos: {{ project.todosData.totaltodos }}</h3>
                <h3 class="truncate text-xs">Last Todo: {{ project.todosData.lastTodoTime }}</h3>
                <h3 class="truncate text-xs">Completed Todos: {{ project.todosData.completedTodos }}</h3>
                <h3 class="truncate text-xs">Uncompleted Todos: {{ project.todosData.unCompletedTodos }}</h3>
                <h3 class="truncate text-xs">Pending Todos: {{ project.todosData.pendingTodos }}</h3>
                <h3 class="truncate text-xs">Created Today: {{ project.todosData.createdToday }}</h3>
                <h3 class="truncate text-xs">Created this Week: {{ project.todosData.createdThisWeek }}</h3>
                <h3 class="truncate text-xs">Created this Month: {{ project.todosData.createdThisMonth }}</h3>
              </div>
              <div class="flex bg-blue-100 text text-black p-1 rounded-xl flex-col flex-1 min-w-0
              ">
                <h2 class="text-xs mt-1 underline">Notes Progress</h2>
                <h3 class="truncate text-xs">Total Notes: {{ project.notesData.totalNotes}}sdsddssdsdsds</h3>
                <h3 class="truncate text-xs">Last Time Note: {{ project.notesData.lastNoteTime}}</h3>
                <h3 class="truncate text-xs">Created Today: {{ project.notesData.createdToday}}</h3>
                <h3 class="truncate text-xs">Created this Week: {{ project.notesData.createdThisWeek}}</h3>
                <h3 class="truncate text-xs">Created this Month: {{ project.notesData.createdThisMonth}}</h3>
              </div>
            </div>
          </RouterLink>
          </div>
        </div>
        <!-- Right Arrow -->
        <button
          v-if="isContentScrollAble"
          @click="scrollRight"
          class="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-100 z-10 cursor-pointer">
          →
        </button>
      </div>
</template>

<!-- <style scoped>
  /* Hide scrollbar but keep functionality  */
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style> -->