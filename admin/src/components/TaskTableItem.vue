<template>
  <tr class="task-table-item">
    <td>{{ task.taskId }}</td>
    <td>{{ task.title }}</td>
    <td>{{ createdAtFormatted }}</td>
    <td>{{ completedAtFormatted }}</td>
    <td>{{ status }}</td>
  </tr>
</template>

<script>
import VueTypes from 'vue-types'
import moment from 'moment'

export default {
  name: 'TaskTableItem',

  props: {
    task: VueTypes.object.isRequired,
    status: VueTypes.string.isRequired,
    createdAt: VueTypes.string,
    completedAt: VueTypes.string,
  },

  computed: {
    createdAtFormatted () {
      return this.createdAt && moment(this.createdAt).format('DD.MM.YY - HH:mm')
    },

    completedAtFormatted () {
      return this.completedAt && moment(this.completedAt).format('DD.MM.YY - HH:mm')
    }
  }
}
</script>

<style lang="scss" scoped>
.task-table-item {
  font-size: 12px;
}
</style>