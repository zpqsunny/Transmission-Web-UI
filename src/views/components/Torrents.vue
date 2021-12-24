<template>
  <div>
    <v-data-table v-model="selectedTorrents" :sort-by="['queuePosition']" no-data-text="暂无内容" no-results-text="未找到匹配项"
                  :headers="headers" :items="$store.state.torrents" item-key="id" show-select show-expand fixed-header single-select
                  :items-per-page="-1" @contextmenu:row="showMenu" hide-default-footer :search="searchStatus" :custom-filter="filterOnlyStatus">
      <template v-slot:item.data-table-expand="{isExpanded, expand}">
        <v-btn icon v-if="!isExpanded" @click="expand(true)">
          <font-awesome-icon :icon="['fa', 'caret-right']" size="2x" />
        </v-btn>
        <v-btn icon v-if="isExpanded" @click="expand(false)" >
          <font-awesome-icon :icon="['fa', 'caret-down']" size="2x" />
        </v-btn>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" style="padding: 0">
          <Information :id="item.id"></Information>
        </td>
      </template>
      <template v-slot:item.queuePosition="{ item }">
        {{ item.queuePosition + 1 }}
      </template>
      <template v-slot:item.name="{ item }">
        <span class="d-inline-block align-center" style="word-break: break-all" :title="item.name + '\n\n' + item.downloadDir">
          <v-tooltip v-if="item.error > 0" top>
            <template v-slot:activator="{ on, attrs }">
              <font-awesome-icon style="color: #e53935" v-bind="attrs" v-on="on" :icon="['fa', 'exclamation-triangle']"/>
            </template>
            <span>{{ item.errorString }}</span>
          </v-tooltip>
          {{ item.name }}
        </span>
      </template>
      <template v-slot:item.status="{ item }">
        <div v-if="item.status === 0"><v-chip label outlined>已暂停</v-chip></div>
        <div v-if="item.status === 1"><v-chip label outlined color="orange">待校验</v-chip></div>
        <div v-if="item.status === 2"><v-chip label outlined color="orange">校验中</v-chip></div>
        <div v-if="item.status === 3"><v-chip label outlined color="secondary">待下载</v-chip></div>
        <div v-if="item.status === 4"><v-chip label outlined color="primary">下载中</v-chip></div>
        <div v-if="item.status === 5"><v-chip label outlined color="green">待做种</v-chip></div>
        <div v-if="item.status === 6"><v-chip label outlined color="green">做种中</v-chip></div>
      </template>
      <template v-slot:item.totalSize="{ item }">
        <v-progress-linear v-if="item.metadataPercentComplete < 1" color="purple lighten-1" height="20" rounded striped :value="(item.metadataPercentComplete * 100).toFixed(2)">
          <template v-slot:default="{ value }">
            <strong title="正在检索元数据">{{ value }}%</strong>
          </template>
        </v-progress-linear>
        {{ item.totalSize | unitFormat }}
      </template>
      <template v-slot:item.percentDone="{ item }">
        <v-progress-linear v-if="item.status === 2" color="cyan lighten-1" height="20" rounded striped :value="(item.recheckProgress * 100).toFixed(2)">
          <template v-slot:default="{ value }">
            <strong>{{ value }}%</strong>
          </template>
        </v-progress-linear>
        <v-progress-linear v-else color="light-blue" height="20" rounded striped :value="(item.percentDone * 100).toFixed(2)">
          <template v-slot:default="{ value }">
            <strong>{{ value }}%</strong>
          </template>
        </v-progress-linear>
      </template>
      <template v-slot:item.addedDate="{ item }">
        {{ item.addedDate | timestampFormat }}
      </template>
      <template v-slot:item.rateDownload="{ item }">
        <v-row no-gutters justify="start">
          <v-col align-self="center">
            <div v-if="item.rateUpload > 0">
              <font-awesome-icon class="up-color" :icon="['fa', 'sort-up']"/> <small>{{ item.rateUpload | unitFormat }} /s </small>
            </div>
            <div v-if="item.rateDownload > 0">
              <font-awesome-icon class="down-color" :icon="['fa', 'sort-down']"/> <small>{{ item.rateDownload | unitFormat }} /s</small>
            </div>
          </v-col>
          <v-col align-self="center">
            <small v-if="item.eta > 0" class="text-no-wrap down-color">剩余 {{ item.eta | timeInterval }}</small>
          </v-col>
        </v-row>
      </template>
      <template v-slot:item.uploadedEver="{ item }">
        <div v-if="item.uploadedEver > 0">
          <small><font-awesome-icon class="up-color" :icon="['fa', 'sort-up']"/> {{ item.uploadedEver | unitFormat }}</small>
        </div>
        <div v-if="item.downloadedEver > 0">
          <small><font-awesome-icon class="down-color" :icon="['fa', 'sort-down']"/> {{ item.downloadedEver | unitFormat }}</small>
        </div>
      </template>
      <template v-slot:item.doneDate="{ item }">
        {{ item.doneDate | timeFormatText }}
      </template>
      <template v-slot:item.activityDate="{ item }">
        {{ item.activityDate | timeFormatText }}
      </template>
    </v-data-table>
    <v-menu v-model="menu.show" :position-x="menu.x" :position-y="menu.y" absolute offset-y transition="slide-x-transition">
      <v-list>
        <v-list-item @click="showTorrentRenamePath">
          <v-list-item-avatar><font-awesome-icon :icon="['far', 'save']"/></v-list-item-avatar>
          <v-list-item-content><v-list-item-title>路径重命名</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item @click="copyDownloadDir">
          <v-list-item-avatar><font-awesome-icon :icon="['far', 'copy']"/></v-list-item-avatar>
          <v-list-item-content><v-list-item-title>路径复制</v-list-item-title></v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-dialog v-model="torrentRenamePathDialog" width="30%">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2 justify-center">路径重命名</v-card-title>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field label="名称" v-model="renamePath.name"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field label="路径" v-model="renamePath.path"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="torrentRenamePath">
            确 定
          </v-btn>
          <v-btn color="second" text @click="torrentRenamePathDialog = false">
            取 消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Information from "@/views/Information";

