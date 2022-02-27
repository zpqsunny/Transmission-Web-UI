<template>
  <div>
    <small>Transmission: {{ $store.state.sessionInfo.version }} rpc-version: {{ $store.state.sessionInfo["rpc-version"] }}</small>
  </div>
</template>

<script>
export default {
  name: "Bottom",
  data() {
    return {

    }
  }
}
</script>

<style scoped>

</style>
