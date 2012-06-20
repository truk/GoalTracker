$(document).ready(function(){   
  $('.delete').click(function() {
    if (!confirm('Really delete this goal?')){
      return;
    }
    $.ajax({
      url: window.location,
      type: 'DELETE',
      success: function(result){
        window.location.replace("/");
      }
    })
  })
  
  $('button').click(function(){
    var quantity = parseInt($(this).html());
    console.log($("#dateSelector").val());
    $.post(window.location + "/add", 
      { "quantity": quantity, "date": $("#dateSelector").val() },
      function(record){
        var d = new Date(record.date);
        $("#remaining").html($("#remaining").html() - quantity);
        var row = document.createElement('tr');
        var cell = document.createElement('td');
        cell.innerHTML = d.toDateString();
        row.appendChild(cell);
        cell = document.createElement('td');
        cell.innerHTML = record.quantity;
        row.appendChild(cell);
        $("#records table").append(row);
    })
  })
})