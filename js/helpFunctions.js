var $jq = jQuery;
function highlight (id) {
	$jq("#" + id + "").addClass("helpHighlighted");
    $jq("#" + id + "").fadeTo("slow", 1);
}

function darken (id) {
	$jq("#"+id+"").removeClass("helpHighlighted");
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