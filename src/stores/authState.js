import {defineStore} from 'pinia'
import {ref} from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

export const useAuthStore = defineStore("authStore", () => {
    const isUserLoggedIn = ref(false);
    const userName = ref('');

    //user Auth state
    if (localStorage.getItem('isLoggedIn') === 'true') {
        isUserLoggedIn.value = true;
        userName.value = localStorage.getItem('userName');
    } else {
        isUserLoggedIn.value = false;
    }

    const router = useRouter();
    const userLogin = (email, password) => {
        if(email === 'aa' && password === 'aa'){
            isUserLoggedIn.value = true;
            localStorage.setItem('isLoggedIn', true);
            if(!localStorage.getItem('userName')){
              localStorage.setItem('userName', 'User');
            }
            router.push('/')
            setTimeout(() => {
                toast.success('Login successfull!');
              }, 1000) 
        } else {
            toast.error('Invalid credientials');
        }
    };

    const LogOutUser = () => {
        localStorage.setItem('isLoggedIn', false);
        isUserLoggedIn.value = false;
        setTimeout(() => {
            toast.success('Logout successfull');
          }, 1000) 
    }

    return {isUserLoggedIn, userName, userLogin, LogOutUser};
});