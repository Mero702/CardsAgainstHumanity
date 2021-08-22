import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Game from '../views/Game.vue'

const routes = [
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
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Create.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
