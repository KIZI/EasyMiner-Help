/**
 * Definition of the EasyMiner Help class
 * @param params : object (optional)
 * @constructor
 */
var EMHelp=function(params){

  //region init
  /**
   * Init function - sets the help parameters
   * @param params
   */
  this.init = function(params){
    this.lang = (typeof params.lang === 'undefined') ? 'en' : params.lang;
    if (typeof params.dataDirectoryUrl !== 'undefined'){
      this.dataDirectoryUrl=params.dataDirectoryUrl;
      if (this.dataDirectoryUrl!="" && this.dataDirectoryUrl.substr(this.dataDirectoryUrl.length-1,1)!="/"){
        this.dataDirectoryUrl += "/";
      }
    }
    if (typeof params.dataFile !== 'undefined'){
      this.dataFile=params.dataFile;
      if (this.dataFile!="" && this.dataFile.substr(this.dataFile.length-4,4).toLowerCase()!=".xml"){
        this.dataFile += ".xml";
      }
    }
  };
  if (typeof params !== "undefined"){this.init(params);}
  //endregion


  var $jq = jQuery;
  var $jqhelpColor = "";
  var q = 0;
  var num = 1;

  var highlight = function(id) {
   $jq("#" + id + "").addClass("helpHighlighted");
   $jq("#" + id + "").fadeTo("slow", 1);
  };

  var darken = function(id) {
   $jq("#"+id+"").removeClass("helpHighlighted");
  };

  var draggable = function(e) {
    window.drag = {};
    drag.pageX0 = e.pageX;
    drag.pageY0 = e.pageY;
    drag.elem = this;
    drag.offset0 = $jq(this).offset();
    var handle_dragging = function (e){
      var left = drag.offset0.left + (e.pageX - drag.pageX0);
      var top = drag.offset0.top + (e.pageY - drag.pageY0);
      $jq(drag.elem)
        .offset({top: top, left: left});
    };
    var handle_mouseup = function (e){
      $jq('body')
        .off('mousemove', handle_dragging)
        .off('mouseup', handle_mouseup);
    };
    $jq('body')
      .on('mouseup', handle_mouseup)
      .on('mousemove', handle_dragging);
  };

  /**
   * Show the given help file...
   */
  this.show = function() {
    var $jqcover = $jq("<div id='helpCover'/>");
    var $jqhelpBox = $jq("<div id='helpBox'/>");
    var $jqtitle = $jq("<h1/>");
    var $jqdescription = $jq("<p/>");
    var $jqcontent = $jq("<div id='helpContent'/>");

    var $jqcloseButton = $jq('<button/>', {
      id: 'helpCloseButton',
      text: 'X',
      click: function () {
        $jqcover.fadeOut("fast", function () {
          $jqcover.remove();
        });
        $jqhelpBox.fadeOut("fast", function () {
          $jqhelpBox.remove();
        });
        this.closeXml();
      }.bind(this)
    });

    var $jqnextButton = $jq('<button/>', {
      id: 'helpNextButton',
      class: 'helpBtn',
      click: function () {
        num++;
        this.getXml(num);
      }.bind(this)
    });

    var $jqprevButton = $jq('<button/>', {
      id: 'helpPrevButton',
      class: 'helpBtn',
      click: function () {
        num--;
        this.getXml(num);
      }.bind(this)
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

    $jq(document).keyup(function (e) {
      if (e.keyCode == 27) {
        $jqcover.fadeOut("fast", function () {
          $jqcover.remove();
        });
        $jqhelpBox.fadeOut("fast", function () {
          $jqhelpBox.remove();
        });
        this.closeXml();
      }
    }.bind(this));

    /**
     * @private
     * @param i
     */
    this.getXml = function (i) {
      var lang=this.lang;
      $jq.ajax({
        url: this.dataDirectoryUrl + this.dataFile,
        dataType: 'xml',
        success: function (data) {
          $jq("#helpVideo").remove();
          $jqcontent.html("");
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
            $jqprevButton.attr('disabled', 'disabled');
          }
          $jq(data).find('step').each(function () {
            $jq(this).find('id').each(function () {
              darken($jq(this).text());
            });
          });
          $jq(data).find('steps').eq(q).each(function () {
            $jq(this).find('step:nth-child(' + i + ')').each(function () {
              $jq(this).find('id').each(function () {
                highlight($jq(this).text());
                id = $jq(this).text();
              });
              $jq("html, body").animate({scrollTop: $jq("#" + id + "").offset().top - 20}, 1000);
              $jqtitle.html($jq(data).find('section').eq(q).text() + " step " + i + " / " + $jq(data).find('steps').eq(q).children().size() + "<br />" + $jq(this).find('title').find(lang).text());
              $jq(this).find('text').each(function () {
                $jqdescription.html($jq(this).find(lang).text());
              });
              $jq(this).find('html').each(function () {
                $jq("#helpContent").load("../_help/html/" + $jq(this).text(), function (response, status, xhr) {
                  if (status == "error") {
                    var msg = "Sorry but there was an error: ";
                    alert(msg);
                  }
                });
              });
              $jq(this).find('video').each(function () {
                $jqcontent.append($jq("<video id='helpVideo' width='320' height='240' controls/>"));
                $jq("#helpVideo").attr('src', $jq(this).text());
              });
            }.bind(this));
          });
          if (i == $jq(data).find('steps').eq(q).children().size() && q == $jq(data).find('steps').size() - 1) {
            $jqnextButton.attr('disabled', 'disabled');
          }
          $jq(".helpNavline").each(function () {
            $jq(this).removeClass('currentNavline');
            var numSub = "";
            for (var y = 0; y <= $jq(this).html().length - 1; y++) {
              if ($jq(this).html().charAt(y) == '.') {
                y++;
                while ($jq.isNumeric($jq(this).html().charAt(y))) {
                  numSub += $jq(this).html().charAt(y);
                  y++;
                }
                break;
              }
            }
            if (num == parseInt(numSub) && q == parseInt($jq(this).html().substr(3, $jq(this).html().indexOf('.')) - 1)) {
              $jq(this).addClass('currentNavline');
            }
          });
        },
        error: function () {
          $jq('.timeline').text('Failed to get feed');
        }
      });
    };

    this.closeXml = function () {
      $jq.ajax({
        url: this.dataDirectoryUrl + this.dataFile,
        dataType: 'xml',
        success: function (data) {
          $jq(data).find('step').each(function () {
            $jq(this).find('id').each(function () {
              darken($jq(this).text());
            });
          });
          $jq("#helpNav").remove();
        },
        error: function () {
          $jq('.timeline').text('Failed to get feed');
        }
      });
    };

    this.createNav = function () {
      var $jqnav = $jq("<div id='helpNav'/>");
      var $jqnavcon = $jq("<div id='helpNavContent'/>");
      var $jqmin = $jq('<button/>', {
                id: 'helpMinButton',
                text: '-',
                click: function () {
                  $jqnavcon.toggle();
                  $jq(this).text(function(i,text) {
                          return text === "-" ? "+" : "-";
                      });
                }
              });
      $jqnav.append($jq("<h2>Navigation</h2>"));
      $jqnav.append($jqmin);
      $jq(document.body).append($jqnav);
      $jq.ajax({
      url: this.dataDirectoryUrl + this.dataFile,
      dataType: 'xml',
      success: function(data) {
        p = 0;  
        $jq(data).find('section').each(function() {
          var $jqul = $jq("<ul class='helpUl'/>");
          var $jqli = $jq("<li class='helpLi'/>");
          var $jqul2 = $jq("<ul/>");
          $jqli.html("<h3>" + $jq(this).text() + "<span>+</span></h3>");
          $jqli.find('h3').click(function() {
              $jq(this).find('span').text(function(i,text) {
                return text === "-" ? "+" : "-";
              });
              $jq(this).parent().find('ul').toggle();
          });
          $jqli.append($jqul2);
          $jqul.append($jqli);
          $jqnavcon.append($jqul);
          $jq(data).find('steps').eq(p).each(function() {
            j = 1;
            $jq(this).find('step').each(function () {

              var $jqnavli = $jq('<li/>', {
                class: 'helpNavline',
                click: function() {
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
                  }
                 num = parseInt(numSub);
                 this.getXml(num);
                }.bind(this)
              });
              $jqnavli.html("<p>" + (p+1) + "." + j + " " + $jq(this).find('title').find('en').text() + "</p>");
              if (p == q && j == num) {
                $jqnavli.addClass('currentNavline');
              }
              $jqul2.append($jqnavli);
              j++;

            });
          });
          p++;
        }); 
        $jqnav.append($jqnavcon);
      },
      error: function() {
        $jq('.timeline').text('Failed to get feed');
      }
  });

};

    //run
    this.createNav();
    this.getXml(num);
  }


};
