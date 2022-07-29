<template>
  <div class="custom-chart block">
    <div class="custom-chart-inner">
      <b-row>
        <b-col class="inner-title mr-auto">{{ title }}</b-col>
        <b-col
          class="week-filter"
          v-if="weekFilter"
        >
          <b-dropdown
            class="mr-2"
            variant="outline-primary"
            :text="age ? age[0] + '-' + age[1] : '16-20'"
            v-if="ageFilter"
            right
            size="sm"
          >
            <b-dropdown-item @click="age = [0, 100]">All</b-dropdown-item>
            <b-dropdown-item @click="age = [16,20]">Age 16-20</b-dropdown-item>
          </b-dropdown>
          <b-dropdown
            variant="outline-primary"
            right
            :text="week ? week.text : 'Total'"
            v-if="weekFilter"
            size="sm"
          >
            <b-dropdown-item
              v-for="w in weeks"
              :key="'week-' + w.value"
              @click="week = w"
            >{{ w.text }}</b-dropdown-item>
          </b-dropdown>
        </b-col>
      </b-row>

      <BarChart
        :values="valuesActual"
        v-if="type === 'bar'"
        class="is-chart bar-chart"
        style="height: 25vh;"
        :datasets="datasetsActual"
        :keys="keysActual"
      />
      <StackedBarChart
        :values="values"
        v-if="type === 'stacked-bar'"
        class="is-chart bar-chart"
        style="height: 25vh;"
        :options="options"
        :datasets="datasetsActual"
        :keys="keysActual"
      />
      <LineChart
        :values="valuesActual"
        v-else-if="type === 'line'"
        class="is-chart line-chart"
        style="height: 20vh;"
        :options="options"
        :datasets=datasetsActual
        :keys="keysActual"
      />
      <PieChart
        :values="values"
        v-else-if="type === 'pie'"
        class="is-chart pie-chart"
        style="height: 20vh;"
        :keys="keys"
      />
      <slot name="bottom"></slot>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import _ from 'lodash'
import moment from 'moment'
import BarChart from './BarChart'
import StackedBarChart from './StackedBarChart'
import LineChart from './LineChart'
import PieChart from './PieChart'
import VueTypes from 'vue-types';
import { getProps as getTaskChartProps } from '../defs/chart/TaskChart'
const WEEK_FORMAT = 'YYYY-WW'

export default {
  name: 'ChartComp',
  components: {
    StackedBarChart,
    BarChart,
    LineChart,
    PieChart
  },
  props: {
    title: VueTypes.string,
    type: VueTypes.string.def('bar'),
    weekFilter: VueTypes.bool.def(false),
    ageFilter: VueTypes.bool.def(false),
    values: VueTypes.array.def(undefined),
    keys: VueTypes.array.def(undefined),
    datasets: VueTypes.array.def(undefined),
    queryName: VueTypes.string,
    options: VueTypes.object
  },

  computed: {
    keysActual () {
      return this.fetchedKeys || this.keys
    },
    valuesActual () {
      return this.fetchedValues || this.values
    },
    datasetsActual () {
      return this.fetchedDatasets || this.datasets
    },
    weeks () {
      let current = moment()
      let weeks = []

      while (moment('01.01.2022', 'DD.MM.YYYY').diff(current, 'weeks') < 0) {
        weeks.push({
          value: current.format(WEEK_FORMAT),
          text: moment().format(WEEK_FORMAT) === current.format(WEEK_FORMAT) ? `Current week` : `W ${current.format('W - YYYY')}`
        })
        current = current.subtract(1, 'week')
      }

      return [{ text: 'Total', value: null }, ...weeks]
    },

    query () {
      if (this.ageFilter && this.weekFilter) {
        return gql`
          query($week:String, $minAge:Int, $maxAge:Int) {
            adminStatistics {
              ${this.queryName}(week:$week, minAge:$minAge, maxAge:$maxAge) {
                values
                keys
              }
            }
          }
        `
      } else if (this.weekFilter) {
        return gql`
          query($week:String) {
            adminStatistics {
              ${this.queryName}(week:$week) {
                values
                keys
              }
            }
          }
        `
      } else {
        return gql`
          query {
            adminStatistics {
              ${this.queryName} {
                values
                keys
              }
            }
          }
        `
      }
    }
  },

  mounted () {
    if (this.queryName) {
      this.fetch()
    }
  },

  methods: {
    fetch () {
      this.$apollo.query({
        query: this.query,
        variables: {
          week: this.week ? this.week.value : null,
          minAge: this.age[0] || 0,
          maxAge: this.age[1] || 100
        }
      }).then(({ data: { adminStatistics } }) => {
        if (this.queryName === 'completedTasks' && adminStatistics && adminStatistics.completedTasks) {
          const { keys, datasets } = getTaskChartProps(_.get(adminStatistics, 'completedTasks'))
          this.fetchedKeys = keys
          this.fetchedDatasets = datasets
        } else {
          this.fetchedKeys = adminStatistics[this.queryName].keys
          this.fetchedValues = adminStatistics[this.queryName].values
        }
      })
    }
  },

  watch: {
    week () {
      this.fetch()
    },
    age () {
      this.fetch()
    }
  },

  data () {
    return {
      week: null,
      datacollection: null,
      fetchedKeys: null,
      fetchedDatasets: null,
      fetchedValues: null,
      age: [16, 20],
      chartOptions: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                show: false
              }
            }
          ]
        }
      }
    }
  }
}
</script>

<style>
.is-chart {
}

.week-filter {
  text-align: right;
}

.custom-chart-inner {
  padding: 1rem;
  border-radius: 5px;
  background-color: #fff;
}

.custom-chart .inner-title {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-align: left;
}

.bar-chart {
  height: '25vh';
  width: '100%';
}
</style>