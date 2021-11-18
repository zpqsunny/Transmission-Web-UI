<template>
  <v-app>
    <v-system-bar app height="50%">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-btn text small @click="logout">
        <font-awesome-icon size="2x" :icon="['fa','sign-out-alt']"/>
      </v-btn>
    </v-system-bar>
    <!--  种子状态过滤  -->
    <v-navigation-drawer v-model="drawer" absolute bottom temporary>
      <v-list dense nav>
        <v-list-item-group v-model="filterItem" color="primary">
          <v-list-item @click="torrentStatusUpdate(-1)">
            <v-list-item-avatar><font-awesome-icon size="2x" :icon="['fa','folder']"/></v-list-item-avatar>
            <v-list-item-content><v-list-item-title>全部</v-list-item-title></v-list-item-content>
            <v-list-item-action>{{ torrentTotal }}</v-list-item-action>
          </v-list-item>
          <v-list-item @click="torrentStatusUpdate(0)">
            <v-list-item-avatar><font-awesome-icon size="2x" :icon="['fa','pause']"/></v-list-item-avatar>
            <v-list-item-content><v-list-item-title>暂停</v-list-item-title></v-list-item-content>
            <v-list-item-action>{{ torrentPause }}</v-list-item-action>
          </v-list-item>
          <v-list-item @click="torrentStatusUpdate(2)">
            <v-list-item-avatar><font-awesome-icon size="2x" :icon="['fa','database']"/></v-list-item-avatar>
            <v-list-item-content><v-list-item-title>校验中</v-list-item-title></v-list-item-content>
            <v-list-item-action>{{ torrentDatabase }}</v-list-item-action>
          </v-list-item>
          <v-list-item @click="torrentStatusUpdate(3)">
            <v-list-item-avatar><font-awesome-icon size="2x" :icon="['fa','clock']"/></v-list-item-avatar>
            <v-list-item-content><v-list-item-title>待下载</v-list-item-title></v-list-item-content>
            <v-list-item-action>{{ torrentWaitDownload }}</v-list-item-action>
          </v-list-item>
          <v-list-item @click="torrentStatusUpdate(4)">
            <v-list-item-avatar><font-awesome-icon size="2x" :icon="['fa','cloud-download-alt']"/></v-list-item-avatar>
            <v-list-item-content><v-list-item-title>下载中</v-list-item-title></v-list-item-content>
            <v-list-item-action>{{ torrentDownloading }}</v-list-item-action>
          </v-list-item>
          <v-list-item @click="torrentStatusUpdate(6)">
            <v-list-item-avatar><font-awesome-icon size="2x" :icon="['fa','cloud-upload-alt']"/></v-list-item-avatar>
            <v-list-item-content><v-list-item-title>做种中</v-list-item-title></v-list-item-content>
            <v-list-item-action>{{ torrentUploading }}</v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container fluid>
        <template v-for="(item, index) in this.$store.state.torrents">
          <v-list-item v-if="torrentStatus < 0 || item.status === torrentStatus" :key="index">
            <v-list-item-content>
              <v-list-item-title>
                <span>{{ item.name }}</span>
              </v-list-item-title>
              <v-list-item-subtitle>
                <div style="height: 20px">
                  <span v-if="item.rateUpload > 0"><font-awesome-icon class="up-color" :icon="['fa', 'sort-up']"/> <small>{{ item.rateUpload | unitFormat }} /s </small></span>
                  <span v-if="item.rateDownload > 0"><font-awesome-icon class="down-color" :icon="['fa', 'sort-down']"/> <small>{{ item.rateDownload | unitFormat }} /s</small></span>
                </div>
                <div>
                  <v-progress-linear v-if="item.status === 2" color="cyan lighten-1" height="20" rounded striped
                                     :value="(item.recheckProgress * 100).toFixed(2)">
                    <template v-slot:default="{ value }">
                      <strong>{{ value }}%</strong>
                    </template>
                  </v-progress-linear>
                  <v-progress-linear v-else color="light-blue" height="20" rounded striped
                                     :value="(item.percentDone * 100).toFixed(2)">
                    <template v-slot:default="{ value }">
                      <strong>{{ value }}%</strong>
                    </template>
                  </v-progress-linear>
                </div>
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                <span>{{ item.uploadedEver | unitFormat }}</span> /
                <span>{{ item.totalSize | unitFormat }}</span>&nbsp;
                <span v-if="item.eta > 0" class="text-no-wrap down-color">剩余 {{ item.eta | timeInterval }}</span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'Mobile',
  data() {
    return {
      filterItem: 0,
      torrentStatus: -1,
      drawer: false,
      intervalId: null
    }
  },
  computed: {
    torrentTotal: function () {
      return this.$store.state.torrents.length
    },
    torrentPause: function () {
      return this.$store.state.torrents.filter(v => {return v.status === 0}).length
    },
    torrentDatabase: function () {
      return this.$store.state.torrents.filter(v => {return v.status === 2}).length
    },
    torrentWaitDownload: function () {
      return this.$store.state.torrents.filter(v => {return v.status === 3}).length
    },
    torrentDownloading: function () {
      return this.$store.state.torrents.filter(v => {return v.status === 4}).length
    },
    torrentUploading: function () {
      return this.$store.state.torrents.filter(v => {return v.status === 6}).length
    }
  },
  mounted() {
    this.intervalId = setInterval(() => {
      this.$store.commit('getTorrents')
    }, 2000)
  },
  beforeDestroy() {
    clearInterval(this.intervalId)
  },
  methods: {
    torrentStatusUpdate(status) {
      this.torrentStatus = status
      this.drawer = false;
    },
    logout() {
      localStorage.clear()
      this.$router.push({ path: '/login' })
    }
  }
}
</script>

<style scoped>

</style>
