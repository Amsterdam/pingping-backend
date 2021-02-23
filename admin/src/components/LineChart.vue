<script>
import { Line } from 'vue-chartjs'
import VueTypes from 'vue-types'

export default {
  extends: Line,
  props: {
    values: VueTypes.array,
    keys: VueTypes.array,
    options: VueTypes.object
  },
  computed: {
    chartdata () {
      let res = {}

      res.labels = this.keys
      res.datasets = [
        {
          fill: false,
          borderColor: '#FB9F4B',
          data: this.values
        }
      ]

      return res
    }
  },
  data: () => ({
    optionsDef: {
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
              autoSkip: true,
              maxTicksLimit: 20
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
            unitStepSize: 1,
            time: {
              unit: 'week',
              tooltipFormat: 'dddd LL',
              displayFormats: {
                'week': 'MMM DD'
              },
            },
            gridLines: {
              display: false
            }
          }
        ]
      },
      responsive: true,
      maintainAspectRatio: false,
    }
  }),

  watch: {
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