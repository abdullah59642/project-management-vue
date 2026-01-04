import {defineStore} from 'pinia'
import {ref} from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

export const useProjectStore = defineStore("projectStore", () => {
    let userProjects = ref([]);
    const router = useRouter();
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

    function deleteProject(projectId){
        localStorage.removeItem('project' + projectId);
        renderAllProjects(); 
        router.push('/');
    }

    let renderAllProjects = () => {
        //first empty the projects
        userProjects.value = [];
        let allProjectNumbers = [];
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("project")) {
            let num = parseInt(key.replace("project", ""));
            allProjectNumbers.push(num);
          }
        });
        if(allProjectNumbers.length > 0) {
          allProjectNumbers.forEach(i => {
          let data = localStorage.getItem('project' + i);
          let project = JSON.parse(data);
          userProjects.value.push(
            {
              name: project.name,
              projectKey: i,
            });
          });
      }
    }

    return {addProject, renderAllProjects, userProjects, deleteProject};
});