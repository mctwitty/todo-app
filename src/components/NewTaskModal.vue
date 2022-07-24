<template>
  <div class="modal" :class="{ 'is-active': showNewModal}">
    <div class="modal-background" @click="reset"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Create New Task</p>
        <button class="delete" aria-label="close" @click="reset"></button>
      </header>
      <section class="modal-card-body has-text-left">
        <div class="field">
          <label class="label">Title</label>
          <div class="control">
            <input class="input" type="text" v-model="title">
          </div>
        </div>
        <div class="field">
          <label class="label">Description</label>
          <div class="control">
            <textarea class="textarea" v-model="description"></textarea>
          </div>
        </div>
        <div class="buttons is-right">
          <button class="button is-success" @click.prevent="createNewTask">Create</button>
        </div>
      </section>
      <footer class="modal-card-footer"></footer>
    </div>
    <div class="notificationCenter">
      <div v-for="n in notifications" :key="n.id" class="notification is-success has-text-left">
        <button class="delete" @click="removeNotification(n.id)"></button>
        <p>Created: {{ n.title }}</p>
      </div>
    </div> 
  </div>
</template>

<script>
  export default {
    name: "NewTaskModal",
    data() {
      return {
        title: '',
        description: '',
        notifications: []
      }
    },
    props: ['showNewModal', 'nextTaskId'],
    methods: {
      reset() {
        this.title = ''
        this.description = ''
        this.notifications = []
        this.$emit('toggleNewModal')
      },
      createNewTask() {
        let title = this.title
        let description = this.description
        let stage = "Planning"
        let createdDate = new Date()
        let id = this.nextTaskId
        this.$emit('createNewTask', { id, title, description, stage, createdDate })
        this.addNotification(this.title)
        this.title = ""
        this.description = ""
      },
      addNotification(title) {
        let id = Date.now()
        this.notifications.push({ id, title })
      },
      removeNotification(id) {
        this.notifications = this.notifications.filter(n => n.id != id)
      }
    },
    emits: ['toggleNewModal', 'createNewTask']
  }
</script>

<style scoped>
.notificationCenter {
  position: absolute;
  top: 1em;
  right: 1em;
  width:  350px;
}
.notification {
  width: 100%;
  white-space: nowrap;
  overflow: scroll;
}
</style>