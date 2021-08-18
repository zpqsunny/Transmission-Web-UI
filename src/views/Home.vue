<template>
  <div>
    <v-app style="height: 100vh">
      <v-system-bar height="40%" app>
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
                <v-list-item-avatar><font-awesome-icon :icon="['fa','magnet']"/></v-list-item-avatar>
                <v-list-item-content><v-list-item-title>磁力链接</v-list-item-title></v-list-item-content>
              </v-list-item>
              <v-list-item @click="addTorrentFromFileDialog = true">
                <v-list-item-avatar><font-awesome-icon :icon="['fa','paperclip']"/></v-list-item-avatar>
                <v-list-item-content><v-list-item-title>种子文件</v-list-item-title></v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
        <v-divider style="margin: 0 2px" vertical/>
        <v-btn text small @click="speed" :title="speedEnabled ? '限速' : '全速'">
          <font-awesome-icon size="2x" :icon="speedEnabled ? ['fa', 'running'] : ['fa', 'paper-plane']"/>
        </v-btn>
        <v-divider style="margin: 0 2px" vertical/>
        <v-btn text small @click="torrentAction('torrent-start')" title="重新开始已选择的种子" :disabled="!selectedTorrents.length > 0">
          <font-awesome-icon size="2x" :icon="['fa','play']"/>
        </v-btn>
        <v-btn text small @click="torrentAction('torrent-stop')" title="暂停已选择的种子" :disabled="!selectedTorrents.length > 0">
          <font-awesome-icon size="2x" :icon="['fa','pause']"/>
        </v-btn>
        <v-btn text small @click="torrentAction('torrent-verify')" title="重新校验已选择的种子" :disabled="!selectedTorrents.length > 0">
          <font-awesome-icon size="2x" :icon="['fa','database']"/>
        </v-btn>
        <v-btn text small @click="deleteTorrentDialog = true" title="删除种子" :disabled="!selectedTorrents.length > 0">
          <font-awesome-icon size="2x" :icon="['fa','trash-alt']"/>
        </v-btn>
        <v-btn text small @click="torrentAction('torrent-reannounce')" title="获取更多Peer" :disabled="!selectedTorrents.length > 0">
          <font-awesome-icon size="2x" :icon="['fa','broadcast-tower']"/>
        </v-btn>
        <v-btn text small @click="showTorrentSetLocationDialog" title="移动数据目录" :disabled="!selectedTorrents.length > 0">
          <font-awesome-icon size="2x" :icon="['fa', 'folder']" />
        </v-btn>
        <v-divider style="margin: 0 2px" vertical/>
        <v-btn text small @click="sessionSetDialog = true" title="设置">
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
                <v-list-item-avatar><font-awesome-icon :icon="['fa','angle-double-up']"/></v-list-item-avatar>
                <v-list-item-content><v-list-item-title>移到顶部</v-list-item-title></v-list-item-content>
              </v-list-item>
              <v-list-item @click="torrentAction('queue-move-up')">
                <v-list-item-avatar><font-awesome-icon :icon="['fa','angle-up']"/></v-list-item-avatar>
                <v-list-item-content><v-list-item-title>上移</v-list-item-title></v-list-item-content>
              </v-list-item>
              <v-list-item @click="torrentAction('queue-move-down')">
                <v-list-item-avatar><font-awesome-icon :icon="['fa','angle-down']"/></v-list-item-avatar>
                <v-list-item-content><v-list-item-title>下移</v-list-item-title></v-list-item-content>
              </v-list-item>
              <v-list-item @click="torrentAction('queue-move-bottom')">
                <v-list-item-avatar><font-awesome-icon :icon="['fa','angle-double-down']"/></v-list-item-avatar>
                <v-list-item-content><v-list-item-title>移到底部</v-list-item-title></v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
        <v-spacer></v-spacer>
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
        <v-container fluid>
          <v-row>
            <v-col cols="2">
              <v-list dense>
                <v-list-item-group v-model="filterItem" color="primary">
                  <v-list-item @click="search = 'all'">
                    <v-list-item-avatar><font-awesome-icon size="2x" :icon="['fa','folder']"/></v-list-item-avatar>
                    <v-list-item-content><v-list-item-title>全部</v-list-item-title></v-list-item-content>
                    <v-list-item-action>{{ torrentTotal }}</v-list-item-action>
                  </v-list-item>
                  <v-list-item @click="search = '0'">
                    <v-list-item-avatar><font-awesome-icon size="2x" :icon="['fa','pause']"/></v-list-item-avatar>
                    <v-list-item-content><v-list-item-title>暂停</v-list-item-title></v-list-item-content>
                    <v-list-item-action>{{ torrentPause }}</v-list-item-action>
                  </v-list-item>
                  <v-list-item @click="search = '2'">
                    <v-list-item-avatar><font-awesome-icon size="2x" :icon="['fa','database']"/></v-list-item-avatar>
                    <v-list-item-content><v-list-item-title>校验中</v-list-item-title></v-list-item-content>
                    <v-list-item-action>{{ torrentDatabase }}</v-list-item-action>
                  </v-list-item>
                  <v-list-item @click="search = '3'">
                    <v-list-item-avatar><font-awesome-icon size="2x" :icon="['fa','clock']"/></v-list-item-avatar>
                    <v-list-item-content><v-list-item-title>待下载</v-list-item-title></v-list-item-content>
                    <v-list-item-action>{{ torrentWaitDownload }}</v-list-item-action>
                  </v-list-item>
                  <v-list-item @click="search = '4'">
                    <v-list-item-avatar><font-awesome-icon size="2x" :icon="['fa','cloud-download-alt']"/></v-list-item-avatar>
                    <v-list-item-content><v-list-item-title>下载中</v-list-item-title></v-list-item-content>
                    <v-list-item-action>{{ torrentDownloading }}</v-list-item-action>
                  </v-list-item>
                  <v-list-item @click="search = '6'">
                    <v-list-item-avatar><font-awesome-icon size="2x" :icon="['fa','cloud-upload-alt']"/></v-list-item-avatar>
                    <v-list-item-content><v-list-item-title>做种中</v-list-item-title></v-list-item-content>
                    <v-list-item-action>{{ torrentUploading }}</v-list-item-action>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
              <v-divider/>
              <Statistics></Statistics>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="10">
              <Torrents ref="torrents" :selected-torrents.sync="selectedTorrents" :search-status="search"></Torrents>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
      <v-footer app>
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
      <!--  移动种子对话框  -->
      <v-dialog v-model="torrentSetLocationDialog" width="30%" persistent>
        <v-card>
          <v-card-title class="text-h5 grey lighten-2 justify-center">设置位置</v-card-title>
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <v-text-field label="新的位置" outlined v-model="setLocation.location" autocomplete="off"></v-text-field>
                <v-checkbox label="同时移动数据（如果不钩选，则从新目录下查找文件）" v-model="setLocation.move"></v-checkbox>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="torrentSetLocation">
              确 定
            </v-btn>
            <v-btn color="second" text @click="torrentSetLocationDialog = false">
              取 消
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--   捐款   -->
      <v-dialog v-model="helpMeDialog" width="30%">
        <v-card>
          <v-container>
            <div class="d-flex justify-space-around">
              <img alt="捐助我" :src="require('@/assets/alipay.jpg')" height="400px"/>
              <img alt="捐助我" :src="require('@/assets/weixin.jpg')" height="400px"/>
            </div>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="second" text @click="helpMeDialog = false">
              关 闭
            </v-btn>
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

