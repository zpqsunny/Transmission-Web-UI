<template>
  <div>
    <v-simple-table dense>
      <template v-slot:default>
        <thead>
        <tr>
          <th colspan="4" class="text-center"><v-btn text color="primary" @click="getTorrentBaseInfo" v-text="$t('components.torrent_information.base_info')"></v-btn></th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td class="text-no-wrap" v-text="$t('components.torrent_information.name')"></td>
          <td colspan="3">{{ baseInfo.name }}</td>
        </tr>
        <tr>
          <td class="text-no-wrap" v-text="$t('components.torrent_information.download_dir')"></td>
          <td colspan="3">{{ baseInfo.downloadDir }}</td>
        </tr>
        <tr>
          <td class="text-no-wrap" v-text="$t('components.torrent_information.hash_string')"></td>
          <td colspan="3">{{ baseInfo.hashString }}</td>
        </tr>
        <tr>
          <td class="text-no-wrap" v-text="$t('components.torrent_information.total_size')"></td>
          <td>{{ baseInfo.totalSize | unitFormat }}</td>
          <td class="text-no-wrap" v-text="$t('components.torrent_information.added_date')"></td>
          <td>{{ baseInfo.addedDate | timestampFormat}}</td>
        </tr>
        <tr>
          <td class="text-no-wrap" v-text="$t('components.torrent_information.left_until_done')"></td>
          <td>{{ baseInfo.leftUntilDone | unitFormat}}</td>
          <td class="text-no-wrap" v-text="$t('components.torrent_information.downloaded_ever')"></td>
          <td>{{ baseInfo.downloadedEver | unitFormat}}</td>
        </tr>
        <tr>
          <td class="text-no-wrap" v-text="$t('components.torrent_information.rate_download')"></td>
          <td>{{ baseInfo.rateDownload | unitFormat }}</td>
          <td class="text-no-wrap" v-text="$t('components.torrent_information.rate_upload')"></td>
          <td>{{ baseInfo.rateUpload | unitFormat }}</td>
        </tr>
        <tr>
          <td class="text-no-wrap" v-text="$t('components.torrent_information.creator')"></td>
          <td>{{ baseInfo.creator }}</td>
          <td class="text-no-wrap" v-text="$t('components.torrent_information.date_created')"></td>
          <td>{{ baseInfo.dateCreated | timestampFormat }}</td>
        </tr>
        <tr>
          <td class="text-no-wrap" v-text="$t('components.torrent_information.comment')"></td>
          <td colspan="3">{{ baseInfo.comment }}</td>
        </tr>
        <tr>
          <td class="text-no-wrap" v-text="$t('components.torrent_information.is_private')"></td>
          <td>{{ baseInfo.isPrivate ? $t('yes') : $t('no') }}</td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td class="text-no-wrap" v-text="$t('components.torrent_information.magnet_link')"></td>
          <td colspan="3">
            <v-textarea rows="3" readonly style="word-break: break-all;" :value="baseInfo.magnetLink"></v-textarea>
          </td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
    <div>
      <template v-for="(item, index) in cells">
        <i :key="index" :style="{filter: 'saturate('+ item.ramp +')'}" :title="item.cellSize + ' X ' +item.percent + '%'" style="height: 10px;width: 10px;display: inline-block;background-color: #00C853;margin: 2px"></i>
      </template>
    </div>
  </div>
</template>

<script>
import {Base64} from 'js-base64'

export default {
  name: 'TorrentInformation',
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      cells: [],
      baseInfo: {
        name: '',
        isStalled: false,
        isPrivate: false,
        hashString: '',
        magnetLink: '',
        downloadDir: '',
        pieceCount: 0,
        pieceSize: 0,
        haveUnchecked: 0,
        comment: '',
        dateCreated: '',
        creator: '',
        leftUntilDone: 0,
        downloadedEver: 0,
        addedDate: 0,
        totalSize: 0,
        rateDownload: 0,
        rateUpload: 0,
      },
    }
  },
  mounted() {
    this.getTorrentBaseInfo()
  },
  methods: {
    getTorrentBaseInfo() {
      this.$axios.post('', {
        method: 'torrent-get',
        arguments: {
          ids: [this.id],
          fields: ['name','isStalled', 'isPrivate', 'hashString', 'magnetLink', 'pieces', 'pieceCount', 'pieceSize', 'downloadDir',
            'haveUnchecked', 'comment', 'dateCreated', 'creator', 'leftUntilDone', 'addedDate', 'totalSize', 'rateDownload',
            'rateUpload', 'downloadedEver'
          ]
        }
      }).then(r => {
        if (r.data.result !== 'success') {
          return
        }
        if (r.data.arguments.torrents.length < 1) {
          return
        }
        //info
        let torrent = r.data.arguments.torrents[0]
        this.baseInfo.name = torrent.name
        this.baseInfo.isStalled = torrent.isStalled
        this.baseInfo.isPrivate = torrent.isPrivate
        this.baseInfo.hashString = torrent.hashString
        this.baseInfo.magnetLink = torrent.magnetLink
        this.baseInfo.pieceCount = torrent.pieceCount
        this.baseInfo.pieceSize = torrent.pieceSize
        this.baseInfo.downloadDir = torrent.downloadDir
        this.baseInfo.haveUnchecked = torrent.haveUnchecked
        this.baseInfo.comment = torrent.comment
        this.baseInfo.dateCreated = torrent.dateCreated
        this.baseInfo.creator = torrent.creator
        this.baseInfo.leftUntilDone = torrent.leftUntilDone
        this.baseInfo.addedDate = torrent.addedDate
        this.baseInfo.totalSize = torrent.totalSize
        this.baseInfo.rateDownload = torrent.rateDownload
        this.baseInfo.rateUpload = torrent.rateUpload
        this.baseInfo.downloadedEver = torrent.downloadedEver
        this.peersFrom = torrent.peersFrom
        let pieces = Base64.decode(torrent.pieces)
        let piece = 0
        let pieceCount = torrent.pieceCount;
        let pieceSize = torrent.pieceSize;
        let piecesFlag = []; //inverted
        while (piece < pieceCount) {
          let bset = pieces.codePointAt(piece >> 3);
          for (let test = 0x80; test > 0 && piece < pieceCount; test = test >> 1, ++piece) {
            piecesFlag.push((!(bset & test)));
          }
        }
        let maxCells = 500;
        let piecePerCell = ((maxCells - 1 + pieceCount) / maxCells).toFixed(0)
        let cellSize = this.format(pieceSize * piecePerCell)
        let cellCount = ((piecePerCell - 1 + pieceCount) / piecePerCell).toFixed(0)
        let cells = []
        for (let cell = 0, piece = 0; cell < cellCount; ++ cell) {
          let done = piecePerCell
          for (let i=0; i<piecePerCell; ++i,++piece) {
            if (piecesFlag[piece]) --done
          }
          let percent = (done * 100 / piecePerCell).toFixed(0)
          let rate = percent / 100
          let ramp = ((Math.pow(128, rate) - 1) * 100 / 127).toFixed(0) / 100
          cells.push({
            ramp: ramp,
            cellSize: cellSize,
            percent: percent
          })
        }
        this.cells = cells
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
    },
  }
}
</script>

<style scoped>

</style>
