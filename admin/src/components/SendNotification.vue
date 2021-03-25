<template>
  <div class="jumbotron">
    <p class="lead">Send notifications to {{ recipients.length }} devices.</p>
    <hr class="my-4">
    <b-form
      @submit="onSubmit"
      v-if="!loading"
    >
      <b-form-group label="Recipients">
        <b-form-tags
          input-id="tags-basic"
          disabled
          v-model="recipientsCurrent"
        ></b-form-tags>
      </b-form-group>
      <b-form-group label="Title">
        <b-form-input
          v-model="title"
          placeholder="Title"
          autofocus
          required
          class="mb-2"
        ></b-form-input>
      </b-form-group>
      <b-form-group label="Body">
        <b-form-input
          v-model="body"
          placeholder="Body"
          class="mb-2"
        ></b-form-input>
      </b-form-group>
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
import VueTypes from 'vue-types'

export default {
  name: 'SendNotification',

  props: {
    recipients: VueTypes.array
  },

  mounted () {
    this.recipientsCurrent = [...this.recipients]
  },

  methods: {
    onSubmit (e) {
      e.preventDefault();
      this.loading = true
      this.$apollo.mutate({
        mutation: gql`mutation ($title: String!, $body: String!, $recipients: [NotificationRecipient!]!) {
          adminSendNotifications(title: $title, body: $body, recipients: $recipients)
        }`,
        variables: {
          title: this.title,
          body: this.body,
          recipients: this.recipients
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
    recipientsCurrent (val) {
      this.$emit('update:recipients', val)
    }
  },

  data () {
    return {
      title: '',
      body: '',
      loading: false,
      recipientsCurrent: [],
    }
  }
}
</script>

<style lang="scss" scoped>
</style>