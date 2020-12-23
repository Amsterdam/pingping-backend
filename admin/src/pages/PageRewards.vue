<template>
  <div class="section container">
    <table class="table">
      <thead>
        <tr>
          <th>title</th>
          <th>description</th>
          <th>used</th>
        </tr>
      </thead>
      <tbody>
        <RewardListItem
          v-for="(item,i) in items"
          :key="i"
          @setItem="setItem"
          v-bind="item"
        />
      </tbody>
    </table>
    <b-modal
      size="xl"
      v-model="expanded"
      @ok="updateReward"
      :title="currentItem && currentItem.title || '?'"
    >
      <RewardModal
        :vouchers="vouchers"
        @updateVouchers="updateVouchers"
      />
    </b-modal>
  </div>
</template>

<script>
import RewardModal from '../components/RewardModal'
import RewardListItem from '../components/RewardListItem'
import { GetRewardsQuery } from '../queries/GetRewardsQuery'
import { AdminUpdateRewardMutation } from '../mutations/AdminUpdateRewardMutation'

export default {
  name: 'PageRewards',

  components: {
    RewardModal,
    RewardListItem
  },

  apollo: {
    items: {
      query: GetRewardsQuery,
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
    updateVouchers (vouchers) {
      this.vouchers = JSON.stringify(vouchers)
    },

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
        mutation: AdminUpdateRewardMutation,
        variables: {
          id: this.currentItem.rewardId,
          vouchers: JSON.parse(this.vouchers)
        }
      }).then(({ data }) => {
        this.loading = false
        this.currentItem = data.adminUpdateReward
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
      vouchers: ''
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

.clickable:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>