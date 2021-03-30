<template>
  <div>
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
          <th v-if="role === 'user'">progress</th>
          <th v-if="role === 'user'">device</th>
          <th v-if="role !== 'user'">name</th>
          <th v-if="role !== 'user'">email</th>
          <th v-if="role !== 'user'">role</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <UserListItem
          v-for="(item,i) in filteredItems"
          :key="i"
          @set="setItem"
          v-bind="item"
          :selected.sync="item.selected"
        />
      </tbody>
    </table>
    <b-pagination
      v-model="currentPage"
      :total-rows="items.length"
      :per-page="perPage"
      aria-controls="my-table"
    ></b-pagination>
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
import UserCreateModal from '../components/UserCreateModal'
import VueTypes from 'vue-types'

export default {
  name: 'UserTable',

  components: {
    UserListItem,
    UserCreateModal,
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
    }
  },

  computed: {
    recipients: {
      get () {
        return this.items.filter(i => i.selected === true).map(u => {
          return { token: u.device?.token, userId: u.id }
        })
      },
      set () {
      }
    },
    filteredItems () {
      return this.items.slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage)
    }
  },

  data () {
    return {
      perPage: 20,
      currentPage: 1,
      isFilter: false,
      createUser: false,
      loading: false,
    }
  }
}
</script>

<style lang="scss" scoped>
</style>