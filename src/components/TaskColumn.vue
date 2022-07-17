<template>
  <div class="column is-one-third">
    <div class="containerBackdrop">
      <h1 class="heading is-size-4 has-text-grey">{{ columnHeader }} ({{ tasks.length }})</h1>
    <CardComponent v-for="task in tasks"
      :key="task.id"
      :task="task"
      @modifyTask="emitModify"
      @editTask="editTask"
    />
    </div>
  </div>
</template>

<script>
import CardComponent from './CardComponent.vue'

export default {
  name: "TaskColumn",
  components: {
    CardComponent
  },
  methods: {
    emitModify(id, action) {
      // console.log(arguments)
      this.$emit("modifyTask", id, action)
    },
    editTask(task) {
      this.$emit("editTask", task)
    }
  },
  props: ['columnHeader','tasks'],
  emits: ["modifyTask", "editTask"]
}
</script>

<style>
.column {
  /* background-color: #f8f8f8; */
  border-radius: 1em;
}
.containerBackdrop {
  background-color: #f8f8f8;
  padding: .5rem;
  border-radius: 1rem;
  height: 100%;
}

</style>