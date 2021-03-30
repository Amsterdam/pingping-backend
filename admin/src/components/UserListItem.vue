<template>
  <tr
    :class="['hover', selected && 'selected']"
    @click="toggleSelected"
  >
    <td>{{ id }}</td>
    <td>{{ date }}</td>
    <td v-if="role === 'User'">
      <span>{{ activeAtFormatted }}</span>
    </td>
    <td v-if="role === 'User'">
      <span>{{ balance }}</span>
    </td>
    <td v-if="role === 'User'">
      <span v-if="routes">{{ routesProgress }}</span>
    </td>
    <td v-if="role === 'User'">
      <span v-if="device">{{ device }}</span>
    </td>
    <td v-if="role !== 'User'">
      <span>{{ profile.fullName }}</span>
    </td>
    <td v-if="role !== 'User'">
      <span>{{ email }}</span>
    </td>
    <td v-if="role !== 'User'">
      <span>{{ role }}</span>
    </td>
    <td v-if="role === 'User'">
      <div @click.stop="expanded = true">View</div>
    </td>
    <td v-if="role !== 'User'">
      <div @click.stop="expanded = true">Edit</div>
    </td>
    <b-modal
      size="xl"
      v-model="expanded"
      :title="id"
      id="user-item"
    >
      <UserModal v-bind="$props" />
    </b-modal>
  </tr>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import VueTypes from 'vue-types'
import UserModal from './UserModal'

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
    UserModal
  },

  mounted () {
    this.isSelected = this.selected
  },

  methods: {
    toggleSelected () {
      this.$emit('set', { id: this.id, selected: !this.selected })
    }
  },

  watch: {
    isSelected (val) {
      this.$emit('update:selected', val)
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