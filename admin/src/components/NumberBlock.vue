<template>
  <div class="block number-block">
    <div class="block-inner">
      <div class="title">{{ title }}</div>
      <div class="number">{{ current }}</div>
    </div>
  </div>
</template>

<script>
import VueTypes from 'vue-types'
export default {
  name: 'NumberBlock',

  props: {
    title: VueTypes.string,
    current: VueTypes.number,
    change: VueTypes.number
  }
}
</script>

<style scoped>
.number-block {
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
</style>