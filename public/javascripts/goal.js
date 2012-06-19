$(document).ready(function(){   
  $('.delete').click(function() {
    $.ajax({
      url: window.location,
      type: 'DELETE',
      success: function(result){
        window.location.replace("/");
      }
    })
  })
})