<template>
  <div class="jumbotron">
    <div v-if="done">
      <b-alert show>Notifications sent!</b-alert>

      <b-button
        @click="done = false"
        variant="info"
        class="m-1"
      >
        Continue
      </b-button>
    </div>
    <div v-else>
      <p class="lead">Send notification to <strong>{{ recipients ? recipients.length : 0 }}</strong> devices.</p>
      <hr class="my-4">
      <b-form
        @submit="onSubmit"
        v-if="!loading"
      >
        <div class="form-row">
          <b-form-group
            label="Type"
            class="col-md-6 text-left"
          >
            <b-form-select
              v-model="type"
              :options="types"
            ></b-form-select>
          </b-form-group>
          <b-form-group
            label="Route"
            class="col-md-6 text-left"
          >
            <b-form-select
              v-model="routeId"
              :options="routeIds"
            ></b-form-select>
          </b-form-group>
        </div>
        <b-form-group
          label="Recipients"
          class="mb-12 mr-sm-12 mb-sm-12 text-left"
        >
          <b-form-tags
            input-id="tags-basic"
            v-model="recipients"
            remove-on-delete
          ></b-form-tags>
        </b-form-group>
        <div class="form-row">
          <b-form-group
            label="Title"
            class="col-md-6 text-left"
          >
            <b-form-input
              v-model="title"
              placeholder="Title"
              autofocus
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group
            label="Body"
            class="col-md-6 text-left"
          >
            <b-form-input
              v-model="message"
              placeholder="message"
            ></b-form-input>
          </b-form-group>
        </div>
        <b-form-group
          label="Payload"
          class="mb-12 mr-sm-12 mb-sm-12 text-left"
        >
          <b-form-input
            v-model="payload"
            placeholder="payload"
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
  </div>
</template>

<script>
import { AdminSendNotificationsMutation } from '../mutations/AdminSendNotificationsMutation'
import { GetDraftNotificationQuery } from '../queries/GetDraftNotificationQuery'

export default {
  name: 'SendNotification',

  mounted () {
    this.getDraft()
  },

  methods: {
    getDraft () {
      this.$apollo.query({
        query: GetDraftNotificationQuery,
        variables: {
          type: this.type,
          routeId: this.routeId
        }
      }).then(({ data: { getDraftNotification } }) => {
        this.recipients = getDraftNotification.recipientUserIds
        this.title = getDraftNotification.title
        this.payload = JSON.stringify(getDraftNotification.payload)
      })
    },
    onSubmit (e) {
      e.preventDefault();
      let confirm = window.confirm('Are you sure?')

      if (confirm) {
        this.loading = true
        this.$apollo.mutate({
          mutation: AdminSendNotificationsMutation,
          variables: {
            input: {
              title: this.title,
              message: this.message,
              payload: JSON.parse(this.payload),
              recipientUserIds: this.recipients
            }
          }
        }).then(() => {
          this.loading = false
          this.done = true
        }).catch(() => {
          this.loading = false
        })
      }
    }
  },

  watch: {
    type () {
      this.getDraft()
    }
  },

  data () {
    return {
      title: '',
      message: '',
      payload: '{}',
      loading: false,
      done: false,
      types: ['RemindUserToCompleteOnboarding', 'RemindUserToContinueRoute', 'Manual'],
      type: 'RemindUserToCompleteOnboarding',
      routeId: 'financieleBasis',
      routeIds: ['financieleBasis'],
      recipients: [],
    }
  }
}
</script>

<style lang="scss" scoped>
</style>