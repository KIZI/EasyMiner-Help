
function helpRun(file) {
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
			i++;
			getXml(i);
		}
});

var $jqprevButton = $jq('<button/>', {
		id: 'prevButton',
		class: 'helpBtn',
		click: function () {
			i--;
			getXml(i);
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
createNav();
getXml(i);

function getXml(i) {
	$jq.ajax({
	url:'/easyminercenter/_help/xml/'+file+'.xml',
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
	url:'/easyminercenter/_help/xml/'+file+'.xml',
	dataType: 'xml',
	success: function(data) {
		$jq(data).find('step').each(function() {
			$jq(this).find('id').each(function () {
				darken($jq(this).text());
			});
		});
		$jq("#nav").remove();
	},
	error: function() {
		$jq('.timeline').text('Failed to get feed');
	}
});
}

function createNav () {
	var nav=document.createElement('ul');
	nav.setAttribute('id','nav');

	var li=document.createElement('li');


	$jq(helpBox).append(nav);
	nav.appendChild(li);
	li.innerHTML = "Navigation";

	var ul = document.createElement('ul');
	$jq.ajax({
		url:'/easyminercenter/_help/xml/'+file+'.xml',
		dataType: 'xml',
		success: function(data) {
			var j = 1;
			$jq(data).find('step').each(function() {
				var $jqnavli = $jq('<li/>', {
				class: 'navline',
				click: function () {
					i = parseInt($jq(this).html().charAt(0));
					getXml(i);
					$jq(ul).css({visibility: "hidden"})
				}
			});
				$jqnavli.html(j + " " + $jq(this).find('title').text());
				$jq(ul).append($jqnavli);
				j++;
			});
		},
		error: function() {
			$jq('.timeline').text('Failed to get feed');
		}
	});
	li.appendChild(ul);
	mainmenu();
}


function mainmenu(){
	$jq(" #nav ul ").css({display: "none"}); // Opera Fix
	$jq(" #nav li").hover(function(){
		$jq(this).find('ul:first').css({visibility: "visible",display: "none"}).show(400);
		},function(){
		$jq(this).find('ul:first').css({visibility: "hidden"});
		});
}


}