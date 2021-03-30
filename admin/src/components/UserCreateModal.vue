<template>
  <b-form
    @submit="onSubmitCreateUser"
    v-if="!loading"
  >
    <b-form-group label="Full Name">
      <b-form-input
        v-model="newUser.fullName"
        autofocus
        required
        class="mb-2"
      ></b-form-input>
    </b-form-group>
    <b-form-group label="Email">
      <b-form-input
        v-model="newUser.email"
        placeholder="Email"
        required
        class="mb-2"
      ></b-form-input>
    </b-form-group>
    <b-form-group label="Role">
      <b-form-select
        v-model="newUser.role"
        :options="roles"
      ></b-form-select>
    </b-form-group>
    <b-form-group label="Password">
      <b-form-input
        v-model="newUser.password"
        placeholder="Password"
        type="password"
        required
        class="mb-2"
      ></b-form-input>
    </b-form-group>
    <b-button
      type="submit"
      variant="primary"
    >Send</b-button>
  </b-form>
</template>

<script>
import { CreateUserMutation } from '../mutations/CreateUserMutation'

export default {
  name: 'UserCreateModal',

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
  },

  data () {
    return {
      loading: false,
      roles: ['Admin', 'Reporter'],
      newUser: {
        fullName: '',
        email: '',
        password: '',
        role: 'Admin'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>