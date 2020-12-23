<template>
  <div>
    <div class="text-h6">Vouchers</div>
    <textarea v-model="vouchers"></textarea>
    <div class="text-h6">CSV Input</div>
    <textarea v-model="csv"></textarea>
    <div v-if="csv">{{ importText }}</div>
    <b-button @click="importCsv">Import CSV</b-button>
    <table class="table">
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
          v-for="(voucher,i) in voucherItems"
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
  </div>
</template>

<script>
import VueTypes from 'vue-types'
import { AdminDeleteRewardVoucherMutation } from '../mutations/AdminDeleteRewardVoucherMutation'

export default {
  props: {
    vouchers: VueTypes.string,
  },

  computed: {
    importText () {
      return `Going to import ${this.csvLines.length - 1} items with columns ${this.csvFields.join(',')}`
    },

    csvLines () {
      return this.csv.split('\n')
    },

    csvFields () {
      if (this.csvLines.length) {
        return this.csvLines[0].split(';')
      }

      return []
    },

    voucherItems () {
      return JSON.parse(this.vouchers)
    }
  },

  methods: {
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

        this.$emit('updateVouchers', JSON.parse(this.vouchers).concat(res))
      }
    },

    deleteVoucher (id) {
      let confirm = window.confirm('Are you sure you want to delete the voucher?')

      if (confirm) {
        this.$apollo.mutate({
          mutation: AdminDeleteRewardVoucherMutation,
          variables: {
            id
          }
        }).then(() => {
          this.$emit('updateVouchers', this.voucherItems.filter((i) => i.id !== id))
        }).catch((error) => {
          console.error(error)
        })
      }
    },
  },

  data () {
    return {
      csv: ''
    }
  }
}
</script>

<style scoped>
textarea {
  width: 100%;
}
</style>