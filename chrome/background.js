chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'transmissionFastDownload',
    title: '磁力链接快捷下载',
    contexts: ['selection', 'link'],
  }, () => {
    console.log('contextMenus created')
  })
  console.log('onInstalled')
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== 'transmissionFastDownload') {
    return
  }
  let url = info.linkUrl || info.selectionText
  chrome.runtime.sendMessage({
    extensionId: chrome.runtime.id,
    message: {url: url},
  })
  console.log('sendMessage ok')
})

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({url: chrome.runtime.getURL('index.html')});
});
