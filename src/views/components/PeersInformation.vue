<template>
  <div>
    <v-row no-gutters justify="space-around">
      <v-col align-self="center"><v-btn text color="primary" @click="getPeers"><font-awesome-icon :icon="['fa', 'redo']"/></v-btn></v-col>
      <v-col align-self="center">Cache {{ peersFrom.fromCache }}</v-col>
      <v-col align-self="center">Dht {{ peersFrom.fromDht }}</v-col>
      <v-col align-self="center">Incoming {{ peersFrom.fromIncoming }}</v-col>
      <v-col align-self="center">Lpd {{ peersFrom.fromLpd }}</v-col>
      <v-col align-self="center">Ltep {{ peersFrom.fromLtep }}</v-col>
      <v-col align-self="center">Pex {{ peersFrom.fromPex }}</v-col>
      <v-col align-self="center">Tracker {{ peersFrom.fromTracker }}</v-col>
    </v-row>
    <v-data-table dense :headers="peersHeaders" :items="peersInfo" item-key="address" no-data-text="暂无内容" no-results-text="未找到匹配项"
                  :items-per-page="$store.state.itemsPerPage" @update:items-per-page="e => $store.commit('updateItemsPerPage', e)">
      <template v-slot:item.address="{ item }">
        <img v-if="item.countryCode !== ''" :src="require('@/assets/country/' + item.countryCode + '.png')" :alt="item.country" :title="['地区: ' + item.region, '国家: ' + item.country, '城市: ' + item.city].join('\n')">
        {{ item.address }}
      </template>
      <template v-slot:item.flagStr="{ item }">
        <span :title="item.flagStr | flagStrFormat">{{ item.flagStr }}</span>
      </template>
      <template v-slot:item.connectInfo="{ item }">
        <v-row no-gutters justify="center">
          <v-col>
            <font-awesome-icon :icon="['fa', 'download']" :class="item.isDownloadingFrom ? 'yes-color': 'no-color'" title="正在下载"/>
          </v-col>
          <v-col>
            <font-awesome-icon :icon="['fa', 'lock']" :class="item.isEncrypted ? 'yes-color': 'no-color'" title="加密"/>
          </v-col>
          <v-col>
            <font-awesome-icon :icon="['fa', 'arrow-right']" :class="item.isIncoming ? 'yes-color': 'no-color'" title="传入" />
          </v-col>
          <v-col>
            <font-awesome-icon :icon="['fa', 'upload']" :class="item.isUploadingTo ? 'yes-color': 'no-color'" title="正在上传" />
          </v-col>
          <v-col>
            <span :class="item.isUTP ? 'yes-color': 'no-color'">μTP</span>
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
        <v-row no-gutters justify="start">
          <v-col align-self="center">
            <div v-if="item.rateToPeer > 0">
              <font-awesome-icon class="up-color" :icon="['fa', 'sort-up']"/> <small>{{ item.rateToPeer | unitFormat }} /s</small>
            </div>
            <div v-if="item.rateToClient > 0">
              <font-awesome-icon class="down-color" :icon="['fa', 'sort-down']"/> <small>{{ item.rateToClient | unitFormat }} /s </small>
            </div>
          </v-col>
        </v-row>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import IpInfoWrapper from 'node-ipinfo'

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
        {text: 'IP地址', align: 'start', sortable: false, value: 'address'},
        {text: '客户端', align: 'start', sortable: false, value: 'clientName'},
        {text: '标记', align: 'start', sortable: false, value: 'flagStr'},
        {text: '连接方式', align: 'start', sortable: false, value: 'connectInfo'},
        {text: '端口', align: 'start', sortable: false, value: 'port'},
        {text: '完成进度', align: 'start', sortable: false, value: 'progress'},
        {text: '上传/下载速度', align: 'start', sortable: false, value: 'rateToClient'},
        // {text: '上传速度', align: 'center', sortable: false, value: 'rateToPeer', width: 120},
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
        this.peersInfo = torrent.peers.map(v => {
          v.countryCode = ''
          v.country = ''
          v.region = ''
          v.city = ''
          return v
        })
        this.peersFrom = torrent.peersFrom
        let ipInfoToken = localStorage.getItem('ipInfoToken')
        if (ipInfoToken === null || ipInfoToken.trim() === '') {
          return
        }
        const ipInfoWrapper = new IpInfoWrapper(ipInfoToken)
        for (let i = 0; i < this.peersInfo.length; i++) {
          ipInfoWrapper.lookupIp(this.peersInfo[i].address)
              .then(info => {
                this.peersInfo[i].countryCode = info.countryCode.toLowerCase()
                this.peersInfo[i].country = info.country
                this.peersInfo[i].region = info.region
                this.peersInfo[i].city = info.city
              })
        }
      })
    },
  }
}
</script>

<style scoped>

</style>
