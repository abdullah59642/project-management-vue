<script setup>
import { onMounted, computed, ref, reactive, watch } from 'vue';
const currentPage = ref(1);
const pageSize = ref(16);
const paginatedNotes = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return sortedNotes.value.slice(start, end)
});
const totalPages = computed(() => {
  return Math.ceil(sortedNotes.value.length / pageSize.value)
});
const sortedNotes = computed(() => {
  return [...AllNotes].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt)
  });
});
const updatePageSize = () => {
  if (window.innerWidth < 640) {
    pageSize.value = 8;
  } else {
    pageSize.value = 16;
  }
};

let AllNotes = reactive([]);
let showAddNotesModal = ref(false);
let viewNoteModal = ref(false);
let editNoteId = ref();
let noteData = reactive({
      heading: "",
      text: "",
});

let viewNoteData = reactive({
      heading: "",
      text: "",
});

const props = defineProps({
  projectId: String,
});

//watch for changes in prop to load notes
watch(
    () => props.projectId,
    () => {
      loadCurrentProjectNotes();
});

const viewNote = (noteId) => {
  //get note
     editNoteId.value = noteId;
     let projectObject = JSON.parse(localStorage.getItem('project' + props.projectId));
     let Note = projectObject.notes.find(note => note.noteId === noteId);
     viewNoteData.heading = Note.heading;
     viewNoteData.text = Note.text;
     viewNoteModal.value = true;
}

const loadCurrentProjectNotes = () => {
    let projectObject = JSON.parse(localStorage.getItem('project' + props.projectId));
    AllNotes.splice(0, AllNotes.length, ...projectObject.notes);
    currentPage.value = 1;
}

const updateNote = () => {
  let projectObject = JSON.parse(localStorage.getItem('project' + props.projectId));
  let editNote = projectObject.notes.find(note => note.noteId === editNoteId.value);
  editNote.heading = viewNoteData.heading;
  editNote.text = viewNoteData.text;
  //store the note
  localStorage.setItem('project' + props.projectId, JSON.stringify(projectObject));
  viewNoteModal.value = false;
  loadCurrentProjectNotes();
}

const storeNote = () => {
  let key = 'project' + props.projectId;
  let projectString = localStorage.getItem(key);
  let project = JSON.parse(projectString);
  const now = new Date();
  let newNote = {
    noteId: project.notes.length + 1,
    heading: noteData.heading,
    text: noteData.text,
    createdAt: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`,
  };
  project.notes.push(newNote);
  localStorage.setItem(key, JSON.stringify(project));
  noteData.heading = "";
  noteData.text = "";
  showAddNotesModal.value = false;
  loadCurrentProjectNotes();
}

const deleteNote = () => {
    let projectObject = JSON.parse(localStorage.getItem('project' + props.projectId));
    projectObject.notes = projectObject.notes.filter(note => note.noteId !== editNoteId.value);
    localStorage.setItem('project' + props.projectId, JSON.stringify(projectObject));
    viewNoteModal.value = false;
    loadCurrentProjectNotes();
}

onMounted(() => {
  updatePageSize();
  loadCurrentProjectNotes();
  window.addEventListener('resize', updatePageSize);
});
</script>

<template>
    <div class="flex justify-end me-6">
     <button @click="showAddNotesModal = !showAddNotesModal" class="mt-2.5 ms-1 h-[2.4vh] w-[3vh] flex items-center justify-center p-0 bg-blue-500 text-white rounded cursor-pointer">+</button>
    </div>
      <div v-show="showAddNotesModal"
        class="fixed inset-0 flex justify-center items-center bg-gray bg-opacity-30 backdrop-blur-sm z-50"
        @click.self="showAddNotesModal = false">
        <div class="bg-blue-100 p-6 h-[50vh] w-[80vw] rounded shadow-lg
        sm:h-[60vh] sm:w-[70vw]" @click.stop>
          <h2 class="text-lg font-bold mb-2">Create a note</h2>
          <input v-model="noteData.heading" placeholder="Heading..." class="w-full border rounded mb-2 p-1 outline-black"></input>
          <textarea v-model="noteData.text" placeholder="Text..." class="w-full h-[70%] border rounded mb-2 p-1 outline-black"></textarea>
          <button @click="storeNote" class="bg-blue-600 text-white px-4 py-1 rounded cursor-pointer">Save</button>
          </div>
        </div>

      <h2 class="font-bold mb-2" v-show="AllNotes.length > 0"> Notes </h2>
        <div class="ps-10 flex flex-wrap content-start gap-2 h-[65vh] sm:h-[75vh] w-[90vw] sm:w-[90vw] overflow-y-auto min-h-0 z-0" v-if="AllNotes.length > 0">
            <div v-for="value in paginatedNotes"
                :key="value.noteId"
                @click="viewNote(value.noteId)"
                class="relative bg-blue-200 w-[44%] sm:w-[21%] h-40 rounded-sm cursor-pointer sm:ms-2 truncate p-2 z-0">
                <p class="truncate">{{value.heading}}</p>
                <hr>
                <p class="truncate">{{value.text}}</p>
                <span class="absolute text-[60%] truncate right-2 bottom-0 text-gray-700">{{value.createdAt.split(" ")[0]}}</span>
          </div>
      </div>

      <div v-else>
         <p class="text-center"> No notes available </p>
      </div>
      <div class="sticky bottom-0 flex justify-center h-10 w-[84vw] ">
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
      <!-- modal to show the note -->
           <div v-show="viewNoteModal" class="fixed inset-0 flex justify-center items-center bg-gray bg-opacity-30 backdrop-blur-sm z-50"
             @click.self="viewNoteModal = false">
              <div class="relative p-6 h-[60vh] w-[76vw] bg-blue-100  rounded shadow-lg" @click.stop>
              <h2 class="text-lg font-bold mb-2">Note</h2>
             <button @click="deleteNote()" class="bg-red-600  rounded-sm p-1 hover:bg-red-800 cursor-pointer absolute right-6 top-3"> Delete </button>
              <input v-model="viewNoteData.heading" placeholder="Heading..." class="w-full border rounded mb-2 p-1 outline-black"></input>
              <textarea v-model="viewNoteData.text" placeholder="Text..." class="w-full h-[70%] border rounded mb-2 p-1 outline-black"></textarea>
              <button @click="updateNote()" class="bg-blue-600 text-white px-4 py-1 rounded cursor-pointer">Update</button>
          </div>
        </div>
</template>