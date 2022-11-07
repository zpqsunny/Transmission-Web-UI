<template>
  <div class="border-style">
    <v-tabs v-model="tab">
      <v-tab v-text="$t('information.info')"></v-tab>
      <v-tab v-text="$t('information.trackers')" ></v-tab>
      <v-tab v-text="$t('information.files')"></v-tab>
      <v-tab v-text="$t('information.peers')"></v-tab>
      <v-tab v-text="$t('information.settings')"></v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
<!--   常规     -->
        <TorrentInformation :id="id"></TorrentInformation>
      </v-tab-item>
      <v-tab-item>
<!--   Tracker 服务器     -->
        <TrackerInformation :id="id"></TrackerInformation>
      </v-tab-item>
<!--   文件   -->
      <v-tab-item>
        <FilesInformation :id="id"></FilesInformation>
      </v-tab-item>
      <v-tab-item>
<!--   用户    -->
        <PeersInformation v-if="tab === 3" :id="id"></PeersInformation>
      </v-tab-item>
      <v-tab-item>
<!--        设置-->
        <TorrentSetting :id="id"></TorrentSetting>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import TorrentInformation from '@/views/components/TorrentInformation'
import TrackerInformation from '@/views/components/TrackesrInformation'
import FilesInformation from '@/views/components/FilesInformation'
import PeersInformation from '@/views/components/PeersInformation'
import TorrentSetting from '@/views/components/TorrentSetting'

export default {
  name: 'Information',
  components: {
    TorrentInformation,
    TrackerInformation,
    FilesInformation,
    PeersInformation,
    TorrentSetting,
  },
  data() {
    return {
      tab: null,
    }
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  mounted() {

  },
  methods: {

  },
}
</script>

<style scoped>
  .border-style {
    border-left: #e0e0e0 1px;
    border-left-style: solid;
  }
</style>
