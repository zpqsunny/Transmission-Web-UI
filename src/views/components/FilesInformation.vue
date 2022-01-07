<template>
  <div>
    <v-btn-toggle class="ma-1" v-model="filesButtonAction">
      <v-btn text color="primary" @click="getFiles"><font-awesome-icon :icon="['fa', 'redo']"/></v-btn>
      <v-btn :disabled="filesSelected.length <= 0" text @click="setFilesWantedAndUnwanted('files-wanted')">下载已选择的文件</v-btn>
      <v-btn :disabled="filesSelected.length <= 0" text @click="setFilesWantedAndUnwanted('files-unwanted')">忽略已选择的文件</v-btn>
      <v-menu offset-y transition="slide-x-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn :disabled="filesSelected.length <= 0" text v-bind="attrs" v-on="on">设置优先级别</v-btn>
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
    <v-treeview dense selectable transition shaped hoverable :items="fileTree" return-object @input="selectInput">
      <template v-slot:prepend="{ item, open }">
        <font-awesome-icon v-if="item.type === 'directory'" :icon="['far', open ? 'folder-open' : 'folder']" size="lg" />
        <font-awesome-icon v-if="item.type === 'file'" :icon="['far', item.icon]" size="lg" />
      </template>
      <template v-slot:label="{ item }">
        <div class="d-flex justify-space-between align-center align-content-center">
          <div>
            <span>{{ item.name }}</span>
          </div>
          <div style="width: calc(100vw/7);">
            <div v-if="item.type === 'file'" class="d-flex flex-column">
              <div class="d-flex flex-row justify-space-between">
                <span>{{ item.bytesCompleted | unitFormat }} / {{ item.length | unitFormat }}</span>
                <span><strong>{{(item.bytesCompleted / item.length * 100).toFixed(2)}}%</strong></span>
              </div>
            </div>
            <div class="d-flex flex-column">
              <v-progress-linear v-if="item.length > 0" :value="(item.bytesCompleted / item.length * 100).toFixed(2)" striped rounded color="#03a9f4"></v-progress-linear>
            </div>
            <div class="d-flex flex-column">
              <div class="d-flex justify-space-between">
                <span v-if="item.priority === -1">优先级别: 低</span>
                <span v-if="item.priority === 0">优先级别: 正常</span>
                <span v-if="item.priority === 1">优先级别: 高</span>
                <span v-if="item.type === 'file'">
                  下载:
                  <font-awesome-icon v-if="item.wanted" title="是" style="color: #4CAF50" :icon="['fa', 'check']"/>
                  <font-awesome-icon v-if="!item.wanted" title="否" style="color: #909399" :icon="['fa', 'times']"/>
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </v-treeview>
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
  data() {
    return {
      filesButtonAction: null,
      filesSelected: [],
      fileTree: [],
      fileExtList: [
        {
          icon: 'file-video',
          ext: ['.avi', '.mov', '.rmvb', '.rm', '.flv', '.mp4', '.3gp', '.mkv', '.wmv']
        },
        {
          icon: 'file-audio',
          ext: ['.mp3','.wav', '.flac']
        },
        {
          icon: 'file-image',
          ext: ['.bmp', '.jpg', '.png', '.tif', '.gif', '.pcx', '.tga', '.exif', '.fpx', '.svg', '.psd', '.cdr',
            '.pcd', '.dxf', '.ufo', '.eps', '.ai', '.raw', '.wmf', '.webp']
        }
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
        if (r.data.result !== 'success' || r.data.arguments.torrents.length < 1) {
          return
        }
        let torrent = r.data.arguments.torrents[0]
        //files
        let fileStats = torrent.fileStats
        let files = torrent.files
        let temp = files.map((value, index) => {
          return {
            index: index,
            name: value.name,
            length: value.length,
            bytesCompleted: value.bytesCompleted,
            wanted: fileStats[index].wanted,
            priority: fileStats[index].priority,
          }
        })
        this.fileTree = this.treeify(temp)
      })
    },
    setFilesWantedAndUnwanted(value) {
      let args = {ids: this.id}
      if (value === 'files-wanted') {
        args['files-wanted'] = this.filesSelected
      }
      if (value === 'files-unwanted') {
        args['files-unwanted'] = this.filesSelected
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
      let args = { ids: this.id }
      if (priority === 'priority-normal') {
        args['priority-normal'] = this.filesSelected
      }
      if (priority === 'priority-high') {
        args['priority-high'] = this.filesSelected
      }
      if (priority === 'priority-low') {
        args['priority-low'] = this.filesSelected
      }
      this.$axios.post('', {
        method: 'torrent-set',
        arguments: args
      })
      this.getFiles()
    },
    /**
     * Copy From https://github.com/WDaan/VueTorrent
     * @param paths
     * @returns {[]}
     */
    treeify(paths) {
      let result = []
      const level = { result }
      let id = 0
      paths.forEach(path => {
        path.name.split('/').reduce((r, name) => {
          if (!r[name]) {
            r[name] = { result: [] }
            r.result.push({
              id: ++id,
              index: path.index,
              name: name,
              fullName: path.name,
              type: 'file',
              length: path.length,
              bytesCompleted: path.bytesCompleted,
              wanted: path.wanted,
              priority: path.priority,
              children: r[name].result,
              icon: this.fileIcon(path.name)
            })
          }
          return r[name]
        }, level)
      })
      result = result.map(el => this.parseFolder(el))
      return result
    },
    parseFolder(el) {
      if (el.children.length !== 0) {
        const folder = {
          id: el.id,
          name: el.name,
          fullName: el.name,
          type: 'directory',
          children: el.children
        }
        folder.children = folder.children.map(el => this.parseFolder(el))
        return folder
      }
      return el
    },
    selectInput(e) {
      this.filesSelected = e.map(v => v.index)
    },
    fileIcon(fileName) {
      let index = fileName.lastIndexOf('.')
      if (index < 0) {
        return 'file'
      }
      let ext = fileName.substr(index)
      let i = this.fileExtList.findIndex(v => {
        return v.ext.findIndex(v => v === ext) >= 0
      })
      return i >= 0 ? this.fileExtList[i].icon : 'file'
    }
  }
}
</script>

<style scoped>

</style>
