
function helpRun(file) {
var i = 1;
var lang = 'en';

var $jqcover = $jq("<div id='helpCover'/>");
var $jqhelpBox = $jq("<div id='helpBox'/>");
var $jqtitle = $jq("<h1/>");
var $jqdescription = $jq("<p/>");
var $jqcontent = $jq("<div id='helpContent'/>");

var $jqcloseButton = $jq('<button/>', {
        id: 'helpCloseButton',
	text: 'X',
        click: function () { 
       		$jq(helpBox).toggle( "slow", function() {
    			$jqcover.fadeOut("slow");
  			}); 
       		closeXml();
    	}
});

var $jqnextButton = $jq('<button/>', {
		id: 'helpNextButton',
		class: 'helpBtn',
		click: function () {
			i++;
			getXml(i);
		}
});

var $jqprevButton = $jq('<button/>', {
		id: 'helpPrevButton',
		class: 'helpBtn',
		click: function () {
			i--;
			getXml(i);
		}
});

$jqhelpBox.mousedown(draggable);

$jqhelpBox.append($jqtitle);
$jqhelpBox.append($jqdescription);
$jqhelpBox.append($jqcontent);
$jqhelpBox.append($jqnextButton);
$jqhelpBox.append($jqprevButton);
$jqhelpBox.append($jqcloseButton);

$jq(document.body).append($jqcover);
$jqcover.append($jqhelpBox);
$jqhelpBox.toggle("slow");
createNav();
getXml(i);

function getXml(i) {
	$jq.ajax({
	url:'/easyminercenter/_help/xml/'+file+'.xml',
	dataType: 'xml',
	success: function(data) {
	$jq("#helpVideo").remove();
	$jqnextButton.removeAttr('disabled');
	$jqprevButton.removeAttr('disabled');
	if (i == 1) {
		$jqprevButton.attr('disabled','disabled');
	}
		$jq(data).find('step').each(function() {
			$jq(this).find('id').each(function () {
				darken($jq(this).text());
			});
		});

		$jq(data).find('step:nth-child('+i+')').each(function() {
			$jq(this).find('id').each(function () {
				highlight($jq(this).text());
				id = $jq(this).text();
			});
			$jq("html, body").animate({ scrollTop: $jq("#" + id + "").offset().top-20 }, 1000);
			$jq(this).find('title').each(function () {
				$jqtitle.html("Step " + i + " / " + $jq(data).find("steps").children().size() + " " + $jq(this).find(lang).text());
			});
			$jq(this).find('text').each(function() {
				$jqdescription.html($jq(this).find(lang).text());
			});
			$jq(this).find('video').each(function () {
				$jqcontent.append($jq("<video id='helpVideo' width='320' height='240' controls/>"));
				$jq("#helpVideo").attr('src', $jq(this).text());
			});
		});
			if (i == $jq(data).find("steps").children().size()) {
			$jqnextButton.attr('disabled','disabled');
			}
	},
	error: function() {
		$jq('.timeline').text('Failed to get feed');
	}
});
}

function closeXml() {
	$jq.ajax({
	url:'/easyminercenter/_help/xml/'+file+'.xml',
	dataType: 'xml',
	success: function(data) {
		$jq(data).find('step').each(function() {
			$jq(this).find('id').each(function () {
				darken($jq(this).text());
			});
		});
		$jq("#helpNav").remove();
	},
	error: function() {
		$jq('.timeline').text('Failed to get feed');
	}
});
}

function createNav () {
	var $jqnav = $jq("<ul id='helpNav'/>");
	var $jqli = $jq('<li/>');
	$jqhelpBox.append($jqnav);
	$jqnav.append($jqli);
	$jqli.html("Navigation");
	var $jqul = $jq('<ul/>');
	$jq.ajax({
		url:'/easyminercenter/_help/xml/'+file+'.xml',
		dataType: 'xml',
		success: function(data) {
			var j = 1;
			$jq(data).find('step').each(function() {
				var $jqnavli = $jq('<li/>', {
				class: 'helpNavline',
				click: function () {
					i = parseInt($jq(this).html().charAt(0));
					getXml(i);
					$jqul.css({visibility: "hidden"})
				}
			});
				$jq(this).find('title').each(function () {
					$jqnavli.html(j + " " + $jq(this).find(lang).text());
				});
				$jqul.append($jqnavli);
				j++;
			});
		},
		error: function() {
			$jq('.timeline').text('Failed to get feed');
		}
	});
	$jqli.append($jqul);
	mainmenu();
}


function mainmenu(){
	$jq(" #helpNav ul ").css({display: "none"}); // Opera Fix
	$jq(" #helpNav li").hover(function(){
		$jq(this).find('ul:first').css({visibility: "visible",display: "none"}).show(400);
		},function(){
		$jq(this).find('ul:first').css({visibility: "hidden"});
		});
}


}