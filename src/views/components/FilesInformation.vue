<template>
  <div>
    <v-btn-toggle v-model="filesButtonAction">
      <v-btn @click="getFiles"><font-awesome-icon :icon="['fa', 'redo']"/></v-btn>
      <v-btn @click="setFilesWantedAndUnwanted('files-wanted')">下载已选择的文件</v-btn>
      <v-btn @click="setFilesWantedAndUnwanted('files-unwanted')">忽略已选择的文件</v-btn>
      <v-menu offset-y transition="slide-x-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on">设置优先级别</v-btn>
        </template>
        <v-list>
          <v-list-item @click="setFilesPriority('priority-high')">
            <v-list-item-title>高</v-list-item-title>
          </v-list-item>
          <v-list-item @click="setFilesPriority('priority-normal')">
            <v-list-item-title>正常</v-list-item-title>
          </v-list-item>
          <v-list-item @click="setFilesPriority('priority-low')">
            <v-list-item-title>低</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn-toggle>
    <v-data-table dense v-model="filesSelected" :headers="filesHeaders" :items="filesInfo" item-key="name" show-select no-data-text="暂无内容" no-results-text="未找到匹配项"
                  :items-per-page="$store.state.itemsPerPage" @update:items-per-page="e => $store.commit('updateItemsPerPage', e)">
      <template v-slot:item.name="{ item }">
            <span class="d-inline-block" style="word-break: break-all;" :title="item.name">
              {{ item.name }}
            </span>
      </template>
      <template v-slot:item.length="{ item }">
        {{ item.length | unitFormat }}
      </template>
      <template v-slot:item.progress="{ item }">
        <v-progress-linear :value="(item.bytesCompleted / item.length * 100).toFixed(2)" striped rounded color="#67C23A" height="25">
          <template v-slot:default="{ value }">
            <strong>{{ value }}%</strong>
          </template>
        </v-progress-linear>
      </template>
      <template v-slot:item.bytesCompleted="{ item }">
        {{ item.bytesCompleted | unitFormat }}
      </template>
      <template v-slot:item.wanted="{ item }">
        <span v-if="item.wanted">
          <font-awesome-icon title="是" style="color: #4CAF50" :icon="['fa', 'check']"/>
        </span>
        <span v-else>
          <font-awesome-icon title="否" style="color: #909399" :icon="['fa', 'times']"/>
        </span>
      </template>
      <template v-slot:item.priority="{ item }">
        <span v-if="item.priority === -1">
          低
        </span>
        <span v-if="item.priority === 0">
          正常
        </span>
        <span v-if="item.priority === 1">
          高
        </span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'FilesInformation',
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data: () => {
    return {
      filesButtonAction: null,
      filesInfo: [],
      filesSelected: [],
      filesHeaders: [
        {text: '名称', align: 'start', sortable: false, value: 'name'},
        {text: '大小', align: 'center', sortable: false, value: 'length', width: 150},
        {text: '进度', align: 'center', sortable: false, value: 'progress', width: 150},
        {text: '已下载', align: 'center', sortable: false, value: 'bytesCompleted', width: 150},
        {text: '需要下载', align: 'center', sortable: false, value: 'wanted', width: 100},
        {text: '优先级别', align: 'center', sortable: false, value: 'priority', width: 100},
      ],
    }
  },
  mounted() {
    this.getFiles()
  },
  methods: {
    getFiles() {
      this.$axios.post('', {
        method: 'torrent-get',
        arguments: {
          id: this.id,
          fields: ['files', 'fileStats']
        }
      }).then(r => {
        if (r.data.result !== 'success') {
          return
        }
        if (r.data.arguments.torrents.length < 1) {
          return
        }
        let torrent = r.data.arguments.torrents[0]
        //files
        let fileStats = torrent.fileStats
        let files = torrent.files
        let temp = []
        files.forEach((value, index) => {
          temp.push({
            index: index,
            name: value.name,
            length: value.length,
            bytesCompleted: value.bytesCompleted,
            wanted: fileStats[index].wanted,
            priority: fileStats[index].priority,
          })
        })
        this.filesInfo = temp
      })
    },
    setFilesWantedAndUnwanted(value) {
      if (this.filesSelected.length <= 0) {
        return
      }
      const d = []
      this.filesSelected.forEach(value => {
        d.push(value.index)
      })
      let args = {ids: this.id}
      if (value === 'files-wanted') {
        args['files-wanted'] = d
      }
      if (value === 'files-unwanted') {
        args['files-unwanted'] = d
      }
      this.$axios.post('', {
        method: 'torrent-set',
        arguments: args
      }).then(r => {
        if (r.data.result === 'success') {
          this.getFiles()
        }
      })
    },
    setFilesPriority(priority) {
      if (this.filesSelected.length <= 0) {
        return
      }
      const d = []
      this.filesSelected.forEach(value => {
        d.push(value.index)
      })
      let args = {ids: this.id}
      if (priority === 'priority-normal') {
        args['priority-normal'] = d
      }
      if (priority === 'priority-high') {
        args['priority-high'] = d
      }
      if (priority === 'priority-low') {
        args['priority-low'] = d
      }
      this.$axios.post('', {
        method: 'torrent-set',
        arguments: args
      })
      this.getFiles()
    },
  }
}
</script>

<style scoped>

</style>
