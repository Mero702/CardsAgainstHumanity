import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuePlugin from "@highlightjs/vue-plugin"
import 'highlight.js/styles/atom-one-dark.css'
createApp(App).use(router).use(vuePlugin).mount('#app')
