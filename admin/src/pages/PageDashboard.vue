<template>
  <div class="row q-gutter-md q-mt-md">
    <Chart
      v-if="statistics"
      class="col-12"
      title="New Users Per Day"
      v-bind="statistics.usersPerDay"
    />
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

<style lang="scss" scoped>
</style>