<template>
  <div class="page-login">
    <div class="login-form">
      <b-form inline>
        <label
          class="sr-only"
          for="inline-form-input-name"
        >Email</label>
        <b-input
          id="inline-form-input-name"
          class="mb-2 mr-sm-2 mb-sm-0"
          placeholder="email"
          v-model="email"
        ></b-input>

        <label
          class="sr-only"
          for="inline-form-input-username"
        >Password</label>
        <b-input-group class="mb-2 mr-sm-2 mb-sm-0">
          <b-input
            id="inline-form-input-username"
            type="password"
            placeholder="password"
            v-model="password"
            @keydown.enter="login"
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
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'LoginForm',

  methods: {
    login () {
      this.error = null
      if (!this.email.length || !this.password.length) {
        return
      }

      this.$apollo.mutate({
        mutation: gql`mutation ($email: String!, $password: String! $deviceId: String!) {
          adminLogin(email: $email, password: $password, deviceId: $deviceId) {
            accessToken
            user {
              profile {
                fullName
              }
            }
          }
        }`,
        update: (store, { data: { adminLogin } }) => {
          window.localStorage.setItem('pp:token', adminLogin.accessToken)
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
.page-login {
  background-color: #dfe8e7;
}

.login-form {
  background-color: #fff;
  margin: 4rem;
  max-width: 600px;
  border-radius: 5px;
  position: relative;
  padding: 1rem;
}
</style>
