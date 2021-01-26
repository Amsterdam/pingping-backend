<template>
  <div class="page-dashboard container-flow">
    <div
      class="row"
      v-if="statistics"
    >
      <NumberBlock
        title="Total users"
        class="col-xs-6 col-sm-4 col-md-3 col-lg-2"
        v-bind="statistics.totalUsers"
      />
      <NumberBlock
        title="Active users"
        class="col-xs-6 col-sm-3 col-md-2"
        description="Active users past 7 days"
        v-bind="statistics.activeUsers"
      />
      <NumberBlock
        title="Skipped onboarding"
        class="col-xs-6 col-sm-4 col-md-3"
        description="Pressed 'Vragen overslaan'"
        v-bind="statistics.skippedOnboarding"
      />
    </div>
    <div class="row gx-2">
      <Chart
        v-if="statistics"
        class="col-sm-12 col-lg-8"
        type="line"
        title="New Users Per Day"
        v-bind="statistics.usersPerDay"
      />
      <Chart
        v-if="statistics"
        class="col-sm-7 col-lg-6"
        title="Completed Tasks"
        v-bind="statistics.completedTasks"
      />
      <!-- <div class="col-6"></div> -->
      <Chart
        class="col-sm-5 col-lg-3"
        type="pie"
        v-for="(route, index) in statistics ? statistics.routes : []"
        :key="'pie-' + index"
        :title="route.title"
        v-bind="route.data"
      />
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