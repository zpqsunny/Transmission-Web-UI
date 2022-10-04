<template>
  <div>
    <v-card>
      <v-card-title class="text-h5 grey lighten-2 justify-center">
        <strong v-text="$t('components.add_torrent.add_torrent')"></strong>
      </v-card-title>
      <v-card-text>
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <v-form ref="form">
                <v-text-field v-model="downloadDir" @blur="freeSpace" autocomplete="off">
                  <template v-slot:prepend>
                    <font-awesome-icon size="2x" :icon="['far', 'folder']"/>
                  </template>
                  <template v-slot:label>
                    {{ $t('components.add_torrent.save_path') }}
                    <span v-if="pathSizeByte > 0"> | <strong>{{ pathSizeByte | unitFormat }}</strong> {{ $t('components.add_torrent.can_used') }}</span>
                  </template>
                  <template v-slot:append>
                    <v-btn icon color="#212121" @click="freeSpace"><font-awesome-icon :icon="['fa', 'sync-alt']"/></v-btn>
                  </template>
                </v-text-field>
                <v-textarea outlined :label="$t('components.add_torrent.magnet_url')" v-model="addForm.filename" @focus="onfocus" placeholder="magnet:?xt=urn:btih:"></v-textarea>
                <v-checkbox v-model="autoStart" :label="$t('components.add_torrent.auto_start')"></v-checkbox>
              </v-form>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="addTorrentAction" v-text="$t('sure')"></v-btn>
        <v-btn color="second" text @click="$emit('cancel')" v-text="$t('close')"></v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'AddTorrentFromUrl',
  data() {
    return {
      addForm: {
        filename: '',
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
      }
    }
  },
  mounted() {
    this.$store.commit('getSessionInfo')
  },
  methods: {
    addTorrentAction() {
      if (this.addForm.filename.match(/^[0-9a-f]{40}$/i)) {
        this.addForm.filename = 'magnet:?xt=urn:btih:' + this.addForm.filename
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
          return
        }
        this.$store.commit('showMessage', {type: 'error', title: r.data.result})
      })
    },
    onfocus() {
      navigator.permissions.query({
        name: 'clipboard-read'
      }).then(v => {
        switch (v.state) {
          case 'granted':
          case 'prompt':
            navigator.clipboard.readText()
                .then(r => {
                  if (r.match(/^[0-9a-f]{40}$/i)) {
                    this.addForm.filename = 'magnet:?xt=urn:btih:' + r
                    this.$store.commit('showMessage', {type: 'success', title: '已从剪贴板获取磁力链接'})
                    return
                  }
                  if (r.match(/^magnet:\?xt=urn:btih:[0-9a-f]{40}.?/i)) {
                    this.addForm.filename = r
                    this.$store.commit('showMessage', {type: 'success', title: '已从剪贴板获取磁力链接'})
                  }
                })
                .catch(reason => {
                  console.log(reason)
                  this.$store.commit('showMessage', {type: 'warning', title: '粘贴板权限被拒绝,建议开启粘贴板'})
                })
            break;
          case 'denied':
            this.$store.commit('showMessage', {type: 'warning', title: '粘贴板权限被拒绝,建议开启粘贴板'})
            break;
          default:
            break;
        }
      })
      this.freeSpace()
    },
    freeSpace() {
      this.$axios.post('', {
        method: 'free-space',
        arguments: {
          path: this.downloadDir
        }
      }).then(r => {
        this.pathSizeByte = r.data.arguments['size-bytes']
      })
    },
  }
}
</script>

<style scoped>

</style>
