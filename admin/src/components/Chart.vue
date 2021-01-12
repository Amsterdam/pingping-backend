<template>
  <div class="custom-chart block">
    <div class="custom-chart-inner">
      <div class="inner-title">{{ title }}</div>

      <BarChart
        :values="values"
        v-if="type === 'bar'"
        class="is-chart bar-chart"
        style="height: 30vh;"
        :keys="keys"
      />
      <LineChart
        :values="values"
        v-else-if="type === 'line'"
        class="is-chart line-chart"
        style="height: 25vh;"
        :keys="keys"
      />
      <PieChart
        :values="values"
        v-else-if="type === 'pie'"
        class="is-chart pie-chart"
        style="height: 20vh;"
        :keys="keys"
      />
    </div>
  </div>
</template>

<script>
import BarChart from './BarChart'
import LineChart from './LineChart'
import PieChart from './PieChart'
import VueTypes from 'vue-types';

export default {
  components: {
    BarChart,
    LineChart,
    PieChart
  },
  props: {
    title: VueTypes.string,
    type: VueTypes.string.def('bar'),
    values: VueTypes.array,
    keys: VueTypes.array
  },

  data () {
    return {
      datacollection: null,
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
  margin-left: -1rem;
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
  height: '35vh';
  width: '100%';
}
</style>