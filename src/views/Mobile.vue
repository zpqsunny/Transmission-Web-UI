<template>
  <v-app style="height: 100vh">
    <v-system-bar app height="50%">
      <v-btn text small @click.stop="filterMenu = !filterMenu">
        <font-awesome-icon size="2x" :icon="['fa', 'filter']"/>
      </v-btn>
      <v-menu offset-y transition="scroll-x-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn text small v-bind="attrs" v-on="on">
            <font-awesome-icon size="2x" :icon="['fa','plus']"/>
          </v-btn>
        </template>
        <v-list>
          <v-list-item-group>
            <v-list-item @click="addTorrentFromUrlDialog = true">
              <v-list-item-icon><font-awesome-icon size="xl" :icon="['fa','magnet']"/></v-list-item-icon>
              <v-list-item-content><v-list-item-title v-text="$t('home.open_torrent_address')"></v-list-item-title></v-list-item-content>
            </v-list-item>
            <v-list-item @click="addTorrentFromFileDialog = true">
              <v-list-item-icon><font-awesome-icon size="xl" :icon="['fa','paperclip']"/></v-list-item-icon>
              <v-list-item-content><v-list-item-title v-text="$t('home.open_torrent_file')"></v-list-item-title></v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
      <v-btn text small @click.stop="torrentAction('torrent-start')" :title="$t('home.torrent_start')" :disabled="!selectedTorrents.length > 0">
        <font-awesome-icon size="2x" :icon="['fa', 'play']"/>
      </v-btn>
      <v-btn text small @click.stop="torrentAction('torrent-stop')" :title="$t('home.torrent_stop')" :disabled="!selectedTorrents.length > 0">
        <font-awesome-icon size="2x" :icon="['fa', 'pause']"/>
      </v-btn>
      <v-btn text small @click="deleteTorrentDialog = true" :title="$t('home.torrent_remove')" :disabled="!selectedTorrents.length > 0">
        <font-awesome-icon size="2x" :icon="['fa','trash-alt']"/>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn text small @click="changeLanguage">
        <font-awesome-icon size="2x" :icon="['fa', 'language']"/>
      </v-btn>
      <v-btn text small @click.stop="logout">
        <font-awesome-icon size="2x" :icon="['fa','sign-out-alt']"/>
      </v-btn>
    </v-system-bar>
    <!--  种子状态过滤  -->
    <v-navigation-drawer v-model="filterMenu" app bottom temporary>
      <v-list dense nav>
        <v-list-item-group v-model="filterItem" color="primary">
          <v-list-item @click="torrentStatusUpdate(-1)">
            <v-list-item-icon>
              <font-awesome-icon size="2x" :icon="['fa','folder']"/>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="$t('home.all')"></v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>{{ torrentTotal }}</v-list-item-action>
          </v-list-item>
          <v-list-item @click="torrentStatusUpdate(0)">
            <v-list-item-icon>
              <font-awesome-icon size="2x" :icon="['fa','pause']"/>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="$t('home.pause')"></v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>{{ torrentPause }}</v-list-item-action>
          </v-list-item>
          <v-list-item @click="torrentStatusUpdate(2)">
            <v-list-item-icon>
              <font-awesome-icon size="2x" :icon="['fa','database']"/>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="$t('home.checking')"></v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>{{ torrentDatabase }}</v-list-item-action>
          </v-list-item>
          <v-list-item @click="torrentStatusUpdate(3)">
            <v-list-item-icon>
              <font-awesome-icon size="2x" :icon="['fa','clock']"/>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="$t('home.waiting_download')"></v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>{{ torrentWaitDownload }}</v-list-item-action>
          </v-list-item>
          <v-list-item @click="torrentStatusUpdate(4)">
            <v-list-item-icon>
              <font-awesome-icon size="2x" :icon="['fas','download']"/>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="$t('home.downloading')"></v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>{{ torrentDownloading }}</v-list-item-action>
          </v-list-item>
          <v-list-item @click="torrentStatusUpdate(6)">
            <v-list-item-icon>
              <font-awesome-icon size="2x" :icon="['fas','upload']"/>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="$t('home.uploading')"></v-list-item-title>
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
                          <span v-if="item.status === 0" class="default--text" v-text="$t('components.torrents.parse')"></span>
                          <span v-if="item.status === 1" class="orange--text" v-text="$t('components.torrents.waiting_check')"></span>
                          <span v-if="item.status === 2" class="orange--text" v-text="$t('components.torrents.checking')"></span>
                          <span v-if="item.status === 3" class="secondary--text" v-text="$t('components.torrents.waiting_download')"></span>
                          <span v-if="item.status === 4" class="primary--text" v-text="$t('components.torrents.downloading')"></span>
                          <span v-if="item.status === 5" class="green--text" v-text="$t('components.torrents.wait_upload')"></span>
                          <span v-if="item.status === 6" class="green--text" v-text="$t('components.torrents.uploading')"></span>
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
                      <span v-if="item.eta > 0" class="text-no-wrap down-color">{{ $t('components.torrents.remaining') }} {{ item.eta | timeInterval }}</span>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-list>
      </v-container>
    </v-main>
    <!--  新增URL对话框  -->
    <v-dialog v-if="addTorrentFromUrlDialog" v-model="addTorrentFromUrlDialog" width="80%" persistent>
      <AddTorrentFromUrl v-if="addTorrentFromUrlDialog" @success="torrentActionAddSuccess" @cancel="addTorrentFromUrlDialog = false"/>
    </v-dialog>
    <!--  新增文件上传对话框  -->
    <v-dialog v-if="addTorrentFromFileDialog" v-model="addTorrentFromFileDialog" width="80%" persistent>
      <AddTorrentFromFile v-if="addTorrentFromFileDialog" @success="torrentActionAddSuccess" @cancel="addTorrentFromFileDialog = false"/>
    </v-dialog>
    <!--  删除种子对话框  -->
    <v-dialog v-model="deleteTorrentDialog" width="80%" persistent>
      <v-card>
        <v-card-title class="justify-center" v-text="$t('home.confirm_remove_torrent')"></v-card-title>
        <v-card-text>
          {{ $t('home.are_you_sure_remove_selected_torrent') }}
          <v-checkbox v-model="deleteLocalData" :label="$t('home.remove_with_data')"></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="torrentActionDelete" v-text="$t('sure')"></v-btn>
          <v-btn color="second" text @click="deleteTorrentDialog = false, deleteLocalData = false" v-text="$t('cancel')"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import AddTorrentFromFile from "@/views/components/AddTorrentFromFile.vue";
import AddTorrentFromUrl from "@/views/components/AddTorrentFromUrl.vue";

export default {
  name: 'Mobile',
  components: {AddTorrentFromUrl, AddTorrentFromFile},
  data() {
    return {
      filterMenu: false,
      deleteTorrentDialog: false,
      deleteLocalData: false,
      addTorrentFromUrlDialog: false,
      addTorrentFromFileDialog: false,
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
    torrentActionAddSuccess() {
      this.addTorrentFromUrlDialog = false
      this.addTorrentFromFileDialog = false
      this.$store.commit('getTorrents')
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
