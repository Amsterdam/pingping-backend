<script>
import { Line } from 'vue-chartjs'
import VueTypes from 'vue-types'

export default {
  extends: Line,
  props: {
    values: VueTypes.array,
    datasets: VueTypes.array,
    keys: VueTypes.array,
    options: VueTypes.object
  },
  computed: {
    chartdata () {
      let res = {}

      res.labels = this.keys
      res.datasets = this.datasets

      return res
    }
  },
  data: () => ({
    optionsDef: {
      legend: {
        display: true
      },
      scales: [],
      responsive: true,
      maintainAspectRatio: false,
    }
  }),

  watch: {
    datasets () {
      this.renderChart(this.chartdata, { ...this.optionsDef, ...this.options })
    },
    values () {
      this.renderChart(this.chartdata, { ...this.optionsDef, ...this.options })
    },
    keys () {
      this.renderChart(this.chartdata, { ...this.optionsDef, ...this.options })
    }
  },

  mounted () {
    this.renderChart(this.chartdata, { ...this.optionsDef, ...this.options })
  }
}
</script>