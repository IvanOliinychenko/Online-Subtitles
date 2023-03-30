var onoffOnlineSub = document.getElementById('onoffOnlineSub');
var onoffOnlineSubOnPage = document.getElementById('onoffOnlineSubOnPage');
var tabUrl;
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

chrome.tabs.query({'active': true}, function (tabs) {
  tabUrl = extractDomain(tabs[0].url);
});

chrome.storage.sync.get('onlineSub').then(function(val) {
  if(val.onlineSub === undefined){
    onoffOnlineSub.checked = true;
  }else{
    onoffOnlineSub.checked = val.onlineSub; 
  }
});

chrome.storage.sync.get('onlineSubOnPage').then(function(val) {
 onoffOnlineSubOnPage.checked = true;
  if(val.onlineSubOnPage !== undefined){
    for(var i=0;i<val.onlineSubOnPage.length;i++){
      if(val.onlineSubOnPage[i] === tabUrl){
        onoffOnlineSubOnPage.checked = false;
      }
    }  
  }
}); 

onoffOnlineSubOnPage.addEventListener('click', onoffOnlineSubOnPageFunc, false);
onoffOnlineSub.addEventListener('click', onoffOnlineSubFunc, false);

function onoffOnlineSubOnPageFunc(){
  
  if(this.checked){
    chrome.storage.sync.get('onlineSubOnPage').then(function(val) {
      var onlineSubOnPage;
      if(val.onlineSubOnPage !== undefined){
        onlineSubOnPage = val.onlineSubOnPage.indexOf(tabUrl)
        if(onlineSubOnPage !== undefined){
          val.onlineSubOnPage.splice(onlineSubOnPage, 1)
          onlineSubOnPage = val.onlineSubOnPage;
          chrome.storage.sync.set({'onlineSubOnPage': onlineSubOnPage}).then(function(){
            onoffOnlineSubOnPage.checked = true;
            onlineSubOnOnDomen();
          });
        }
      }
    });
  }else{
    chrome.storage.sync.get('onlineSubOnPage').then(function(val) {
      var onlineSubOnPage = [];
      
      if(val.onlineSubOnPage === undefined){
        onlineSubOnPage.push(tabUrl);
      }else{
        onlineSubOnPage = val.onlineSubOnPage.concat(tabUrl);
      }
      chrome.storage.sync.set({'onlineSubOnPage': onlineSubOnPage}).then(function(){
        onoffOnlineSubOnPage.checked = false;
        onlineSubOffOnDomen();
      });
    }); 
  }
}
function onoffOnlineSubFunc(){
  if(this.checked){
    chrome.storage.sync.set({'onlineSub': true}).then(function(){
      onlineSubOn();
      onoffOnlineSub.checked = true;
    });  
  }else{
    chrome.storage.sync.set({'onlineSub': false}).then(function(){
      onlineSubOff();
      onoffOnlineSub.checked = false;
    });    
  }
}
function onlineSubOff(){
  chrome.runtime.sendMessage({'onlineSubOffOn': 'onlineSubOff'});
}
function onlineSubOn(){
  chrome.runtime.sendMessage({'onlineSubOffOn': 'onlineSubOn'});
}
function onlineSubOffOnDomen(){
  chrome.runtime.sendMessage({'onlineSubOffOnDomen': 'onlineSubOff'});
}
function onlineSubOnOnDomen(){
  chrome.runtime.sendMessage({'onlineSubOnOnDomen': 'onlineSubOn'});
}