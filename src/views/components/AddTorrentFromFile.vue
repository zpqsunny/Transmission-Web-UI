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
                <v-file-input :label="$t('components.add_torrent.torrent_file')" accept="application/x-bittorrent,.torrent" @focus="freeSpace" placeholder="*.torrent" @change="fileChange"></v-file-input>
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
import {Base64} from 'js-base64'

export default {
  name: 'AddTorrentFromFile',
  data() {
    return {
      addForm: {
        metainfo: '',
        paused: false,
      },
      pathSizeByte: 0,
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
          return
        }
        this.$store.commit('showMessage', {type: 'error', title: r.data.result})
      })
    },
    fileChange(e) {
      if (e == null) {
        this.addForm.metainfo = ''
        return
      }
      const fileRead = new FileReader()
      fileRead.onload = (f) => {
        this.addForm.metainfo = Base64.fromUint8Array(new Uint8Array(f.target.result))
      }
      fileRead.readAsArrayBuffer(e)
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
    }
  }
}
</script>

<style scoped>

</style>
