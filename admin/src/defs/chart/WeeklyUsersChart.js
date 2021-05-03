class WeeklyUsersChart {
  constructor(keys, weekly, activeWeekly) {
    this.keys = keys
    this.weekly = weekly
    this.activeWeekly = activeWeekly
    this.datasets = [
      {
        label: 'New',
        yAxisId: 'y1',
        data: this.weekly,
        fill: false,
        backgroundColor: '#003f5c',
        borderColor: '#003f5c',
      },
      {
        label: 'Active',
        yAxisId: 'y1',
        data: this.activeWeekly,
        fill: false,
        backgroundColor: '#FB9F4B',
        borderColor: '#FB9F4B',
      },
    ]
    this.options = {
      interaction: {
        mode: 'index'
      },
      legend: {
        display: true,
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
              display: true
            },
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

export const getProps = ({ keys, values }, activeWeekly) => {
  const instance = new WeeklyUsersChart(keys, values, activeWeekly.values)

  return instance.getProps()
}

export default WeeklyUsersChart