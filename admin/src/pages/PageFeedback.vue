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
import { GetFeedbackQuery } from '../queries/GetFeedbackQuery'

export default {
  name: 'PageAuditLog',

  components: {
  },

  mounted () {
    this.$apollo.query({
      query: GetFeedbackQuery
    }).then(({ data }) => {
      this.items = data.adminGetFeedback
    })
  },

  methods: {
    formatDate (date) {
      return moment(date).format('LLL')
    }
  },

  data () {
    return {
      items: []
    }
  }
}
</script>

<style lang="scss" scoped>
</style>