<template>
  <div>
    <v-btn text color="primary" @click="getPeers"><font-awesome-icon :icon="['fa', 'redo']"/></v-btn>
    <v-data-table dense :headers="peersHeaders" :items="peersInfo" item-key="address" :no-data-text="$t('no_data_text')" :no-results-text="$t('no_results_text')"
                  :items-per-page="$store.state.itemsPerPage" @update:items-per-page="e => $store.commit('updateItemsPerPage', e)">
      <template v-slot:item.address="{ item }">
        <span class="d-inline-block" style="width: 16px;height: 11px">
          <v-img v-if="item.countryCode !== ''" :src="require('@/assets/country/' + item.countryCode + '.png')" :alt="item.country" :title="[$t('components.peers_information.region') +': ' + item.region, $t('components.peers_information.country') +': ' + item.country, $t('components.peers_information.city') +': ' + item.city].join('\n')"></v-img>
        </span>
        {{ item.address }}
      </template>
      <template v-slot:item.flagStr="{ item }">
        <span :title="item.flagStr | flagStrFormat">{{ item.flagStr }}</span>
      </template>
      <template v-slot:item.connectInfo="{ item }">
        <v-row no-gutters justify="center">
          <v-col>
            <font-awesome-icon :icon="['fa', 'download']" :class="item.isDownloadingFrom ? 'yes-color': 'no-color'" :title="$t('components.peers_information.downloading_from')"/>
          </v-col>
          <v-col>
            <font-awesome-icon :icon="['fa', 'lock']" :class="item.isEncrypted ? 'yes-color': 'no-color'" :title="$t('components.peers_information.encrypted')"/>
          </v-col>
          <v-col>
            <font-awesome-icon :icon="['fa', 'arrow-right']" :class="item.isIncoming ? 'yes-color': 'no-color'" :title="$t('components.peers_information.incoming')"/>
          </v-col>
          <v-col>
            <font-awesome-icon :icon="['fa', 'upload']" :class="item.isUploadingTo ? 'yes-color': 'no-color'" :title="$t('components.peers_information.uploading_to')"/>
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
      timeId: null
    }
  },
  computed: {
    peersHeaders: function () {
      return [
        {text: this.$t('components.peers_information.ip_address'), align: 'start', sortable: false, value: 'address'},
        {text: this.$t('components.peers_information.client_name'), align: 'start', sortable: false, value: 'clientName'},
        {text: this.$t('components.peers_information.flag'), align: 'start', sortable: false, value: 'flagStr'},
        {text: this.$t('components.peers_information.connect_info'), align: 'start', sortable: false, value: 'connectInfo'},
        {text: this.$t('components.peers_information.port'), align: 'start', sortable: false, value: 'port'},
        {text: this.$t('components.peers_information.progress'), align: 'start', sortable: false, value: 'progress'},
        {text: this.$t('components.peers_information.upload_download_speed'), align: 'start', sortable: false, value: 'rateToClient'},
        // {text: '上传速度', align: 'center', sortable: false, value: 'rateToPeer', width: 120},
      ];
    }
  },
  mounted() {
    this.getPeers()
    this.timeId = setInterval(() => {
      this.getPeers()
    },3000)
  },
  beforeDestroy() {
    if (this.timeId != null) {
      clearInterval(this.timeId)
    }
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
          return {
            countryCode: '',
            country: '',
            region: '',
            city: '',
            ...v
          }
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
