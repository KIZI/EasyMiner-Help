<?php

namespace EasyMiner\Help;

/**
 * Class Integration - class for integration of EasyMiner-Help to EasyMiner-EasyMinerCenter
 * @package EasyMiner\Help
 * @author Stanislav Vojíř
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0
 */
class Integration {
  /**
   * @var $javascriptFiles - this array contains list of javascript files for inclusion into page
   */
  public static $javascriptFiles = [
    'js/help.js'
  ];

  /**
   * @var $cssFiles - this array contains list of CSS files for inclusion into page
   */
  public static $cssFiles = [
    'css/help.css'
  ];

}