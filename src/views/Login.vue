<template>
  <div>
    <v-app>
      <v-main>
        <v-container fluid style="margin-top: 100px">
          <v-form>
            <v-row justify="center" align="center">
              <v-col xl="3" lg="4" md="5" sm="8" xs="12">
                <v-text-field v-model="api.url" label="Transmission RPC" outlined></v-text-field>
                <v-checkbox v-model="api.auth" label="身份验证"></v-checkbox>
                <v-text-field :disabled="!api.auth" v-model="api.username" label="用户名" outlined></v-text-field>
                <v-text-field type="password" :disabled="!api.auth" v-model="api.password" label="密码" outlined></v-text-field>
                <v-btn color="primary" block @click="login">登 录</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data: () => {
    return {
      api: {
        url: 'http://127.0.0.1:9091/transmission/rpc',
        auth: false,
        username: '',
        password: ''
      }
    }
  },
  methods: {
    login() {
      localStorage.setItem('url', this.api.url)
      localStorage.setItem('auth', this.api.auth)
      localStorage.setItem('username', this.api.username)
      localStorage.setItem('password', this.api.password)
      // if chrome extension
      try {
        chrome.storage.local.set({
          url: this.api.url,
          auth: this.api.auth,
          username: this.api.username,
          password: this.api.password,
        })
      } catch (e) {}
      let re = /(Mobile|Android|iPad|Windows Phone|iPhone)/i
      if (re.test(navigator.appVersion)) {
        this.$router.push({path: '/m'})
      } else {
        this.$router.push({path: '/'})
      }
    }
  }
}
</script>

<style scoped>

</style>
