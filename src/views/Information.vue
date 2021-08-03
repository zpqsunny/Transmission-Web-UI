<template>
  <div>
    <v-tabs v-model="tab">
      <v-tab>常规</v-tab>
      <v-tab>Tracker 服务器</v-tab>
      <v-tab>文件</v-tab>
      <v-tab>用户</v-tab>
      <v-tab>设置</v-tab>
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
        <PeersInformation :id="id"></PeersInformation>
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

</style>
