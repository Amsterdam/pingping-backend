class WeeklyUsersChart {
  constructor(keys, weekly, acc) {
    this.keys = keys
    this.weekly = weekly
    this.acc = acc
    this.datasets = [
      {
        label: 'Weekly',
        yAxisId: 'y1',
        data: this.weekly,
        fill: false,
        borderColor: '#003f5c',
      },
    ]
    this.options = {
      interaction: {
        mode: 'index'
      },
      legend: {
        display: false,
      },
      scales: {
        yAxis: [
          {
            id: 'y1',
            position: 'left',
            gridLines: {
              borderDash: [8, 4],
            },
            ticks: {
              autoSkip: true,
              maxTicksLimit: 20
            },
          },
          {
            id: 'y2',
            position: 'right',
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
              maxTicksLimit: 10
            },
            time: {
              unit: 'month',
              tooltipFormat: '[Week:] W (MMM YYYY)',
              displayFormats: {
                month: 'MMM YYYY'
              }
            },
            gridLines: {
              display: false
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

export const getProps = ({ keys, values }, acc) => {
  const instance = new WeeklyUsersChart(keys, values, acc.values)

  return instance.getProps()
}

export default WeeklyUsersChart