console.log('laoded');

var findVideosOnPage = null;
var allVideos = [];

function findVideoTags(status) {
  if (status) {
    findVideosOnPage = setInterval(function () {
      var rawVideos = document.getElementsByTagName('video');
      for (var i = 0; i < rawVideos.length; i++) {
        if (checkIfNotExists(rawVideos[i], allVideos) && (rawVideos[i].src || findSource(rawVideos[i]))) {
          allVideos.push(rawVideos[i])
          addOnlineSubLoadBtn(rawVideos[i], i + 1)
        }
      }

    }, 1000);
    window.addEventListener('keypress', shortcutsEvent, false);
  } else {
    clearInterval(findVideosOnPage);
    clearTimeout(showTimeoutMM);
    clearTimeout(showTimeoutOW);
    for (var i = 0; i < allVideos.length; i++) {
      allVideos[i].parsedSrt = undefined;
      allVideos[i].removeEventListener('playing', hideOnlineSubSettings, false);
      allVideos[i].removeEventListener('pause', showOnlineSubSettings, false);
      allVideos[i].removeEventListener('mousemove', showOnlineSubSettingsMM, false);
      allVideos[i].removeEventListener('timeupdate', timeUpdateEvent, false);
    }
    window.removeEventListener('keypress', shortcutsEvent, false);
    allVideos = [];
  }
}

function findSource(video) {
  if (video.getElementsByTagName('source').length > 0)
    return true;
  return false
}

function checkIfNotExists(rawVideos, allVideos) {
  for (var j = 0; j < allVideos.length; j++) {
    if (rawVideos == allVideos[j]) {
      return false
    }
  }
  return true
}

