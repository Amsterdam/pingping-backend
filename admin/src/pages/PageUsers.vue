<template>
  <div class="page section">
    <b-tabs
      class="section"
      content-class="mt-3"
    >
      <b-tab
        title="Users"
        active
      >
        <UserTable
          :items="users"
          role="user"
        />
      </b-tab>
      <b-tab title="Admins">
        <UserTable
          :items="admins"
          role="admin"
        />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'
import UserTable from '../components/UserTable'
import { GetUsersQuery } from '../queries/GetUsersQuery'
import RequestUtil from '../utils/RequestUtil'

export default {
  name: 'PageUsers',

  components: {
    UserTable
  },

  computed: {
    ...mapState({
      users: state => state.users.items,
      admins: state => state.admins.items
    }),
  },

  mounted () {
    this.fetch()
  },

  methods: {
    fetch () {
      this.fetchUsers()
      this.fetchAdmins()
    },

    fetchUsers () {
      this.$apollo.query({
        query: GetUsersQuery,
        variables: {
          roles: ['User']
        },
        update: (store, { data }) => {
          store.writeData({ query: GetUsersQuery, data })
        }
      }).then(({ data }) => {
        this.$store.commit('users/setItems', data.adminGetUsers.map(i => {
          return {
            ...i,
            selected: false,
            device: _.first(i.devices.filter(d => d.notificationStatus === 'Approved'))
          }
        }))
      }).catch(RequestUtil.errorHook)
    },

    fetchAdmins () {
      this.$apollo.query({
        query: GetUsersQuery,
        variables: {
          roles: ['Admin', 'Reporter']
        },
        update: (store, { data }) => {
          store.writeData({ query: GetUsersQuery, data })
        }
      }).then(({ data }) => {
        this.$store.commit('admins/setItems', data.adminGetUsers)
      }).catch(RequestUtil.errorHook)
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