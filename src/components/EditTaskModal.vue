<template>
  <div class="modal is-active">
    <div class="modal-background" @click="$emit('closeModal')"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Edit Task</p>
        <button class="delete" aria-label="close" @click="$emit('closeModal')"></button>
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
          <button class="button is-warning" @click.prevent="$emit('closeModal')">Cancel</button>
          <button class="button is-success" @click.prevent="saveChanges">Save</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "EditTaskModal",
  data() {
    return {
      title: this.task.title,
      description: this.task.description
    }
  },
  props: ["showEditModal", "task"],
  methods: {
    saveChanges() {
      let id = this.task.id
      let title = this.title
      let description = this.description
      this.$emit("editTask", { id, title, description })
      this.$emit("closeModal")
    }
  },
  emits: ["closeModal", "editTask"]
}
</script>