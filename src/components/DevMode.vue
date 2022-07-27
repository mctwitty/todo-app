<template>
  <section class="buttons is-centered">
    <p>DevMode functions:</p>
    <button class="button" @click="testAction">Test</button>
    <button class="button" @click="loadSamples">loadSamples</button>
    <button class="button" @click="pushAllToLs">pushAll</button>
    <button class="button" @click="clearAllTasks">clearAll</button>
    <button class="button" @click="exportBackup">export</button>
  </section>
</template>

<script>
export default {
  name: "DevMode",
  methods: {
    testAction() {
      this.$emit("testEvent", "2")
    },
    pushAllToLs() {
      this.$emit("pushAllToLs")
    },
    loadSamples() {
      this.$emit("loadSampleTasks")
    },
    clearAllTasks() {
      this.$emit("clearAllTasks")
    },
    exportBackup() {
      this.$emit("exportBackup")
    }
  },
  emits: ["testEvent", "pushAllToLs", "loadSampleTasks", "clearAllTasks", "exportBackup"]
}
</script>