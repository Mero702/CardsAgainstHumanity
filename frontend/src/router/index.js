import { createRouter, createWebHistory } from "vue-router";
import Home from '../views/Home.vue';
import Game from '../views/Game.vue';
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
            component: () => import('../views/Create.vue')
        },
        {
            path: '/help',
            name: 'Help',
            component: () => import('../views/Help.vue')
        }
    ],
});
export default router;
