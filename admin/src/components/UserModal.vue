<template>
  <div>
    <h6>Devices</h6>
    <UserDevice
      v-for="(device, i) in devices"
      :key="'device-' + i"
      v-bind="device"
    />
    <h6>Tasks</h6>
    <vue-json-pretty :data="userTasks" />
    <h6>Rewards</h6>
    <vue-json-pretty :data="rewards" />
    <h6>Transactions</h6>
    <vue-json-pretty :data="transactions" />

    <b-button
      variant="danger"
      @click="deleteUser"
      class="mt-4"
    >Delete User</b-button>
  </div>
</template>

<script>
import VueTypes from 'vue-types'
import UserDevice from './UserDevice'
import VueJsonPretty from 'vue-json-pretty'
import { DeleteUserMutation } from '../mutations/DeleteUserMutation'

export default {
  name: 'UserModal',

  props: {
    devices: VueTypes.array.def([]),
    id: VueTypes.string,
    email: VueTypes.string,
    createdAt: VueTypes.string,
    activeAt: VueTypes.string,
    balance: VueTypes.integer,
    selected: VueTypes.bool,
    userTasks: VueTypes.array,
    routes: VueTypes.array,
    rewards: VueTypes.array,
    role: VueTypes.string,
    profile: VueTypes.object,
    transactions: VueTypes.array
  },

  components: {
    UserDevice,
    VueJsonPretty
  },

  methods: {
    deleteUser () {
      if (window.confirm('Are you sure?')) {
        this.$apollo.mutate({
          mutation: DeleteUserMutation,
          variables: {
            id: this.id
          }
        }).then(() => {
          this.$store.commit('users/removeItem', this.id)
          this.$root.$emit('bv::hide::modal', 'user-item')
        })
      }
    }
  },

  computed: {
  },
};
</script>

<style lang="scss" scoped></style>
