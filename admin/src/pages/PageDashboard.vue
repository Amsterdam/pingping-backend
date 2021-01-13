<template>
  <div class="page-dashboard container-flow">
    <div
      class="row"
      v-if="statistics"
    >
      <NumberBlock
        title="Total users"
        v-bind="statistics.totalUsers"
      />
      <NumberBlock
        title="Active users"
        description="Active users past 7 days"
        v-bind="statistics.activeUsers"
      />
    </div>
    <div class="row gx-2">
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
      <!-- <div class="col-6"></div> -->
      <Chart
        class="col col-3"
        type="pie"
        v-for="(route, index) in statistics ? statistics.routes : []"
        :key="'pie-' + index"
        :title="route.title"
        v-bind="route.data"
      />
    </div>
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
import NumberBlock from '../components/NumberBlock'
import Chart from '../components/Chart'

export default {
  name: 'PageDashboard',

  components: {
    Chart,
    NumberBlock
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
  padding: 0 1rem;
}
</style>