<template>
  <div>
    <v-btn-toggle v-model="trackerButtonAction">
      <v-btn @click="getTrackers"><font-awesome-icon :icon="['fa', 'redo']"/></v-btn>
      <v-btn @click="addTrackersAction">添加新的Tracker</v-btn>
      <v-btn @click="removeTracker">删除已选中的Tracker</v-btn>
    </v-btn-toggle>
    <v-data-table v-model="trackerSelected" dense :headers="trackerHeaders" :items="trackersInfo" item-key="id" show-select no-data-text="暂无内容" no-results-text="未找到匹配项"
                  :items-per-page="$store.state.itemsPerPage" @update:items-per-page="e => $store.commit('updateItemsPerPage', e)">
      <template v-slot:item.lastAnnounceSucceeded="{ item }">
        <font-awesome-icon :style="{color: item.lastAnnounceSucceeded ? '#4CAF50': '#909399' }" :icon="['fa', 'check-circle']"/>
      </template>
      <template v-slot:item.lastScrapeTime="{ item }">
        {{ item.lastScrapeTime | timestampFormat }}
      </template>
      <template v-slot:item.nextAnnounceTime="{ item }">
        {{ item.nextAnnounceTime | timestampFormat }}
      </template>
    </v-data-table>
    <v-dialog v-if="addTrackerDialog" v-model="addTrackerDialog" width="500">
      <AddTrackers :ids="[id]" @success="addTrackerSuccess" @cancel="addTrackerDialog = false" />
    </v-dialog>
  </div>
</template>

<script>
import AddTrackers from '@/views/components/AddTrackers'

export default {
  name: "TrackersInformation",
  components: {
    AddTrackers
  },
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data: () => {
    return {
      trackerButtonAction: null,
      addTrackerDialog: false,
      trackersInfo: [],
      trackerHeaders: [
        {text: '服务器', align: 'start', sortable: false, value: 'announce', width: 150},
        {text: '状态', align: 'center', sortable: false, value: 'lastAnnounceSucceeded', width: 80},
        {text: '信息', align: 'start', sortable: false, value: 'lastAnnounceResult'},
        {text: '下载数', align: 'center', sortable: false, value: 'downloadCount', width: 80},
        {text: '吸血数', align: 'center', sortable: false, value: 'leecherCount', width: 80},
        {text: '种子数', align: 'center', sortable: false, value: 'seederCount', width: 80},
        {text: '更新时间', align: 'center', sortable: false, value: 'lastScrapeTime', width: 180},
        {text: '下次更新时间', align: 'center', sortable: false, value: 'nextAnnounceTime', width: 180},
      ],
      trackerSelected: [],
    }
  },
  mounted() {
    this.getTrackers()
  },
  methods: {
    getTrackers() {
      this.$axios.post('', {
        method: 'torrent-get',
        arguments: {
          ids: [this.id],
          fields: ['trackerStats']
        }
      }).then(r => {
        if (r.data.result !== 'success') {
          return
        }
        if (r.data.arguments.torrents.length > 0) {
          let torrent = r.data.arguments.torrents[0]
          //trackers
          this.trackersInfo = torrent.trackerStats
        }
      })
    },
    addTrackersAction() {
      this.addTrackerDialog = true
    },
    removeTracker() {
      if (this.trackerSelected.length <= 0) {
        return
      }
      const d = []
      this.trackerSelected.forEach(value => {
        d.push(value.id)
      })
      this.$axios.post('', {
        method: 'torrent-set',
        arguments: {
          ids: [this.id],
          trackerRemove: d
        }
      }).then(r => {
        if (r.data.result === 'success') {
          this.trackerSelected = []
          this.getTrackers()
        }
      })
    },
    addTrackerSuccess() {
      this.addTrackerDialog = false
      this.getTrackers()
    }
  }
}
</script>

<style scoped>

</style>
