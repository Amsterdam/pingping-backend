<template>
  <tr>
    <td
      class="clickable"
      @click="setItem"
    >{{ title }}</td>
    <td>{{ description }}</td>
    <td>
      <b-badge
        pill
        :variant="statusVariant"
      >{{ status }}</b-badge>
    </td>
    <td width="20%">
      <b-progress
        :max="total"
        show-value
      >
        <b-progress-bar
          :value="available"
          :variant="variant"
        ></b-progress-bar>
      </b-progress>

    </td>
  </tr>
</template>

<script>
import VueTypes from 'vue-types'

export default {
  name: 'RewardListItem',

  props: {
    rewardId: VueTypes.string,
    vouchers: VueTypes.array,
    title: VueTypes.string,
    description: VueTypes.string,
    status: VueTypes.string,
    active: VueTypes.bool
  },

  methods: {
    setItem () {
      this.$emit('setItem', this.$props)
    }
  },

  computed: {
    total () {
      return this.vouchers.length
    },

    available () {
      return this.vouchers.filter(i => i.userId).length
    },

    variant () {
      return this.available < this.total ? this.available / this.total < 0.2 ? 'danger' : 'success' : 'danger'
    },

    statusVariant () {
      if (!this.active) {
        return 'danger'
      }

      return 'success'
    }
  }
}
</script>

<style lang="scss" scoped>
</style>