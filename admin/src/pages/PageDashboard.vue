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
      <NumberBlock
        title="Skipped onboarding"
        description="Pressed 'Vragen overslaan'"
        v-bind="statistics.skippedOnboarding"
      />
    </div>
    <div class="row gx-2">
      <Chart
        class="col-sm-6 col-lg-6"
        title="Age distribution"
        :weekFilter="true"
        :ageFilter="true"
        queryName="userPerMonthOfBirth"
      />
      <Chart
        class="col-sm-6 col-lg-6"
        title="Completed Tasks"
        type="stacked-bar"
        queryName="completedTasks"
        completedTasks="completedTasks"
        :weekFilter="true"
      />
      <Chart
        class="col-sm-6 col-lg-6"
        title="Routes"
        type="bar"
        v-bind="routes"
        :weekFilter="false"
      />
      <Chart
        v-if="statistics"
        class="col-sm-6 col-lg-5"
        type="line"
        title="Users weekly"
        v-bind="weeklyUsers"
      />
      <Chart
        v-if="statistics"
        class="col-sm-6 col-lg-4"
        type="line"
        title="Cumulative Users"
        v-bind="cumulativeUsers"
      />
      <Chart
        class="col-sm-4 col-lg-3"
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
import { getProps as getWeeklyUsersProps } from '../defs/chart/WeeklyUsersChart'
import { getProps as getCumulativeUsersProps } from '../defs/chart/UsersCumulativeChart'
import { getProps as getRouteProps } from '../defs/chart/RoutesChart'

export default {
  name: 'PageDashboard',

  components: {
    Chart,
    NumberBlock,
  },

  apollo: {
    statistics: {
      query: AdminStatisticsQuery,
      update: res => res.adminStatistics,
    }
  },

  computed: {
    weeklyUsers () {
      const { usersPerWeek, activeUsersPerWeek } = this.statistics
      return getWeeklyUsersProps(usersPerWeek, activeUsersPerWeek)
    },
    cumulativeUsers () {
      return getCumulativeUsersProps(this.statistics?.usersCumulative)
    },
    routes () {
      return getRouteProps(this.statistics?.routesPerMonth, this.statistics?.routesCompletedPerMonth)
    }
  },

  data () {
    return {
      showAll: false,
      statisticsWeekly: null,
    }
  }
}
</script>

<style scoped>
.page-dashboard {
  padding: 0 1rem;
}

.row {
  display: flex;
}

hr {
  margin-top: 1rem;
  margin-bottom: 1rem;
  border: 0;
  border-top: 4px solid rgba(0, 0, 0, 0.1);
  width: 100%;
}
</style>