<template>
  <div>
    <router-view/>
    <v-snackbar app v-model="$store.state.message.show" :timeout="$store.state.message.timeout" top >
      <font-awesome-icon v-if="$store.state.message.type === 'error'" style="color: #e53935" :icon="['fa', 'exclamation-triangle']" />
      <font-awesome-icon v-if="$store.state.message.type === 'warning'" style="color: #f1d10a" :icon="['fa', 'exclamation']" />
      <font-awesome-icon v-if="$store.state.message.type === 'success'" style="color: #67C23A" :icon="['fa', 'check']" />
      {{ $store.state.message.title }}
    </v-snackbar>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {

      }
    },
    mounted() {
      this.configLanguage()
    },
    methods: {
      configLanguage() {
        const lan = localStorage.getItem('lan')
        console.log(lan)
      }
    }
  }
</script>
<style scoped>
</style>
