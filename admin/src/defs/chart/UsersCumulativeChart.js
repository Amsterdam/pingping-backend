class UsersCumulativeChart {
  constructor(keys, users, routes, completedRoutes) {
    this.keys = keys
    this.datasets = [
      {
        label: 'Completed Routes',
        data: completedRoutes,
        borderColor: '#ff6361',
        backgroundColor: '#ff6361',
        pointRadius: 1
      },
      {
        label: 'Routes',
        data: routes,
        borderColor: '#0D2036',
        backgroundColor: '#0D2036',
        pointRadius: 0.5
      },
      {
        label: 'Cumulative Users',
        data: users,
        borderColor: '#fb9f4b',
        backgroundColor: '#fb9f4b',
        pointRadius: 0.5
      },
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

export const getProps = ({ keys, values }, routes, completedRoutes) => {
  const instance = new UsersCumulativeChart(keys, values, routes.values, completedRoutes.values)

  return instance.getProps()
}

export default UsersCumulativeChart