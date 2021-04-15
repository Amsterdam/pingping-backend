<template>
  <div>
    <b-badge>{{ os }}</b-badge> -
    <b-badge :variant="notificationStatusVariant">{{ notificationStatus }} notifications</b-badge>
  </div>
</template>

<script>
import VueTypes from 'vue-types';

export default {
  name: 'UserDevice',

  props: {
    id: VueTypes.string,
    notificationStatus: VueTypes.string,
    os: VueTypes.string
  },

  computed: {
    notificationStatusVariant () {
      switch (this.notificationStatus) {
        case 'Declined':
          return 'danger'
        case 'Approved':
          return 'success'
        case 'Initial':
        default:
          return 'warning'
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
