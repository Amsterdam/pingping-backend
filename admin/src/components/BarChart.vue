<script>
import { Bar } from 'vue-chartjs'
import VueTypes from 'vue-types'

export default {
  extends: Bar,
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
          backgroundColor: '#C5EAD3',
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
              borderDash: [8, 4],
            },
            ticks: {
              beginAtZero: true,
              autoSkip: true,
              maxTicksLimit: 10
            }
          }
        ],
        xAxes: [
          {
            gridLines: {
              display: false
            },
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