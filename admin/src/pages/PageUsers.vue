<template>
  <div class="page section">
    <div class="section">
      <SendNotification
        v-if="selected.length"
        :deviceTokens="selected"
      />
      <div
        class="p-2"
        @click="isFilter = !isFilter"
      >{{ isFilter ? 'Filter: \'NotificationStatus=Approved\'' : 'Filter: none' }}</div>
      <table class="table">
        <thead>
          <b-button
            class="m-2"
            @click="createUser = true"
          >Create</b-button>
          <tr>
            <th></th>
            <th>id</th>
            <th>created</th>
            <th>device</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <UserListItem
            v-for="(item,i) in filteredUsers"
            :key="i"
            @set="setItem"
            v-bind="item"
            selected="item.selected"
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
import UserListItem from '../components/UserListItem'
import SendNotification from '../components/SendNotification'
import UserCreateModal from '../components/UserCreateModal'

export default {
  name: 'PageUsers',

  components: {
    UserListItem,
    SendNotification,
    UserCreateModal
  },

  mounted () {
  },

  computed: {
    ...mapState({
      users: state => state.users.items
    }),
    filteredUsers () {
      if (this.isFilter) {
        return this.users.filter((u => {
          if (u.devices.length) {
            const activeDevices = u.devices.filter(d => d.notificationStatus === 'Approved')

            return activeDevices.length > 0
          }

          return true
        }))
      } else {
        return this.users
      }
    }
  },

  methods: {
    setItem (set) {
      let index = this.users.map(i => i.id).indexOf(set.id)

      if (index !== -1) {
        this.users[index] = Object.assign(this.users[index], set)
      }

      this.selected = this.users.filter(i => i.selected === true).map(u => u.device.token).join(',')
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

<style lang="css" scoped>
.jumbotron {
  padding: 1rem;
  margin-top: 2rem;
}

.section {
  text-align: left;
}
</style>