$(document).ready(function(){   
  $('#addGoal').click(function() {
    console.log("OK");
    $.ajax({
      url: "/goal",
      type: 'PUT',
      data: { 'action': $("#action").val(),
              'quantity': $("#quantity").val(),
              'unit': $("#unit").val(),
              'period': $("#period").val() },
      success: function(result){
        window.location.replace("/");
      }
    })
  })
})