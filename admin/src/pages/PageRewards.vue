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
      <div class="text-h6">Vouchers</div>
      <textarea v-model="vouchers"></textarea>
      <div class="text-h6">CSV Input</div>
      <textarea v-model="csv"></textarea>
      <b-button @click="importCsv">Import CSV</b-button>
      <!-- <vue-json-pretty :data="currentItem" /> -->
      <table
        class="table"
        v-if="currentItem"
      >
        <thead>
          <tr>
            <th>Action</th>
            <th>Used</th>
            <th>data</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(voucher,i) in currentItem.vouchers"
            :key="i"
          >
            <td
              class="clickable"
              @click="deleteVoucher(voucher.id)"
            >Delete</td>
            <td>{{ voucher.userId !== null }}</td>
            <td>{{ voucher.data }}</td>
          </tr>
        </tbody>
      </table>
    </b-modal>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import RewardListItem from '../components/RewardListItem'

export default {
  name: 'PageRewards',

  components: {
    RewardListItem
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
    deleteVoucher (id) {
      let confirm = window.confirm('Are you sure you want to delete the voucher?')

      if (confirm) {
        this.$apollo.mutate({
          mutation: gql`mutation ($id: String!) {
          adminDeleteRewardVoucher(id: $id) {
            message
          }
        }`,
          variables: {
            id
          }
        }).then(() => {
          this.currentItem.vouchers = this.currentItem.vouchers.filter((i) => i.id !== id);
        }).catch((error) => {
          console.error(error)
        })
      }
    },

    importCsv () {
      let res = []
      let lines = this.csv.split('\n')

      if (lines.length) {
        let fields = lines[0].split(';')

        for (var i = 1; i < lines.length; i++) {
          let values = lines[i].split(';')
          let item = {}

          for (var f in fields) {
            item[fields[f]] = values[f]
          }

          res.push({ data: item })
        }

        this.vouchers = JSON.stringify(JSON.parse(this.vouchers).concat(res))

        // this.vouchers = this.vouchers.concat(res)
      }
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
        mutation: gql`mutation ($id: String!, $vouchers: [RewardVoucherInput]) {
          adminUpdateReward(id: $id, vouchers: $vouchers) {
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
      csv: '',
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

.clickable:hover {
  text-decoration: underline;
  cursor: pointer;
}

textarea {
  width: 100%;
}
</style>