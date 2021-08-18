<template>
  <div>
    <v-card>
      <v-card-title class="text-h5 grey lighten-2 justify-center">
        <strong>添加Trackers</strong>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-form ref="form">
                <v-textarea outlined name="input-7-4" label="Trackers地址" v-model="addTrackersForm.trackers"></v-textarea>
              </v-form>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <a href="https://ngosang.github.io/trackerslist/trackers_all_ip.txt" target="_blank">Trackers</a>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="addTrackersAction">确 定</v-btn>
        <v-btn color="second" text @click="$emit('cancel')">关 闭</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'AddTrackers',
  data() {
    return {
      addTrackersForm: {
        trackers: '',
      }
    }
  },
  props: {
    ids: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    addTrackersAction() {
      const trackers = this.addTrackersForm.trackers.split('\n\n')
      this.$axios.post('', {
        method: 'torrent-set',
        arguments: {
          ids: this.ids,
          trackerAdd: trackers
        }
      }).then(r => {
        if (r.data.result === 'success') {
          this.$emit('success')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
