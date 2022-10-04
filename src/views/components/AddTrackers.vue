<template>
  <div>
    <v-card>
      <v-card-title class="text-h5 grey lighten-2 justify-center">
        <strong v-text="$t('components.add_trackers.add_trackers')"></strong>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-form ref="form">
                <v-textarea outlined :label="$t('components.add_trackers.tracker_address')" v-model="addTrackersForm.trackers"></v-textarea>
              </v-form>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <a href="https://ngosang.github.io/trackerslist/trackers_all_ip.txt" target="_blank" v-text="$t('components.add_trackers.trackers')"></a>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="addTrackersAction" v-text="$t('sure')"></v-btn>
        <v-btn color="second" text @click="$emit('cancel')" v-text="$t('close')"></v-btn>
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
