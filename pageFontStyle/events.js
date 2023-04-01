

chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{
  if(request.todo=="highlight"){
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.pageAction.show(tabs[0].id)
    })
  }
})