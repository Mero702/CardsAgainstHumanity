import { createRouter, createWebHistory } from "vue-router";
import Home from '@/views/Home.vue'
import Game from '@/views/Game.vue'
import Create from '@/views/Create.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/game/:roomID',
      name: 'Game',
      component: Game
    },
    {
      path: '/create',
      name: 'Create',
      component: Create
    },
    {
      path: '/help',
      name: 'Help',
      component: () => import('../views/Help.vue')
    },
    {
      path: '/preview',
      name: 'Preview',
      component: () => import('../views/Preview.vue')
    }
  ],
});

export default router;
