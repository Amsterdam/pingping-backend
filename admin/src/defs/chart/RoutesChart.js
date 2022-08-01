import moment from 'moment'

class RoutesChart {
  constructor(keys, routes, completedRoutes) {
    this.keys = keys.map((value) => {
      return moment(value).format('MMM YYYY')
    })
    this.datasets = [
      {
        label: 'Routes',
        data: routes,
        borderColor: '#fb9f4b',
        backgroundColor: '#fb9f4b',
        pointRadius: 0.5
      },
      {
        label: 'Completed Routes',
        data: completedRoutes,
        borderColor: '#0D2036',
        backgroundColor: '#0D2036',
        pointRadius: 1
      },
    ]
    this.options = {
      legend: {
        display: true,
      },
      scales: {
        yAxis: [
          {
            gridLines: {
              borderDash: [8, 4],
            },
            ticks: {
              autoSkip: true,
              maxTicksLimit: 20
            },
            beginAtZero: true
          }
        ],
        xAxes: [
          {
            id: 'x',
            type: 'time',
            distribution: 'linear',
            ticks: {
              autoSkip: true,
              maxTicksLimit: 1
            },
            time: {
              unit: 'month',
              tooltipFormat: 'MMM D YYYY',
              displayFormats: {
                month: 'MMM YYYY'
              }
            },
            gridLines: {
              display: true
            }
          }
        ]
      }
    }
  }

  getProps () {
    return {
      keys: this.keys,
      datasets: this.datasets,
      options: this.options
    }
  }
}

export const getProps = ({ keys, values }, completedRoutes) => {
  const instance = new RoutesChart(keys, values, completedRoutes.values)

  return instance.getProps()
}

export default RoutesChart