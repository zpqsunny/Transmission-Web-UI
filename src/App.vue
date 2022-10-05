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
    created() {
      this.configLanguage()
    },
    methods: {
      configLanguage() {
        const i18n = localStorage.getItem('i18n')
        if (i18n !== null) {
          document.documentElement.lang = i18n
          this.$i18n.locale = i18n
          return
        }
        let locale
        switch (navigator.language) {
          case 'zh-CN':
          case 'zh-TW':
            locale = 'zh-CN'
            break
          default:
            locale = 'en'
            break;
        }
        document.documentElement.lang = locale
        this.$i18n.locale = locale
        localStorage.setItem('i18n', locale)
      }
    },
    watch: {
      '$i18n.locale': function (val, oldVal) {
        document.documentElement.lang = val
      }
    }
  }
</script>
<style scoped>
</style>
