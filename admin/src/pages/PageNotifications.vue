<template>
  <div class="section">
    <SendNotification />
    <table class="table">
      <thead>
        <tr>
          <th>Created</th>
          <th>Type</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <NotificationItem
          v-for="(item, index) in items"
          :key="'item-' + index"
          v-bind="item"
        />
      </tbody>
    </table>
  </div>
</template>

<script>
import { GetNotificationsQuery } from '../queries/GetNotificationsQuery'
import NotificationItem from '../components/NotificationItem.vue'
import SendNotification from '../components/SendNotification.vue'

export default {
  name: 'PageAuditLog',

  components: {
    NotificationItem,
    SendNotification
  },

  apollo: {
    items: {
      query: GetNotificationsQuery,
      update: res => res.getNotifications
    }
  },

  data () {
    return {
      items: []
    }
  }
}
</script>

<style lang="scss" scoped>
</style>