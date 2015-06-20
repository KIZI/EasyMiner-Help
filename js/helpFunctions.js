var $jq = jQuery;
function hilight (id) {
	$jq("#" + id + "").css({
		"position" : "relative", 
		"z-index" : "100", 
		"opacity" : "0.01"
	});

	$jq("#" + id + "").fadeTo("slow", 1);
}

function darken (id) {
	$jq("#"+id+"").css("z-index", "0");
}