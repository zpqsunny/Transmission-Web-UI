import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../plugins/axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    message: {
      show: false,
      timeout: 4000,
      title: ''
    },
    torrents: [],
    itemsPerPage: 10,
    sessionInfo: {
      "alt-speed-down": 50,
      "alt-speed-enabled": false,
      "alt-speed-time-begin": 540,
      "alt-speed-time-day": 127,
      "alt-speed-time-enabled": false,
      "alt-speed-time-end": 1020,
      "alt-speed-up": 50,
      "blocklist-enabled": false,
      "blocklist-size": 0,
      "blocklist-url": "http://www.example.com/blocklist",
      "cache-size-mb": 4,
      "config-dir": "",
      "dht-enabled": true,
      "download-dir": "",
      "download-queue-enabled": false,
      "download-queue-size": 0,
      "encryption": "preferred",
      "idle-seeding-limit": 0,
      "idle-seeding-limit-enabled": false,
      "incomplete-dir": "",
      "incomplete-dir-enabled": false,
      "lpd-enabled": false,
      "peer-limit-global": 240,
      "peer-limit-per-torrent": 60,
      "peer-port": 51413,
      "peer-port-random-on-start": false,
      "pex-enabled": true,
      "port-forwarding-enabled": false,
      "queue-stalled-enabled": false,
      "queue-stalled-minutes": 0,
      "rename-partial-files": true,
      "rpc-version": 0,
      "rpc-version-minimum": 1,
      "script-torrent-done-enabled": false,
      "script-torrent-done-filename": "",
      "seed-queue-enabled": false,
      "seed-queue-size": 0,
      "seedRatioLimit": 0,
      "seedRatioLimited": false,
      "speed-limit-down": 100,
      "speed-limit-down-enabled": false,
      "speed-limit-up": 100,
      "speed-limit-up-enabled": false,
      "start-added-torrents": true,
      "trash-original-torrent-files": false,
      "units": {
        "memory-bytes": 1024,
        "memory-units": ["KiB", "MiB", "GiB", "TiB"],
        "size-bytes": 1000,
        "size-units": ["kB", "MB", "GB", "TB"],
        "speed-bytes": 1000,
        "speed-units": ["kB/s", "MB/s", "GB/s", "TB/s"]
      },
      "utp-enabled": true,
      "version": ""
    }
  },
  mutations: {
    getTorrents(state) {
      axios.post('',
        {
          method: 'torrent-get',
          arguments: {
            fields: ['id', 'name', 'status', 'hashString', 'totalSize', 'percentDone', 'addedDate', 'leftUntilDone',
              'rateDownload', 'rateUpload', 'recheckProgress', 'peersGettingFromUs', 'peersSendingToUs', 'eta', 'metadataPercentComplete',
              'uploadRatio', 'uploadedEver', 'downloadedEver', 'downloadDir', 'error', 'errorString', 'doneDate', 'queuePosition',
              'activityDate'
            ]
          }
        }).then(r => {
        if (r.data.result === 'success') {
          state.torrents = r.data.arguments.torrents
        }
      })
    },
    getSessionInfo(state) {
      axios.post('',
        {
          method: 'session-get',
          arguments: {
            fields: ['alt-speed-down', 'alt-speed-enabled', 'alt-speed-time-begin', 'alt-speed-time-enabled', 'alt-speed-time-end', 'alt-speed-time-day', 'alt-speed-up', 'blocklist-url', 'blocklist-enabled',
              'blocklist-size', 'cache-size-mb', 'config-dir', 'download-dir', 'download-queue-size', 'download-queue-enabled', 'dht-enabled',
              'encryption', 'idle-seeding-limit', 'idle-seeding-limit-enabled', 'incomplete-dir', 'incomplete-dir-enabled',
              'lpd-enabled', 'peer-limit-global', 'peer-limit-per-torrent', 'pex-enabled', 'peer-port', 'peer-port-random-on-start',
              'port-forwarding-enabled', 'queue-stalled-enabled', 'queue-stalled-minutes', 'rename-partial-files', 'rpc-version',
              'rpc-version-minimum', 'script-torrent-done-filename', 'script-torrent-done-enabled', 'seedRatioLimit',
              'seedRatioLimited', 'seed-queue-size', 'seed-queue-enabled', 'speed-limit-down', 'speed-limit-down-enabled',
              'speed-limit-up', 'speed-limit-up-enabled', 'start-added-torrents', 'trash-original-torrent-files', 'units',
              'utp-enabled', 'version', 'units','download-dir-free-space'
            ]
          }
        }).then(r => {
        if (r.data.result === 'success') {
          state.sessionInfo = r.data.arguments
        }
      })
    },
    updateSessionSet(state) {
      axios.post('',
        {
          method: 'session-set',
          arguments: state.sessionInfo
        })
    },
    updateItemsPerPage(state, value) {
      state.itemsPerPage = value
    },
    showMessage(state, message) {
      state.message.show = message.show
      state.message.title = message.title
    }
  },
  actions: {

  },
  modules: {
  }
})
