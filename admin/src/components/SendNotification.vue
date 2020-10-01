<template>
  <div class="jumbotron">
    <p class="lead">Send notifications to {{ items.length }} devices.</p>
    <hr class="my-4">
    <b-form
      @submit="onSubmit"
      v-if="!loading"
    >
      <b-form-input
        v-model="deviceTokens"
        disabled
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
      return this.deviceTokens.split(',')
    }
  },

  methods: {
    onSubmit (e) {
      e.preventDefault();
      this.loading = true
      this.$apollo.mutate({
        mutation: gql`mutation ($title: String!, $body: String!, $deviceTokens: String!) {
          sendNotifications(title: $title, body: $body, deviceTokens: $deviceTokens)
        }`,
        variables: {
          title: this.title,
          body: this.body,
          deviceTokens: this.deviceTokens
        }
      }).then((data) => {
        console.log(data)
      }).catch((error) => {
        console.error(error)
      })
    }
  },

  data () {
    return {
      title: '',
      body: '',
      loading: false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>