export default {
  name: 'Torrents',
  components: {
    Information
  },
  props: {
    searchStatus: {
      type: String,
      default: 'all'
    }
  },
  data() {
    return {
      menu: {
        show: false,
        x: 0,
        y: 0,
        selectItem: {}
      },
      selectAll: false,
      torrentRenamePathDialog: false,
      renamePath: {
        path: '',
        name: ''
      },
      selectedTorrents: [],
      headers: [
        {text: '序号', align: 'center', sortable: true, value: 'queuePosition', width: 60, class: 'torrent-list', cellClass: 'torrent-list'},
        // {text: 'id', align: 'start', sortable: false, value: 'id', width: 50},
        {text: '名称', align: 'start', sortable: false, value: 'name', width: 300, class: 'torrent-list', cellClass: 'torrent-list'},
        {text: '状态', align: 'center', sortable: false, value: 'status', width: 90, class: 'torrent-list', cellClass: 'torrent-list'},
        // {text: 'hashString', align: 'start', sortable: false, value: 'hashString'},
        {text: '总大小', align: 'right', sortable: false, value: 'totalSize', width: 90, class: 'torrent-list', cellClass: 'torrent-list'},
        {text: '进度', align: 'center', sortable: false, value: 'percentDone', width: 100, class: 'torrent-list', cellClass: 'torrent-list'},
        {text: '添加时间', align: 'center', sortable: false, value: 'addedDate', width: 170, class: 'torrent-list', cellClass: 'torrent-list'},
        // {text: 'trackerStats', align: 'start', sortable: false, value: 'trackerStats', width: 200},
        // {text: 'leftUntilDone', align: 'start', sortable: false, value: 'leftUntilDone', width: 200},
        {text: '上传/下载速度', align: 'start', sortable: false, value: 'rateDownload', width: 250, class: 'torrent-list', cellClass: 'torrent-list'},
        // {text: '上传速度', align: 'start', sortable: false, value: 'rateUpload', width: 150},
        // {text: 'recheckProgress', align: 'start', sortable: false, value: 'recheckProgress', width: 200},
        // {text: 'peersGettingFromUs', align: 'start', sortable: false, value: 'peersGettingFromUs', width: 200},
        // {text: 'peersSendingToUs', align: 'start', sortable: false, value: 'peersSendingToUs', width: 200},
        {text: '分享率', align: 'center', sortable: false, value: 'uploadRatio', width: 90, class: 'torrent-list', cellClass: 'torrent-list'},
        {text: '已上传/下载', align: 'left', sortable: false, value: 'uploadedEver', width: 90, class: 'torrent-list', cellClass: 'torrent-list'},
        // {text: '已完成', align: 'center', sortable: false, value: 'downloadedEver', width: 90, class: 'torrent-list', cellClass: 'torrent-list'},
        // {text: '保存目录', align: 'start', sortable: false, value: 'downloadDir', width: 200},
        {text: '完成时间', align: 'center', sortable: false, value: 'doneDate', width: 160, class: 'torrent-list', cellClass: 'torrent-list'},
        {text: '最后活动于', align: 'center', sortable: false, value: 'activityDate', width: 160, class: 'torrent-list', cellClass: 'torrent-list'},
      ],
      torrentsList: []
    }
  },
  methods: {
    getTorrentList() {
      this.$store.commit('getTorrents')
    },
    showMenu(e, {item}) {
      e.preventDefault()
      this.menu.show = false
      this.menu.x = e.clientX
      this.menu.y = e.clientY
      this.menu.selectItem = item
      this.$nextTick(() => {
        this.menu.show = true
      })
    },
    showTorrentRenamePath(){
      this.renamePath.name = this.menu.selectItem.name
      this.renamePath.path = this.menu.selectItem.downloadDir
      this.torrentRenamePathDialog = true
    },
    torrentRenamePath() {
      this.$axios.post('', {
        method: 'torrent-rename-path',
        arguments: {
          ids: [this.menu.selectItem.id],
          ...this.renamePath
        }
      }).then(r => {
        if (r.data.result === 'success') {
          this.torrentRenamePathDialog = false
          return
        }
        this.$store.commit('showMessage', {type: 'error', title: r.data.result})
      })
    },
    copyDownloadDir() {
      let input = document.createElement('input')
      input.value = this.menu.selectItem.downloadDir
      document.body.append(input)
      input.select()
      document.execCommand('Copy')
      input.remove()
      this.$store.commit('showMessage', {type: 'success', title: '复制成功'})
    },
    filterOnlyStatus(value, search, item) {
      if (search === 'all') {
        return true
      }
      return item.status.toString() === search
    }
  },
  watch: {
    selectedTorrents: function (newValue, oldValue) {
      this.$emit('update:selectedTorrents', newValue)
    }
  }
}
</script>

<style scoped>

</style>
