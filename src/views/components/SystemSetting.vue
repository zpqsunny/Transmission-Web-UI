<template>
  <div>
    <!--  设置对话框    -->
      <v-card>
        <v-card-title class="headline grey lighten-2 justify-center">
          <strong>设置</strong>
        </v-card-title>
        <v-card-text>
          <v-tabs v-model="setTab">
            <v-tab>速度</v-tab>
            <v-tab>下载</v-tab>
            <v-tab>做种</v-tab>
            <v-tab>隐私</v-tab>
            <v-tab>网络</v-tab>
          </v-tabs>
          <v-tabs-items v-model="setTab">
            <v-tab-item>
              <v-card>
                <v-card-title>速度限制</v-card-title>
                <v-container>
                  <v-row>
                    <v-col cols="2">
                      <v-checkbox v-model="$store.state.sessionInfo['speed-limit-up-enabled']" label="上传"></v-checkbox>
                    </v-col>
                    <v-col cols="10">
                      <v-text-field outlined type="number" v-model.number="$store.state.sessionInfo['speed-limit-up']" :disabled="!$store.state.sessionInfo['speed-limit-up-enabled']">
                        <template v-slot:append>
                          kB/s
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2">
                      <v-checkbox v-model="$store.state.sessionInfo['speed-limit-down-enabled']" label="下载"></v-checkbox>
                    </v-col>
                    <v-col cols="10">
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
                <v-card-title><font-awesome-icon :icon="['fa', 'running']" />备用速度限制</v-card-title>
                <v-card-subtitle>手动或者定时覆盖普通速度限制</v-card-subtitle>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field outlined type="number" v-model.number="$store.state.sessionInfo['alt-speed-up']" label="上传">
                        <template v-slot:append>
                          kB/s
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field outlined type="number" v-model.number="$store.state.sessionInfo['alt-speed-down']" label="下载">
                        <template v-slot:append>
                          kB/s
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2">
                      <v-checkbox label="定时" v-model="$store.state.sessionInfo['alt-speed-time-enabled']"></v-checkbox>
                    </v-col>
                    <v-col cols="5">
                      <v-menu ref="timeBegin" v-model="timeBeginMenu" :close-on-content-click="false" :nudge-right="40" :return-value.sync="timeBegin"
                              transition="scale-transition" offset-y max-width="300px" min-width="300px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field :disabled="!$store.state.sessionInfo['alt-speed-time-enabled']" v-model="timeBegin" label="开始时间" prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                        </template>
                        <v-time-picker v-if="timeBeginMenu" v-model="timeBegin" full-width @click:minute="$refs['timeBegin'].save(timeBegin)"></v-time-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="5">
                      <v-menu ref="timeEnd" v-model="timeEndMenu" :close-on-content-click="false" :nudge-right="40" :return-value.sync="timeEnd"
                              transition="scale-transition" offset-y max-width="300px" min-width="300px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field :disabled="!$store.state.sessionInfo['alt-speed-time-enabled']" v-model="timeEnd" label="结束时间" prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                        </template>
                        <v-time-picker v-if="timeEndMenu" v-model="timeEnd" full-width @click:minute="$refs['timeEnd'].save(timeEnd)"></v-time-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <div class="d-flex justify-space-between">
                        <v-checkbox label="星期日" :disabled="!$store.state.sessionInfo['alt-speed-time-enabled']" v-model="sunday"></v-checkbox>
                        <v-checkbox label="星期一" :disabled="!$store.state.sessionInfo['alt-speed-time-enabled']" v-model="monday"></v-checkbox>
                        <v-checkbox label="星期二" :disabled="!$store.state.sessionInfo['alt-speed-time-enabled']" v-model="tuesday"></v-checkbox>
                        <v-checkbox label="星期三" :disabled="!$store.state.sessionInfo['alt-speed-time-enabled']" v-model="wednesday"></v-checkbox>
                        <v-checkbox label="星期四" :disabled="!$store.state.sessionInfo['alt-speed-time-enabled']" v-model="thursday"></v-checkbox>
                        <v-checkbox label="星期五" :disabled="!$store.state.sessionInfo['alt-speed-time-enabled']" v-model="friday"></v-checkbox>
                        <v-checkbox label="星期六" :disabled="!$store.state.sessionInfo['alt-speed-time-enabled']" v-model="saturday"></v-checkbox>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card>
                <v-card-title>添加</v-card-title>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-checkbox label="添加 Torrent 后开始" v-model.number="$store.state.sessionInfo['start-added-torrents']"></v-checkbox>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-checkbox label="将 .torrent 文件移至回收站" v-model.number="$store.state.sessionInfo['trash-original-torrent-files']"></v-checkbox>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field outlined v-model="downloadDir" label="保存的位置">
                        <template v-slot:append v-if="pathSizeByte > 0">
                          {{ pathSizeByte | unitFormat }} 可用
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
              <v-card>
                <v-card-title>下载队列</v-card-title>
                <v-container>
                  <v-row>
                    <v-col cols="6">
                      <v-checkbox v-model="$store.state.sessionInfo['download-queue-enabled']" label="最大活动下载数"></v-checkbox>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field outlined type="number" v-model.number="$store.state.sessionInfo['download-queue-size']" :disabled="!$store.state.sessionInfo['download-queue-enabled']"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <v-checkbox v-model="$store.state.sessionInfo['queue-stalled-enabled']" label="下载是属于非活动的如果停止分享数据在"></v-checkbox>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field outlined type="number" v-model.number="$store.state.sessionInfo['queue-stalled-minutes']" :disabled="!$store.state.sessionInfo['queue-stalled-enabled']">
                        <template v-slot:append>
                          分钟之前
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
              <v-card>
                <v-card-title>未完成</v-card-title>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-checkbox v-model="$store.state.sessionInfo['rename-partial-files']" label="在未完成文件附加“.part”扩展名"></v-checkbox>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="3">
                      <v-checkbox v-model="$store.state.sessionInfo['incomplete-dir-enabled']" label="保存未完成文件到"></v-checkbox>
                    </v-col>
                    <v-col cols="9">
                      <v-text-field label="" outlined v-model="$store.state.sessionInfo['incomplete-dir']"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4">
                      <v-checkbox v-model="$store.state.sessionInfo['script-torrent-done-enabled']" label="当 Torrent 完成时调用脚本：" ></v-checkbox>
                    </v-col>
                    <v-col cols="8">
                      <v-text-field outlined v-model="$store.state.sessionInfo['script-torrent-done-filename']" :disabled="!$store.state.sessionInfo['script-torrent-done-enabled']">
                        <template v-slot:prepend-inner>
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
                <v-card-title>限制</v-card-title>
                <v-container>
                  <v-row>
                    <v-col cols="4">
                      <v-checkbox v-model="$store.state.sessionInfo['seedRatioLimited']" label="停止做种当分享率达到"></v-checkbox>
                    </v-col>
                    <v-col cols="8">
                      <v-text-field outlined type="number" v-model.number="$store.state.sessionInfo['seedRatioLimit']" :disabled="!$store.state.sessionInfo['seedRatioLimited']"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4">
                      <v-checkbox v-model="$store.state.sessionInfo['idle-seeding-limit-enabled']" label="停止做种当空闲达到"></v-checkbox>
                    </v-col>
                    <v-col cols="8">
                      <v-text-field outlined type="number" v-model.number="$store.state.sessionInfo['idle-seeding-limit']" :disabled="!$store.state.sessionInfo['idle-seeding-limit-enabled']">
                        <template v-slot:append>
                          分钟
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card>
                <v-card-title>加密</v-card-title>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-select :items="[{text:'要求加密',value:'required'},{text:'优先加密',value:'preferred'},{text:'允许加密',value:'tolerate'}]"
                                label="加密模式" outlined v-model="$store.state.sessionInfo['encryption']">
                      </v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
              <v-card>
                <v-card-title>黑名单</v-card-title>
                <v-container>
                  <v-row>
                    <v-col cols="3">
                      <v-checkbox v-model="$store.state.sessionInfo['blocklist-enabled']" label="启用黑名单"></v-checkbox>
                    </v-col>
                    <v-col cols="9">
                      <v-text-field outlined v-model="$store.state.sessionInfo['blocklist-url']" :disabled="!$store.state.sessionInfo['blocklist-enabled']"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row justify="center">
                    <v-col cols="12">
                      <span>黑名单包含 {{ blockListSize }} 条规则
                        <v-btn color="secondary" :disabled="!$store.state.sessionInfo['blocklist-enabled']" @click="updateBlockList">更新</v-btn>
                      </span>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card>
                <v-card-title>入站的用户</v-card-title>
                <v-container>
                  <v-row>
                    <v-col cols="4">
                      <v-checkbox v-model="$store.state.sessionInfo['peer-port-random-on-start']" label="每次启动时随机选择端口"></v-checkbox>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field outlined type="number" label="入站连接的端口" v-model.number="$store.state.sessionInfo['peer-port']" :disabled="$store.state.sessionInfo['peer-port-random-on-start']">
                        <template v-slot:append>
                          {{ portIsOpen }}
                        </template>
                      </v-text-field>
                    </v-col>
                    <v-col cols="2">
                      <v-btn text @click="portTest">测试端口</v-btn>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-checkbox v-model="$store.state.sessionInfo['port-forwarding-enabled']" label="启用端口转发"></v-checkbox>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
              <v-card>
                <v-card-title>用户限制</v-card-title>
                <v-container>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field outlined label="全体最大用户数量" type="number" v-model.number="$store.state.sessionInfo['peer-limit-global']"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field outlined label="每个 Torrent 的最大用户数量" type="number" v-model.number="$store.state.sessionInfo['peer-limit-per-torrent']"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
              <v-card>
                <v-card-title>选项</v-card-title>
                <v-container>
                  <v-row>
                    <v-col cols="6">
                      <v-checkbox v-model="$store.state.sessionInfo['utp-enabled']" label="为用户连接启用 µTP"></v-checkbox>
                    </v-col>
                    <v-col cols="6">
                      <v-checkbox v-model="$store.state.sessionInfo['pex-enabled']" label="使用 PEX 以寻找更多用户"></v-checkbox>
                    </v-col>
                    <v-col cols="6">
                      <v-checkbox v-model="$store.state.sessionInfo['dht-enabled']" label="使用 DHT 以寻找更多用户"></v-checkbox>
                    </v-col>
                    <v-col cols="6">
                      <v-checkbox v-model="$store.state.sessionInfo['lpd-enabled']" label="使用本地用户发现已寻找更多用户"></v-checkbox>
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
          <v-btn color="primary" text @click="updated">
            保 存
          </v-btn>
          <v-btn color="second" text @click="$emit('closed')">
            关 闭
          </v-btn>
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
        portIsOpen: '状态未知',
        checkbox: [],
        pathSizeByte: 0,
        blockListSize: 0
      }
    },
    computed: {
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
        this.portIsOpen = '正在测试TCP端口...'
        this.$axios.post('',
            {
              method: 'port-test',
              arguments: {}
            }).then(r => {
          if (r.data.result === 'success') {
            this.portIsOpen = r.data.arguments['port-is-open'] ? '端口是开启的' : '端口是关闭的'
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
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
