/*\
title: $:/plugins/midorum/lls/macros/lls-pre-create-hook.js
type: application/javascript
module-type: macro

\*/
(function () {
  "use strict";

  const utils = require("$:/plugins/midorum/lls/modules/utils.js").llsUtils;
  const cache = require("$:/plugins/midorum/lls/modules/cache.js");

  exports.name = "lls-pre-create-hook";
  exports.params = [
    { name: "wiki" },
    { name: "params" }
  ];
  exports.run = function (wiki, params) {
    const calculateStaticticMacro = $tw.macros["lls-calculate-statistic"];
    if (!calculateStaticticMacro) throw Error("It seems that calculate statistic macro is missed");
    const tags = cache.getTags({});
    const now = new Date().getTime();
    const wikiUtils = utils.getWikiUtils(wiki);
    const stateTiddler = wikiUtils.withTiddler(tags.lastAnswerTime);
    const time = stateTiddler.exists() ? utils.parseInteger(stateTiddler.getTiddlerField("text"), now) : now;
    logStatistic(tags.wordArticleStatisticLog, tags.wordArticle, time, calculateStaticticMacro, wikiUtils);
    logStatistic(tags.ruleStatisticLog, tags.rule, time, calculateStaticticMacro, wikiUtils);
    logStatistic(tags.usageExampleStatisticLog, tags.usageExample, time, calculateStaticticMacro, wikiUtils);
    return true; // proceed creating an SRS session
  };

  function logStatistic(log, tag, time, calculateStaticticMacro, wikiUtils) {
    const logTiddler = wikiUtils.withTiddler(log);
    const logContent = logTiddler.getTiddlerField("text");
    const lastRecordTime = getLastRecordTime(logContent);
    if (isSameDay(lastRecordTime, time)) return; // do not write extra log for the same day
    const statistic = calculateStaticticMacro.run("[tag[" + tag + "]]", wikiUtils.wiki);
    logTiddler.doNotInvokeSequentiallyOnSameTiddler.updateTiddler({
      type: "text/plain",
      text: (logContent ? (logContent + "\n") : "") + statistic
    });
  }

  function getLastRecordTime(logContent) {
    if (!logContent) return undefined;
    const records = logContent.trim().split("\n");
    const lastRecord = records.length ? records[records.length - 1] : undefined;
    if (lastRecord) {
      const delimiterIndex = lastRecord.indexOf(";");
      if (delimiterIndex > -1) {
        return utils.parseInteger(lastRecord.substring(0, delimiterIndex));
      }
    }
    return undefined;
  }

  function isSameDay(timestamp1, timestamp2) {
    if (!timestamp1 || !timestamp2) return false;
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

})();