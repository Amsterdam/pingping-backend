import _ from 'lodash'

const ROUTE_KEYS = {
  onboarding: 'Onboarding',
  financieleBasis: 'Fix je basis'
}

const COLORS = ['#FB9F4B', '#ff6361', '#003f5c', '#58508d', '#bc5090']

class TaskChart {
  constructor(keys, values) {
    this.keys = keys
    this.values = values
    this.labels = TaskChart.processLabels(keys)
  }

  static processLabels (keys) {
    return keys.reduce((val, item) => {
      let key = _.last(item.split(':'))
      let index = val.indexOf(key)

      if (index === -1) {
        val.push(key)
      }

      return val
    }, [])
  }

  getProps () {
    return {
      keys: this.labels,
      datasets: this.getDatasets()
    }
  }

  getDataForLabel (label) {
    return this.labels.map(t => {
      let valIndex = this.keys.indexOf(`${label}:${t}`)

      if (valIndex !== -1) {
        return this.values[valIndex]
      }

      return 0
    })
  }

  getDatasets () {
    return this.keys.reduce((val, item) => {
      let group = _.first(item.split(':'))
      let groupLabel = _.get(ROUTE_KEYS, _.first(item.split(':')), 'other')
      let index = val.map(s => s.key).indexOf(group)

      if (index === -1) {
        val.push({
          key: group,
          label: groupLabel,
          data: this.getDataForLabel(group),
          backgroundColor: COLORS[val.length],
        })
      }

      return val
    }, [])
  }
}

export const getProps = ({ keys, values }) => {
  const instance = new TaskChart(keys, values)

  return instance.getProps()
}

export default TaskChart