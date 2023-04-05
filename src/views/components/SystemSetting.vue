<template>
  <div>
    <!--  设置对话框    -->
      <v-card>
        <v-card-title class="headline grey lighten-2 justify-center">
          <strong v-text="$t('components.system_setting.setting')"></strong>
        </v-card-title>
        <v-card-text>
          <v-tabs v-model="setTab">
            <v-tab v-text="$t('components.system_setting.speed')"></v-tab>
            <v-tab v-text="$t('components.system_setting.bandwidth')"></v-tab>
            <v-tab v-text="$t('components.system_setting.upload')"></v-tab>
            <v-tab v-text="$t('components.system_setting.privacy')"></v-tab>
            <v-tab v-text="$t('components.system_setting.network')"></v-tab>
            <v-tab v-text="$t('components.system_setting.other')"></v-tab>
          </v-tabs>
          <v-tabs-items v-model="setTab">
            <v-tab-item>
              <v-card>
                <v-card-title v-text="$t('components.system_setting.global_bandwidth_limits')"></v-card-title>
                <v-container>
                  <v-row>
                    <v-col cols="5">
                      <v-checkbox v-model="$store.state.sessionInfo['speed-limit-up-enabled']" :label="$t('components.system_setting.upload_rate')"></v-checkbox>
                    </v-col>
                    <v-col cols="7">
                      <v-text-field outlined type="number" v-model.number="$store.state.sessionInfo['speed-limit-up']" :disabled="!$store.state.sessionInfo['speed-limit-up-enabled']">
                        <template v-slot:append>
                          kB/s
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="5">
                      <v-checkbox v-model="$store.state.sessionInfo['speed-limit-down-enabled']" :label="$t('components.system_setting.download_rate')"></v-checkbox>
                    </v-col>
                    <v-col cols="7">
                      <v-text-field outlined type="number" v-model.number="$store.state.sessionInfo['speed-limit-down']" :disabled="!$store.state.sessionInfo['speed-limit-down-enabled']">
                        <template v-slot:append>
                          kB/s
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
              <v-card>
                <v-card-title><font-awesome-icon :icon="['fa', 'running']" />
                  {{ $t('components.system_setting.speed_limit_mode') }}
                </v-card-title>
                <v-card-subtitle v-text="$t('components.system_setting.when_enabled_speed_limit_overwrite_the_global_bandwidth_limits')"></v-card-subtitle>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field outlined type="number" v-model.number="$store.state.sessionInfo['alt-speed-up']" :label="$t('components.system_setting.upload_rate')">
                        <template v-slot:append>
                          kB/s
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field outlined type="number" v-model.number="$store.state.sessionInfo['alt-speed-down']" :label="$t('components.system_setting.download_rate')">
                        <template v-slot:append>
                          kB/s
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4">
                      <v-checkbox :label="$t('components.system_setting.schedule_speed_limit')" v-model="$store.state.sessionInfo['alt-speed-time-enabled']"></v-checkbox>
                    </v-col>
                    <v-col cols="4">
                      <v-menu ref="timeBegin" v-model="timeBeginMenu" :close-on-content-click="false" :nudge-right="40" :return-value.sync="timeBegin"
                              transition="scale-transition" offset-y max-width="300px" min-width="300px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field :disabled="!$store.state.sessionInfo['alt-speed-time-enabled']" v-model="timeBegin" :label="$t('components.system_setting.time_begin')" prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                        </template>
                        <v-time-picker v-if="timeBeginMenu" v-model="timeBegin" full-width @click:minute="$refs['timeBegin'].save(timeBegin)"></v-time-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="4">
                      <v-menu ref="timeEnd" v-model="timeEndMenu" :close-on-content-click="false" :nudge-right="40" :return-value.sync="timeEnd"
                              transition="scale-transition" offset-y max-width="300px" min-width="300px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field :disabled="!$store.state.sessionInfo['alt-speed-time-enabled']" v-model="timeEnd" :label="$t('components.system_setting.time_end')" prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                        </template>
                        <v-time-picker v-if="timeEndMenu" v-model="timeEnd" full-width @click:minute="$refs['timeEnd'].save(timeEnd)"></v-time-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <div class="d-flex justify-space-between">
                        <v-checkbox :label="$t('components.system_setting.sun')" :disabled="!$store.state.sessionInfo['alt-speed-time-enabled']" v-model="sunday"></v-checkbox>
                        <v-checkbox :label="$t('components.system_setting.mon')" :disabled="!$store.state.sessionInfo['alt-speed-time-enabled']" v-model="monday"></v-checkbox>
                        <v-checkbox :label="$t('components.system_setting.tue')" :disabled="!$store.state.sessionInfo['alt-speed-time-enabled']" v-model="tuesday"></v-checkbox>
                        <v-checkbox :label="$t('components.system_setting.wed')" :disabled="!$store.state.sessionInfo['alt-speed-time-enabled']" v-model="wednesday"></v-checkbox>
                        <v-checkbox :label="$t('components.system_setting.thur')" :disabled="!$store.state.sessionInfo['alt-speed-time-enabled']" v-model="thursday"></v-checkbox>
                        <v-checkbox :label="$t('components.system_setting.fri')" :disabled="!$store.state.sessionInfo['alt-speed-time-enabled']" v-model="friday"></v-checkbox>
                        <v-checkbox :label="$t('components.system_setting.sat')" :disabled="!$store.state.sessionInfo['alt-speed-time-enabled']" v-model="saturday"></v-checkbox>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card>
                <v-card-title v-text="$t('components.system_setting.adding')"></v-card-title>
                <v-container>
                  <v-row>
                    <v-col cols="6">
                      <v-checkbox :label="$t('components.system_setting.start_transfers_when_added')" v-model.number="$store.state.sessionInfo['start-added-torrents']"></v-checkbox>
                    </v-col>
                    <v-col cols="6">
                      <v-checkbox :label="$t('components.system_setting.trash_original_torrent_files')" v-model.number="$store.state.sessionInfo['trash-original-torrent-files']"></v-checkbox>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field outlined v-model="downloadDir" :label="$t('components.system_setting.default_location')">
                        <template v-slot:append v-if="pathSizeByte > 0">
                          {{ pathSizeByte | unitFormat }} {{ $t('components.system_setting.available') }}
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
              <v-card>
                <v-card-title v-text="$t('components.system_setting.queues')"></v-card-title>
                <v-container>
                  <v-row>
                    <v-col cols="6">
                      <v-checkbox v-model="$store.state.sessionInfo['download-queue-enabled']" :label="$t('components.system_setting.download_with_maximum_of')"></v-checkbox>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field outlined type="number" v-model.number="$store.state.sessionInfo['download-queue-size']" :disabled="!$store.state.sessionInfo['download-queue-enabled']"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <v-checkbox v-model="$store.state.sessionInfo['queue-stalled-enabled']" :label="$t('components.system_setting.transfer_is_stalled_when_inactive_for')"></v-checkbox>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field outlined type="number" v-model.number="$store.state.sessionInfo['queue-stalled-minutes']" :disabled="!$store.state.sessionInfo['queue-stalled-enabled']">
                        <template v-slot:append>
                          {{ $t('minutes') }}
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
              <v-card>
                <v-card-title v-text="$t('components.system_setting.part')"></v-card-title>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-checkbox v-model="$store.state.sessionInfo['rename-partial-files']" :label="$t('components.system_setting.append_part_to_incomplete_files')"></v-checkbox>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="5">
                      <v-checkbox v-model="$store.state.sessionInfo['incomplete-dir-enabled']" :label="$t('components.system_setting.keep_incomplete_files_in')"></v-checkbox>
                    </v-col>
                    <v-col cols="7">
                      <v-text-field label="" outlined v-model="$store.state.sessionInfo['incomplete-dir']"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="5">
                      <v-checkbox v-model="$store.state.sessionInfo['script-torrent-done-enabled']" :label="$t('components.system_setting.when_download_completes')" ></v-checkbox>
                    </v-col>
                    <v-col cols="7">
                      <v-text-field outlined v-model="$store.state.sessionInfo['script-torrent-done-filename']" :disabled="!$store.state.sessionInfo['script-torrent-done-enabled']">
                        <template v-slot:append>
                          <a href="https://github.com/ronggang/transmission-web-control/wiki/About-script-torrent-done-filename" target="_blank">Wiki</a>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card>
                <v-card-title v-text="$t('components.system_setting.limit')"></v-card-title>
                <v-container>
                  <v-row>
                    <v-col cols="6">
                      <v-checkbox v-model="$store.state.sessionInfo['seedRatioLimited']" :label="$t('components.system_setting.stop_seeding_at_ratio')"></v-checkbox>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field outlined type="number" v-model.number="$store.state.sessionInfo['seedRatioLimit']" :disabled="!$store.state.sessionInfo['seedRatioLimited']"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <v-checkbox v-model="$store.state.sessionInfo['idle-seeding-limit-enabled']" :label="$t('components.system_setting.stop_seeding_when_inactive_for')"></v-checkbox>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field outlined type="number" v-model.number="$store.state.sessionInfo['idle-seeding-limit']" :disabled="!$store.state.sessionInfo['idle-seeding-limit-enabled']">
                        <template v-slot:append>
                          {{ $t('minutes') }}
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card>
                <v-card-title v-text="$t('components.system_setting.encryption')"></v-card-title>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-select :items="[{text: $t('components.system_setting.required'), value:'required'},{text:$t('components.system_setting.preferred'), value:'preferred'},{text:$t('components.system_setting.tolerate'),value:'tolerate'}]"
                                outlined v-model="$store.state.sessionInfo['encryption']">
                      </v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
              <v-card>
                <v-card-title v-text="$t('components.system_setting.block_list')"></v-card-title>
                <v-container>
                  <v-row>
                    <v-col cols="5">
                      <v-checkbox v-model="$store.state.sessionInfo['blocklist-enabled']" :label="$t('components.system_setting.prevent_peers_in_block_list_from_connecting')"></v-checkbox>
                    </v-col>
                    <v-col cols="7">
                      <v-text-field outlined v-model="$store.state.sessionInfo['blocklist-url']" :disabled="!$store.state.sessionInfo['blocklist-enabled']"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row justify="center">
                    <v-col cols="12">
                      <span>{{ $t('components.system_setting.block_list_total_rules', [blockListSize]) }}
                        <v-btn color="secondary" :disabled="!$store.state.sessionInfo['blocklist-enabled']" @click="updateBlockList" v-text="$t('components.system_setting.update')"></v-btn>
                      </span>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card>
                <v-card-title v-text="$t('components.system_setting.peer_communication')"></v-card-title>
                <v-container>
                  <v-row>
                    <v-col cols="5">
                      <v-checkbox v-model="$store.state.sessionInfo['peer-port-random-on-start']" :label="$t('components.system_setting.randomize_port_on_launch')"></v-checkbox>
                    </v-col>
                    <v-col cols="7">
                      <v-text-field outlined type="number" :label="$t('components.system_setting.peer_listening_port')" v-model.number="$store.state.sessionInfo['peer-port']" :disabled="$store.state.sessionInfo['peer-port-random-on-start']" @blur="portTest">
                        <template v-slot:append-outer>
                          <font-awesome-icon size="xl" style="color: #f8cf06" v-if="portStatus === 'pending'" :icon="['fa', 'spinner']" :spin="true" />
                          <font-awesome-icon size="xl" style="color: #67C23A" v-if="portStatus === 'ok'" :icon="['fa', 'check']" />
                          <font-awesome-icon size="xl" style="color: #ff5252" v-if="portStatus === 'fail'" :icon="['fa', 'times']" />
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-checkbox v-model="$store.state.sessionInfo['port-forwarding-enabled']" :label="$t('components.system_setting.automatically_map_port')"></v-checkbox>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
              <v-card>
                <v-card-title v-text="$t('components.system_setting.connections')"></v-card-title>
                <v-container>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field outlined :label="$t('components.system_setting.global_maximum_connections')" type="number" v-model.number="$store.state.sessionInfo['peer-limit-global']"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field outlined :label="$t('components.system_setting.maximum_connections_for_new_transfers')" type="number" v-model.number="$store.state.sessionInfo['peer-limit-per-torrent']"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <v-checkbox v-model="$store.state.sessionInfo['utp-enabled']" :label="$t('components.system_setting.enable_micro_transport_protocol')"></v-checkbox>
                    </v-col>
                    <v-col cols="6">
                      <v-checkbox v-model="$store.state.sessionInfo['pex-enabled']" :label="$t('components.system_setting.use_peer_exchange_pex_for_public_torrents')"></v-checkbox>
                    </v-col>
                    <v-col cols="6">
                      <v-checkbox v-model="$store.state.sessionInfo['dht-enabled']" :label="$t('components.system_setting.use_distributed_hash_table_dht_for_public_torrents')"></v-checkbox>
                    </v-col>
                    <v-col cols="6">
                      <v-checkbox v-model="$store.state.sessionInfo['lpd-enabled']" :label="$t('components.system_setting.use_local_peer_discovery_for_public_torrents')"></v-checkbox>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
              <v-card>
                <v-card-title v-text="$t('components.system_setting.default_public_trackers')">
                </v-card-title>
                <v-textarea v-model="$store.state.sessionInfo['default-trackers']" :placeholder="$t('components.system_setting.default_public_trackers_info')">
                </v-textarea>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card>
                <v-card-title>ipinfo.io</v-card-title>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field label="Access Token" v-model="ipInfoToken" outlined>
                        <template v-slot:append>
                          <a href="https://ipinfo.io/" target="_blank"><font-awesome-icon size="1x" :icon="['fa', 'info-circle']"/></a>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="updated" v-text="$t('save')"></v-btn>
          <v-btn color="second" text @click="$emit('closed')" v-text="$t('close')"></v-btn>
        </v-card-actions>
      </v-card>
  </div>
