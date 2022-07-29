<template>
  <div>
    <UserDevice
      v-for="(device, i) in devices"
      :key="'device-' + i"
      v-bind="device"
    />
    <div class="pt-3">
      <b-tabs content-class="m-3">
        <b-tab
          title="Tasks"
          active
        >
          <task-table :tasks="userTasks" />
        </b-tab>
        <b-tab title="Routes">
          <b-table
            striped
            hover
            small
            :items="routes"
          ></b-table>
        </b-tab>
        <b-tab title="Rewards">
          <b-table
            striped
            hover
            small
            :items="rewards"
          ></b-table>
        </b-tab>
        <b-tab title="Transactions">
          <b-table
            striped
            hover
            small
            :items="transactions"
          ></b-table>
        </b-tab>
      </b-tabs>
    </div>
    <b-button
      variant="danger"
      @click="deleteUser"
      class="mt-4"
    >Delete User</b-button>
  </div>
</template>

<script>
import VueTypes from 'vue-types'
import UserDevice from './UserDevice.vue'
import { DeleteUserMutation } from '../mutations/DeleteUserMutation'
import TaskTable from './TaskTable.vue'

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
    TaskTable
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
