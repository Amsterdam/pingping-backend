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
        class="col-sm-6 col-lg-4"
        title="Users by age"
        v-bind="statisticsWeekly.usersPerYearOfBirth"
      />
      <Chart
        v-if="statisticsWeekly"
        class="col-sm-6 col-lg-3"
        title="Users 16-18"
        v-bind="statisticsWeekly.userPerMonthOfBirthFocus"
      />
      <Chart
        v-if="statisticsWeekly"
        class="col-sm-7 col-lg-5"
        title="Completed Tasks"
        type="stacked-bar"
        :keys="taskLabels"
        :datasets="completedTasks"
      />
      <hr />
      <Chart
        v-if="statistics"
        class="col-sm-12 col-lg-8"
        type="line"
        title="New Users Per Day"
        v-bind="statistics.usersPerDay"
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

export default {
  name: 'PageDashboard',

  components: {
    Chart,
    NumberBlock
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
    taskLabels () {
      if (this.statisticsWeekly && this.statisticsWeekly.completedTasks) {
        return this.statisticsWeekly?.completedTasks.keys.reduce((val, item) => {
          let key = _.last(item.split(':'))
          let index = val.indexOf(key)

          if (index === -1) {
            val.push(key)
          }

          return val
        }, [])
      }

      return []
    },
    completedTasks () {
      if (this.statisticsWeekly && this.statisticsWeekly.completedTasks) {
        const getDataForLabel = (label) => {
          return this.taskLabels.map(t => {
            let valIndex = this.statisticsWeekly.completedTasks.keys.indexOf(`${label}:${t}`)

            if (valIndex !== -1) {
              return this.statisticsWeekly.completedTasks.values[valIndex]
            }

            return 0
          })
        }

        return this.statisticsWeekly?.completedTasks.keys.reduce((val, item) => {
          let group = _.first(item.split(':'))
          let groupLabel = _.get(this.routeKeys, _.first(item.split(':')), 'other')
          let index = val.map(s => s.key).indexOf(group)

          if (index === -1) {
            val.push({
              key: group,
              label: groupLabel,
              data: getDataForLabel(group),
              backgroundColor: this.colors[val.length],
            })
          }

          return val
        }, [])
      }

      return []
    },

    weeks () {
      let current = moment()
      let weeks = []

      while (moment('04.01.2021', 'DD.MM.YYYY').diff(current, 'weeks') < 0) {
        weeks.push({
          value: current.format('WW.YYYY'),
          text: moment().format('WW.YYYY') === current.format('WW.YYYY') ? `Current week` : current.format('W - YYYY')
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
      statisticsWeekly: null,
      routeKeys: {
        onboarding: 'Onboarding',
        financieleBasis: 'Fix je basis'
      },
      colors: ['#FB9F4B', '#ff6361', '#003f5c', '#58508d', '#bc5090']
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