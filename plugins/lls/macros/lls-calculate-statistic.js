/*\
title: $:/plugins/midorum/lls/macros/lls-calculate-statistic.js
type: application/javascript
module-type: macro

\*/
(function () {
  "use strict";

  const utils = require("$:/plugins/midorum/lls/modules/utils.js").llsUtils;
  const stateTitle = require("$:/plugins/midorum/lls/modules/cache.js").getTags({}).lastAnswerTime;

  exports.name = "lls-calculate-statistic";
  exports.params = [
    { name: "filter" },
    { name: "time" },
    { name: "wiki" }
  ];
  exports.run = function (filter, time, wiki) {
    if (!filter) return "Error: The 'filter' attribute should be defined";
    wiki = wiki || $tw.rootWidget.wiki;
    const wikiUtils = utils.getWikiUtils(wiki);
    time = time || utils.parseInteger(wikiUtils.withTiddler(stateTitle).getTiddlerField("text"), new Date().getTime());
    const basetime = new Date(2000, 0, 1).getTime();
    const c = utils.statistic;
    // console.debug("lls-calculate-statistic", filter, wiki, time)
    const d1v = c.D1 * c.DAY_MS + time,
      d2v = c.D2 * c.DAY_MS + time,
      d3v = c.D3 * c.DAY_MS + time,
      w1v = c.W1 * c.DAY_MS + time,
      w2v = c.W2 * c.DAY_MS + time,
      m1v = c.M1 * c.DAY_MS + time,
      m3v = c.M3 * c.DAY_MS + time,
      m6v = c.M6 * c.DAY_MS + time,
      y1v = c.Y1 * c.DAY_MS + time;
    var fo = 0, fd1 = 0, fd2 = 0, fd3 = 0, fw1 = 0, fw2 = 0, fm1 = 0, fm3 = 0, fm6 = 0, fy1 = 0;
    var bo = 0, bd1 = 0, bd2 = 0, bd3 = 0, bw1 = 0, bw2 = 0, bm1 = 0, bm3 = 0, bm6 = 0, by1 = 0;
    const list = wikiUtils.filterTiddlers(filter)
      .map(el => {
        const tiddler = wikiUtils.withTiddler(el);
        return {
          fd: utils.parseInteger(tiddler.getTiddlerField("srs-forward-due"), basetime),
          bd: utils.parseInteger(tiddler.getTiddlerField("srs-backward-due"), basetime)
        };
      });
    list.forEach(el => {
      if (el.fd > y1v) fy1++;
      else if (el.fd > m6v) fm6++;
      else if (el.fd > m3v) fm3++;
      else if (el.fd > m1v) fm1++;
      else if (el.fd > w2v) fw2++;
      else if (el.fd > w1v) fw1++;
      else if (el.fd > d3v) fd3++;
      else if (el.fd > d2v) fd2++;
      else if (el.fd > d1v) fd1++;
      else if (el.fd > basetime) fo++;
      if (el.bd > y1v) by1++;
      else if (el.bd > m6v) bm6++;
      else if (el.bd > m3v) bm3++;
      else if (el.bd > m1v) bm1++;
      else if (el.bd > w2v) bw2++;
      else if (el.bd > w1v) bw1++;
      else if (el.bd > d3v) bd3++;
      else if (el.bd > d2v) bd2++;
      else if (el.bd > d1v) bd1++;
      else if (el.bd > basetime) bo++;
    });
    // time;total;fw_overdue,fw_d1,fw_d2,fw_d3,fw_w1,fw_w2,fw_m1,fw_m3,fw_m6,fw_y1;bw_overdue,bw_d1,bw_d2,bw_d3,bw_w1,bw_w2,bw_m1,bw_m3,bw_m6,bw_y1
    return "" + time + ";" + list.length + ";"
      + fo + "," + fd1 + "," + fd2 + "," + fd3 + "," + fw1 + "," + fw2 + "," + fm1 + "," + fm3 + "," + fm6 + "," + fy1 + ";"
      + bo + "," + bd1 + "," + bd2 + "," + bd3 + "," + bw1 + "," + bw2 + "," + bm1 + "," + bm3 + "," + bm6 + "," + by1;
  };

})();