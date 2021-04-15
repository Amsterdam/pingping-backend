<template>
  <table class="table table-sm">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Task</th>
        <th scope="col">Started</th>
        <th scope="col">Ended</th>
        <th scope="col">Status</th>
      </tr>
    </thead>
    <tbody>
      <task-table-item
        v-for="(task, t) in tasks"
        :key="'task-' + t"
        v-bind="task"
      />
    </tbody>
  </table>
</template>

<script>
import VueTypes from 'vue-types'
import TaskTableItem from './TaskTableItem'

export default {
  name: 'TaskTable',

  props: {
    tasks: VueTypes.array
  },

  components: {
    TaskTableItem
  }
}
</script>

<style lang="scss" scoped>
</style>