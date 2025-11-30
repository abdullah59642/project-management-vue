<script setup>
import { onMounted, ref, reactive, watch } from 'vue'

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
  projectId: String
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
    console.log(AllNotes);
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
  let newNote = {
    noteId: project.notes.length + 1,
    heading: noteData.heading,
    text: noteData.text,
    createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
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
  loadCurrentProjectNotes();
});
</script>

<template>
    <div class="flex justify-end me-6">
     <button @click="showAddNotesModal = !showAddNotesModal" class="p-1 bg-blue-500 text-white rounded cursor-pointer">+</button>
    </div>
      <div v-show="showAddNotesModal"
        class="fixed inset-0 flex justify-center items-center bg-gray bg-opacity-30 backdrop-blur-sm z-50"
        @click.self="showAddNotesModal = false">
        <div class="bg-white p-6 h-[80vh] w-[80vw] rounded shadow-lg" @click.stop>
          <h2 class="text-lg font-bold mb-2">Create a note</h2>
          <input v-model="noteData.heading" placeholder="Heading..." class="w-full border rounded mb-2 p-1"></input>
          <textarea v-model="noteData.text" placeholder="Text..." class="w-full h-[70%] border rounded mb-2 p-1"></textarea>
          <button @click="storeNote" class="bg-blue-600 text-white px-4 py-1 rounded cursor-pointer">Save</button>
          </div>
        </div>

      <h2 class="font-bold mb-2" v-show="AllNotes.length > 0"> Notes </h2>
      <div class="flex flex-wrap gap-2 max-h-[77vh] w-[84vw]  overflow-y-auto" v-if="AllNotes.length > 0">
          <div @click="viewNote(value.noteId)" class="relative bg-blue-200 w-[21%] h-40 rounded-sm cursor-pointer ms-2 truncate p-2" v-for="(value, index) in AllNotes">
              <p class="truncate">{{value.heading}}</p>
              <hr>
              <p class="truncate">{{value.text}}</p>
              <span class="absolute text-[60%] truncate right-2 bottom-0 text-gray-700">{{value.createdAt}}</span>
          </div>
      </div>
      <div v-else>
         <p class="text-center"> No notes available </p>
      </div>
      <!-- modal to show the note -->
           <div v-show="viewNoteModal"
             class="fixed inset-0 flex justify-center items-center bg-gray bg-opacity-30 backdrop-blur-sm z-50"
             @click.self="viewNoteModal = false">
              <div class="relative p-6 h-[80vh] w-[80vw] bg-blue-100  rounded shadow-lg" @click.stop>
              <h2 class="text-lg font-bold mb-2">Note</h2>
             <button @click="deleteNote()" class="bg-red-600  rounded-sm p-1 hover:bg-red-800 cursor-pointer absolute right-6 top-3"> Delete </button>
              <input v-model="viewNoteData.heading" placeholder="Heading..." class="w-full border rounded mb-2 p-1"></input>
              <textarea v-model="viewNoteData.text" placeholder="Text..." class="w-full h-[70%] border rounded mb-2 p-1"></textarea>
              <button @click="updateNote()" class="bg-blue-600 text-white px-4 py-1 rounded cursor-pointer">Update</button>
          </div>
        </div>
</template>