$(function(){
  chrome.storage.sync.get('spending',function(target){
    if(target.spending){
    $("#spending").text(target.spending)
    }
    else $("#spending").text(0)
  })
  chrome.storage.sync.get('limit',function(target){
    if(target.limit){
    $("#budget_left").text(target.limit)
    }
    else{
      $("#budget_left").text("limit not set")
    }
  })
  $("#submit").click(
    function(){
      chrome.storage.sync.get(['spending','limit'],function(budget){
        var newTotal=0
        if(budget.spending){
          newTotal=parseInt(budget.spending)
        }
        newTotal+=parseInt($("#spent").val())
        chrome.storage.sync.set({'spending':newTotal},function(){
          if(newTotal>=budget.limit){
            var notifObj={
              type:'basic',
              iconUrl:'./icon48.png',
              title:"limit reached",
              message:"bruh your limit reached"
            }
            chrome.notifications.create("limitNotif",notifObj)
          }
        })
        $("#spending").text(newTotal)
        $("#spent").val('')
      })
    })
})