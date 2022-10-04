<template>
  <div>
    <v-btn-toggle class="ma-1" v-model="trackerButtonAction">
      <v-btn text color="primary" @click="getTrackers"><font-awesome-icon :icon="['fa', 'redo']"/></v-btn>
      <v-btn text @click="addTrackersAction" v-text="$t('components.trackers_information.add_new_trackers')"></v-btn>
      <v-btn :disabled="trackerSelected.length <= 0" text @click="removeTracker" v-text="$t('components.trackers_information.remove_selected_trackers')"></v-btn>
    </v-btn-toggle>
    <v-data-table v-model="trackerSelected" dense :headers="trackerHeaders" :items="trackersInfo" item-key="id"
                  show-select :no-data-text="$t('no_data_text')" :no-results-text="$t('no_results_text')" @contextmenu:row="showMenu"
                  :items-per-page="$store.state.itemsPerPage" @update:items-per-page="e => $store.commit('updateItemsPerPage', e)">
      <template v-slot:item.lastAnnounceSucceeded="{ item }">
        <font-awesome-icon :style="{color: item.lastAnnounceSucceeded ? '#4CAF50': '#909399' }" :icon="['fa', 'check-circle']"/>
      </template>
      <template v-slot:item.lastScrapeTime="{ item }">
        {{ item.lastScrapeTime | timeFormatText }}
      </template>
      <template v-slot:item.nextAnnounceTime="{ item }">
        {{ item.nextAnnounceTime | timeFormatText }}
      </template>
    </v-data-table>
    <v-dialog v-if="addTrackerDialog" v-model="addTrackerDialog" width="500">
      <AddTrackers :ids="[id]" @success="addTrackerSuccess" @cancel="addTrackerDialog = false" />
    </v-dialog>
    <v-dialog v-if="replaceTrackerDialog" v-model="replaceTrackerDialog" width="30%">
      <v-card>
        <v-card-title class="justify-center"><strong v-text="$t('components.trackers_information.replace_tracker')"></strong></v-card-title>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-form ref="replaceTrackerForm">
                <v-text-field v-model="replaceTrackerForm.announce" label="Tracker URL" outlined autocomplete="off"></v-text-field>
              </v-form>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="replaceTrackerAction" v-text="$t('sure')"></v-btn>
          <v-btn color="second" text @click="replaceTrackerDialog = false" v-text="$t('close')"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-menu v-model="menu.show" :position-x="menu.x" :position-y="menu.y" absolute offset-y transition="slide-x-transition">
      <v-list>
        <v-list-item @click="showReplaceDialog">
          <v-list-item-icon><font-awesome-icon size="xl" :icon="['fa', 'edit']"/></v-list-item-icon>
          <v-list-item-content><v-list-item-title v-text="$t('components.trackers_information.replace_tracker')"></v-list-item-title></v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
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
  data() {
    return {
      trackerButtonAction: null,
      addTrackerDialog: false,
      trackersInfo: [],
      menu: {
        show: false,
        x: 0,
        y: 0,
        selectItem: {}
      },
      replaceTrackerDialog: false,
      replaceTrackerForm: {
        id: 0,
        announce: ''
      },
      trackerHeaders: [
        {text: this.$t('components.trackers_information.announce'), align: 'start', sortable: false, value: 'announce', width: 150},
        {text: this.$t('components.trackers_information.status'), align: 'center', sortable: false, value: 'lastAnnounceSucceeded', width: 80},
        {text: this.$t('components.trackers_information.info'), align: 'start', sortable: false, value: 'lastAnnounceResult'},
        {text: this.$t('components.trackers_information.download_count'), align: 'center', sortable: true, value: 'downloadCount', width: 90},
        {text: this.$t('components.trackers_information.leecher_count'), align: 'center', sortable: true, value: 'leecherCount', width: 90},
        {text: this.$t('components.trackers_information.seeder_count'), align: 'center', sortable: true, value: 'seederCount', width: 90},
        {text: this.$t('components.trackers_information.last_scrape_time'), align: 'center', sortable: false, value: 'lastScrapeTime', width: 180},
        {text: this.$t('components.trackers_information.next_announce_time'), align: 'center', sortable: false, value: 'nextAnnounceTime', width: 180},
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
      const d = this.trackerSelected.map(v => v.id)
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
    showReplaceDialog() {
      this.replaceTrackerForm.id = this.menu.selectItem.id
      this.replaceTrackerForm.announce = this.menu.selectItem.announce
      this.replaceTrackerDialog = true
    },
    replaceTrackerAction() {
      this.$axios.post('', {
        method: 'torrent-set',
        arguments: {
          ids: [this.id],
          trackerReplace: [this.replaceTrackerForm.id, this.replaceTrackerForm.announce]
        }
      }).then(r => {
        if (r.data.result === 'success') {
          this.replaceTrackerDialog = false
          this.getTrackers()
          return
        }
        this.$store.commit('showMessage', {type: 'error', title: r.data.result})
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
