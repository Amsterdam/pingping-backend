<template>
  <div class="container text-center">
    <b-form inline>
      <label
        class="sr-only"
        for="inline-form-input-name"
      >Email</label>
      <b-input
        id="inline-form-input-name"
        class="mb-2 mr-sm-2 mb-sm-0"
        v-model="email"
      ></b-input>

      <label
        class="sr-only"
        for="inline-form-input-username"
      >Password</label>
      <b-input-group
        prepend="@"
        class="mb-2 mr-sm-2 mb-sm-0"
      >
        <b-input
          id="inline-form-input-username"
          v-model="password"
        ></b-input>
      </b-input-group>

      <b-button
        variant="primary"
        @click="login"
      >Login</b-button>
    </b-form>

    <b-alert
      show
      variant="danger"
      class="mt-3"
      v-if="error"
    >{{ error }}</b-alert>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'Login',

  methods: {
    login () {
      this.error = null
      if (!this.email.length || !this.password.length) {
        return
      }

      this.$apollo.mutate({
        mutation: gql`mutation ($email: String!, $password: String! $deviceId: String!) {
          login(email: $email, password: $password, deviceId: $deviceId) {
            accessToken
            user {
              profile {
                fullName
              }
            }
          }
        }`,
        update: (store, { data: { login } }) => {
          window.localStorage.setItem('pp:token', login.accessToken)
          location.reload()
        },
        variables: {
          email: this.email,
          password: this.password,
          deviceId: window.localStorage.getItem('deviceId')
        }
      }).catch(data => {
        console.error(data.message)
        // this.error = _.get(data, 'errors.0.message')
        this.error = 'Invalid Credentials'
      })
    }
  },

  data () {
    return {
      email: '',
      password: '',
      error: null
    }
  }
}
</script>

<style scoped>
</style>
