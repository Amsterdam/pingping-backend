<template>
  <tr>
    <td>{{ id }}</td>
    <td>{{ createdAt }}</td>
    <td>
      <span v-if="device">{{ device.id }} - {{ device.notificationStatus }}</span>
    </td>
    <td>
      <button
        v-if="device"
        @click="sendNotification"
      >Send</button>
    </td>
  </tr>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'UserListItem',

  props: {
    devices: Array,
    id: String,
    createdAt: String
  },

  methods: {
    sendNotification () {
    }
  },

  computed: {
    device () {
      return _.first(this.devices.filter(d => d.notificationStatus === 'Approved'))
    }
  },
}
</script>

<style lang="scss" scoped>
</style>