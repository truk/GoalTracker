$(document).ready(function(){   
  $('.addRecord').click(function() {
    $.ajax({
      url: "/add/" + this.id,
      type: 'POST',
      data: { 'quantity': this.quantity }
      success: function(result){
        window.location.replace("/");
      }
    })
  })
})