class UsersAccumulativeChart {
  constructor(keys, acc) {
    this.keys = keys
    this.datasets = [
      {
        label: 'Accumulative',
        data: acc,
        borderColor: '#fb9f4b',
        backgroundColor: '#fb9f4b',
        fillColor: "yellow",
        pointRadius: 0
      }
    ]
    this.options = {
      legend: {
        display: false,
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

export const getProps = ({ keys, values }) => {
  const instance = new UsersAccumulativeChart(keys, values)

  return instance.getProps()
}

export default UsersAccumulativeChart