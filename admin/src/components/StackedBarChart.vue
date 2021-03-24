<script>
import { Bar } from 'vue-chartjs'
import VueTypes from 'vue-types'

export default {
  extends: Bar,
  props: {
    values: VueTypes.array,
    keys: VueTypes.array,
    options: VueTypes.object,
    datasets: VueTypes.array.def(undefined)
  },
  computed: {
    chartdata () {
      let res = {}

      res.labels = this.keys
      res.datasets = this.datasets ? this.datasets : [
        {
          backgroundColor: '#C5EAD3',
          data: this.values
        }
      ]

      return res
    }
  },
  data: () => ({
    optionsDef: {
      legend: {
        display: true
      },
      scales: {
        yAxes: [
          {
            stacked: true,
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
            stacked: true,
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
    this.renderChart(this.chartdata, this.options)
  }
}
</script>