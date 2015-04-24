function hilight (id) {
	$("#" + id + "").css({
		"position" : "relative", 
		"z-index" : "100", 
		"opacity" : "0.01"
	});

	$("#" + id + "").fadeTo("slow", 1);
}

function darken (id) {
	$("#"+id+"").css("z-index", "1");
}