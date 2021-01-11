<template>
  <div class="custom-chart">
    <div class="inner-title">{{ title }}</div>

    <BarChart
      :values="values"
      v-if="type === 'bar'"
      :keys="keys"
    />
    <LineChart
      :values="values"
      v-else-if="type === 'line'"
      :keys="keys"
    />
  </div>
</template>

<script>
import BarChart from './BarChart'
import LineChart from './LineChart'
import VueTypes from 'vue-types';

export default {
  components: {
    BarChart,
    LineChart
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
.custom-chart {
  margin-top: 1rem;
  border-radius: 5px;
  background-color: #fff;
}

.custom-chart .inner-title {
  /* margin-left: 1.5rem; */
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-align: left;
}
</style>