<template>
  <v-app style="height: 100vh">
    <v-system-bar app height="50%">
      <v-btn text small @click.stop="filterMenu = !filterMenu">
        <font-awesome-icon size="2x" :icon="['fa', 'filter']"/>
      </v-btn>
      <v-btn text small @click.stop="torrentAction('torrent-start')" title="重新开始已选择的种子" :disabled="!selectedTorrents.length > 0">
        <font-awesome-icon size="2x" :icon="['fa', 'play']"/>
      </v-btn>
      <v-btn text small @click.stop="torrentAction('torrent-stop')" title="暂停已选择的种子" :disabled="!selectedTorrents.length > 0">
        <font-awesome-icon size="2x" :icon="['fa', 'pause']"/>
      </v-btn>
      <v-btn text small @click="deleteTorrentDialog = true" title="删除种子" :disabled="!selectedTorrents.length > 0">
        <font-awesome-icon size="2x" :icon="['fa','trash-alt']"/>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn text small @click.stop="logout">
        <font-awesome-icon size="2x" :icon="['fa','sign-out-alt']"/>
      </v-btn>
    </v-system-bar>
    <!--  种子状态过滤  -->
    <v-navigation-drawer v-model="filterMenu" app bottom temporary>
      <v-list dense nav>
        <v-list-item-group v-model="filterItem" color="primary">
          <v-list-item @click="torrentStatusUpdate(-1)">
            <v-list-item-avatar>
              <font-awesome-icon size="2x" :icon="['fa','folder']"/>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>全部</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>{{ torrentTotal }}</v-list-item-action>
          </v-list-item>
          <v-list-item @click="torrentStatusUpdate(0)">
            <v-list-item-avatar>
              <font-awesome-icon size="2x" :icon="['fa','pause']"/>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>暂停</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>{{ torrentPause }}</v-list-item-action>
          </v-list-item>
          <v-list-item @click="torrentStatusUpdate(2)">
            <v-list-item-avatar>
              <font-awesome-icon size="2x" :icon="['fa','database']"/>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>校验中</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>{{ torrentDatabase }}</v-list-item-action>
          </v-list-item>
          <v-list-item @click="torrentStatusUpdate(3)">
            <v-list-item-avatar>
              <font-awesome-icon size="2x" :icon="['fa','clock']"/>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>待下载</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>{{ torrentWaitDownload }}</v-list-item-action>
          </v-list-item>
          <v-list-item @click="torrentStatusUpdate(4)">
            <v-list-item-avatar>
              <font-awesome-icon size="2x" :icon="['fa','cloud-download-alt']"/>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>下载中</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>{{ torrentDownloading }}</v-list-item-action>
          </v-list-item>
          <v-list-item @click="torrentStatusUpdate(6)">
            <v-list-item-avatar>
              <font-awesome-icon size="2x" :icon="['fa','cloud-upload-alt']"/>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>做种中</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>{{ torrentUploading }}</v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container fluid>
        <v-list flat three-line>
          <v-list-item-group v-model="selectedTorrents" multiple>
            <template v-for="(item, index) in $store.state.torrents">
              <v-list-item :value="item.id" style="padding: 0;border-bottom: thin solid #e0e0e0;" v-if="torrentStatus < 0 || item.status === torrentStatus" :key="index">
                <template v-slot:default="{ active }">
                  <v-list-item-action style="margin-right: 16px;">
                    <v-checkbox :input-value="active"></v-checkbox>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ item.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <div class="d-flex justify-space-between">
                        <div>
                          <span v-if="item.status === 0" class="default--text">已暂停</span>
                          <span v-if="item.status === 1" class="orange--text">待校验</span>
                          <span v-if="item.status === 2" class="orange--text">校验中</span>
                          <span v-if="item.status === 3" class="secondary--text">待下载</span>
                          <span v-if="item.status === 4" class="primary--text">下载中</span>
                          <span v-if="item.status === 5" class="green--text">待做种</span>
                          <span v-if="item.status === 6" class="green--text">做种中</span>
                        </div>
                        <div>
                          <span v-if="item.rateUpload > 0"><font-awesome-icon class="up-color" :icon="['fa', 'sort-up']"/> <small>{{ item.rateUpload | unitFormat }} /s </small></span>
                          <span v-if="item.rateDownload > 0"><font-awesome-icon class="down-color" :icon="['fa', 'sort-down']"/> <small>{{ item.rateDownload | unitFormat }} /s</small></span>
                        </div>
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
                      <template v-if="item.metadataPercentComplete === 1">
                        <span>{{ item.downloadedEver | unitFormat }} / {{ item.totalSize | unitFormat }}</span>
                      </template>
                      <span v-if="item.eta > 0" class="text-no-wrap down-color"> 剩余 {{ item.eta | timeInterval }}</span>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-list>
      </v-container>
    </v-main>
    <!--  删除种子对话框  -->
    <v-dialog v-model="deleteTorrentDialog" width="80%" persistent>
      <v-card>
        <v-card-title class="justify-center">删除种子确认</v-card-title>
        <v-card-text>
          确定要删除已选择的种子吗?
          <v-checkbox v-model="deleteLocalData" label="同时删除数据"></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="torrentActionDelete">
            确 定
          </v-btn>
          <v-btn color="second" text @click="deleteTorrentDialog = false, deleteLocalData = false">
            取 消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  name: 'Mobile',
  data() {
    return {
      filterMenu: false,
      deleteTorrentDialog: false,
      deleteLocalData: false,
      filterItem: 0,
      torrentStatus: -1,
      intervalId: null,
      selectedTorrents: []
    }
  },
  computed: {
    torrentTotal: function () {
      return this.$store.state.torrents.length
    },
    torrentPause: function () {
      return this.$store.state.torrents.filter(v => {
        return v.status === 0
      }).length
    },
    torrentDatabase: function () {
      return this.$store.state.torrents.filter(v => {
        return v.status === 2
      }).length
    },
    torrentWaitDownload: function () {
      return this.$store.state.torrents.filter(v => {
        return v.status === 3
      }).length
    },
    torrentDownloading: function () {
      return this.$store.state.torrents.filter(v => {
        return v.status === 4
      }).length
    },
    torrentUploading: function () {
      return this.$store.state.torrents.filter(v => {
        return v.status === 6
      }).length
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
    torrentAction(method) {
      this.$axios.post('', {
        method: method,
        arguments: {
          ids: this.selectedTorrents
        }
      })
    },
    torrentStatusUpdate(status) {
      this.torrentStatus = status
      this.filterMenu = false;
    },
    logout() {
      localStorage.removeItem('url')
      localStorage.removeItem('auth')
      localStorage.removeItem('username')
      localStorage.removeItem('password')
      this.$router.push({ path: '/login' })
    },
    torrentActionDelete() {
      this.$axios.post('', {
        method: 'torrent-remove',
        arguments: {
          ids: this.selectedTorrents,
          "delete-local-data": this.deleteLocalData
        }
      }).then(r => {
        if (r.data.result === 'success') {
          this.deleteLocalData = false
          this.selectedTorrents = []
          this.$store.commit('getTorrents')
          this.deleteTorrentDialog = false
        }
      })
    },
  }
}
</script>

<style scoped>

</style>