function addOnlineSubLoadBtn(video, id) {
  var onlineSubFonts = [{ fontName: "Arial", fontValue: "Arial, Helvetica, sans-serif" }, { fontName: "Arial Black", fontValue: "\"Arial Black\", Gadget, sans-serif" },
  { fontName: "Impact", fontValue: "Impact, Charcoal, sans-serif" }, { fontName: "Lucida Sans Unicode", fontValue: "\"Lucida Sans Unicode\", \"Lucida Grande\", sans-serif" },
  { fontName: "Tahoma", fontValue: "Tahoma, Geneva, sans-serif" }, { fontName: "Trebuchet MS", fontValue: "\"Trebuchet MS\", Helvetica, sans-serif" },
  { fontName: "Verdana", fontValue: "Verdana, Geneva, sans-serif" }, { fontName: "Georgia", fontValue: "Georgia, serif" },
  { fontName: "Palatino Linotype", fontValue: "\"Palatino Linotype\", \"Book Antiqua\", Palatino, serif" }, { fontName: "Times New Roman", fontValue: "\"Times New Roman\", Times, serif" },
  { fontName: "Courier New", fontValue: "\"Courier New\", Courier, monospace" }, { fontName: "Lucida Console", fontValue: "\"Lucida Console\", Monaco, monospace" }];

  var encodings = ['UTF-8', 'IBM866', 'ISO-8859-2', 'ISO-8859-3', 'ISO-8859-4', 'ISO-8859-5', 'ISO-8859-6', 'ISO-8859-7', 'ISO-8859-8', 'ISO-8859-8-I', 'ISO-8859-10', 'ISO-8859-13', 'ISO-8859-14', 'ISO-8859-15', 'ISO-8859-16', 'KOI8-R', 'KOI8-U', 'macintosh', 'windows-874', 'windows-1250', 'windows-1251', 'windows-1252', 'windows-1253', 'windows-1254', 'windows-1255', 'windows-1256', 'windows-1257', 'windows-1258', 'x-mac-cyrillic', 'GBK', 'gb18030', 'Big5', 'EUC-JP', 'ISO-2022-JP', 'Shift_JIS', 'EUC-KR', 'UTF-16BE', 'UTF-16LE'];

  var onlineSubDashboard = `
  <div class="onlineSubWrap" id="onlineSubWrap_${id}"></div>
  <div class="onlineSubDashboard" id="onlineSubDashboard_${id}">
    <input type="file" id="onlineSubLoadBtn_${id}" accept=".srt" class="onlineSubLoadBtn" />
    <label class="onlineSubLoadLabel" for="onlineSubLoadBtn_${id}">
      <div></div>
    </label>
    <div class="onlineSubSettings" show="false"></div>
    <div class="onlineSubSettingsWrap">
      <div>
        <span>Reset position: </span>
        <input class="onlineSubResetPos" type="button" value="reset" />
      </div>
      
      <div>
        <span>Color: </span>
        <input class="onlineSubColor" type="color" value="#ffff00" />
      </div>

      <div>
        <span>Bold: </span>
        <input class="onlineSubBold" type="checkbox" />
      </div>

      <div>
        <span>Stroke: </span>
        <input class="onlineSubStrokeColor" type="color" value="#000000" />
      </div>
      
      <div>
        <span>Background color: </span>
        <input class="onlineSubWrapLine" type="color" value="#000000">
      </div>

      <div>
        <span>Background opacity: </span>
        <input class="onlineSubWrapLineOpacity" type="range" min="1" max="100" step="1" value="0" />
      </div>
      
      <div>
        <span>Time corection (ms): </span>
        <input class="onlineSubCorOutput" type="number" step="500" value="-1000" />
      </div>
      
      <div>
        <span>Size: </span>
        <input class="onlineSubFontSize" type="range" value="32" min="12" max="96" step="1" />
      </div>
      
      <div>
        <span>Font family: </span>
        <select class="onlineSubFontFamily"></select>
      </div>
      
      <div>
        <span>Encoding: </span>
        <select class="onlineSubEncoding"></select>
      </div>
      
      <div>
        <span>Save globally: </span>
        <input type="button" value="save" class="onlineSubSaveAsGlobal" />
      </div>
    </div>
  </div>
  `;

  video.insertAdjacentHTML('afterend', onlineSubDashboard);

  if (!video.parentElement.style.position) {
    video.parentElement.style.position = 'relative';
  }
  if (!video.parentElement.style.height) {
    video.parentElement.style.height = '100%';
  }

  var onlineSubWrap = video.parentElement.getElementsByClassName('onlineSubWrap')[0];
  var onlineSubWrapLine = video.parentElement.getElementsByClassName('onlineSubWrapLine')[0]
  var onlineSubLoadBtn = video.parentElement.getElementsByClassName('onlineSubLoadBtn')[0];
  var onlineSubResetPos = video.parentElement.getElementsByClassName('onlineSubResetPos')[0];
  var onlineSubColor = video.parentElement.getElementsByClassName('onlineSubColor')[0];
  var onlineSubStrokeColor = video.parentElement.getElementsByClassName('onlineSubStrokeColor')[0];
  var onlineSubFontSize = video.parentElement.getElementsByClassName('onlineSubFontSize')[0];
  var onlineSubFontFamily = video.parentElement.getElementsByClassName('onlineSubFontFamily')[0];
  var onlineSubEncoding = video.parentElement.getElementsByClassName('onlineSubEncoding')[0];
  var onlineSubSettings = video.parentElement.getElementsByClassName('onlineSubSettings')[0];
  var onlineSubDashboard = video.parentElement.getElementsByClassName('onlineSubDashboard')[0];
  var onlineSubWrapLineOpacity = video.parentElement.getElementsByClassName('onlineSubWrapLineOpacity')[0];
  var onlineSubSaveAsGlobal = video.parentElement.getElementsByClassName('onlineSubSaveAsGlobal')[0];
  var onlineSubBold = video.parentElement.getElementsByClassName('onlineSubBold')[0];

  setUpEncodings(onlineSubEncoding, encodings);
  setUpStyles(onlineSubDashboard, onlineSubFonts, onlineSubFontFamily, onlineSubWrap);
  getStylesFromStorage(onlineSubDashboard);

  onlineSubResetPos.addEventListener('click', setUpWrapPosEvent, false);
  onlineSubSettings.addEventListener("click", showdashboard, false);
  onlineSubLoadBtn.addEventListener('change', handleFileSelect, false);
  onlineSubFontSize.addEventListener('input', changeFontSize, false);
  onlineSubWrapLineOpacity.addEventListener('input', changeSubOpacity, false);
  onlineSubColor.addEventListener('change', changeSubColor, false);
  onlineSubStrokeColor.addEventListener('change', changeSubStrokeColor, false);
  onlineSubWrapLine.addEventListener('change', changeSubWrapLine, false);
  onlineSubFontFamily.addEventListener('change', changeSubFontFamily, false);
  onlineSubEncoding.addEventListener('change', changeSubEncoding, false);
  video.addEventListener('playing', hideOnlineSubSettings, false);
  video.addEventListener('pause', showOnlineSubSettings, false);
  video.addEventListener('mousemove', showOnlineSubSettingsMM, false);
  onlineSubDashboard.addEventListener('mousemove', showOnlineSubSettingsOW, false);
  onlineSubDashboard.addEventListener('click', function (evt) { evt.stopPropagation(); }, false);
  onlineSubSaveAsGlobal.addEventListener("click", saveStylesAsGlobal, false);
  onlineSubBold.addEventListener('change', changeSubWeight, false);

  dragElement(onlineSubWrap);
  setUpWrapPos(onlineSubDashboard);

}

