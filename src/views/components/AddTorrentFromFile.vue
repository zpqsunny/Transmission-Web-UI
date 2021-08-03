<template>
  <div>
    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        添加种子
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-form ref="form">
                <v-text-field v-model="downloadDir" label="保存的位置" outlined autocomplete="off">
                  <template v-slot:append v-if="pathSizeByte > 0">
                    {{ pathSizeByte | unitFormat }} 可用
                  </template>
                </v-text-field>
                <v-file-input label="种子文件" outlined dense accept=".torrent,application/x-bittorrent" placeholder="*.torrent" @change="fileChange"></v-file-input>
                <v-checkbox v-model="autoStart" label="自动开始"></v-checkbox>
              </v-form>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="addTorrentAction">确 定</v-btn>
        <v-btn color="second" text @click="$emit('cancel')">关 闭</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import {Base64} from 'js-base64'

export default {
  name: 'AddTorrent',
  data: () => {
    return {
      addForm: {
        metainfo: '',
        paused: false,
      },
      pathSizeByte: 0
    }
  },
  computed: {
    autoStart: {
      get() {
        return !this.addForm.paused
      },
      set(v) {
        this.addForm.paused = !v
      }
    },
    downloadDir: {
      get() {
        return this.$store.state.sessionInfo["download-dir"]
      },
      set(v) {
        this.$store.state.sessionInfo["download-dir"] = v
        this.freeSpace()
      }
    }
  },
  mounted() {
    this.$store.commit('getSessionInfo')
    this.freeSpace()
  },
  methods: {
    addTorrentAction() {
      if (this.addForm.metainfo === '') {
        return
      }
      this.$axios.post('', {
        method: 'torrent-add',
        arguments: {
          'download-dir': this.downloadDir,
          ...this.addForm
        }
      }).then(r => {
        if (r.data.result === 'success') {
          this.$emit('success')
        }
      })
    },
    fileChange(e) {
      const fileRead = new FileReader()
      fileRead.onload = (f) => {
        this.addForm.metainfo = Base64.btoa(f.target.result)
      }
      fileRead.readAsBinaryString(e)
    },
    freeSpace() {
      this.$axios.post('', {
        method: 'free-space',
        arguments: {
          path: this.downloadDir
        }
      }).then(r => {
        if (r.data.result === 'success') {
          this.pathSizeByte = r.data.arguments['size-bytes']
        }
      })
    },
  }
}
</script>

<style scoped>

</style>
