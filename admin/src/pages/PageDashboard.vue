<template>
  <div class="page-dashboard">
    <Chart
      v-if="statistics"
      class="col-7"
      type="line"
      title="New Users Per Day"
      v-bind="statistics.usersPerDay"
    />
    <!-- <div class="col-4"></div> -->
    <Chart
      v-if="statistics"
      class="col-5"
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
  background-color: #dfe8e7;
  max-width: 100%;
  padding: 1rem;
}
</style>