<template>
  <div class="custom-chart small">
    <div class="inner-title">{{ title }}</div>

    <BarChart
      :values="values"
      :keys="keys"
    />
  </div>
</template>

<script>
import BarChart from './BarChart'
import VueTypes from 'vue-types';

export default {
  components: {
    BarChart
  },
  props: {
    title: VueTypes.string,
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
  },
  mounted () {
    this.fillData()
  },
  methods: {
    fillData () {
      this.datacollection = {
        labels: [this.getRandomInt(), this.getRandomInt()],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#7e7665',
            data: [this.getRandomInt(), this.getRandomInt()]
          }
        ]
      }
    },
    getRandomInt () {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    }
  }
}
</script>

<style>
.custom-chart {
  margin-top: 1rem;
  border-radius: 5px;
  background-color: #fff;
  padding: 1rem;
}

.custom-chart.inner-title {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.small {
  max-width: 600px;
  /* margin:  150px auto; */
}
</style>