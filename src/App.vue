<template>
  <section class="hero is-primary">
    <div class="hero-body">
      <p class="heading is-size-3">
        The Vue TODO App
      </p>
    </div>
  </section>
  <section id="actions" class="buttons is-centered">
    <div class="button is-primary" @click="toggleNewModal">Create New Task</div>
    <DevMode v-if="devMode"
      @test-event="loadAllTasksFromLS"
      @push-all-to-ls="pushAllTasksToLocalStorage"
      @load-sample-tasks="loadSampleTasks"
      @clear-all-tasks="clearAllTasks"
    />
  </section>
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
    pushTaskToLocalStorage,
    // devMode functions
    loadSampleTasks,
    pushAllTasksToLocalStorage,
    loadTaskFromLS,
    loadAllTasksFromLS,
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
    // if(this.devMode) this.tasks = sampleTasks

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
  // margin-top: 60px;
}
.hero {
  margin-bottom: 20px;
}
#actions {
  margin: 20px;
}
</style>
