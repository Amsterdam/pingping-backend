<template>
  <tr
    :class="['hover', selected && 'selected']"
    @click="toggleSelected"
  >
    <td>
      <input
        type="checkbox"
        v-if="canSendNotifications"
        v-model="isSelected"
      />
    </td>
    <td>{{ id }}</td>
    <td>{{ date }}</td>
    <td v-if="role === 'User'">
      <span>{{ balance }}</span>
    </td>
    <td v-if="role === 'User'">
      <span v-if="routes">{{ routesProgress }}</span>
    </td>
    <td v-if="role === 'User'">
      <span v-if="device">{{ device }}</span>
    </td>
    <td v-if="role === 'Admin'">
      <span>{{ profile.fullName }}</span>
    </td>
    <td v-if="role === 'Admin'">
      <span>{{ email }}</span>
    </td>
    <td>
      <div @click.stop="expanded = true">More...</div>
    </td>
    <b-modal
      size="xl"
      v-model="expanded"
      :title="id"
      id="user-item"
    >
      <div v-if="activeAt">
        <span class="text-bold">Last Active Date:</span> {{ activeAtFormatted }}
      </div>
      <h6>Devices</h6>
      <vue-json-pretty :data="devices" />
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
    </b-modal>
  </tr>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { DeleteUserMutation } from '../mutations/DeleteUserMutation'
import VueJsonPretty from 'vue-json-pretty'
import VueTypes from 'vue-types'

export default {
  name: 'UserListItem',

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
    VueJsonPretty
  },

  mounted () {
    this.isSelected = this.selected
  },

  methods: {
    toggleSelected () {
      this.$emit('set', { id: this.id, selected: !this.selected })
    },

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

  watch: {
    isSelected (val) {
      this.$emit('changeSelected', { id: this.id, selected: val })
    },

    selected (val) {
      this.isSelected = val
    }
  },

  computed: {
    activeAtFormatted () {
      if (this.activeAt) {
        return moment(this.activeAt / 1).format('DD.MM.Y HH:mm')
      }

      return null
    },

    routesProgress () {
      return this.routes.map(r => r.status).join(',')
    },

    date () {
      return moment(this.createdAt / 1).format('DD.MM.Y HH:mm')
    },
    device () {
      let device = _.first(this.devices)

      if (!device) {
        return ''
      }

      return [
        device.os,
        device.status
      ].filter(i => i).join(' - ')
    },

    canSendNotifications () {
      return this.devices.filter(d => d.notificationStatus === 'Approved').length > 0
    }
  },

  data () {
    return {
      isSelected: false,
      expanded: false
    }
  }
}
</script>

<style lang="css" scoped>
.hover {
  cursor: pointer;
}

.modal-dialog {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.modal-content {
  height: auto;
  min-height: 100%;
  border-radius: 0;
}

.text-bold {
  font-weight: bold;
}
</style>