</template>

<script>
  export default {
    name: 'SystemSetting',
    data() {
      return {
        timeBeginMenu: false,
        timeEndMenu: false,
        setTab: null,
        portStatus: 'none',
        checkbox: [],
        pathSizeByte: 0,
        blockListSize: 0
      }
    },
    computed: {
      ipInfoToken: {
        get() {
          let token = localStorage.getItem('ipInfoToken')
          return token === null ? '' : token
        },
        set(v) {
          localStorage.setItem('ipInfoToken', v)
        }
      },
      downloadDir: {
        get() {
          return this.$store.state.sessionInfo['download-dir']
        },
        set(v) {
          this.$store.state.sessionInfo['download-dir'] = v
          this.freeSpace()
        }
      },
      timeBegin: {
        get() {
          let h = Math.floor(this.$store.state.sessionInfo['alt-speed-time-begin'] / 60)
          let hours = h.toString()
          if (h <= 9) {
            hours = '0' + h.toString()
          }
          let m = this.$store.state.sessionInfo['alt-speed-time-begin'] - h * 60
          let minute = m.toString()
          if (m <= 0) {
            minute = '00'
          }
          if (m <= 9) {
            minute = '0' + m.toString()
          }
          return hours + ':' + minute
        },
        set(v) {
          let split = v.split(':', 2)
          let h = Number.parseInt(split[0]) * 60
          let m = Number.parseInt(split[1])
          this.$store.state.sessionInfo['alt-speed-time-begin'] = h + m
        }
      },
      timeEnd: {
        get() {
          let h = Math.floor(this.$store.state.sessionInfo['alt-speed-time-end'] / 60)
          let hours = h.toString()
          if (h <= 9) {
            hours = '0' + h.toString()
          }
          let m = this.$store.state.sessionInfo['alt-speed-time-end'] - h * 60
          let minute = m.toString()
          if (m <= 0) {
            minute = '00'
          }
          if (m <= 9) {
            minute = '0' + m.toString()
          }
          return hours + ':' + minute
        },
        set(v) {
          let split = v.split(':', 2)
          let h = Number.parseInt(split[0]) * 60
          let m = Number.parseInt(split[1])
          this.$store.state.sessionInfo['alt-speed-time-end'] = h + m
        }
      },
      saturday: {
        get() {
          let saturday = this.$store.state.sessionInfo['alt-speed-time-day'].toString(2).split('')
          let len = 7 - saturday.length
          for (let i = 0; i < len; i++) {
            saturday.unshift('0')
          }
          return saturday[0] === '1'
        },
        set(v) {
          let day = this.$store.state.sessionInfo['alt-speed-time-day'].toString(2).split('')
          let len = 7 - day.length
          for (let i = 0; i < len; i++) {
            day.unshift('0')
          }
          day[0] = v ? '1' : '0'
          this.$store.state.sessionInfo['alt-speed-time-day'] = Number.parseInt(day.join(''),2)
        }
      },
      friday: {
        get() {
          let friday = this.$store.state.sessionInfo['alt-speed-time-day'].toString(2).split('')
          let len = 7 - friday.length
          for (let i = 0; i < len; i++) {
            friday.unshift('0')
          }
          return friday[1] === '1'
        },
        set(v) {
          let day = this.$store.state.sessionInfo['alt-speed-time-day'].toString(2).split('')
          let len = 7 - day.length
          for (let i = 0; i < len; i++) {
            day.unshift('0')
          }
          day[1] = v ? '1' : '0'
          this.$store.state.sessionInfo['alt-speed-time-day'] = Number.parseInt(day.join(''),2)
        }
      },
      thursday: {
        get() {
          let friday = this.$store.state.sessionInfo['alt-speed-time-day'].toString(2).split('')
          let len = 7 - friday.length
          for (let i = 0; i < len; i++) {
            friday.unshift('0')
          }
          return friday[2] === '1'
        },
        set(v) {
          let day = this.$store.state.sessionInfo['alt-speed-time-day'].toString(2).split('')
          let len = 7 - day.length
          for (let i = 0; i < len; i++) {
            day.unshift('0')
          }
          day[2] = v ? '1' : '0'
          this.$store.state.sessionInfo['alt-speed-time-day'] = Number.parseInt(day.join(''),2)
        }
      },
      wednesday: {
        get() {
          let friday = this.$store.state.sessionInfo['alt-speed-time-day'].toString(2).split('')
          let len = 7 - friday.length
          for (let i = 0; i < len; i++) {
            friday.unshift('0')
          }
          return friday[3] === '1'
        },
        set(v) {
          let day = this.$store.state.sessionInfo['alt-speed-time-day'].toString(2).split('')
          let len = 7 - day.length
          for (let i = 0; i < len; i++) {
            day.unshift('0')
          }
          day[3] = v ? '1' : '0'
          this.$store.state.sessionInfo['alt-speed-time-day'] = Number.parseInt(day.join(''),2)
        }
      },
      tuesday: {
        get() {
          let tuesday = this.$store.state.sessionInfo['alt-speed-time-day'].toString(2).split('')
          let len = 7 - tuesday.length
          for (let i = 0; i < len; i++) {
            tuesday.unshift('0')
          }
          return tuesday[4] === '1'
        },
        set(v) {
          let day = this.$store.state.sessionInfo['alt-speed-time-day'].toString(2).split('')
          let len = 7 - day.length
          for (let i = 0; i < len; i++) {
            day.unshift('0')
          }
          day[4] = v ? '1' : '0'
          this.$store.state.sessionInfo['alt-speed-time-day'] = Number.parseInt(day.join(''),2)
        }
      },
      monday: {
        get() {
          let monday = this.$store.state.sessionInfo['alt-speed-time-day'].toString(2).split('')
          let len = 7 - monday.length
          for (let i = 0; i < len; i++) {
            monday.unshift('0')
          }
          return monday[5] === '1'
        },
        set(v) {
          let day = this.$store.state.sessionInfo['alt-speed-time-day'].toString(2).split('')
          let len = 7 - day.length
          for (let i = 0; i < len; i++) {
            day.unshift('0')
          }
          day[5] = v ? '1' : '0'
          this.$store.state.sessionInfo['alt-speed-time-day'] = Number.parseInt(day.join(''),2)
        }
      },
      sunday: {
        get() {
          let monday = this.$store.state.sessionInfo['alt-speed-time-day'].toString(2).split('')
          let len = 7 - monday.length
          for (let i = 0; i < len; i++) {
            monday.unshift('0')
          }
          return monday[6] === '1'
        },
        set(v) {
          let day = this.$store.state.sessionInfo['alt-speed-time-day'].toString(2).split('')
          let len = 7 - day.length
          for (let i = 0; i < len; i++) {
            day.unshift('0')
          }
          day[6] = v ? '1' : '0'
          this.$store.state.sessionInfo['alt-speed-time-day'] = Number.parseInt(day.join(''),2)
        }
      },

    },
    mounted() {
      this.$store.commit('getSessionInfo')
      this.portTest()
      this.freeSpace()
    },
    methods: {
      updated() {
        this.$store.commit('updateSessionSet')
        this.$emit('closed')
      },
      portTest() {
        this.portStatus = 'pending'
        this.$axios.post('',
            {
              method: 'port-test',
              arguments: {}
            }).then(r => {
          if (r.data.result === 'success') {
            this.portStatus = r.data.arguments['port-is-open'] ? 'ok' : 'fail'
          }
        })
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
      updateBlockList() {
        this.$axios.post('', {
          method: 'blocklist-update',
        }).then(r => {
          if (r.data.result === 'success') {
            this.blockListSize = r.data.arguments['blocklist-size']
            return
          }
          this.$store.commit('showMessage',{ title: r.data.result, type: 'error'})
        })
      }
    }
  }
</script>

<style scoped>

</style>
