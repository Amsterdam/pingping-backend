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
        v-if="statistics"
        class="col-sm-6 col-lg-5"
        title="Users by age"
        v-bind="statistics.usersPerYearOfBirth"
      />
      <Chart
        v-if="statistics"
        class="col-sm-7 col-lg-6"
        title="Completed Tasks"
        v-bind="statistics.completedTasks"
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
import moment from 'moment'
import { AdminStatisticsQuery } from '../queries/AdminStatisticsQuery'
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

  methods: {
    fetch () {
      this.$apollo.query({
        query: AdminStatisticsQuery,
        variables: {
          week: this.week
        }
      }).then(({ data }) => {
        this.statistics = data.adminStatistics
      })
    }
  },

  computed: {
    weeks () {
      let current = moment()
      let weeks = []

      while (moment('04.01.2021', 'DD.MM.YYYY').diff(current, 'weeks') < 0) {
        weeks.push({
          value: current.format('WW.YYYY'),
          text: current.format('WW.YYYY')
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
      statistics: null
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