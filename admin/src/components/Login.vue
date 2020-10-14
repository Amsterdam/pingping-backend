<template>
  <div>
    <input
      v-model="deviceId"
      type="password"
    />
    <button @click="login">Login</button>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'Login',

  methods: {
    login () {
      if (this.deviceId.length === 12) {
        this.$apollo.mutate({
          mutation: gql`mutation ($input: RegisterDeviceInput!) {
            registerDevice(input: $input) {
              accessToken
            }
          }`,
          update: (store, { data: { registerDevice } }) => {
            console.log('registerDevice', registerDevice)
            window.localStorage.setItem('pp:token', registerDevice.accessToken)
            // this.$emit('login', registerDevice.accessToken)
            location.reload()
          },
          variables: {
            input: {
              deviceId: this.deviceId
            }
          }
        })
      } else {
        window.alert('Wrong password.' + this.deviceId.length)
        this.deviceId = ''
      }
    }
  },

  data () {
    return {
      deviceId: ''
    }
  }
}
</script>

<style lang="scss" scoped>
</style>