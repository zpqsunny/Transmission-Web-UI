<template>
  <div>
    <v-form>
      <v-container fluid>
        <v-row>
          <v-col cols="3">
            <v-text-field type="number" :label="$t('components.torrent_setting.stop_sending_at_ratio')" v-model="setInfo.seedRatioLimit" :min="1"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <v-btn text color="secondary" @click="getSettings" v-text="$t('flush')"></v-btn>
            <v-btn text color="primary" @click="setSettings" v-text="$t('save')"></v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
export default {
  name: 'TorrentSetting',
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      setInfo: {
        downloadLimited: false,
        downloadLimit: 0,
        uploadLimited: false,
        uploadLimit: 0,
        'peer-limit': 0,
        seedIdleLimit: 0,
        seedIdleMode: 0,
        seedRatioLimit: 0,
        seedRatioMode: 0,
      },
    }
  },
  mounted() {
    this.getSettings()
  },
  methods: {
    getSettings() {
      this.$axios.post('', {
        method: 'torrent-get',
        arguments: {
          ids: [this.id],
          fields: ['downloadLimited', 'downloadLimit', 'uploadLimited', 'uploadLimit', 'peer-limit', 'seedIdleLimit',
            'seedIdleMode', 'seedRatioLimit', 'seedRatioMode'
          ]
        }
      }).then(r => {
        if (r.data.result !== 'success') {
          return
        }
        if (r.data.arguments.torrents.length <= 0) {
          return
        }
        let torrent = r.data.arguments.torrents[0]
        this.setInfo.downloadLimited = torrent.downloadLimited
        this.setInfo.downloadLimit = torrent.downloadLimit
        this.setInfo.uploadLimited = torrent.uploadLimited
        this.setInfo.uploadLimit = torrent.uploadLimit
        this.setInfo['peer-limit'] = torrent['peer-limit']
        this.setInfo.seedIdleLimit = torrent.seedIdleLimit
        this.setInfo.seedIdleMode = torrent.seedIdleMode
        this.setInfo.seedRatioLimit = torrent.seedRatioLimit
        this.setInfo.seedRatioMode = torrent.seedRatioMode
      })
    },
    setSettings() {
      this.$axios.post('', {
        method: 'torrent-set',
        arguments: {
          ids: [this.id],
          ...this.setInfo
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
