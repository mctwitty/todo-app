import { createApp } from 'vue'
import App from './App.vue'
require('./assets/main.scss')

/* import fontawesome */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPlay, faPencil, faTrash, faCheck, faUpload } from '@fortawesome/free-solid-svg-icons'
library.add(faPlay, faPencil, faTrash, faCheck, faUpload)

createApp(App)
.component('font-awesome-icon', FontAwesomeIcon)
.mount('#app')