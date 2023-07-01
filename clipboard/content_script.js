chrome.runtime.onMessage.addListener(()=>{
 console.log("content script")
 selectedText = window.getSelection().toString()
 chrome.runtime.sendMessage({text: selectedText})
})


document.getElementsByTagName("input")[1].focus()