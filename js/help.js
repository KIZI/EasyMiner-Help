
$(document).ready(function() {
var i = 1;

var cover = document.createElement("div");
cover.setAttribute("id", "cover");

var info = document.createElement("div");
info.setAttribute("class", "infoBox");

var helpBox = document.createElement("div");
helpBox.setAttribute("id", "helpBox");

var titleH1 = document.createElement("h1");
var description = document.createElement("p");

var $conButton = $('<button/>', {
		id: 'conButton',
		text: 'continue',
		click: function () {
			cover.appendChild(helpBox);
			$(helpBox).toggle( "slow");
			info.remove();
			getXml(i);
			i++;
		}
});

var $closeButton = $('<button/>', {
        id: 'closeButton',
        click: function () { 
       		$(helpBox).toggle( "slow", function() {
    			$(cover).fadeOut("slow");
  			}); 
    	}
});

var $nextButton = $('<button/>', {
		id: 'nextButton',
		class: 'helpBtn',
		click: function () {
			getXml(i);
			i++;
		}
});

var $prevButton = $('<button/>', {
		id: 'prevButton',
		class: 'helpBtn',
		click: function () {
			i -= 1;
			getXml(i-1);
		}
});

$(helpBox).append(titleH1);
$(helpBox).append(description);
$(helpBox).append($nextButton);
$(helpBox).append($prevButton);
$(helpBox).append($closeButton);
$(info).append($conButton);
cover.appendChild(info);

document.body.appendChild(cover);


function getXml(i) {
	$.ajax({
	url:'xml/help.xml',
	dataType: 'xml',
	success: function(data) {
		$(data).find('step').each(function() {
			$(this).find('id').each(function () {
				darken($(this).text());
			});
		});

		$(data).find('step:nth-child('+i+')').each(function() {
			$(this).find('id').each(function () {
				hilight($(this).text());
			});
			titleH1.innerHTML = "Step " + i + " / " + $(data).find("steps").children().size() + " " + $(this).find('title').text();
			description.innerHTML =  $(this).find('title').text();
		});
	},
	error: function() {
		$('.timeline').text('Failed to get feed');
	}
});
}

});