function changeSubEncoding(evt) {
  handleFileSelect(evt);
}

function changeSubWeight(evt) {
  var onlineSubDashboard = getClosestOnlineSubDashboard(evt.target).parentElement.getElementsByClassName('onlineSubWrap')[0];

  if (evt.target.checked) {
    onlineSubDashboard.style.fontWeight = 'bold';
  } else {
    onlineSubDashboard.style.fontWeight = 'normal';
  }
}

function saveStylesAsGlobal(evt) {
  var onlineSubDashboard;
  if (evt.target !== undefined) {
    onlineSubDashboard = getClosestOnlineSubDashboard(evt.target);
  } else {
    onlineSubDashboard = evt;
  }
  var inputs = onlineSubDashboard.querySelectorAll("input[type='range'],input[type='checkbox'],input[type='color'],input[type='number'],select");
  var stylesArray = [];
  for (var i = 0; i < inputs.length; i++) {
    var obj = {}
    obj.className = inputs[i].className;
    if (inputs[i].type === 'checkbox') {
      obj.checked = inputs[i].checked;
    } else {
      obj.value = inputs[i].value;
    }
    stylesArray.push(obj);
  }
  saveStylesToStorage(stylesArray);
}

function getStylesFromStorage(onlineSubDashboard) {
  chrome.storage.sync.get('onlineSubSettings').then(function (val) {
    var inputs = onlineSubDashboard.querySelectorAll("input[type='range'],input[type='checkbox'],input[type='color'],input[type='number'],select");
    if (val.onlineSubSettings !== undefined) {
      for (var i = 0; i < inputs.length; i++) {
        for (var j = 0; j < val.onlineSubSettings.length; j++) {
          if (inputs[i].className === val.onlineSubSettings[j].className) {
            if (inputs[i].type === 'checkbox') {
              inputs[i].checked = val.onlineSubSettings[j].checked;
            } else {
              inputs[i].value = val.onlineSubSettings[j].value;
            }
            if (inputs[i].className === 'onlineSubFontSize' || inputs[i].className === 'onlineSubWrapLineOpacity') {
              inputs[i].dispatchEvent(new Event('input', { 'bubbles': true }));
            } else {
              inputs[i].dispatchEvent(new Event('change', { 'bubbles': true }));
            }
          }
        }
      }
    } else {
      saveStylesAsGlobal(onlineSubDashboard)
    }
  });
}

function saveStylesToStorage(val) {
  chrome.storage.sync.set({ 'onlineSubSettings': val }).then(function () {
    chrome.runtime.sendMessage({ 'changeGlobalSettings': val });
  });
}

function setUpStyles(onlineSubDashboard, onlineSubFonts, onlineSubFontFamily, onlineSubWrap) {

  for (var i = 0; i < onlineSubDashboard.children.length; i++) {
    var exept = onlineSubDashboard.children[i].className;
    if (exept != 'onlineSubSettings' && exept != 'onlineSubLoadLabel')
      onlineSubDashboard.children[i].style.display = 'none';
  }

  for (var i = 0; i < onlineSubFonts.length; i++) {
    var option = document.createElement('option');
    option.value = onlineSubFonts[i].fontValue;
    option.innerText = onlineSubFonts[i].fontName;
    onlineSubFontFamily.appendChild(option);

  }
}

function setUpEncodings(onlineSubEncoding, encodings) {
  for (var i = 0; i < encodings.length; i++) {
    onlineSubEncoding.options[onlineSubEncoding.options.length] = new Option(encodings[i], encodings[i]);
  }
};

var setUpWrapPosTimer = null;
function setUpWrapPos(dashboard) {
  var onlineSubWrap = dashboard.parentElement.getElementsByClassName('onlineSubWrap')[0];
  onlineSubWrap.style.bottom = "10%"
  onlineSubWrap.style.left = 0;
  onlineSubWrap.style.right = 0;
  onlineSubWrap.style.top = null;
}

