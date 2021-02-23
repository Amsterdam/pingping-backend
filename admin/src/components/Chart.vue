<template>
  <div class="custom-chart block">
    <div class="custom-chart-inner">
      <div class="inner-title">{{ title }}</div>
      <BarChart
        :values="values"
        v-if="type === 'bar'"
        class="is-chart bar-chart"
        style="height: 30vh;"
        :datasets="datasets"
        :keys="keys"
      />
      <StackedBarChart
        :values="values"
        v-if="type === 'stacked-bar'"
        class="is-chart bar-chart"
        style="height: 30vh;"
        :datasets="datasets"
        :keys="keys"
      />
      <LineChart
        :values="values"
        v-else-if="type === 'line'"
        class="is-chart line-chart"
        style="height: 25vh;"
        :options="options"
        :keys="keys"
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
import BarChart from './BarChart'
import StackedBarChart from './StackedBarChart'
import LineChart from './LineChart'
import PieChart from './PieChart'
import VueTypes from 'vue-types';

export default {
  components: {
    StackedBarChart,
    BarChart,
    LineChart,
    PieChart
  },
  props: {
    title: VueTypes.string,
    type: VueTypes.string.def('bar'),
    values: VueTypes.array,
    keys: VueTypes.array,
    datasets: VueTypes.array.def(undefined),
    options: VueTypes.object
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
  margin-left: -0.5rem;
}

.custom-chart-inner {
  padding: 0.5rem;
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