function helpRun(file) {
var lang = 'en';
var q = 0;
var num = 1;
var $jqcover = $jq("<div id='helpCover'/>");
var $jqhelpBox = $jq("<div id='helpBox'/>");
var $jqtitle = $jq("<h1/>");
var $jqdescription = $jq("<p/>");
var $jqcontent = $jq("<div id='helpContent'/>");

var $jqcloseButton = $jq('<button/>', {
        id: 'helpCloseButton',
	text: 'X',
        click: function () { 
       		$jqcover.fadeOut( "fast", function() {
    			$jqcover.remove();
  			}); 
  			$jqhelpBox.fadeOut( "fast", function() {
    				$jqhelpBox.remove();
    		});
  			closeXml();	
    	}
});

var $jqnextButton = $jq('<button/>', {
		id: 'helpNextButton',
		class: 'helpBtn',
		click: function () {
			num++;
			getXml(num);
		}
});

var $jqprevButton = $jq('<button/>', {
		id: 'helpPrevButton',
		class: 'helpBtn',
		click: function () {
			num--;
			getXml(num);
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
$jq(document.body).append($jqhelpBox);
$jqhelpBox.fadeToggle("slow");
createNav();
getXml(num);

$jq(document).keyup(function(e) {
     if (e.keyCode == 27) { 
        $jqcover.fadeOut( "fast", function() {
    			$jqcover.remove();
  			}); 
        $jqhelpBox.fadeOut( "fast", function() {
    				$jqhelpBox.remove();
    		});
  			closeXml();	
    }
});

function getXml(i) {
	$jq.ajax({
	url:'/easyminercenter/_help/xml/'+file+'.xml',
	dataType: 'xml',
	success: function(data) {
	$jq("#helpVideo").remove();
	$jqnextButton.removeAttr('disabled');
	$jqprevButton.removeAttr('disabled');
	if (i > $jq(data).find('steps').eq(q).children().size()) {
		q++;
		i = 1;
		num = 1;
	}
	if (i == 0) {
		q--;
		i = $jq(data).find('steps').eq(q).children().size();
		num = $jq(data).find('steps').eq(q).children().size();
	}
	if (i == 1 && q == 0) {
		$jqprevButton.attr('disabled','disabled');
	}
		$jq(data).find('step').each(function() {
			$jq(this).find('id').each(function () {
				darken($jq(this).text());
			});
		});
		$jq(data).find('steps').eq(q).each(function() {
			$jq(this).find('step:nth-child('+i+')').each(function() {
				$jq(this).find('id').each(function () {
					highlight($jq(this).text());
					id = $jq(this).text();
				});
				$jq("html, body").animate({ scrollTop: $jq("#" + id + "").offset().top-20 }, 1000);
				$jqtitle.html($jq(data).find('section').eq(q).text() + " step " + i + " / " + $jq(data).find('steps').eq(q).children().size() + "<br />" + $jq(this).find('title').find(lang).text());
				$jq(this).find('text').each(function() {
					$jqdescription.html($jq(this).find(lang).text());
				});
				$jq(this).find('video').each(function () {
					$jqcontent.append($jq("<video id='helpVideo' width='320' height='240' controls/>"));
					$jq("#helpVideo").attr('src', $jq(this).text());
				});
			});
		});
		if (i == $jq(data).find('steps').eq(q).children().size() && q == $jq(data).find('steps').size() - 1) {
			$jqnextButton.attr('disabled','disabled');
		}
		$jq(".helpNavline").each(function () {
			$jq(this).removeClass('currentNavline');
			if(num == parseInt($jq(this).html().charAt(5)) && q == parseInt($jq(this).html().charAt(3)) - 1) {
				$jq(this).addClass('currentNavline');
			}
		});
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
	var $jqli = $jq("<li id='helpNavTitle'/>");
	var $jqul = $jq('<ul/>');
	$jqcover.append($jqnav);
	$jqul.append($jqli);
	$jqli.html("<p>Navigation</p>");
	$jq.ajax({
		url:'/easyminercenter/_help/xml/'+file+'.xml',
		dataType: 'xml',
		success: function(data) {
			p = 0;	
			$jq(data).find('section').each(function() {
				var $jqnavli = $jq('<li/>', {
				class: 'helpNavlist',
				});
				$jqnavli.html("<p>" + $jq(this).text() + "</p>");
				$jqul.append($jqnavli);
				$jq(data).find('steps').eq(p).each(function() {
					j = 1;
					$jq(this).find('step').each(function () {
						var $jqnavli2 = $jq('<li/>', {
						class: 'helpNavline',
						click: function () {
							q = parseInt($jq(this).html().substr(3,$jq(this).html().indexOf('.')) - 1);
							var numSub = "";
							for (var i = 0; i <= $jq(this).html().length - 1; i++) {
								if ($jq(this).html().charAt(i) == '.') {
									i++;
									while ($jq.isNumeric($jq(this).html().charAt(i))) {
										numSub += $jq(this).html().charAt(i);
										i++;
									}
									break;
								}
							};
							num = parseInt(numSub);
							getXml(num);
						}
						});
						$jqnavli2.html("<p>" + (p+1) + "." + j + " " + $jq(this).find('title').find(lang).text() + "</p>");
						if (p == q && j == num) {
							$jqnavli2.addClass('currentNavline');
						}
						$jqul.append($jqnavli2);
						j++;
					});
				});
				p++;
			});		
			
		},
		error: function() {
			$jq('.timeline').text('Failed to get feed');
		}
	});
	$jqnav.append($jqul);
}
}