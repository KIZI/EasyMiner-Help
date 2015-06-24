
function helpRun() {
var i = 1;
var id = "";
var cover = document.createElement("div");
cover.setAttribute("id", "cover");

var helpBox = document.createElement("div");
helpBox.setAttribute("id", "helpBox");

var titleH1 = document.createElement("h1");
var description = document.createElement("p");

var $jqcloseButton = $jq('<button/>', {
        id: 'closeButton',
	text: 'X',
        click: function () { 
       		$jq(helpBox).toggle( "slow", function() {
    			$jq(cover).fadeOut("slow");
  			}); 
       		closeXml();
    	}
});

var $jqnextButton = $jq('<button/>', {
		id: 'nextButton',
		class: 'helpBtn',
		click: function () {
			getXml(i);
			i++;
		}
});

var $jqprevButton = $jq('<button/>', {
		id: 'prevButton',
		class: 'helpBtn',
		click: function () {
			i -= 1;
			getXml(i-1);
		}
});

$jq(helpBox).append(titleH1);
$jq(helpBox).append(description);
$jq(helpBox).append($jqnextButton);
$jq(helpBox).append($jqprevButton);
$jq(helpBox).append($jqcloseButton);

document.body.appendChild(cover);
cover.appendChild(helpBox);
$jq(helpBox).toggle( "slow");
getXml(i);
i++;

function getXml(i) {
	$jq.ajax({
	url:'/easyminercenter/_help/xml/help.xml',
	dataType: 'xml',
	success: function(data) {
	$jq(nextButton).removeAttr('disabled');
	$jq(prevButton).removeAttr('disabled');
	if (i == 1) {
		$jq(prevButton).attr('disabled','disabled');
	}
		$jq(data).find('step').each(function() {
			$jq(this).find('id').each(function () {
				darken($jq(this).text());
			});
		});

		$jq(data).find('step:nth-child('+i+')').each(function() {
			$jq(this).find('id').each(function () {
				hilight($jq(this).text());
				id = $jq(this).text();
			});
			$jq("html, body").animate({ scrollTop: $jq("#" + id + "").offset().top-20 }, 1000);
			titleH1.innerHTML = "Step " + i + " / " + $jq(data).find("steps").children().size() + " " + $jq(this).find('title').text();
			description.innerHTML =  $jq(this).find('text').text();
		});
			if (i == $jq(data).find("steps").children().size()) {
			$jq(nextButton).attr('disabled','disabled');
			}
	},
	error: function() {
		$jq('.timeline').text('Failed to get feed');
	}
});
}

function closeXml() {
	$jq.ajax({
	url:'/easyminercenter/_help/xml/help.xml',
	dataType: 'xml',
	success: function(data) {
		$jq(data).find('step').each(function() {
			$jq(this).find('id').each(function () {
				darken($jq(this).text());
			});
		});
	},
	error: function() {
		$jq('.timeline').text('Failed to get feed');
	}
});
}

}