<template>
  <div class="section">
    <table class="table">
      <thead>
        <tr>
          <th>Created</th>
          <th>Route</th>
          <th>Rating</th>
          <th>Feedback</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, i) in items"
          :key="i"
        >
          <td>{{ formatDate(item.createdAt) }}</td>
          <td>{{ item.routeId }}</td>
          <td>{{ item.rating }}</td>
          <td>{{ item.feedback }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import moment from 'moment'
import RequestUtil from '../utils/RequestUtil'
import { GetFeedbackQuery } from '../queries/GetFeedbackQuery'

export default {
  name: 'PageAuditLog',

  components: {
  },

  apollo: {
    items: {
      query: GetFeedbackQuery,
      update: res => res.adminGetFeedback,
      error: RequestUtil.errorHook
    }
  },

  methods: {
    formatDate (date) {
      return moment(date).format('LLL')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>