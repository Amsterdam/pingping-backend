class WeeklyUsersChart {
  constructor(keys, values) {
    this.keys = keys
    this.values = values
    this.options = {
      scales: {
        xAxes: [
          {
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
      values: this.values,
      options: this.options
    }
  }
}

export const getProps = ({ keys, values }) => {
  const instance = new WeeklyUsersChart(keys, values)

  return instance.getProps()
}

export default WeeklyUsersChart