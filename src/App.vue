<template>
  <section class="hero is-primary">
    <div class="hero-body">
      <p class="heading is-size-3">
        The Vue TODO App
      </p>
    </div>
  </section>
  <section id="actions">
    <div class="buttons is-centered">
      <div class="button is-primary" @click="toggleNewModal">Create New Task</div>
      <div>
        <input id="advancedOptions" type="checkbox" class="switch is-rounded" v-model="advancedOptions">
        <label for="advancedOptions">Advanced Options</label>
      </div>
    </div>
    <div id="advanced" class="buttons is-centered" v-show="advancedOptions">
      <button class="button" @click="exportBackup">Create Backup</button>
      <div class="file">
        <label class="file-label">
          <input class="file-input" type="file" accept="text/json" ref="fileImport" @change="importJSON">
          <span class="file-cta">
            <span class="file-icon">
              <font-awesome-icon :icon="['fa-solid', 'fa-upload']" />
            </span>
            <span class="file-label">
              Import Backup
            </span>
          </span>
        </label>
      </div>
    </div>
  </section>
  <DevMode id="devMode" v-if="devMode"
    @test-event="loadAllTasksFromLS"
    @push-all-to-ls="pushAllTasksToLocalStorage"
    @load-sample-tasks="loadSampleTasks"
    @clear-all-tasks="clearAllTasks"
    @export-backup="exportBackup"
  />
  <div class="container">
    <div class="columns is-variable is-1">
      <TaskColumn column-header="Planning" :tasks="plannedTasks" @modifyTask="modifyTask" @editTask="editTask"/>
      <TaskColumn column-header="Ongoing" :tasks="ongoingTasks" @modifyTask="modifyTask" @editTask="editTask"/>
      <TaskColumn column-header="Completed Today" :tasks="completedToday" @modifyTask="modifyTask" @editTask="editTask"/>
    </div>
  </div>
  <NewTaskModal :showNewModal="showNewModal" :nextTaskId="nextTaskId" @toggle-new-modal="toggleNewModal" @create-new-task="createNewTask"/>
</template>

<script>
import TaskColumn from './components/TaskColumn.vue'
import NewTaskModal from './components/NewTaskModal.vue'

import DevMode from './components/DevMode.vue'
import sampleTasks from './data/tasks.json'

// helper functions
function getNextStage(currentStage) {
  let nextStage
  if(currentStage == "Planning") {
    nextStage = "Ongoing"
  } else {
    nextStage = "Completed"
  }
  return nextStage
}
function pushTaskToLocalStorage(task) {
  localStorage.setItem(task.id.toString(), JSON.stringify(task))
}

