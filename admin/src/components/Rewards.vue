<template>
  <div class="section container">
    <!-- <div @click="isFilter = !isFilter">{{ isFilter ? 'Filter: \'NotificationStatus=Approved\'' : 'Filter: none' }}</div> -->
    <table class="table">
      <thead>
        <tr>
          <th>title</th>
          <th>description</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item,i) in items"
          :key="i"
        >
          <td
            class="clickable"
            @click="setItem(item)"
          >{{ item.title }}</td>
          <td>{{ item.description }}</td>
        </tr>
      </tbody>
    </table>
    <b-modal
      size="xl"
      v-model="expanded"
      @ok="updateReward"
      :title="currentItem && currentItem.title || '?'"
    >
      <textarea v-model="vouchers"></textarea>
      <vue-json-pretty :data="currentItem">
      </vue-json-pretty>
    </b-modal>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import VueJsonPretty from 'vue-json-pretty'

export default {
  name: 'Rewards',

  components: {
    VueJsonPretty
  },

  apollo: {
    items: {
      query: gql`query rewards { getRewards {
        rewardId
        title
        description
        vouchers {
          id
          userId
          data
        }
      }}`,
      update: data => {
        return data.getRewards
      },
      error: error => {
        if (error.message === 'GraphQL error: unauthorized') {
          window.localStorage.removeItem('pp:token')
          window.alert('unauthorized')
          window.setTimeout(() => {
            location.reload()
          }, 1000)
        }
      }
    }
  },

  methods: {
    setItem (item) {
      this.currentItem = item
      this.expanded = true
      this.vouchers = JSON.stringify(item.vouchers.map(i => {
        return {
          id: i.id,
          data: i.data,
          userId: i.userId
        }
      }))
    },
    updateReward (e) {
      e.preventDefault();
      this.loading = true
      this.$apollo.mutate({
        mutation: gql`mutation ($id: String!, $vouchers: [RewardVoucherInput]) {
          updateReward(id: $id, vouchers: $vouchers) {
            rewardId
            title
            description
            vouchers {
              id
              userId
              data
            }
          }
        }`,
        variables: {
          id: this.currentItem.rewardId,
          vouchers: JSON.parse(this.vouchers)
        }
      }).then(({ data }) => {
        console.log(data)
        this.loading = false
        this.currentItem = data.updateReward
      }).catch((error) => {
        console.error(error)
        this.loading = false
      })
    }
  },

  data () {
    return {
      items: [],
      selected: '',
      expanded: false,
      currentItem: null,
      vouchers: []
    }
  }
}
</script>

<style lang="css" scoped>
.jumbotron {
  padding: 1rem;
  margin-top: 2rem;
}

.section {
  text-align: left;
}

textarea {
  width: 100%;
}
</style>