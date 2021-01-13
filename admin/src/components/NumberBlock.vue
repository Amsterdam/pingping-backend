<template>
  <div class="block number-block">
    <div class="block-inner">
      <div
        class="title"
        :title="description"
        v-b-tooltip.hover
      >{{ title }}</div>
      <div class="number">{{ current }}</div>
      <div
        v-b-tooltip.hover
        title="Change since 7 days ago"
        :class="['change', change && change > 0 ? 'positive' : 'negative']"
        v-if="change"
      >{{ change * 100 + '%' }}</div>
    </div>
  </div>
</template>

<script>
import VueTypes from 'vue-types'
export default {
  name: 'NumberBlock',

  props: {
    title: VueTypes.string,
    description: VueTypes.string,
    current: VueTypes.number,
    change: VueTypes.number
  }
}
</script>

<style scoped>
.number-block {
  position: relative;
  max-width: 200px;
  width: 200px;
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
  color: red;
}

.number-block .change {
  color: green;
}
</style>