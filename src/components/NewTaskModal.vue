<template>
  <div class="modal" :class="{ 'is-active': showNewModal}">
    <div class="modal-background"></div>
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
        <div>
          <button class="button is-success" @click.prevent="createNewTask">Create</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  export default {
    name: "NewTaskModal",
    data() {
      return {
        title: '',
        description: ''
      }
    },
    props: ['showNewModal', 'numberOfTasks'],
    methods: {
      reset() {
        this.title = ''
        this.description = ''
        this.$emit('toggleNewModal')
      },
      createNewTask() {
        let title = this.title
        let description = this.description
        let stage = "Planning"
        let createdDate = new Date()
        let id = this.numberOfTasks
        this.$emit('createNewTask', { id, title, description, stage, createdDate })
        this.title = ""
        this.description = ""
      }
    },
    emits: ['toggleNewModal', 'createNewTask']
  }
</script>
