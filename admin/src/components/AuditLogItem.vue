<template>
  <tr>
    <td>{{ createdAt }}</td>
    <td>{{ type }}</td>
    <td>{{ userFullName }}</td>
    <td>{{ description }}</td>
  </tr>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'AuditLogItem',

  props: {
    createdAt: String,
    type: String,
    user: Object,
    description: String,
  },

  computed: {
    userFullName () {
      return _.get(this.user, 'profile.fullName');
    },
  },
};
</script>

<style lang="scss" scoped></style>
