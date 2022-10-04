<template>
  <div>
    <v-app style="height: 100vh">
      <v-system-bar height="40%" app>
        <v-btn text small @click="navigation = !navigation">
          <font-awesome-icon size="2x" :icon="['fa','bars']"/>
        </v-btn>
        <v-btn text small @click="$refs['torrents'].getTorrentList()">
          <font-awesome-icon size="2x" :icon="['fa','redo-alt']"/>
        </v-btn>
        <v-divider style="margin: 0 2px" vertical/>
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
                <v-list-item-content><v-list-item-title>磁力链接</v-list-item-title></v-list-item-content>
              </v-list-item>
              <v-list-item @click="addTorrentFromFileDialog = true">
                <v-list-item-icon><font-awesome-icon size="xl" :icon="['fa','paperclip']"/></v-list-item-icon>
                <v-list-item-content><v-list-item-title>种子文件</v-list-item-title></v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
        <v-divider style="margin: 0 2px" vertical/>
        <v-btn text small @click="speed" :title="$store.state.sessionInfo['alt-speed-enabled'] ? '限速' : '全速'">
          <font-awesome-icon size="2x" :icon="$store.state.sessionInfo['alt-speed-enabled'] ? ['fa', 'running'] : ['fa', 'paper-plane']"/>
        </v-btn>
        <v-divider style="margin: 0 2px" vertical/>
        <v-btn text small @click="torrentAction('torrent-start')" :title="$t('home.torrent_start')" :disabled="!selectedTorrents.length > 0">
          <font-awesome-icon size="2x" :icon="['fa','play']"/>
        </v-btn>
        <v-btn text small @click="torrentAction('torrent-stop')" :title="$t('home.torrent_stop')" :disabled="!selectedTorrents.length > 0">
          <font-awesome-icon size="2x" :icon="['fa','pause']"/>
        </v-btn>
        <v-btn text small @click="torrentAction('torrent-verify')" :title="$t('home.torrent_verify')" :disabled="!selectedTorrents.length > 0">
          <font-awesome-icon size="2x" :icon="['fa','database']"/>
        </v-btn>
        <v-btn text small @click="deleteTorrentDialog = true" :title="$t('home.torrent_remove')" :disabled="!selectedTorrents.length > 0">
          <font-awesome-icon size="2x" :icon="['fa','trash-alt']"/>
        </v-btn>
        <v-btn text small @click="torrentAction('torrent-reannounce')" :title="$t('home.torrent_reannounce')" :disabled="!selectedTorrents.length > 0">
          <font-awesome-icon size="2x" :icon="['fa','broadcast-tower']"/>
        </v-btn>
        <v-btn text small @click="showTorrentSetLocationDialog" :title="$t('home.set_new_location')" :disabled="!selectedTorrents.length > 0">
          <font-awesome-icon size="2x" :icon="['fa', 'folder']" />
        </v-btn>
        <v-divider style="margin: 0 2px" vertical/>
        <v-btn text small @click="sessionSetDialog = true" :title="$t('home.set')">
          <font-awesome-icon size="2x" :icon="['fa','cog']"/>
        </v-btn>
        <v-divider style="margin: 0 2px" vertical/>
        <v-menu offset-y transition="scroll-x-transition">
          <template v-slot:activator="{ on, attrs }">
            <v-btn text small v-bind="attrs" v-on="on" :disabled="!selectedTorrents.length > 0">
              <font-awesome-icon size="2x" :icon="['fa','list-ol']"/>
            </v-btn>
          </template>
          <v-list>
            <v-list-item-group>
              <v-list-item @click="torrentAction('queue-move-top')">
                <v-list-item-icon><font-awesome-icon size="xl" :icon="['fa','angle-double-up']"/></v-list-item-icon>
                <v-list-item-content><v-list-item-title v-text="$t('home.queue_move_top')"></v-list-item-title></v-list-item-content>
              </v-list-item>
              <v-list-item @click="torrentAction('queue-move-up')">
                <v-list-item-icon><font-awesome-icon size="xl" :icon="['fa','angle-up']"/></v-list-item-icon>
                <v-list-item-content><v-list-item-title v-text="$t('home.queue_move_up')"></v-list-item-title></v-list-item-content>
              </v-list-item>
              <v-list-item @click="torrentAction('queue-move-down')">
                <v-list-item-icon><font-awesome-icon size="xl" :icon="['fa','angle-down']"/></v-list-item-icon>
                <v-list-item-content><v-list-item-title v-text="$t('home.queue_move_down')"></v-list-item-title></v-list-item-content>
              </v-list-item>
              <v-list-item @click="torrentAction('queue-move-bottom')">
                <v-list-item-icon><font-awesome-icon size="xl" :icon="['fa','angle-double-down']"/></v-list-item-icon>
                <v-list-item-content><v-list-item-title v-text="$t('home.queue_move_bottom')"></v-list-item-title></v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
        <v-spacer></v-spacer>
        <v-btn text small @click="changeLanguage">
          <font-awesome-icon size="2x" :icon="['fa', 'language']"/>
        </v-btn>
        <v-btn text small @click="helpMeDialog = true">
          <font-awesome-icon size="2x" :icon="['fa', 'thumbs-up']"/>
        </v-btn>
        <v-btn text small @click="linkGithub">
          <font-awesome-icon size="2x" :icon="['fab', 'github']"/>
        </v-btn>
        <v-divider style="margin: 0 2px" vertical/>
        <v-btn text small @click="goEmail">
          <font-awesome-icon size="2x" :icon="['fa', 'envelope']"/>
        </v-btn>
        <v-divider style="margin: 0 2px" vertical/>
        <v-btn text small @click="logout">
          <font-awesome-icon size="2x" :icon="['fa','sign-out-alt']"/>
        </v-btn>
      </v-system-bar>
      <v-main>
        <v-navigation-drawer :value="navigation" app width="320">
          <v-list dense>
            <v-list-item-group v-model="filterItem" color="primary">
              <v-list-item @click="search = 'all'">
                <v-list-item-icon><font-awesome-icon size="2x" :icon="['fa','folder']"/></v-list-item-icon>
                <v-list-item-title v-text="$t('home.all')"></v-list-item-title>
                <v-list-item-action>
                  <v-list-item-action-text>{{ torrentTotal }}</v-list-item-action-text>
                </v-list-item-action>
              </v-list-item>
              <v-list-item @click="search = '0'">
                <v-list-item-icon><font-awesome-icon size="2x" :icon="['fa','pause']"/></v-list-item-icon>
                <v-list-item-title v-text="$t('home.pause')"></v-list-item-title>
                <v-list-item-action>
                  <v-list-item-action-text>{{ torrentPause }}</v-list-item-action-text>
                </v-list-item-action>
              </v-list-item>
              <v-list-item @click="search = '2'">
                <v-list-item-icon><font-awesome-icon size="2x" :icon="['fa','database']"/></v-list-item-icon>
                <v-list-item-title v-text="$t('home.checking')"></v-list-item-title>
                <v-list-item-action>
                  <v-list-item-action-text>{{ torrentDatabase }}</v-list-item-action-text>
                </v-list-item-action>
              </v-list-item>
              <v-list-item @click="search = '3'">
                <v-list-item-icon><font-awesome-icon size="2x" :icon="['fa','clock']"/></v-list-item-icon>
                <v-list-item-title v-text="$t('home.waiting_download')"></v-list-item-title>
                <v-list-item-action>
                  <v-list-item-action-text>{{ torrentWaitDownload }}</v-list-item-action-text>
                </v-list-item-action>
              </v-list-item>
              <v-list-item @click="search = '4'">
                <v-list-item-icon><font-awesome-icon size="2x" :icon="['fas','download']"/></v-list-item-icon>
                <v-list-item-title v-text="$t('home.downloading')"></v-list-item-title>
                <v-list-item-action>
                  <v-list-item-action-text>{{ torrentDownloading }}</v-list-item-action-text>
                </v-list-item-action>
              </v-list-item>
              <v-list-item @click="search = '6'">
                <v-list-item-icon><font-awesome-icon size="2x" :icon="['fas','upload']"/></v-list-item-icon>
                <v-list-item-title v-text="$t('home.uploading')"></v-list-item-title>
                <v-list-item-action>
                  <v-list-item-action-text>{{ torrentUploading }}</v-list-item-action-text>
                </v-list-item-action>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <v-divider/>
          <Statistics></Statistics>
        </v-navigation-drawer>
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <Torrents ref="torrents" :selected-torrents.sync="selectedTorrents" :search-status="search"></Torrents>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
      <v-footer app>
        <Bottom/>
      </v-footer>
      <!--  新增URL对话框  -->
      <v-dialog v-if="addTorrentFromUrlDialog" v-model="addTorrentFromUrlDialog" width="30%">
        <AddTorrentFromUrl v-if="addTorrentFromUrlDialog" @success="torrentActionAddSuccess" @cancel="addTorrentFromUrlDialog = false"/>
      </v-dialog>
      <!--  新增文件上传对话框  -->
      <v-dialog v-if="addTorrentFromFileDialog" v-model="addTorrentFromFileDialog" width="30%">
        <AddTorrentFromFile v-if="addTorrentFromFileDialog" @success="torrentActionAddSuccess" @cancel="addTorrentFromFileDialog = false"/>
      </v-dialog>
      <!--  设置对话框  -->
      <v-dialog v-if="sessionSetDialog" v-model="sessionSetDialog" width="40%">
        <SystemSetting v-if="sessionSetDialog" @closed="sessionSetDialog = false"></SystemSetting>
      </v-dialog>
      <!--  删除种子对话框  -->
      <v-dialog v-model="deleteTorrentDialog" width="30%" persistent>
        <v-card>
          <v-card-title class="justify-center" v-text="$t('home.confirm_remove_torrent')">=</v-card-title>
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
      <!--  移动种子对话框  -->
      <v-dialog v-model="torrentSetLocationDialog" width="30%" persistent>
        <v-card>
          <v-card-title class="text-h5 grey lighten-2 justify-center" v-text="$t('home.set_location')"></v-card-title>
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <v-text-field :label="$t('home.new_location')" outlined v-model="setLocation.location" autocomplete="off"></v-text-field>
                <v-checkbox :label="$t('home.with_move_data')" v-model="setLocation.move"></v-checkbox>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="torrentSetLocation" v-text="$t('sure')"></v-btn>
            <v-btn color="second" text @click="torrentSetLocationDialog = false" v-text="$t('cancel')"></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--   捐款   -->
      <v-dialog v-model="helpMeDialog" width="30%">
        <v-card>
          <Coffee></Coffee>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="second" text @click="helpMeDialog = false" v-text="$t('close')"></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app>
  </div>
