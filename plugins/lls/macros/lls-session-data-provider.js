/*\
title: $:/plugins/midorum/lls/macros/lls-session-data-provider.js
type: application/javascript
module-type: macro

Produces custom data for SRS learning session
\*/
(function () {
  "use strict";

  exports.name = "lls-session-data-provider";
  exports.params = [
    { name: "wiki", description: "Object that allows to retrieve data from the wiki" },
    { name: "direction", description: "Direction of the learning choosed by the user: 'forward', 'backward' or 'both'" },
    { name: "limit", description: "Maximum number of items to take" },
    { name: "time", description: "Current time" }
  ];
  exports.run = function (wiki, direction, limit, time) {
    // console.debug( "lls-session-data-provider", wiki, direction, limit, time)
    const takeForward = direction === "forward" || direction === "both";
    const takeBackward = direction === "backward" || direction === "both";
    const itemFitsDirection = el => (takeForward && el.forward) || (takeBackward && el.backward);
    const deleteInappropriateDirection = el => {
      if (!takeForward) el.forward = undefined;
      if (!takeBackward) el.backward = undefined;
      return el;
    };
    const bothDirectionsDueDateComparator = (o1, o2) => {
      const due1 = Math.min(o1.forward ? (o1.forward.due || wiki.SRS_BASE_TIME) : Number.MAX_SAFE_INTEGER,
        o1.backward ? (o1.backward.due || wiki.SRS_BASE_TIME) : Number.MAX_SAFE_INTEGER);
      const due2 = Math.min(o2.forward ? (o2.forward.due || wiki.SRS_BASE_TIME) : Number.MAX_SAFE_INTEGER,
        o2.backward ? (o2.backward.due || wiki.SRS_BASE_TIME) : Number.MAX_SAFE_INTEGER);
      return due1 - due2;
    };
    const focusedThenNewThenOverdue = (o1, o2) => (o1.focused && !o2.focused) ? -1
      : (!o1.focused && o2.focused) ? 1
        : (o1.due || wiki.SRS_BASE_TIME) - (o2.due || wiki.SRS_BASE_TIME);
    const focusedThenNewThenOverdueOnBase = (o1, o2) => (o1.focused && !o2.focused) ? -1
      : (!o1.focused && o2.focused) ? 1
        : (o1.base || wiki.SRS_BASE_TIME) - (o2.base || wiki.SRS_BASE_TIME);
    const isNewOrOverdue = el => !el.due || el.due < time;
    const isExists = el => !!el;
    const isFocused = title => (wiki.getTiddler(title).fields.tags || []).some(tag => focusedTags.includes(tag));
    const toMinimalDirection = el => {
      const result = !el.forward ? el.backward
        : !el.backward ? el.forward
          : (el.forward.due || wiki.SRS_BASE_TIME) <= (el.backward.due || wiki.SRS_BASE_TIME) ? el.forward
            : el.backward;
      result.focused = el.focused;
      return result;
    };
    const articleMap = {};
    var count = 0;
    // console.debug("wiki", wiki)
    const focusedTags = wiki.filterTitles("[tag[$:/lls/tags/userTag]tag[$:/lls/tags/userFocus]]");
    // console.debug("focusedTags", focusedTags);
    wiki.getTitlesWithTag("$:/lls/tags/word")
      // .slice(0, 1)
      // .map(el => {console.debug("word", el);return el;})
      .map(word => wiki.filterTitles("[tag[" + word + "]tag[$:/lls/tags/wordArticle]]")
        // .map(el => {console.debug("wa", el);return el;})
        .map(wa => {
          const srsData = wiki.getSrsData(wa);
          srsData.focused = isFocused(wa);
          return srsData;
        })
        // .map(el => { console.debug("wa srs data", el); return el; })
        .filter(itemFitsDirection)
        // .map(el => {console.debug("wa fits direction", el);return el;})
        .map(deleteInappropriateDirection)
        // .map(el => {console.debug("wa apropriate directions", el);return el;})
        .map(toMinimalDirection)
        // .map(el => { console.debug("wa minimal direction", el); return el; })
        .map(article => {
          const isArticleOverdue = isNewOrOverdue(article);
          const examples = wiki.filterTitles("[tag[" + article.src + "]tag[$:/lls/tags/usageExample]]")
            // .map(el => { console.debug("usage example for ", article.src, el); return el; })
            .map(ue => {
              const srsData = wiki.getSrsData(ue)
              const result = article.direction === "forward" ? srsData.forward : srsData.backward;
              if (result) result.focused = article.focused || isFocused(ue);
              return result;
            })
            .filter(isExists);
          if (!examples.length) {
            if (isArticleOverdue) {
              article["type"] = "$:/lls/tags/wordArticle";
              if (article.due) article.base = article.due;
              return article;
            } else return undefined;
          }
          const ue = examples.sort(focusedThenNewThenOverdue)
            .at(0);
          const isUsageExampleOverdue = isNewOrOverdue(ue);
          if (isArticleOverdue || (isUsageExampleOverdue && (article.focused || ue.focused))) {
            ue["type"] = "$:/lls/tags/usageExample";
            if (article.due) ue.base = article.due;
            return ue;
          } else return undefined;
        })
        .filter(isExists)
        // .map(el => {console.debug("wa is new or overdue", el);return el;})
        .sort(focusedThenNewThenOverdue)
        // .map(el => {console.debug("wa sorted", el);return el;})
        .at(0))
      // .map(el => { console.debug("selected article or usage example", el); return el; })
      .filter(isExists)
      .sort(focusedThenNewThenOverdue)
      // .map(el => { console.debug("selected wa after sorting", el); return el; })
      .forEach(item => {
        if (count < limit && !articleMap[item.src]) {
          articleMap[item.src] = item;
          count++;
        }
      });
    // console.debug("articleMap", Object.keys(articleMap))
    // console.debug("articleMap", articleMap)
    if (count >= limit) return Object.values(articleMap).slice(0, limit).sort(focusedThenNewThenOverdue);
    // take examples from rules if the current count is insufficient
    const ruleMap = {};
    const rules = wiki.getTitlesWithTag("$:/lls/tags/rule");
    rules
      // .slice(0, 1)
      // .map(el => { console.debug("rule 1", el, wiki.getTiddler(el).fields.brief); return el; })
      .map(rule => wiki.getSrsData(rule))
      // .map(el => { console.debug("rule 2", el); return el; })
      .filter(itemFitsDirection)
      // .map(el => { console.debug("rule 3", el); return el; })
      .map(deleteInappropriateDirection)
      // .map(el => { console.debug("rule 4", el); return el; })
      .sort(bothDirectionsDueDateComparator)
      // .map(el => { console.debug("rule 5", el); return el; })
      .map(toMinimalDirection)
      // .map(el => { console.debug("rule 6", el); return el; })
      // .filter(isNewOrOverdue)
      // .map(el => { console.debug("rule 7", el); return el; })
      .map(rule => {
        const isRuleOverdue = isNewOrOverdue(rule);
        const examples = wiki.filterTitles("[tag[" + rule.src + "]tag[$:/lls/tags/usageExample]]")
          // .map(el => { console.debug("usage example for ", rule.src, el); return el; })
          .map(ue => {
            const srsData = wiki.getSrsData(ue)
            const result = rule.direction === "forward" ? srsData.forward : srsData.backward;
            if (result) result.focused = isFocused(ue);
            return result;
          })
          .filter(el => !!el && !articleMap[el.src]);
        if (!examples.length) {
          return undefined;
        }
        const ue = examples.sort(focusedThenNewThenOverdue)
          .at(0);
        const isUsageExampleOverdue = isNewOrOverdue(ue);
        if (isRuleOverdue || isUsageExampleOverdue) {
          ue["type"] = "$:/lls/tags/usageExample";
          if (rule.due) ue.base = rule.due;
          return ue;
        } else return undefined;
      })
      .filter(isExists)
      .forEach(item => {
        if (!ruleMap[item.src]) ruleMap[item.src] = item;
      });
    // console.debug("ruleMap", Object.keys(ruleMap))
    // console.debug("ruleMap", ruleMap)
    return Object.values(articleMap).concat(Object.values(ruleMap).slice(0, limit - count)).sort(focusedThenNewThenOverdueOnBase);
  };

})();