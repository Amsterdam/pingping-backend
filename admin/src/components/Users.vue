<template>
  <div class="section container">
    <AdminActions />
    <SendNotification
      v-if="selected.length"
      :deviceTokens="selected"
    />
    <div @click="isFilter = !isFilter">{{ isFilter ? 'Filter: \'NotificationStatus=Approved\'' : 'Filter: none' }}</div>
    <table class="table">
      <thead>
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
        />
      </tbody>
    </table>
  </div>
</template>

<script>
import _ from 'lodash'
import gql from 'graphql-tag'
import AdminActions from './AdminActions'
import UserListItem from './UserListItem'
import SendNotification from './SendNotification'

export default {
  name: 'Users',

  components: {
    AdminActions,
    UserListItem,
    SendNotification
  },

  computed: {
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

      console.log('index', index, set)

      if (index !== -1) {
        this.users[index] = Object.assign(this.users[index], set)
      }

      this.selected = this.users.filter(i => i.selected === true).map(u => u.device.token).join(',')
    }
  },

  apollo: {
    users: {
      query: gql`query users($token:String!) { getUsers(token:$token) {
        id
        createdAt
        data
        devices {
          id
          token
          os
          notificationStatus
        }
      }}`,
      variables: {
        token: window.localStorage.getItem('pp:token')
      },
      update: data => {
        return data.getUsers.map(i => {
          return {
            ...i,
            selected: false,
            device: _.first(i.devices.filter(d => d.notificationStatus === 'Approved'))
          }
        })
      },
      error: error => {
        if (error.message === 'GraphQL error: unauthorized') {
          window.localStorage.removeItem('pp:token')
          window.alert('unauthorized')
          window.setTimeout(() => {
            location.reload()
          }, 1000)
        }
      }
    }
  },

  data () {
    return {
      users: [],
      isFilter: false,
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