var $jq = jQuery;
function hilight (id) {
	$jq("#" + id + "").css({
		"position" : "relative", 
		"z-index" : "11", 
		"opacity" : "0.01",
		"border-color": "#0049FF", 
        "border-width":"2px", 
        "border-style":"solid"
	});

	$jq("#" + id + "").fadeTo("slow", 1);
}

function darken (id) {
	$jq("#"+id+"").css({
		"z-index" : "0",
		"border-style":"none"
		});
}