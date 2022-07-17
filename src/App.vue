<template>
  <section class="hero is-primary">
    <div class="hero-body">
      <p class="heading is-size-3">
        The TODO App
      </p>
    </div>
  </section>
  <section id="actions" class="buttons is-centered">
    <div class="button is-primary" @click="toggleNewModal">Create New Task</div>
    <DevMode v-if="devMode" @test-event="loadTaskFromLS"/>
  </section>
  <div class="container">
    <div class="columns is-variable is-1">
      <TaskColumn column-header="Planning" :tasks="plannedTasks" @modifyTask="modifyTask" @editTask="editTask"/>
      <TaskColumn column-header="Ongoing" :tasks="ongoingTasks" @modifyTask="modifyTask" @editTask="editTask"/>
      <TaskColumn column-header="Completed Today" :tasks="completedToday" @modifyTask="modifyTask" @editTask="editTask"/>
    </div>
  </div>
  <NewTaskModal :showNewModal="showNewModal" :numberOfTasks="totalTasks" @toggleNewModal="toggleNewModal" @create-new-task="createNewTask"/>
</template>

<script>
import TaskColumn from './components/TaskColumn.vue'
import NewTaskModal from './components/NewTaskModal.vue'
import DevMode from './components/DevMode.vue'
import tasks from './data/tasks.json'

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
// devMode functions 
function pushTaskToLocalStorage(task) {
  localStorage.setItem(task.id.toString(), JSON.stringify(task))
}
function loadAllTasksToLocalStorage() {
  for(let i = 0; i < this.tasks.length; i++) {
    let task = this.tasks[i]
    localStorage.setItem(task.id.toString(), JSON.stringify(task))
  }
}
function loadTaskFromLS(id) {
  let task = localStorage.getItem(id.toString())
  console.log(JSON.parse(task))
}
export default {
  name: 'App',
  data() {
    return {
      devMode: true,
      tasks: [],
      refreshKey: 0,
      showNewModal: false,
      showEditModal: false
    }
  },
  methods: {
    modifyTask(id, action) {
      let index = tasks.findIndex((task) => task.id == id)

      if(action == 'promote') {
        let stage = tasks[index].stage
        let nextStage = getNextStage(stage)
        tasks[index].stage = nextStage
        if(nextStage == "Completed") {
          tasks[index].completedDate = (new Date).toJSON()
        }
      } else if(action == 'delete') {
        tasks[index].stage = "Deleted"
      } else if(action == 'edit') {
        this.showEditModal = true
      }
      this.refreshKey++
    },
    toggleNewModal() {
      this.showNewModal = !this.showNewModal
    },
    createNewTask(task) {
      this.tasks.push(task)
    },
    editTask(task) {
      let index = tasks.findIndex((t) => t.id == task.id)
      tasks[index].title = task.title
      tasks[index].description = task.description
    },
    // devMode functions
    pushTaskToLocalStorage,
    loadAllTasksToLocalStorage,
    loadTaskFromLS
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
    if(this.devMode) this.tasks = tasks
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
