var contextMenuItem={
  "id":"spendSelected",
  "title":"Spend",
  "contexts":["selection"]
}

chrome.contextMenus.create(contextMenuItem);

chrome.contextMenus.onClicked.addListener(function(target){
  if(target.menuItemId==="spendSelected" && target.selectionText!=NaN){
    chrome.storage.sync.get(["spending","limit"], function (target2) {
      var newTotal = 0
      if (target2.spending) {
        newTotal = parseInt(target2.spending)
      }
      newTotal += parseInt(target.selectionText)
      chrome.storage.sync.set({ 'spending': newTotal }, function () {
        if (newTotal >= target2.limit) {
          var notifObj = {
            type: 'basic',
            iconUrl: './icon48.png',
            title: "limit reached",
            message: "bruh your limit reached"
          }
          chrome.notifications.create("limitNotif", notifObj)
        }
      })})
  }
})

chrome.storage.onChanged.addListener(function(changes,storageName){
  chrome.action.setBadgeText({"text":changes.spending.newValue.toString()})
})