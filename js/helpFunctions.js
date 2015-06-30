var $jq = jQuery;
function highlight (id) {
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

function draggable(e) {
    window.drag = {};
    drag.pageX0 = e.pageX;
    drag.pageY0 = e.pageY;
    drag.elem = this;
    drag.offset0 = $jq(this).offset();
    function handle_dragging(e){
        var left = drag.offset0.left + (e.pageX - drag.pageX0);
        var top = drag.offset0.top + (e.pageY - drag.pageY0);
        $jq(drag.elem)
        .offset({top: top, left: left});
    }
    function handle_mouseup(e){
        $jq('body')
        .off('mousemove', handle_dragging)
        .off('mouseup', handle_mouseup);
    }
    $jq('body')
    .on('mouseup', handle_mouseup)
    .on('mousemove', handle_dragging);
}