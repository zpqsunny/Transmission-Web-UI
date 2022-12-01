<template>
  <div>
    <v-app>
      <v-system-bar height="40%" app>
        <v-spacer></v-spacer>
        <v-btn text small @click="changeLanguage">
          <font-awesome-icon size="2x" :icon="['fa', 'language']"/>
        </v-btn>
      </v-system-bar>
      <v-main>
        <v-container fluid style="margin-top: 100px">
          <v-form>
            <v-row justify="center" align="center">
              <v-col xl="3" lg="4" md="5" sm="8" xs="12">
                <v-text-field v-model="api.url" label="Transmission RPC" outlined placeholder="http://127.0.0.1:9091/transmission/rpc"></v-text-field>
                <v-checkbox v-model="api.auth" :label="$t('login.auth')"></v-checkbox>
                <v-text-field :disabled="!api.auth" v-model="api.username" :label="$t('login.username')" outlined></v-text-field>
                <v-text-field type="password" :disabled="!api.auth" v-model="api.password" :label="$t('login.password')" outlined></v-text-field>
                <v-btn color="primary" block @click="login" v-text="$t('login.login')"></v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-main>
      <Confirm :v.sync="versionWarning.show" :title="versionWarning.title" :text="versionWarning.text" @cancel="cancel" @ok="go"></Confirm>
    </v-app>
  </div>
</template>

<script>
import Confirm from '@/views/components/Confirm'

export default {
  name: 'Login',
  components: {
    Confirm
  },
  data: () => {
    return {
      api: {
        url: '',
        auth: false,
        username: '',
        password: ''
      },
      versionWarning: {
        show: false,
        title: '',
        text: ''
      },
    }
  },
  mounted() {
    let url = localStorage.getItem('url')
    if (url !== null) {
      this.api.url = url
    }
  },
  methods: {
    login() {
      localStorage.setItem('url', this.api.url)
      localStorage.setItem('auth', this.api.auth)
      localStorage.setItem('username', this.api.username)
      localStorage.setItem('password', this.api.password)
      this.action()
    },
    action() {
      this.$axios.post('', {
        method: 'session-get',
        arguments: {
          fields: ['rpc-version', 'version']
        }
      }).then(r => {
        if (r.data.result === 'success') {
          let rpcVersion = this.$store.state.application.rpcVersion
          if (r.data.arguments['rpc-version'] < rpcVersion) {
            this.versionWarning.title = '提示'
            this.versionWarning.text = '当前RPC版本为' + r.data.arguments['rpc-version'] + ',小于建议版本' + rpcVersion + '是否继续登录?'
            this.versionWarning.show = true
            return
          }
          this.go()
        }
      }).catch(error => {
        if (error.response.status === 409) {
          // 缺少头部 重试
          this.action()
          return
        }
        this.$store.commit('showMessage', {type: 'error', title: 'Connect Fail'})
      })
    },
    go() {
      let re = /(Mobile|Android|iPad|Windows Phone|iPhone)/i
      if (re.test(navigator.appVersion)) {
        this.$router.push({path: '/m'})
      } else {
        this.$router.push({path: '/'})
      }
    },
    cancel() {
      localStorage.removeItem('url')
      localStorage.removeItem('auth')
      localStorage.removeItem('username')
      localStorage.removeItem('password')
    },
    changeLanguage() {
      if (this.$i18n.locale === 'en') {
        this.$i18n.locale = 'zh-CN'
        localStorage.setItem('i18n','zh-CN')
      } else {
        this.$i18n.locale = 'en'
        localStorage.setItem('i18n','en')
      }
    },
  }
}
</script>

<style scoped>

</style>
