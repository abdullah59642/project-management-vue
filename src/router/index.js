import { createRouter, createWebHistory } from 'vue-router'
import About from '../components/About.vue'
import Login from '../components/Login.vue'
import Settings from '../components/Settings.vue'
import Welcome from '../components/Welcome.vue'
import ProjectView from '../components/ProjectView.vue'
import { useAuthStore } from '@/stores/authState'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/about',
      component: About,
    },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/',
      component: Welcome,
    },
    {
      path: '/settings',
      component: Settings,
    },
    {
      path: '/project/:id',
      component: ProjectView,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.path === '/login' && authStore.isUserLoggedIn) {
    next('/');
  } 
  else if(to.path === '/settings' && !authStore.isUserLoggedIn){
    next('/login');
  } 
  else {
    next();
  }
})


export default router