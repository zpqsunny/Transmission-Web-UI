<template>
  <div>
    <router-view/>
    <v-snackbar app v-model="$store.state.message.show" :timeout="$store.state.message.timeout" top >
      <span>
        <font-awesome-icon v-if="$store.state.message.type === 'error'" style="color: #e53935" :icon="['fa', 'exclamation-triangle']" />
        <font-awesome-icon v-if="$store.state.message.type === 'success'" style="color: #67C23A" :icon="['fa', 'check']" />
        {{ $store.state.message.title }}
      </span>
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="$store.state.message.show = false">
          关 闭
        </v-btn>
      </template>
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
    methods: {

    }
  }
</script>
<style scoped>
</style>
