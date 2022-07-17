<template>
  <span>
    <button class="button" @click="testAction">Test</button>
  </span>
</template>

<script>
export default {
  name: "DevMode",
  methods: {
    testAction() {
      this.$emit("testEvent", "2")
    }
  },
  emits: ["testEvent"]
}
</script>