import {defineStore} from 'pinia'
import {ref} from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

export const useProjectStore = defineStore("projectStore", () => {

    const addProject = (...data) => {
        let i = 0;
        do {
          ++i;
        } while(localStorage.getItem('project' + i) !== null);
        let key = 'project' + i;
        const project = {
            name: data[0],
            description: data[1],
            notes: [],
            todo: [],
        };
        localStorage.setItem(key, JSON.stringify(project));
        return true;
    }
    return {addProject};
});