function setUpWrapPosEvent(evt) {
  var dashboard = evt.target.closest('.onlineSubDashboard');
  setUpWrapPos(dashboard);
}

function showdashboard(evt) {
  var getShow = evt.target.getAttribute("show");
  var displayVal = 'none';
  if (getShow == 'false') {
    evt.target.setAttribute('show', 'true');
    displayVal = ''
  } else {
    evt.target.setAttribute('show', 'false');
  }
  var onlineSubWrapChildren = evt.target.parentElement.children;
  for (var i = 0; i < onlineSubWrapChildren.length; i++) {
    var exept = onlineSubWrapChildren[i].className;
    if (exept != 'onlineSubSettings' && exept != 'onlineSubLoadLabel')
      onlineSubWrapChildren[i].style.display = displayVal;
  }
}

var showTimeoutOW = null;
function showOnlineSubSettingsOW(evt) {
  var dashboard;
  var video;
  if (evt.target.className === 'onlineSubDashboard') {
    video = evt.target.parentElement.getElementsByTagName('video')[0];
    dashboard = evt.target;
  } else {
    video = evt.target.parentElement.parentElement.getElementsByTagName('video')[0];
    dashboard = evt.target.parentElement;
  }
  if (video !== undefined && !video.paused) {
    clearTimeout(showTimeoutOW);
    dashboard.style.opacity = '1';
    showTimeoutOW = setTimeout(function () {
      clearTimeout(showTimeoutOW);
      dashboard.style.opacity = '0';
    }, 900)
  }
}
var showTimeoutMM = null;

function showOnlineSubSettingsMM(evt) {
  if (!evt.target.paused) {
    var onlineSubDashboard = evt.target.parentElement.getElementsByClassName('onlineSubDashboard')[0];
    clearTimeout(showTimeoutMM);
    if (onlineSubDashboard)
      onlineSubDashboard.style.opacity = '1';
    showTimeoutMM = setTimeout(function () {
      clearTimeout(showTimeoutMM);
      if (onlineSubDashboard)
        onlineSubDashboard.style.opacity = '0';
    }, 900)
  }
}

function hideOnlineSubSettings(evt) {
  var onlineSubDashboard = evt.target.parentElement.getElementsByClassName('onlineSubDashboard')[0];
  setTimeout(function () {
    if (onlineSubDashboard)
      onlineSubDashboard.style.opacity = '0';
  }, 1000)
}

function showOnlineSubSettings(evt) {
  var onlineSubDashboard = evt.target.parentElement.getElementsByClassName('onlineSubDashboard')[0];
  setTimeout(function () {
    if (onlineSubDashboard)
      onlineSubDashboard.style.opacity = '1';
  }, 1100)
}

function changeSubFontFamily(evt) {
  var onlineSubWrap = getClosestOnlineSubDashboard(evt.target).parentElement.getElementsByClassName('onlineSubWrap')[0];
  onlineSubWrap.style.fontFamily = evt.target.value;
}

function changeFontSize(evt) {
  var onlineSubWrap = getClosestOnlineSubDashboard(evt.target).parentElement.getElementsByClassName('onlineSubWrap')[0];
  onlineSubWrap.style.fontSize = evt.target.value + 'px';
}

function getClosestOnlineSubDashboard(el) {
  return el.closest('.onlineSubDashboard');
}

function changeSubWrapLine(evt) {
  var closestOnlineSubDashboard = getClosestOnlineSubDashboard(evt.target);

  if (closestOnlineSubDashboard.getElementsByTagName('style').length > 0)
    closestOnlineSubDashboard.removeChild(closestOnlineSubDashboard.getElementsByTagName('style')[0]);

  var id = closestOnlineSubDashboard.id.split('_')[1];

  var onlineSubWrapLineOpacity = parseInt(closestOnlineSubDashboard.getElementsByClassName('onlineSubWrapLineOpacity')[0].value);
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = "#onlineSubWrap_" + id + " span{background-color: " + convertHex(evt.target.value, onlineSubWrapLineOpacity) + ";}";
  closestOnlineSubDashboard.appendChild(css);
}

