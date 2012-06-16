$(document).ready(function(){   
	$('.expand').click(function() {
		var elem = $(this);
		if (elem.html() == "+"){
			elem.html('-');
		}else{
			elem.html('+');
		}
		elem.parent().next().toggle();
	});
});