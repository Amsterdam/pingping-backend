<template>
  <div>
    <SendNotification
      v-if="selected.length"
      :deviceTokens="selected"
    />
    <div
      class="p-2"
      v-if="role === 'user'"
      @click="isFilter = !isFilter"
    >{{ isFilter ? 'Filter: \'NotificationStatus=Approved\'' : 'Filter: none' }}</div>
    <table class="table">
      <thead>
        <b-button
          class="m-2"
          v-if="role === 'admin'"
          @click="createUser = true"
        >Create</b-button>
        <tr>
          <th></th>
          <th>id</th>
          <th>created</th>
          <th v-if="role === 'user'">balance</th>
          <th v-if="role === 'user'">device</th>
          <th v-if="role === 'admin'">name</th>
          <th v-if="role === 'admin'">email</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <UserListItem
          v-for="(item,i) in filteredItems"
          :key="i"
          @set="setItem"
          v-bind="item"
          :selected="item.selected"
        />
      </tbody>
    </table>
    <b-modal
      size="xl"
      v-model="createUser"
      :title="'Create User'"
      id="create-user"
      :hide-footer="true"
    >
      <UserCreateModal />
    </b-modal>
  </div>
</template>

<script>
import UserListItem from '../components/UserListItem'
import SendNotification from '../components/SendNotification'
import UserCreateModal from '../components/UserCreateModal'
import VueTypes from 'vue-types'

export default {
  name: 'UserTable',

  components: {
    UserListItem,
    UserCreateModal,
    SendNotification
  },

  props: {
    items: VueTypes.array,
    role: VueTypes.string
  },

  methods: {
    setItem (set) {
      let index = this.items.map(i => i.id).indexOf(set.id)

      if (index !== -1) {
        this.items[index] = Object.assign(this.items[index], set)
      }

      this.selected = this.items.filter(i => i.selected === true).map(u => u.device.token).join(',')
    }
  },

  computed: {
    filteredItems () {
      if (this.isFilter) {
        return this.items.filter((u => {
          if (u.devices.length) {
            const activeDevices = u.devices.filter(d => d.notificationStatus === 'Approved')

            return activeDevices.length > 0
          }

          return true
        }))
      } else {
        return this.items
      }
    }
  },

  data () {
    return {
      isFilter: false,
      createUser: false,
      loading: false,
      selected: ''
    }
  }
}
</script>

<style lang="scss" scoped>
</style>