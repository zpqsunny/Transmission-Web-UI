import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n)

const messages = {
  en: {
    sure: 'Sure',
    close: 'Close',
    cancel: 'Cancel',
    save: 'Save',
    flush: 'Flush',
    yes: 'Yes',
    no: 'No',
    no_data_text: 'No Data',
    no_results_text: 'No Results',
    ago: ' Ago',
    later: ' Later',
    years: ' Years',
    months: ' Months',
    weeks: ' Weeks',
    days: ' Days',
    hours: ' Hours',
    minutes: ' Minutes',
    seconds: ' Seconds',
    components: {
      add_torrent: {
        'add_torrent': 'Add Torrent',
        'can_used': 'Available',
        'save_path': 'Save Location',
        'torrent_file': 'Torrent File',
        'magnet_url': 'Magnet Url',
        'auto_start': 'Start Automatically'
      },
      add_trackers: {
        'add_trackers': 'Add Trackers',
        'tracker_address': 'Tracker Address',
        'trackers': 'Trackers',
      },
      files_information: {
        'download_selected_files': 'Download Selected Files',
        'ignore_selected_files': 'Ignore selected files',
        'set_priority': 'Set Priority',
        'priority_high': 'high',
        'priority_normal': 'normal',
        'priority_low': 'low',
        'priority': 'Priority ',
      },
      peers_information: {
        'country': 'Country',
        'region': 'Region',
        'city': 'City',
        'downloading_from': 'Downloading',
        'encrypted': 'encrypt',
        'incoming': 'InComing',
        'uploading_to': 'Uploading',
        'ip_address': 'IP',
        'client_name': 'Client Name',
        'flag': 'Flag',
        'connect_info': 'Connect Info',
        'port': 'Port',
        'progress': 'Progress',
        'upload_download_speed': 'Upload/Download Speed',
      },
      statistics: {
        'upload_speed': 'Upload Speed ',
        'download_speed': 'Download speed ',
      },
      system_setting: {
        'setting': 'Setting',
        'speed': 'Speed',
        'bandwidth': 'Bandwidth',
        'upload': 'Upload',
        'privacy': 'Privacy',
        'network': 'Network',
        'other': 'Other',
        'global_bandwidth_limits': 'Global Bandwidth Limits',
        'upload_rate': 'Upload rate',
        'download_rate': 'Download rate',
        'speed_limit_mode': 'Speed Limit Mode',
        'when_enabled_speed_limit_overwrite_the_global_bandwidth_limits': 'When enabled Speed Limit overwrite the global bandwidth limits',
        'schedule_speed_limit': 'Schedule Speed Limit',
        'time_begin':'Time begin',
        'time_end':'Time end',
        'sun': 'Sun',
        'mon': 'Mon',
        'tue': 'Tue',
        'wed': 'Wed',
        'thur': 'Thur',
        'fri': 'Fri',
        'sat': 'Sat',
        'adding': 'Adding',
        'start_transfers_when_added': 'Start transfers when added',
        'trash_original_torrent_files': 'Trash original torrent files',
        'default_location': 'Default location',
        'available': 'Available',
        'queues': 'Queues',
        'download_with_maximum_of': 'Download with maximum of',
        'transfer_is_stalled_when_inactive_for': 'Transfer is stalled when inactive for',
        'append_part_to_incomplete_files': 'Append part to incomplete files',
        'keep_incomplete_files_in': 'Keep incomplete files in',
        'when_download_completes': 'When download completes',
        'limit': 'Limit',
        'stop_seeding_at_ratio': 'Stop seeding at ratio',
        'stop_seeding_when_inactive_for': 'Stop seeding when inactive for',
        'encryption': 'Encryption',
        'required': 'Required',
        'preferred': 'Preferred',
        'tolerate': 'Tolerate',
        'block_list': 'Block list',
        'prevent_peers_in_block_list_from_connecting': 'Prevent peers in block list from connecting',
        'update': 'Update',
        'peer_communication': 'Peer communication',
        'randomize_port_on_launch': 'Randomize port on launch',
        'peer_listening_port': 'Peer listening port',
        'port_check_site_is_down': '',
        'automatically_map_port': 'Automatically map port',
        'global_maximum_connections': 'Global maximum connections',
        'maximum_connections_for_new_transfers': 'Maximum connections for new transfers',
        'connections': 'Connections',
        'enable_micro_transport_protocol': 'Enable micro transport protocol (µTP)',
        'use_peer_exchange_pex_for_public_torrents': 'Use peer exchange (PEX) for public torrents',
        'use_distributed_hash_table_dht_for_public_torrents': 'Use distributed hash table (DHT) for public torrents',
        'use_local_peer_discovery_for_public_torrents': 'Use local peer discovery for public torrents',
      },
      torrent_information: {
        'base_info': 'Information',
        'name': 'Name',
        'download_dir': 'Download Dir',
        'hash_string': 'Hash',
        'total_size': 'Total Size',
        'added_date': 'Added Date',
        'left_until_done': 'Remaining',
        'downloaded_ever': 'Downloaded',
        'rate_download': 'Download Speed',
        'rate_upload': 'Upload Speed',
        'creator': 'Creator',
        'date_created': 'Created Date',
        'comment': 'Comment',
        'is_private': 'Is Private',
        'magnet_link': 'Magnet Link',
      },
      torrents: {
        'parse': 'Parse',
        'waiting_check': 'Wait Check',
        'checking': 'Checking',
        'waiting_download': 'Wait Download',
        'downloading': 'Downloading',
        'wait_upload': 'Wait Upload',
        'uploading': 'Uploading',
        'retrieving_metadata': 'Retrieving Metadata',
        'remaining': 'Remaining',
        'rename': 'Rename',
        'copy_path': 'Copy Path',
        'name': 'Name',
        'queue_position': 'Index',
        'status': 'Status',
        'total_size': 'Total Size',
        'percent_done': 'Progress',
        'added_date': 'Added Date',
        'upload_download_speed': 'Upload/Download Speed',
        'upload_ratio': 'Ratio',
        'ready_upload_download': 'Uploaded/Downloaded',
        'done_date': 'Done Date',
        'activity_date': 'Activity Date',
      },
      torrent_setting: {
        'when': '当种子的分享率达到这个数时，自动停止做种'
      },
      trackers_information: {
        'add_new_trackers': 'Add New Tracker',
        'remove_selected_trackers': 'Delete Selected Trackers',
        'replace_tracker': 'Replace Tracker',
        'announce': 'Server',
        'status': 'Status',
        'info': 'Info',
        'download_count': 'Download Count',
        'leecher_count': 'Leecher Count',
        'seeder_count': 'Seeder Count',
        'last_scrape_time': 'Update Time',
        'next_announce_time': 'Last Update Time',
      }
    },
    home: {
      'xs': '限速',
      'xss': '全速',
      'torrent_start': 'Start Selected Torrents',
      'torrent_stop': 'Parse Selected Torrents',
      'torrent_verify': 'Verify Selected Torrents',
      'torrent_remove': 'Delete Selected Torrents',
      'torrent_reannounce': 'Get More Peer',
      'set_new_location': 'Move New Location',
      'set': 'Setting',
      'queue_move_top': 'Move Top',
      'queue_move_up': 'Move Up',
      'queue_move_down': 'Move Down',
      'queue_move_bottom': 'Move Bottom',
      'all': 'All',
      'pause': 'Pause',
      'checking': 'Checking',
      'waiting_download': 'Waiting',
      'downloading': 'Downloading',
      'uploading': 'Uploading',
      'confirm_remove_torrent': 'Delete Torrent Confirm',
      'are_you_sure_remove_selected_torrent': 'Are You Sure Delete Selected Torrent ?',
      'remove_with_data': 'Delete Data',
      'set_location': 'Set Location',
      'new_location': 'New Location',
      'with_move_data': 'At The Same Time Move Data (If )（如果不钩选，则从新目录下查找文件）',
    },
    information: {
      info: 'Info',
      trackers: 'Tracker',
      files: 'Files',
      peers: 'Peer',
      settings: 'Settings',
    },
    login: {
      auth: 'Auth',
      username: 'Username',
      password: 'Password',
      login: 'Login'
    },
  },
  'zh-CN': {
    sure: '确 定',
    close: '关 闭',
    cancel: '取 消',
    save: '保 存',
    flush: '刷 新',
    yes: '是',
    no: '否',
    no_data_text: '暂无内容',
    no_results_text: '未找到匹配项',
    ago: ' 前',
    later: ' 后',
    years: ' 年',
    months: ' 个月',
    weeks: ' 星期',
    days: ' 天',
    hours: ' 时',
    minutes: ' 分',
    seconds: ' 秒',
    components: {
      add_torrent: {
        'add_torrent': '添加种子',
        'can_used': '可用',
        'save_path': '保存的位置',
        'torrent_file': '种子文件',
        'magnet_url': '种子地址',
        'auto_start': '自动开始'
      },
      add_trackers: {
        'add_trackers': '添加Trackers',
        'tracker_address': 'Trackers地址',
        'trackers': 'Trackers',
      },
      files_information: {
        'download_selected_files': '下载已选择的文件',
        'ignore_selected_files': '忽略已选择的文件',
        'set_priority': '设置优先级别',
        'priority_high': '高',
        'priority_normal': '正常',
        'priority_low': '低',
        'priority': '优先级别 ',
      },
      peers_information: {
        'country': '国家',
        'region': '地区',
        'city': '城市',
        'downloading_from': '正在下载',
        'encrypted': '加密',
        'incoming': '传入',
        'uploading_to': '正在上传',
        'ip_address': 'IP地址',
        'client_name': '客户端',
        'flag': '标记',
        'connect_info': '连接方式',
        'port': '端口',
        'progress': '完成进度',
        'upload_download_speed': '上传/下载速度',
      },
      statistics: {
        'upload_speed': '上传速度 ',
        'download_speed': '下载速度 ',
      },
      system_setting: {
        'setting': '设置',
        'speed': '速度',
        'bandwidth': '带宽',
        'upload': '做种',
        'privacy': '隐私',
        'network': '网络',
        'other': '其他',
        'global_bandwidth_limits': '全局速度限制',
        'upload_rate': '上传',
        'download_rate': '下载',
        'speed_limit_mode': '备用速度限制',
        'when_enabled_speed_limit_overwrite_the_global_bandwidth_limits': '手动或者定时覆盖全局速度限制',
        'schedule_speed_limit': '定时',
        'time_begin':'开始时间',
        'time_end':'结束时间',
        'sun': '星期日',
        'mon': '星期一',
        'tue': '星期二',
        'wed': '星期三',
        'thur': '星期四',
        'fri': '星期五',
        'sat': '星期六',
        'adding': '添加',
        'start_transfers_when_added': '添加 Torrent 后开始',
        'trash_original_torrent_files': '将 .torrent 文件移至回收站',
        'default_location': '默认保存的位置',
        'available': '可用',
        'queues': '下载队列',
        'download_with_maximum_of': '最大活动下载数',
        'transfer_is_stalled_when_inactive_for': '下载是属于非活动的如果停止分享数据在',
        'append_part_to_incomplete_files': '在未完成文件附加“.part”扩展名',
        'keep_incomplete_files_in': '保存未完成文件到',
        'when_download_completes': '当 Torrent 完成时调用脚本：',
        'limit': '限制',
        'stop_seeding_at_ratio': '停止做种当分享率达到',
        'stop_seeding_when_inactive_for': '停止做种当空闲达到',
        'encryption': '加密',
        'required': '要求加密',
        'preferred': '优先加密',
        'tolerate': '允许加密',
        'block_list': '黑名单',
        'prevent_peers_in_block_list_from_connecting': '启用黑名单',
        'update': '更新',
        'peer_communication': '入站的用户',
        'randomize_port_on_launch': '每次启动时随机选择端口',
        'peer_listening_port': '入站连接的端口',
        'port_check_site_is_down': '',
        'automatically_map_port': '启用端口转发',
        'peer_limit_global': '全体最大用户数量',
        'peer_limit_per_torrent': '每个 Torrent 的最大用户数量',
        'enable_micro_transport_protocol': '为用户连接启用 µTP',
        'pex_enabled': '使用 PEX 以寻找更多用户',
        'dht_enabled': '使用 DHT 以寻找更多用户',
        'lpd_enabled': '使用本地用户发现已寻找更多用户',
      },
      torrent_information: {
        'base_info': '基本信息',
        'name': '名称',
        'download_dir': '保存目录',
        'hash_string': '哈希值',
        'total_size': '总大小',
        'added_date': '添加时间',
        'left_until_done': '剩余',
        'downloaded_ever': '已完成',
        'rate_download': '下载速度',
        'rate_upload': '上传速度',
        'creator': '创建者',
        'date_created': '创建时间',
        'comment': '描述',
        'is_private': '是否私有',
        'magnet_link': '磁链接地址',
      },
      torrents: {
        'parse': '已暂停',
        'waiting_check': '待校验',
        'checking': '校验中',
        'waiting_download': '待下载',
        'downloading': '下载中',
        'wait_upload': '待做种',
        'uploading': '做种中',
        'retrieving_metadata': '正在检索元数据',
        'remaining': '剩余',
        'rename': '重命名',
        'copy_path': '路径复制',
        'name': '名称',
        'queue_position': '序号',
        'status': '状态',
        'total_size': '总大小',
        'percent_done': '进度',
        'added_date': '添加时间',
        'upload_download_speed': '上传/下载速度',
        'upload_ratio': '分享率',
        'ready_upload_download': '已上传/下载',
        'done_date': '完成时间',
        'activity_date': '最后活动于',
      },
      torrent_setting: {
        'when': '当种子的分享率达到这个数时，自动停止做种'
      },
      trackers_information: {
        'add_new_trackers': '添加新的Tracker',
        'remove_selected_trackers': '删除已选中的Tracker',
        'replace_tracker': 'Tracker替换',
        'announce': '服务器',
        'status': '状态',
        'info': '信息',
        'download_count': '下载数',
        'leecher_count': '吸血数',
        'seeder_count': '种子数',
        'last_scrape_time': '更新时间',
        'next_announce_time': '下次更新时间',
      }
    },
    home: {
      'xs': '限速',
      'xss': '全速',
      'torrent_start': '重新开始已选择的种子',
      'torrent_stop': '暂停已选择的种子',
      'torrent_verify': '重新校验已选择的种子',
      'torrent_remove': '删除种子',
      'torrent_reannounce': '获取更多Peer',
      'set_new_location': '移动数据目录',
      'set': '设置',
      'queue_move_top': '移到顶部',
      'queue_move_up': '上移',
      'queue_move_down': '下移',
      'queue_move_bottom': '移到底部',
      'all': '全部',
      'pause': '暂停',
      'checking': '校验中',
      'waiting_download': '待下载',
      'downloading': '下载中',
      'uploading': '做种中',
      'confirm_remove_torrent': '删除种子确认',
      'are_you_sure_remove_selected_torrent': '确定要删除已选择的种子吗?',
      'remove_with_data': '同时删除数据',
      'set_location': '设置位置',
      'new_location': '新的位置',
      'with_move_data': '同时移动数据（如果不钩选，则从新目录下查找文件）',
    },
    information: {
      info: '基本信息',
      trackers: 'Tracker 服务器',
      files: '文件',
      peers: '用户',
      settings: '设置',
    },
    login: {
      auth: '身份验证',
      username: '用户名',
      password: '密码',
      login: '登 录'
    },
  }
}

const i18n = new VueI18n({
  locale: 'en',
  messages: messages
})

export default i18n
