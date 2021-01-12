<template>
  <div class="page-dashboard">
    <Chart
      v-if="statistics"
      class="col-12"
      type="line"
      title="New Users Per Day"
      v-bind="statistics.usersPerDay"
    />
    <Chart
      v-if="statistics"
      class="col-6"
      title="Completed Tasks"
      v-bind="statistics.completedTasks"
    />
    <div
      v-if="false"
      class="col-3"
    >
      {{ statistics.activeUsers30Days }}
    </div>
  </div>
</template>

<script>
import { AdminStatisticsQuery } from '../queries/AdminStatisticsQuery'
import Chart from '../components/Chart'

export default {
  name: 'PageDashboard',

  components: {
    Chart
  },

  apollo: {
    statistics: {
      query: AdminStatisticsQuery,
      update: res => res.adminStatistics
    }
  },
}
</script>

<style scoped>
.page-dashboard {
}
</style>