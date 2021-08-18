<template>
  <div>
    <v-data-table dense :headers="peersHeaders" :items="peersInfo" item-key="address" no-data-text="暂无内容" no-results-text="未找到匹配项"
                  :items-per-page="$store.state.itemsPerPage" @update:items-per-page="e => $store.commit('updateItemsPerPage', e)">
      <template v-slot:item.connectInfo="{ item }">
        <v-row no-gutters justify="center">
          <v-col>
            <font-awesome-icon :icon="['fa', 'download']" :style="{color: item.isDownloadingFrom ? '#4CAF50' : '#909399'}" title="正在下载"/>
          </v-col>
          <v-col>
            <font-awesome-icon :icon="['fa', 'lock']" :style="{color: item.isEncrypted ? '#4CAF50' : '#909399'}" title="加密"/>
          </v-col>
          <v-col>
            <font-awesome-icon :icon="['fa', 'arrow-right']" :style="{color: item.isIncoming ? '#4CAF50' : '#909399'}" title="传入" />
          </v-col>
          <v-col>
            <font-awesome-icon :icon="['fa', 'upload']" :style="{color: item.isUploadingTo ? '#4CAF50' : '#909399'}" title="正在上传" />
          </v-col>
          <v-col>
            <span :style="{color: item.isUTP ? '#4CAF50' : '#909399'}">μTP</span>
          </v-col>
        </v-row>
      </template>
      <template v-slot:item.progress="{ item }">
        <v-progress-linear :value="(item.progress * 100).toFixed(2)" striped rounded color="#67C23A" height="25">
          <template v-slot:default="{ value }">
            <strong>{{ value }}%</strong>
          </template>
        </v-progress-linear>
      </template>
      <template v-slot:item.rateToClient="{ item }">
        {{ item.rateToClient | unitFormat }}<span v-if="item.rateToClient > 0">/s</span>
      </template>
      <template v-slot:item.rateToPeer="{ item }">
        {{ item.rateToPeer | unitFormat }}<span v-if="item.rateToPeer > 0">/s</span>
      </template>
      <template v-slot:body.append>
        <tr class="text-center">
          <td><v-btn text color="primary" @click="getPeers"><font-awesome-icon :icon="['fa', 'redo']"/></v-btn></td>
          <td>Cache {{ peersFrom.fromCache }}</td>
          <td>Dht {{ peersFrom.fromDht }}</td>
          <td>Incoming {{ peersFrom.fromIncoming }}</td>
          <td>Lpd {{ peersFrom.fromLpd }}</td>
          <td>Ltep {{ peersFrom.fromLtep }}</td>
          <td>Pex {{ peersFrom.fromPex }}</td>
          <td>Tracker {{ peersFrom.fromTracker }}</td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'PeersInformation',
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      peersFrom: {
        fromCache: 0,
        fromDht: 0,
        fromIncoming: 0,
        fromLpd: 0,
        fromLtep: 0,
        fromPex: 0,
        fromTracker: 0,
      },
      peersInfo: [],
      peersHeaders: [
        {text: 'IP地址', align: 'center', sortable: false, value: 'address', width: 100},
        {text: '客户端', align: 'center', sortable: false, value: 'clientName', width: 100},
        {text: '标记', align: 'center', sortable: false, value: 'flagStr', width: 80},
        {text: '连接方式', align: 'center', sortable: false, value: 'connectInfo', width: 100},
        {text: '端口', align: 'center', sortable: false, value: 'port', width: 100},
        {text: '完成进度', align: 'center', sortable: false, value: 'progress', width: 120},
        {text: '下载速度', align: 'center', sortable: false, value: 'rateToClient', width: 120},
        {text: '上传速度', align: 'center', sortable: false, value: 'rateToPeer', width: 120},
      ]
    }
  },
  mounted() {
    this.getPeers()
  },
  methods: {
    getPeers() {
      this.$axios.post('', {
        method: 'torrent-get',
        arguments: {
          ids: [this.id],
          fields: ['peers', 'peersFrom']
        }
      }).then(r => {
        if (r.data.result !== 'success') {
          return
        }
        if (r.data.arguments.torrents.length < 1) {
          return
        }
        let torrent = r.data.arguments.torrents[0]
        //peers
        this.peersInfo = torrent.peers
        this.peersFrom = torrent.peersFrom
      })
    },
  }
}
</script>

<style scoped>

</style>
