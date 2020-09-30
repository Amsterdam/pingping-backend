<template>
  <tr
    :class="['hover', selected && 'selected']"
    @click="toggleSelected"
  >
    <td><input
        type="checkbox"
        v-model="selected"
      />
    <td>{{ id }}</td>
    <td>{{ createdAt }}</td>
    <td>
      <span v-if="device">{{ device.id }} - {{ device.notificationStatus }}</span>

    </td>
    <td>
      <div @click.stop="expanded = true">More...</div>
    </td>
    <b-modal
      size="xl"
      v-model="expanded"
      :title="id"
    >
      <vue-json-pretty :data="data">
      </vue-json-pretty>
    </b-modal>
  </tr>
</template>

<script>
import _ from 'lodash'
import VueJsonPretty from 'vue-json-pretty'

export default {
  name: 'UserListItem',

  props: {
    devices: Array,
    id: String,
    createdAt: String,
    selected: Boolean,
    data: Object
  },

  components: {
    VueJsonPretty
  },

  mounted () {
    this.isSelected = this.selected
  },

  methods: {
    toggleSelected () {
      this.$emit('set', { id: this.id, selected: !this.selected })
    }
  },

  watch: {
    isSelected (val) {
      this.$emit('changeSelected', { id: this.id, selected: val })
    },

    selected (val) {
      this.isSelected = val
    }
  },

  computed: {
    device () {
      return _.first(this.devices.filter(d => d.notificationStatus === 'Approved'))
    }
  },

  data () {
    return {
      isSelected: false,
      expanded: false
    }
  }
}
</script>

<style lang="css" scoped>
.hover {
  cursor: pointer;
}
</style>