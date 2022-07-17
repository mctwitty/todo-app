<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title has-text-info">{{ task.title }}</p>
    </header>
    <p class="card-content has-text-left" v-show="task.description != ''">{{ task.description }}</p>
    <footer class="card-footer">
      <a class="card-footer-item" @click="openModal" title="Edit"><font-awesome-icon icon="fa-solid fa-pencil" /></a>
      <a class="card-footer-item" v-if="!isCompleted" @click="modifyTask('promote')" title="Promote">
        <font-awesome-icon :icon="['fa-solid', isOngoing ? 'fa-check' : 'fa-play']" />
      </a>
      <a class="card-footer-item" @click="modifyTask('delete')" title="delete"><font-awesome-icon icon="fa-solid fa-trash" /></a>
    </footer>
  </div>
  <EditTaskModal v-if="showEditModal" :task="task" @closeModal="closeModal" @editTask="editTask"/>
</template>

<script>
import EditTaskModal from './EditTaskModal.vue'

export default {
  name: 'CardComponent',
  data() {
    return {
      showEditModal: false,
      isOngoing: this.task.stage == "Ongoing",
      isCompleted: this.task.stage == "Completed"
    }
  },
  props: ["task"],
  emits: ["modifyTask", "editTask"],
  methods: {
    modifyTask(action) {
      this.$emit("modifyTask", this.task.id, action)
    },
    openModal() {
      this.showEditModal = true
    },
    closeModal() {
      this.showEditModal = false
    },
    editTask(task) {
      this.$emit("editTask", task)
    }
  },
  components: {
    EditTaskModal
  }
}
</script>

<style>
  .card {
    margin-bottom: 1.5rem;
    border-radius: 1em;
  }
  .card-footer a {
    color: hsl(0deg, 0%, 48%);
  }

</style>