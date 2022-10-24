<template>
  <div>
    <div>Loading test</div>
    <button @click="show">show Loading</button>
    <button @click="hide">hide Loading</button>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  methods: {
    show() {
      this.$loading.show(false)
    },
    hide() {
      this.$loading.hide()
    },
  },
}
</script>

<style lang="less" scoped></style>
