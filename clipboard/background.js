add_item = {
 id: "add_item",
 title: "Add to clipboard",
 contexts: ["selection"]
}

chrome.contextMenus.create(add_item)

// --------  context menu  ------
chrome.contextMenus.onClicked.addListener((info, tab) => {
 if (info.menuItemId === "add_item") {
  console.log("fsd")
  input = info.selectionText

  chrome.storage.sync.get(["text_arr"], (target) => {
   if (target.text_arr) {
   }
   else {
    target.text_arr = []
   }
   target.text_arr.push(input)
   chrome.storage.sync.set({ "text_arr": target.text_arr },)
  })
 }
})



// ------- commands ----------
chrome.commands.onCommand.addListener((command) => {
 if (command === "add_text") {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
   chrome.tabs.sendMessage(tabs[0].id, { message: "ping" })
  })
 }
}
)


chrome.runtime.onMessage.addListener((message) => {
 if (message.text) {
  chrome.storage.sync.get(["text_arr"], (target) => {
   if (target.text_arr) {
   }
   else {
    target.text_arr = []
   }
   console.log(message.text)
   target.text_arr.unshift(message.text)
   chrome.storage.sync.set({ "text_arr": target.text_arr },)
  })
 }
})