// devMode functions 
function loadSampleTasks() {
  this.tasks = sampleTasks
}
function pushAllTasksToLocalStorage() {
  for(let i = 0; i < this.tasks.length; i++) {
    let task = this.tasks[i]
    localStorage.setItem(task.id.toString(), JSON.stringify(task))
  }
}
function loadTaskFromLS(id) {
  // unnecessary to load a single task?
  let task = localStorage.getItem(id.toString())
  console.log(JSON.parse(task))
}
function loadAllTasksFromLS() {
  // functionality moved to run on mount
  let storedTasks = Object.keys(localStorage)
  for(let i = 0; i < storedTasks.length; i++) {
    if(storedTasks[i] != "config") {
      this.tasks.push(JSON.parse(localStorage.getItem(storedTasks[i])))
    }
  }
}
function clearAllTasks() {
  // clear all task, leave config
  Object.keys(localStorage).forEach(key => {
    if(key != "config") {
      localStorage.removeItem(key)
    }
  })
  this.tasks = []
}
export default {
  name: 'App',
  data() {
    return {
      devMode: true,
      advancedOptions: false,
      tasks: [],
      refreshKey: 0,
      showNewModal: false,
      showEditModal: false,
      config: {},
      nextTaskId: 0
    }
  },
  methods: {
    modifyTask(id, action) {
      let index = this.tasks.findIndex((task) => task.id == id)

      if(action == 'promote') {
        let stage = this.tasks[index].stage
        let nextStage = getNextStage(stage)
        this.tasks[index].stage = nextStage
        if(nextStage == "Completed") {
          this.tasks[index].completedDate = (new Date).toJSON()
        }
      } else if(action == 'delete') {
        this.tasks[index].stage = "Deleted"
      }
      pushTaskToLocalStorage(this.tasks[index])
      this.refreshKey++
    },
    toggleNewModal() {
      this.showNewModal = !this.showNewModal
    },
    createNewTask(task) {
      this.tasks.push(task)
      pushTaskToLocalStorage(task)
      this.nextTaskId++
    },
    editTask(task) {
      let index = this.tasks.findIndex((t) => t.id == task.id)
      this.tasks[index].title = task.title
      this.tasks[index].description = task.description
      pushTaskToLocalStorage(this.tasks[index])
    },
    exportBackup() {
      const file = new Blob([JSON.stringify(this.tasks)], { type: 'text/json' })
      let link = document.createElement("a")
      link.download = "task" + Date.now() + ".json"
      link.href = window.URL.createObjectURL(file)
      link.dataset.downloadurl = ["text/json", link.download, link.href].join(":")
      link.click()
      link.remove()
    },
    importJSON() {
      // this input doesn't allow multiple files
      const file = this.$refs["fileImport"].files[0]
      if(file) {
        file.text().then(data => {
          let importedTasks = JSON.parse(data)
          // TODO: validate importedTasks

          // clear old tasks from local storage
          Object.keys(localStorage)
            .filter(key => key != "config")
            .forEach(key => localStorage.removeItem(key))
          // set imported tasks
          this.tasks = importedTasks
          // push imported tasks to localStorage
          importedTasks.forEach(task => localStorage.setItem(task.id.toString(), JSON.stringify(task)))
        })
      }
    },
    pushTaskToLocalStorage,
    // devMode functions
    loadSampleTasks,
    loadTaskFromLS,
    loadAllTasksFromLS,
    pushAllTasksToLocalStorage,
    clearAllTasks
  },
  computed: {
    plannedTasks() {
      this.refreshKey
      return this.tasks.filter(task => task.stage == "Planning")
    },
    ongoingTasks() {
      this.refreshKey
      return this.tasks.filter(task => task.stage == "Ongoing")
    },
    // completedTasks no longer used, can be removed
    completedTasks() {
      this.refreshKey
      return this.tasks.filter(task => task.stage == "Completed")
    },
    completedToday() {
      this.refreshKey
      return this.tasks.filter(task => (task.stage == "Completed" && (new Date(task.completedDate)).toDateString() == (new Date).toDateString()))
    },
    totalTasks() {
      return this.tasks.length
    }
  },
  components: {
    TaskColumn,
    NewTaskModal,
    DevMode
  },
  mounted() {
    // load config if it exists
    if(!("config" in localStorage)) {
      localStorage.setItem("config", JSON.stringify({ devMode: "false" }))
    }
    this.config = JSON.parse(localStorage.getItem("config"))
    this.devMode = (this.config.devMode == "true")

    // load tasks from local storage
    let storedTasks = Object.keys(localStorage).filter(key => key != "config")
    storedTasks.sort((a, b) => Number(a) - Number(b))
    for(let i = 0; i < storedTasks.length; i++) {
      this.tasks.push(JSON.parse(localStorage.getItem(storedTasks[i])))
    }
    // calculate next id
    if(this.tasks.length > 0) {
      this.nextTaskId = Math.max.apply(null, this.tasks.map(task => Number(task.id))) + 1
    }
  },
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.hero {
  margin-bottom: 20px;
}
#actions {
  margin: 20px;
}
#actions .button, #devMode .button {
  margin-bottom: 0px;
}
</style>
