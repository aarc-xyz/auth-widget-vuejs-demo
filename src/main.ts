import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import Aarc from '@aarc-dev/auth-widget-vuejs'
import '../node_modules/@aarc-dev/auth-widget-vuejs/dist/style.css'

const app = createApp(App)
app.use(createPinia())

Aarc.initAarcAuthKit(app)

app.mount('#app')
