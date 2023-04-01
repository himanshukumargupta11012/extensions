$(function(){
  chrome.storage.sync.get('limit',function(target){
    $('#limit').val(target.limit)
  })
  $("#set_limit").click(
    function(){
      var limit=parseInt($("#limit").val())
      chrome.storage.sync.set({"limit":limit},function(){
        close()
      })
    }
  )
  $('#reset').click(function(){
    chrome.storage.sync.set({'spending':0},function(){
      var notifObj = {
        type: 'basic',
        iconUrl: './icon48.png',
        title: "Budget Manager",
        message: "reset successfully"
      }
      chrome.notifications.create("limitNotif", notifObj)
      // close()
    })
  })
})