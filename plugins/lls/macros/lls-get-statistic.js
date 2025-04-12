/*\
title: $:/plugins/midorum/lls/macros/lls-get-statistic.js
type: application/javascript
module-type: macro

\*/
(function () {
  "use strict";

  const utils = require("$:/plugins/midorum/lls/modules/utils.js").llsUtils;
  const cache = require("$:/plugins/midorum/lls/modules/cache.js");

  exports.name = "lls-get-statistic";
  exports.params = [
    { name: "count" },
    { name: "wiki" }
  ];
  exports.run = function (count, wiki) {
    const calculateStaticticMacro = $tw.macros["lls-calculate-statistic"];
    if (!calculateStaticticMacro) throw Error("It seems that calculate statistic macro is missed");
    wiki = wiki || $tw.rootWidget.wiki;
    const wikiUtils = utils.getWikiUtils(wiki);
    const tags = cache.getTags({});
    const logCount = getLogCount(count || wikiUtils.withTiddler("$:/lls/state/statisticHistory").getTiddlerDataByIndex("historyCount"));
    const now = new Date().getTime();
    const s = {};
    s.wordAricleLog = getLastLogRecords(tags.wordArticleStatisticLog, logCount, wikiUtils);
    s.ruleLog = getLastLogRecords(tags.ruleStatisticLog, logCount, wikiUtils);
    s.usageExampleLog = getLastLogRecords(tags.usageExampleStatisticLog, logCount, wikiUtils);
    s.wordArticleCurrent = calculateStaticticMacro.run("[tag[" + tags.wordArticle + "]]", now, wikiUtils.wiki);
    s.ruleCurrent = calculateStaticticMacro.run("[tag[" + tags.rule + "]]", now, wikiUtils.wiki);
    s.usageExampleCurrent = calculateStaticticMacro.run("[tag[" + tags.usageExample + "]]", now, wikiUtils.wiki);
    const result = {
      count: logCount + 1,
      wordAricleLog: s.wordAricleLog.map(r => formatRecord(r)),
      ruleLog: s.ruleLog.map(r => formatRecord(r)),
      usageExampleLog: s.usageExampleLog.map(r => formatRecord(r)),
      wordArticleCurrent: formatRecord(s.wordArticleCurrent),
      ruleCurrent: formatRecord(s.ruleCurrent),
      usageExampleCurrent: formatRecord(s.usageExampleCurrent)
    };
    return JSON.stringify(result);
  };

  function getLogCount(count) {
    const c = utils.parseInteger(count, 1);
    return c > 0 ? c - 1 : 0;
  }

  function getLastLogRecords(log, count, wikiUtils) {
    if (count > 0) {
      const logInstance = wikiUtils.withTiddler(log);
      const content = logInstance.getTiddlerField("text");
      if (content) {
        return content.split("\n").slice(-1 * count);
      }
    }
    return [];
  }

  function formatRecord(record) {
    const chanks = record.split(";");
    const forwardStatistic = chanks[2].split(",");
    const backwardStatistic = chanks[3].split(",");
    const result = {
      time: formatDate(new Date(utils.parseInteger(chanks[0]))),
      total: utils.parseInteger(chanks[1]),
      forward: {
        overdue: utils.parseInteger(forwardStatistic[0]),
        d1: utils.parseInteger(forwardStatistic[1]),
        d2: utils.parseInteger(forwardStatistic[2]),
        d3: utils.parseInteger(forwardStatistic[3]),
        w1: utils.parseInteger(forwardStatistic[4]),
        w2: utils.parseInteger(forwardStatistic[5]),
        m1: utils.parseInteger(forwardStatistic[6]),
        m3: utils.parseInteger(forwardStatistic[7]),
        m6: utils.parseInteger(forwardStatistic[8]),
        y1: utils.parseInteger(forwardStatistic[9])
      },
      backward: {
        overdue: utils.parseInteger(backwardStatistic[0]),
        d1: utils.parseInteger(backwardStatistic[1]),
        d2: utils.parseInteger(backwardStatistic[2]),
        d3: utils.parseInteger(backwardStatistic[3]),
        w1: utils.parseInteger(backwardStatistic[4]),
        w2: utils.parseInteger(backwardStatistic[5]),
        m1: utils.parseInteger(backwardStatistic[6]),
        m3: utils.parseInteger(backwardStatistic[7]),
        m6: utils.parseInteger(backwardStatistic[8]),
        y1: utils.parseInteger(backwardStatistic[9])
      }
    };
    result.forward.overdueP = toPercent(result.total, result.forward.overdue, 2);
    result.backward.overdueP = toPercent(result.total, result.backward.overdue, 2);
    result.forward.passed = getPassedCount(result.forward);
    result.backward.passed = getPassedCount(result.backward);
    result.forward.passedP = toPercent(result.total, result.forward.passed, 2);
    result.backward.passedP = toPercent(result.total, result.backward.passed, 2);
    result.forward.new = result.total - result.forward.overdue - result.forward.passed;
    result.backward.new = result.total - result.backward.overdue - result.backward.passed;
    result.forward.newP = toPercent(result.total, result.forward.new, 2);
    result.backward.newP = toPercent(result.total, result.backward.new, 2);
    result.forward.wamP = getWAMP(result.total, result.forward);
    result.backward.wamP = getWAMP(result.total, result.backward);
    return result;
  }

  function formatDate(date) {
    return ("" + date.getFullYear()).slice(-2)
      + "/" + ("0" + (date.getMonth() + 1)).slice(-2)
      + "/" + ("0" + date.getDate()).slice(-2)
      + " " + ("0" + date.getHours()).slice(-2)
      + ":" + ("0" + date.getMinutes()).slice(-2);
  }

  function toPercent(total, part, precision) {
    if (total === 0) return undefined;
    const p = isNaN(precision) ? 1 : Math.pow(10, precision);
    return (Math.round(part / total * 100 * p) / p).toFixed(precision);
  }

  function getPassedCount(o) {
    return o.y1 + o.m6 + o.m3 + o.m1 + o.w2 + o.w1 + o.d3 + o.d2 + o.d1;
  }

  function getWAMP(total, o) {
    const denominator = utils.statistic.D1 + utils.statistic.D2 + utils.statistic.D3 + utils.statistic.W1 + utils.statistic.W2
      + utils.statistic.M1 + utils.statistic.M3 + utils.statistic.M6 + utils.statistic.Y1;
    const numerator = o.d1 * utils.statistic.D1 + o.d2 * utils.statistic.D2 + o.d3 * utils.statistic.D3 + o.w1 * utils.statistic.W1
      + o.w2 * utils.statistic.W2 + o.m1 * utils.statistic.M1 + o.m3 * utils.statistic.M3 + o.m6 * utils.statistic.M6 + o.y1 * utils.statistic.Y1;
    return toPercent(total * utils.statistic.Y1 / denominator, numerator / denominator, 2);
  }

})();