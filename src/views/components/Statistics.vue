<template>
  <div>
    <div class="d-flex justify-start align-center" style="height: 30px">
      <div class="text-center w-50">
        <small class="up-color"><font-awesome-icon class="up-color" :icon="['fa', 'sort-up']"/>&nbsp;<b>{{ sessionStatistics.uploadSpeed | unitFormat }} /s</b></small>
      </div>
      <div class="text-center w-50">
        <small class="down-color"><font-awesome-icon class="down-color" :icon="['fa', 'sort-down']"/>&nbsp;<b>{{ sessionStatistics.downloadSpeed | unitFormat }} /s</b></small>
      </div>
    </div>
    <div style="height: 300px" ref="chart"></div>
  </div>
</template>

<script>
const echarts = require('echarts')

export default {
  name: 'Statistics',
  data() {
    return {
      sessionStatistics: {
        activeTorrentCount: 0,
        downloadSpeed: 0,
        pausedTorrentCount: 0,
        torrentCount: 0,
        uploadSpeed: 0,
        "cumulative-stats": {
          uploadedBytes: 0,
          downloadedBytes: 0,
          filesAdded: 0,
          sessionCount: 0,
          secondsActive: 0,
        },
        "current-stats": {
          uploadedBytes: 0,
          downloadedBytes: 0,
          filesAdded: 0,
          sessionCount: 0,
          secondsActive: 0,
        }
      },
      intervalId: null,
      myChart: null,
      chart: {
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            let upload = params[0].value
            let download = params[1].value
            return upload[0] + '<br/>'+ this.$t('components.statistics.upload_speed') + this.format(upload[1]) + '<br/>'+ this.$t('components.statistics.download_speed') + this.format(download[1])
          },
          axisPointer: {
            animation: false
          }
        },
        legend: {
          data: [
            {
              name: this.$t('components.statistics.upload_speed'),
              textStyle: {
                color: '#67C23A'
              }
            },
            {
              name: this.$t('components.statistics.download_speed'),
              textStyle: {
                color: '#409EFF'
              }
            }
          ]
        },
        grid: {
          left: '2%',
          right: '2%',
        },
        xAxis: {
          type: 'category',
          splitLine: {
            show: false
          },
          show: false
        },
        yAxis: {
          type: 'value',
          max: (value => {
            return value.max * 0.1 + value.max
          }),
          boundaryGap: [0, '100%'],
          splitLine: {
            show: false
          },
          show: false
        },
        series: [
          {
            name: this.$t('components.statistics.upload_speed'),
            type: 'line',
            showSymbol: false,
            lineStyle: {
              color: '#67C23A',
              width: 3
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(103, 194, 58)'
              }, {
                offset: 1,
                color: 'rgba(200, 230, 201)'
              }])
            },
            smooth: true,
            data: [],
          },
          {
            name: this.$t('components.statistics.download_speed'),
            type: 'line',
            showSymbol: false,
            lineStyle: {
              color: '#409EFF',
              width: 3
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(64, 158, 255)'
              }, {
                offset: 1,
                color: 'rgba(187, 222, 251)'
              }])
            },
            smooth: true,
            data: [],
          },
        ],
      },
    }
  },
  mounted() {
    this.myChart = echarts.init(this.$refs['chart'])
    this.intervalId = setInterval(() => {
      this.getStatistics()
    }, 2000)
    window.onresize = () => {
      this.myChart.resize()
    }
  },
  beforeDestroy() {
    clearInterval(this.intervalId)
  },
  methods: {
    getStatistics() {
      let date = new Date()
      this.$axios.post('', {method: 'session-stats'})
        .then(r => {
          if (r.data.result !== 'success') {
            return
          }
          this.sessionStatistics = r.data.arguments
          let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
          let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
          let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
          this.chart.series[0].data.push({
            name: date.toString(),
            value: [ [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-') + ' ' +  [hours, minutes, seconds].join(':'), this.sessionStatistics.uploadSpeed]
          })
          this.chart.series[1].data.push({
            name: date.toString(),
            value: [ [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-') + ' ' +  [hours, minutes, seconds].join(':'), this.sessionStatistics.downloadSpeed]
          })
          if (this.chart.series[0].data.length > 20) {
            this.chart.series[0].data.shift()
            this.chart.series[1].data.shift()
          }
          this.myChart.setOption(this.chart)
          this.setTitle(this.format(this.sessionStatistics.uploadSpeed), this.format(this.sessionStatistics.downloadSpeed))
        })
    },
    format(value) {
      if (value === undefined || value === 0) {
        return '0 B'
      }
      if (value < 1024) {
        return value + ' B'
      }
      let a = value / 1024
      let unit
      if (a < 1024) {
        unit = ' KB'
      } else if (a < 1024 * 1024) {
        a = a / 1024
        unit = ' MB'
      } else if (a < 1024 * 1024 * 1024){
        a = a / 1024 / 1024
        unit = ' GB'
      } else {
        a = a / 1024 / 1024 / 1024
        unit = ' TB'
      }
      let v = a.toString().split('.', 2)
      if (v.length >= 2 && v[1].length >= 2) {
        return v[0] + '.' + v[1].substring(0, 2) + unit
      }
      return a + unit
    },

    setTitle(upload, download) {
      document.title = `🔺 ${upload}\u00a0\u00a0🔻 ${download}`
    }
  }
}
</script>