</template>

<script>
import SystemSetting from '@/views/components/SystemSetting'
import Statistics from '@/views/components/Statistics'
import Information from '@/views/Information'
import Torrents from '@/views/components/Torrents'
import AddTorrentFromUrl from '@/views/components/AddTorrentFromUrl'
import AddTorrentFromFile from '@/views/components/AddTorrentFromFile'
import Coffee from '@/views/components/Coffee'
import Bottom from '@/views/Bottom'

export default {
  name: 'Home',
  components: {
    SystemSetting,
    Statistics,
    Information,
    Torrents,
    AddTorrentFromUrl,
    AddTorrentFromFile,
    Coffee,
    Bottom,
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
  data() {
    return {
      search: 'all',
      navigation: false,
      filterItem: 0,
      intervalId: null,
      sessionSetDialog: false,
      deleteTorrentDialog: false,
      deleteLocalData: false,
      addDialog: false,
      addTorrentFromUrlDialog: false,
      addTorrentFromFileDialog: false,
      torrentSetLocationDialog: false,
      selectedTorrents: [],
      setLocation: {
        location: '',
        move: false,
      },
      helpMeDialog: false
    }
  },
  mounted() {
    this.intervalId = setInterval(() => {
      this.$refs['torrents'].getTorrentList()
    }, 2000)
    this.$store.commit('getSessionInfo')
    this.chromeEnv()
  },
  beforeDestroy() {
    clearInterval(this.intervalId)
  },
  methods: {
    torrentAction(method) {
      let ids = this.selectedTorrents.map(v => v.id)
      this.$axios.post('', {
        method: method,
        arguments: {
          ids: ids
        }
      })
    },
    torrentActionAddSuccess() {
      this.addTorrentFromUrlDialog = false
      this.addTorrentFromFileDialog = false
      this.$refs['torrents'].getTorrentList()
    },
    torrentActionDelete() {
      let ids = this.selectedTorrents.map(v => v.id)
      this.$axios.post('', {
        method: 'torrent-remove',
        arguments: {
          ids: ids,
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
    speed() {
      let enabled = !this.$store.state.sessionInfo["alt-speed-enabled"]
      this.$axios.post('', {
        method: 'session-set',
        arguments: {
          "alt-speed-enabled": enabled
        }
      }).then(r => {
        if (r.data.result === 'success') {
          this.$store.state.sessionInfo["alt-speed-enabled"] = !this.$store.state.sessionInfo["alt-speed-enabled"]
        }
      })
    },
    showTorrentSetLocationDialog() {
      this.setLocation.location = this.selectedTorrents[0].downloadDir
      this.torrentSetLocationDialog = true
    },
    torrentSetLocation() {
      let ids = this.selectedTorrents.map(v => v.id)
      this.$axios.post('', {
        method: 'torrent-set-location',
        arguments: {
          ids: ids,
          ...this.setLocation
        }
      }).then(r => {
        if (r.data.result === 'success') {
          this.torrentSetLocationDialog = false
          return
        }
        this.$store.commit('showMessage', {type: 'error', title: r.data.result})
      })
    },
    linkGithub() {
      window.location.href = 'https://github.com/zpqsunny/Transmission-Web-UI'
    },
    goEmail() {
      window.location.href = 'mailto:torrentweb@gmail.com'
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
    chromeEnv() {
      try {
        chrome.runtime.onMessage.addListener(((message, sender, sendResponse) => {
          let downloadLink = message.message.url
          if (downloadLink.match(/^[0-9a-f]{40}$/i)) {
            downloadLink = 'magnet:?xt=urn:btih:' + downloadLink
          } else if (!downloadLink.match(/^magnet:\?xt=urn:btih:[0-9a-f]{40}.?/i)) {
            console.warn(downloadLink + 'is not magnet url')
            return
          }
          this.$axios.post('', {
            method: 'session-get',
            arguments: {
              fields: ['download-dir']
            }
          }).then(r => {
            if (r.data.result === 'success') {
              let downloadDir = r.data.arguments['download-dir']
              this.$axios.post('', {
                method: 'torrent-add',
                arguments: {
                  'download-dir': downloadDir,
                  filename: downloadLink,
                  paused: false,
                }
              }).then(r => {
                console.log('torrent-add: ' + r.data.result)
              })
            }
          })
        }))
      } catch (e) {
        console.warn('is not run in chrome extension')
      }
    }
  }
}
</script>
