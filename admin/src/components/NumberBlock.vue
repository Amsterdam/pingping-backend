<template>
  <div class="block number-block">
    <div class="block-inner">
      <div
        class="title"
        :title="description"
        v-b-tooltip.hover
      >{{ title }}</div>
      <div class="number">
        <span>{{ current }}</span>
        <span
          class="smaller"
          v-if="percentile"
        >({{ percentile * 100 }}%)</span>
      </div>
      <div
        v-b-tooltip.hover
        title="Change since 7 days ago"
        :class="['change', changeClass]"
        v-if="change"
      >
        <b-icon-arrow-up v-if="positive" />
        <b-icon-arrow-down v-else />
        <span>{{ displayChange }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import VueTypes from 'vue-types'

export default {
  name: 'NumberBlock',

  props: {
    title: VueTypes.string,
    description: VueTypes.string,
    current: VueTypes.number,
    change: VueTypes.number,
    percentile: VueTypes.number
  },

  computed: {
    positive () {
      return this.change && this.change > 0 ? true : false
    },

    changeClass () {
      return this.change && this.change > 0 ? 'positive' : 'negative'
    },

    displayChange () {
      return _.round(this.change * 100, 2) + '%'
    }
  }
}
</script>

<style scoped>
.number-block {
  position: relative;
  text-align: left;
}

.number-block .block-inner {
  padding: 0.5rem;
}

.number-block .title {
  font-weight: bold;
}

.number-block .number {
  font-weight: bold;
  font-size: 2rem;
}

.number-block .change {
  position: absolute;
  font-weight: bold;
  top: 1rem;
  right: 1.5rem;
}

.number-block .change.negative {
  color: #ff4136;
}

.number-block .change {
  color: #2ecc40;
}

.smaller {
  font-size: 75%;
  margin-left: 10px;
}
</style>