function changeSubOpacity(evt) {
  var closestOnlineSubDashboard = getClosestOnlineSubDashboard(evt.target);

  if (closestOnlineSubDashboard.getElementsByTagName('style').length > 0)
    closestOnlineSubDashboard.removeChild(closestOnlineSubDashboard.getElementsByTagName('style')[0]);

  var id = closestOnlineSubDashboard.id.split('_')[1];
  var onlineSubWrapLine = closestOnlineSubDashboard.getElementsByClassName('onlineSubWrapLine')[0].value;
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = "#onlineSubWrap_" + id + " span{background-color: " + convertHex(onlineSubWrapLine, evt.target.value) + ";}";
  closestOnlineSubDashboard.appendChild(css);
}

function convertHex(hex, opacity) {
  hex = hex.replace('#', '');
  r = parseInt(hex.substring(0, 2), 16);
  g = parseInt(hex.substring(2, 4), 16);
  b = parseInt(hex.substring(4, 6), 16);

  result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
  return result;
}

function changeSubColor(evt) {
  var onlineSubWrap = getClosestOnlineSubDashboard(evt.target).parentElement.getElementsByClassName('onlineSubWrap')[0];
  onlineSubWrap.style.webkitTextFillColor = evt.target.value;
}

function changeSubStrokeColor(evt) {
  var onlineSubWrap = getClosestOnlineSubDashboard(evt.target).parentElement.getElementsByClassName('onlineSubWrap')[0];
  onlineSubWrap.style.webkitTextStrokeColor = evt.target.value;
}

function handleFileSelect(evt) {
  var closestOnlineSubDashboard = getClosestOnlineSubDashboard(evt.target);
  var loadSubBtn = closestOnlineSubDashboard.getElementsByClassName('onlineSubLoadBtn')[0];
  var video = closestOnlineSubDashboard.parentElement.getElementsByTagName('video')[0];
  var selectedEncoding = closestOnlineSubDashboard.getElementsByClassName('onlineSubEncoding')[0];
  if (loadSubBtn.files && loadSubBtn.files[0]) {
    var file = loadSubBtn.files[0];

    var reader = new FileReader();
    reader.onload = (function (file) {
      return function (e) {
        var parseError = false;
        try {
          video.parsedSrt = parseSrt(e.target.result)
        } catch (e) {
          alert("reading the file error");
          parseError = true;
        }
        if (!parseError) {
          video.addEventListener('timeupdate', timeUpdateEvent, false);
        }

      };
    })(file);
    reader.readAsText(file, selectedEncoding.value);
  }
}

function parseSrt(rawSrt) {
  var splitedSrt = rawSrt.trim().split((rawSrt.search("\n\r\n") != -1) ? "\n\r\n" : "\n\n");
  var parsedSrt = [];
  for (var i = 0; i < splitedSrt.length; i++) {
    var obj = {};
    var subPart = splitedSrt[i].split('\n');

    var time = subPart[1].split(" --> ");
    obj.number = parseInt(subPart[0], 10);
    obj.startTime = parseTime(time[0]);
    obj.endTime = parseTime(time[1]);
    if (subPart.length > 3) {
      obj.text = subPart.slice(2).join("\n")
    } else {
      obj.text = subPart[2];
    }
    parsedSrt.push(obj);
  }
  return parsedSrt
}

function parseTime(timeString) {
  var chunks = timeString.split(":")
    , secondChunks = chunks[2].split(",")
    , hours = parseInt(chunks[0], 10)
    , minutes = parseInt(chunks[1], 10)
    , seconds = parseInt(secondChunks[0], 10)
    , milliSeconds = parseInt(secondChunks[1], 10)

  return (hours * 3600 + minutes * 60 + seconds) * 1000 + milliSeconds
}

function getVideoCurTime(video) {
  var getMs = video.currentTime.toString().split('.');
  if (getMs.length <= 1) {
    return getMs[0]
  }
  return getMs[0] * 1000 + parseInt(getMs[1].slice(0, 3))
}

function timeUpdateEvent(evt) {
  var video = evt.target;
  var subWrap = evt.target.parentElement.getElementsByClassName('onlineSubWrap')[0];
  var parsedSrt = evt.target.parsedSrt;

  var curVidTime = getVideoCurTime(video); //current video time
  curSubText = sybSynch(video, curVidTime, parsedSrt); //sub synchronizing
  curSubText = curSubText.split('\n');
  var preperedSubText = '';
  for (var i = 0; i < curSubText.length; i++) {
    preperedSubText += '<span>' + curSubText[i] + '</span><br/>'
  }
  subWrap.innerHTML = preperedSubText;
}

