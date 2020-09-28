<template>
  <div class="section container">
    <div>Filter: 'NotificationStatus=Approved'</div>
    <table class="table">
      <thead>
        <tr>
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
          v-bind="item"
        />
      </tbody>
    </table>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import UserListItem from './UserListItem'

export default {
  name: 'Users',

  components: {
    UserListItem
  },

  computed: {
    filteredUsers () {
      return this.users.filter((u => {
        if (u.devices.length) {
          const activeDevices = u.devices.filter(d => d.notificationStatus === 'Approved')

          return activeDevices.length > 0
        }

        return true
      }))
    }
  },

  apollo: {
    users: {
      query: gql`query users($token:String!) { getUsers(token:$token) {
        id
        createdAt
        devices {
          id
          token
          notificationStatus
        }
      }}`,
      variables: {
        token: window.localStorage.getItem('pp:token')
      },
      update: data => {
        return data.getUsers
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
      users: []
    }
  }
}
</script>

<style lang="css" scoped>
.section {
  text-align: left;
}
</style>