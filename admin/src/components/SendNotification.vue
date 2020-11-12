<template>
  <div class="jumbotron">
    <p class="lead">Send notifications to {{ items.length }} devices.</p>
    <hr class="my-4">
    <b-form
      @submit="onSubmit"
      v-if="!loading"
    >
      <b-form-input
        v-model="sendTokens"
        placeholder="Device Tokens"
        autofocus
        required
        class="mb-2"
      ></b-form-input>
      <b-form-input
        v-model="title"
        placeholder="Title"
        autofocus
        required
        class="mb-2"
      ></b-form-input>
      <b-form-input
        v-model="body"
        placeholder="Body"
        class="mb-2"
      ></b-form-input>
      <b-button
        type="submit"
        variant="primary"
      >Send</b-button>
    </b-form>
    <div v-else>
      Loading...
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'SendNotification',

  props: {
    deviceTokens: String
  },

  computed: {
    items () {
      return this.sendTokens.split(',')
    }
  },

  mounted () {
    this.sendTokens = this.deviceTokens
  },

  methods: {
    onSubmit (e) {
      e.preventDefault();
      this.loading = true
      this.$apollo.mutate({
        mutation: gql`mutation ($title: String!, $body: String!, $deviceTokens: String!) {
          adminSendNotifications(title: $title, body: $body, deviceTokens: $deviceTokens)
        }`,
        variables: {
          title: this.title,
          body: this.body,
          deviceTokens: this.sendTokens
        }
      }).then((data) => {
        console.log('notificationSuccess', data)
        this.loading = false
      }).catch((error) => {
        console.error('notificationError', error)
        this.loading = false
      })
    }
  },

  watch: {
    deviceTokens (val) {
      this.sendTokens = val
    }
  },

  data () {
    return {
      title: '',
      body: '',
      loading: false,
      sendTokens: ''
    }
  }
}
</script>

<style lang="scss" scoped>
</style>