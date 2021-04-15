<template>
  <tr>
    <td>{{ task.taskId }}</td>
    <td>{{ task.title }}</td>
    <td>{{ status }}</td>
  </tr>
</template>

<script>
import VueTypes from 'vue-types'
export default {
  name: 'TaskTableItem',

  props: {
    task: VueTypes.object.isRequired,
    status: VueTypes.string.isRequired
  }
}
</script>

<style lang="scss" scoped>
</style>