<script>
import { Pie } from 'vue-chartjs'
import VueTypes from 'vue-types'

export default {
  extends: Pie,
  props: {
    values: VueTypes.array,
    keys: VueTypes.array
  },
  computed: {
    chartdata () {
      let res = {}

      res.labels = this.keys
      res.datasets = [
        {
          backgroundColor: ['#FB9F4B', '#0D2036', '#2DBCCA'],
          data: this.values
        }
      ]

      return res
    }
  },
  data: () => ({
    options: {
      legend: {
        display: false
      },
      responsive: true,
      maintainAspectRatio: false
    }
  }),

  watch: {
    values () {
      this.renderChart(this.chartdata, this.options)
    },
    keys () {
      this.renderChart(this.chartdata, this.options)
    }
  },

  mounted () {
    this.renderChart(this.chartdata, this.options)
  }
}
</script>