function sybSynch(video, curVidTime, parsedSrt) {
  var onlineSubCorOutput = parseInt(video.parentElement.getElementsByClassName('onlineSubCorOutput')[0].value);
  var currentSubPartEndTime = 0;
  var curText = '';
  for (var i = 0; i < parsedSrt.length; i++) {
    if (curVidTime >= parsedSrt[i].startTime + onlineSubCorOutput && curVidTime <= parsedSrt[i].endTime + onlineSubCorOutput) {
      curText = parsedSrt[i].text;
      currentSubPartEndTime = parsedSrt[i].endTime;
    }
  }
  if (curVidTime >= currentSubPartEndTime + onlineSubCorOutput) {
    curText = ' '
  }
  return curText
}

function checkIfNotBannedGlobal() {
  var switchOnGlobal = true;
  var switchOnOnsite = true;
  chrome.storage.sync.get('onlineSub').then(function (val1) {
    if (val1.onlineSub !== undefined) {
      var tabUrl = extractDomain(window.location.href);
      switchOnGlobal = val1.onlineSub;
      chrome.storage.sync.get('onlineSubOnPage').then(function (val2) {
        if (val2.onlineSubOnPage !== undefined) {
          for (var i = 0; i < val2.onlineSubOnPage.length; i++) {
            if (val2.onlineSubOnPage[i] === tabUrl)
              switchOnOnsite = false;
          }
        }
        if (switchOnGlobal && switchOnOnsite) {
          findVideoTags(true);
        } else {
          removeOnlineSub();
          findVideoTags(false);
        }
      });
    }
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

function setStylesFromGlobal(val) {
  var onlineSubDashboards = document.getElementsByClassName('onlineSubDashboard');
  for (var k = 0; k < onlineSubDashboards.length; k++) {
    var inputs = onlineSubDashboards[k].querySelectorAll("input[type='range'],input[type='checkbox'],input[type='color'],input[type='number'],select");
    if (val.length > 0) {
      for (var i = 0; i < inputs.length; i++) {
        for (var j = 0; j < val.length; j++) {
          if (inputs[i].className === val[j].className) {
            if (inputs[i].type === 'checkbox') {
              inputs[i].checked = val[j].checked;
            } else {
              inputs[i].value = val[j].value;
            }
            if (inputs[i].className === 'onlineSubFontSize' || inputs[i].className === 'onlineSubWrapLineOpacity') {
              inputs[i].dispatchEvent(new Event('input', { 'bubbles': true }));
            } else {
              inputs[i].dispatchEvent(new Event('change', { 'bubbles': true }));
            }
          }
        }
      }
    }
  }
}

function removeOnlineSub() {
  document.querySelectorAll('.onlineSubWrap, .onlineSubDashboard').forEach(el => el.remove());
}

function subtitleToTime(miliseconds, speedOrDelay) {
  var coreOutput = document.getElementsByClassName('onlineSubCorOutput');
  if (!coreOutput.length > 0) {
    return;
  }

  var onlineSubCorOutput = parseInt(coreOutput[0].value);

  if (speedOrDelay === 'speed') {
    onlineSubCorOutput += miliseconds;
    console.log('Speed subs by + ' + miliseconds + 'ms');
  } else if (speedOrDelay === 'delay') {
    onlineSubCorOutput -= miliseconds;
    console.log("Delay subs by - " + miliseconds + 'ms');
  }

  coreOutput[0].value = onlineSubCorOutput;
}

var miliseconds = 500;
// "G : -500ms delay \\n" +
// "H : +500ms delay \\n" +
function shortcutsEvent(e) {
  var subs = document.getElementsByClassName('onlineSubWrap');
  if (subs.length === 0) {
    return;
  }

  if (e.key === 'g' || e.key === 'G') {
    subtitleToTime(miliseconds, 'delay');
  }
  if (e.key === 'h' || e.key === 'H') {
    subtitleToTime(miliseconds, 'speed');
  }
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    e.stopPropagation();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    e.stopPropagation();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    elmnt.style.right = null;
    elmnt.style.bottom = null;
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.onlineSub === 'onlineSubOff') {
    checkIfNotBannedGlobal()
  } else if (message.onlineSub === 'onlineSubOn') {
    checkIfNotBannedGlobal()
  } else if (message.changeGlobalSettings !== undefined) {
    setStylesFromGlobal(message.changeGlobalSettings)
  }
});

// clean up in case if already loaded;
removeOnlineSub()
findVideoTags(false);

checkIfNotBannedGlobal();
