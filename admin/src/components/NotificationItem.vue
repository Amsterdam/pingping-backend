<template>
  <tr>
    <td>{{ createdAt }}</td>
    <td>{{ type }}</td>
    <td>{{ status }}</td>
  </tr>
</template>

<script>
export default {
  name: 'NotificartionItem',

  props: {
    createdAt: String,
    type: String,
    status: String,
  }
};
</script>

<style lang="scss" scoped></style>
