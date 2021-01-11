<script>
import { Line } from 'vue-chartjs'
import VueTypes from 'vue-types'

export default {
  extends: Line,
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
          // backgroundColor: '#96C3BA',
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
      scales: {
        yAxes: [
          {
            gridLines: {
              display: false
            },
          }
        ],
        xAxes: [
          {
            type: 'time',
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10
            },
            time: {
              unit: 'month',
              tooltipFormat: 'DD.MM.YYYY'
            },
            gridLines: {
              display: false
            }
          }
        ]
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