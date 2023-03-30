chrome.storage.sync.get('onlineSub').then(function(val){
  if(val.onlineSub === undefined){
    chrome.storage.sync.set({'onlineSub': true});
  }
});

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  if(message.onlineSubOffOn  === 'onlineSubOff'){
    onlineSubOffOn('onlineSubOff')
  }else if(message.onlineSubOffOn === 'onlineSubOn'){
    onlineSubOffOn('onlineSubOn') 
  }else if(message.onlineSubOnOnDomen === 'onlineSubOn'){
    onlineSubOffOnDomen('onlineSubOn')
  }else if(message.onlineSubOffOnDomen === 'onlineSubOff'){
    onlineSubOffOnDomen('onlineSubOff')
  }else if(message.changeGlobalSettings !== undefined){
    changeGlobalSettings(message.changeGlobalSettings,sender.tab.id)
  }else{
    console.log('onlineSub backgroundscript message error')
  }
});

function changeGlobalSettings(val,sender){
  chrome.windows.getAll({populate:true},function(windows){
    windows.forEach(function(window){
      window.tabs.forEach(function(tab){
        if(tab.id != sender)
          chrome.tabs.sendMessage(tab.id, {'changeGlobalSettings': val });
      });
    });
  });
}

function onlineSubOffOn(val){
  chrome.windows.getAll({populate:true},function(windows){
    windows.forEach(function(window){
      window.tabs.forEach(function(tab){
        chrome.tabs.sendMessage(tab.id, {'onlineSub': val });
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

function onlineSubOffOnDomen(val){
  var curTabUrl;
  chrome.tabs.query({'active': true}, function (tabs) {
   curTabUrl = extractDomain(tabs[0].url)
  });
  chrome.tabs.query({}, function (tabs) {
   for(var i=0;i<tabs.length;i++){
      if(tabs[i].url.slice(0,6) !== 'chrome' && extractDomain(tabs[i].url) === curTabUrl)
        chrome.tabs.sendMessage(tabs[i].id, {'onlineSub': val });
   }
  });
}