export default {
  name: 'Home',
  components: {
    SystemSetting,
    Statistics,
    Information,
    Torrents,
    AddTorrentFromUrl,
    AddTorrentFromFile
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
  data: () => ({
    search: 'all',
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
    speedEnabled: false,
    helpMeDialog: false
  }),
  mounted() {
    this.intervalId = setInterval(() => {
      this.$refs['torrents'].getTorrentList()
    }, 2000)
  },
  beforeDestroy() {
    clearInterval(this.intervalId)
  },
  methods: {
    torrentAction(method) {
      let ids = []
      this.selectedTorrents.forEach(value => {
        ids.push(value.id)
      })
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
      let ids = []
      this.selectedTorrents.forEach(value => {
        ids.push(value.id)
      })
      this.$axios.post('', {
        method: 'torrent-remove',
        arguments: {
          ids: ids,
          "delete-local-data": this.deleteLocalData
        }
      }).then(r => {
        if (r.data.result === 'success') {
          this.selectedTorrents = []
          this.$store.commit('getTorrents')
          this.deleteTorrentDialog = false
        }
      })
    },
    speed() {
      this.speedEnabled = !this.speedEnabled
      this.$axios.post('', {
        method: 'session-set',
        arguments: {
          "alt-speed-enabled": this.speedEnabled
        }
      })
    },
    showTorrentSetLocationDialog() {
      this.setLocation.location = this.selectedTorrents[0].downloadDir
      this.torrentSetLocationDialog = true
    },
    torrentSetLocation() {
      let ids = []
      this.selectedTorrents.forEach(value => {
        ids.push(value.id)
      })
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
    logout() {
      localStorage.clear()
      this.$router.push({ path: '/login' })
    }
  }
}
</script>
