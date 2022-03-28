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
    <td width="15%">
      <b-progress
        :max="total"
        show-value
      >
        <b-progress-bar
          :value="available"
          variant="success"
        ></b-progress-bar>
        <b-progress-bar
          :value="used"
          variant="danger"
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
      return this.vouchers.length - this.vouchers.filter(i => i.userId).length
    },

    used () {
      return this.vouchers.filter(i => i.userId).length
    },

    percentageDone () {
      return this.available / this.total
    },

    variant () {
      return this.available < this.total ? (this.percentageDone > 0.8 ? 'danger' : 'success') : 'danger'
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