import './css/bootstrap.min.css';
import './css/bootstrap-datepicker.min.css';
import './css/tabulator.min.css';
import './css/ui.fancytree.min.css';

import './js/jquery-3.7.1.min.js';
window.$ = window.jQuery = jQuery;
import './js/jquery-ui.min.js';
import './js/bootstrap.bundle.min.js';
import './js/bootstrap-datepicker.min.js';
import './js/tabulator.min.js';
import './js/luxon.min.js';
import './js/xlsx.full.min.js';
import './js/exceljs.min.js';
import './js/jquery.fancytree.glyph.js';
import './js/jquery.fancytree.filter.js';
import './js/pharm_fs_main_report_driver.js';

window.onload = function () {
  if (typeof initialLoad === 'function') {
    initialLoad();
  }
};