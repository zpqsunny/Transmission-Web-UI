// runtime installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'transmissionFastDownload',
    title: chrome.i18n.getMessage('contextMenusTitle'),
    contexts: ['selection', 'link'],
  }, () => {
    console.log('contextMenus created');
  });
  console.log('onInstalled');
})
let tId = -1
// contextMenus onClicked
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== 'transmissionFastDownload') {
    return;
  }
  if (tId < 0) {
    console.log('not open tab, so do not send message');
    return;
  }
  let url = info.linkUrl || info.selectionText
  chrome.runtime.sendMessage({
    extensionId: chrome.runtime.id,
    message: {url: url},
  });
  console.log('send message ok');
})
// action onClicked
chrome.action.onClicked.addListener((tab) => {
  if (tId < 0) {
    chrome.tabs.create({url: chrome.runtime.getURL('index.html')})
      .then(t => {
        console.log('tab created');
        tId = t.id;
      });
    return;
  }
  chrome.tabs.get(tId).then(t => {
    if (!t.active) {
      chrome.tabs.update(tId, {active: true});
    }
  })
})
// tabs onRemoved
chrome.tabs.onRemoved.addListener((tabId, detachInfo) => {
  if (tabId === tId) {
    console.log('tab removed');
    tId = -1;
  }
})
