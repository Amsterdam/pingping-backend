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
    <hr />
    <b-form inline>
      <label
        class="mr-sm-2"
        for="inline-form-custom-select-pref"
      >Filter by week</label>
      <b-form-select
        v-model="week"
        :options="weeks"
      ></b-form-select>
    </b-form>
    <div class="row gx-2">
      <Chart
        v-if="statisticsWeekly"
        class="col-sm-6 col-lg-5"
        title="Users 15 - 22"
        v-bind="statisticsWeekly.userPerMonthOfBirth"
        :keys="ageKeys"
      >
        <div
          slot="bottom"
          class="addition"
        >Only users aged 15-22. <span
            class="text-link"
            @click="showAll = true"
          >Chart for all users</span></div>
      </Chart>
      <Chart
        v-if="statisticsWeekly && showAll"
        class="col-sm-6 col-lg-5"
        title="Users by age"
        v-bind="statisticsWeekly.usersPerYearOfBirth"
      />
      <Chart
        v-if="statisticsWeekly"
        class="col-sm-7 col-lg-6"
        title="Completed Tasks"
        type="stacked-bar"
        v-bind="completedTasks"
      />
      <hr />
      <Chart
        class="col-sm-12 col-lg-8"
        v-if="false"
        type="line"
        title="New Users Per Day"
        v-bind="statistics.usersPerDay"
      />
      <Chart
        v-if="statistics"
        class="col-sm-12 col-lg-8"
        type="line"
        title="New users weekly"
        v-bind="weeklyUsers"
      />
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
import _ from 'lodash'
import moment from 'moment'
import { AdminStatisticsQuery } from '../queries/AdminStatisticsQuery'
import { AdminStatisticsWeeklyQuery } from '../queries/AdminStatisticsWeeklyQuery'
import NumberBlock from '../components/NumberBlock'
import Chart from '../components/Chart'
import { getProps as getTaskChartProps } from '../defs/chart/TaskChart'
import { getProps as getWeeklyUsersProps } from '../defs/chart/WeeklyUsersChart'

const WEEK_FORMAT = 'YYYY-WW'

export default {
  name: 'PageDashboard',

  components: {
    Chart,
    NumberBlock,
  },

  mounted () {
    this.fetch()
  },

  apollo: {
    statistics: {
      query: AdminStatisticsQuery,
      update: res => res.adminStatistics,
    }
  },

  methods: {
    fetch () {
      this.$apollo.query({
        query: AdminStatisticsWeeklyQuery,
        variables: {
          week: this.week
        }
      }).then(({ data }) => {
        this.statisticsWeekly = data.adminStatistics
      })
    }
  },

  computed: {
    completedTasks () {
      return getTaskChartProps(_.get(this.statisticsWeekly, 'completedTasks'))
    },
    weeklyUsers () {
      return getWeeklyUsersProps(_.get(this.statistics, 'usersPerWeek'))
    },
    ageKeys () {
      if (this.statisticsWeekly && this.statisticsWeekly.userPerMonthOfBirth) {
        return this.statisticsWeekly.userPerMonthOfBirth.keys
      }

      return []
    },

    weeks () {
      let current = moment()
      let weeks = []

      while (moment('04.01.2021', 'DD.MM.YYYY').diff(current, 'weeks') < 0) {
        weeks.push({
          value: current.format(WEEK_FORMAT),
          text: moment().format(WEEK_FORMAT) === current.format(WEEK_FORMAT) ? `Current week` : current.format('W - YYYY')
        })
        current = current.subtract(1, 'week')
      }

      return [{ text: 'Total', value: null }, ...weeks]
    }
  },

  watch: {
    week () {
      this.fetch()
    }
  },

  data () {
    return {
      week: null,
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

hr {
  margin-top: 1rem;
  margin-bottom: 1rem;
  border: 0;
  border-top: 4px solid rgba(0, 0, 0, 0.1);
  width: 100%;
}
</style>