<template>
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
      <b-form
        @submit="onSubmitCreateUser"
        v-if="!loading"
      >
        <b-form-input
          v-model="newUser.fullName"
          placeholder="Full Name"
          autofocus
          required
          class="mb-2"
        ></b-form-input>
        <b-form-input
          v-model="newUser.email"
          placeholder="Email"
          required
          class="mb-2"
        ></b-form-input>
        <div>Role: {{ newUser.role }}</div>
        <b-form-input
          v-model="newUser.password"
          placeholder="Password"
          type="password"
          required
          class="mb-2"
        ></b-form-input>
        <b-button
          type="submit"
          variant="primary"
        >Send</b-button>
      </b-form>
      <div v-else>
        Loading...
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import UserListItem from '../components/UserListItem'
import SendNotification from '../components/SendNotification'
import { CreateUserMutation } from '../mutations/CreateUserMutation'

export default {
  name: 'PageUsers',

  components: {
    UserListItem,
    SendNotification
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
    onSubmitCreateUser (e) {
      e.preventDefault();
      this.loading = true

      this.$apollo.mutate({
        mutation: CreateUserMutation,
        variables: {
          input: this.newUser
        }
      }).then(({ data }) => {
        this.$store.commit('users/addItem', data.adminCreateUser)
        this.loading = false
        this.$root.$emit('bv::hide::modal', 'create-user')
      })
    },

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
      newUser: {
        fullName: '',
        email: '',
        password: '',
        role: 'Admin'
      },
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