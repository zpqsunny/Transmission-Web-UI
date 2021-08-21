<template>
  <div>
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
            return upload[0] + '<br/>上传速度: ' + this.format(upload[1]) + '<br/>下载速度: ' + this.format(download[1]) + ''
          },
          axisPointer: {
            animation: false
          }
        },
        legend: {
          data: [
            {
              name: '上传速度',
              textStyle: {
                color: '#67C23A'
              }
            },
            {
              name: '下载速度',
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
          type: 'time',
          splitLine: {
            show: false
          },
          show: false
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          splitLine: {
            show: false
          },
          show: false
        },
        series: [
          {
            name: '上传速度',
            type: 'line',
            showSymbol: false,
            lineStyle: {
              color: '#67C23A',
              width: 5
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
            data: [],
          },
          {
            name: '下载速度',
            type: 'line',
            showSymbol: false,
            lineStyle: {
              color: '#409EFF',
              width: 5
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
          if (r.data.result === 'success') {
            this.sessionStatistics = r.data.arguments
            let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
            let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
            let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
            this.chart.series[0].data.push({
              name: date.toString(),
              value: [ [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('/') + ' ' +  [hours, minutes, seconds].join(':'), this.sessionStatistics.uploadSpeed]
            })
            this.chart.series[1].data.push({
              name: date.toString(),
              value: [ [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('/') + ' ' +  [hours, minutes, seconds].join(':'), this.sessionStatistics.downloadSpeed]
            })
            if (this.chart.series[0].data.length > 40) {
              this.chart.series[0].data.shift()
              this.chart.series[1].data.shift()
            }
            this.myChart.setOption(this.chart)
          }
        })
    },
    format(value) {
      if (value === undefined || value === 0) {
        return ''
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
    }
  }
}
</script>
