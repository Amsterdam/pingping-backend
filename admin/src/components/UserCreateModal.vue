<template>
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