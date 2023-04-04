chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.storage.sync.set({ 'onlineSub': true }).then(() => {
      injectOnlineSub();
    })
  }
});

function injectOnlineSub() {
  chrome.windows.getAll({ populate: true }, function (windows) {
    windows.forEach(function (window) {
      window.tabs.forEach(function (tab) {
        if (tab.url.slice(0, 6) !== 'chrome' && tab.status === 'complete') {
          chrome.scripting.executeScript({
            target: { tabId: tab.id, allFrames: true },
            files: ['onlineSubcontent.js']
          });
          chrome.scripting.insertCSS({
            target: { tabId: tab.id, allFrames: true },
            files: ['onlineSub.css']
          });
        }
      });
    });
  });
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.onlineSubOffOn === 'onlineSubOff') {
    onlineSubOffOn('onlineSubOff')
  } else if (message.onlineSubOffOn === 'onlineSubOn') {
    onlineSubOffOn('onlineSubOn')
  } else if (message.onlineSubOnOnDomen === 'onlineSubOn') {
    onlineSubOffOnDomen('onlineSubOn')
  } else if (message.onlineSubOffOnDomen === 'onlineSubOff') {
    onlineSubOffOnDomen('onlineSubOff')
  } else if (message.changeGlobalSettings !== undefined) {
    changeGlobalSettings(message.changeGlobalSettings, sender.tab.id)
  } else {
    console.log('onlineSub backgroundscript message error')
  }
});

function changeGlobalSettings(val, sender) {
  chrome.windows.getAll({ populate: true }, function (windows) {
    windows.forEach(function (window) {
      window.tabs.forEach(function (tab) {
        if (tab.url.slice(0, 6) !== 'chrome' && tab.status === 'complete')
          chrome.tabs.sendMessage(tab.id, { 'changeGlobalSettings': val }).catch(x => { });
      });
    });
  });
}

function onlineSubOffOn(val) {
  chrome.windows.getAll({ populate: true }, function (windows) {
    windows.forEach(function (window) {
      window.tabs.forEach(function (tab) {
        if (tab.url.slice(0, 6) !== 'chrome' && tab.status === 'complete') {
          chrome.tabs.sendMessage(tab.id, { 'onlineSub': val }).catch(x => { });
        }
      });
    });
  });
}

function extractDomain(url) {
  var domain;
  if (url.indexOf("://") > -1) {
    domain = url.split('/')[2];
  }
  else {
    domain = url.split('/')[0];
  }
  domain = domain.split(':')[0];
  return domain;
}

function onlineSubOffOnDomen(val) {
  chrome.windows.getCurrent({ populate: true })
    .then(window => {
      return extractDomain(window.tabs.find(tab => tab.active).url)
    })
    .then(curTabUrl => {
      chrome.tabs.query({}).then(tabs => {
        tabs.forEach(tab => {
          if (tab.url.slice(0, 6) !== 'chrome' && extractDomain(tab.url) === curTabUrl) {
            chrome.tabs.sendMessage(tab.id, { 'onlineSub': val }).catch(x => { });
          }
        })
      })
    });
}