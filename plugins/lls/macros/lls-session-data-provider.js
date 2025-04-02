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
    const dueDateComparator = (o1, o2) => (o1.due || wiki.SRS_BASE_TIME) - (o2.due || wiki.SRS_BASE_TIME);
    const isNewOrOverdue = el => !el.due || el.due < time;
    const isExists = el => !!el;
    const toMinimalDirection = el => {
      if (!el.forward) return el.backward;
      if (!el.backward) return el.forward;
      const fd = el.forward.due || wiki.SRS_BASE_TIME;
      const bd = el.backward.due || wiki.SRS_BASE_TIME;
      return fd <= bd ? el.forward : el.backward;
    };
    const articleMap = {};
    var count = 0;
    wiki.getTitlesWithTag("$:/lls/tags/word")
      // .slice(0, 1)
      // .map(el => {console.debug("word", el);return el;})
      .map(word => wiki.filterTitles("[tag[" + word + "]tag[$:/lls/tags/wordArticle]]")
        // .map(el => {console.debug("wa", el);return el;})
        .map(wa => wiki.getSrsData(wa))
        // .map(el => {console.debug("wa srs data", el);return el;})
        .filter(itemFitsDirection)
        // .map(el => {console.debug("wa fits direction", el);return el;})
        .map(deleteInappropriateDirection)
        // .map(el => {console.debug("wa apropriate directions", el);return el;})
        .map(toMinimalDirection)
        // .map(el => {console.debug("wa minimal direction", el);return el;})
        .filter(isNewOrOverdue)
        // .map(el => {console.debug("wa is new or overdue", el);return el;})
        .sort(dueDateComparator)
        .at(0))
      // .map(el => { console.debug("selected wa", el); return el; })
      .filter(isExists)
      .sort(dueDateComparator)
      // .map(el => { console.debug("wa after sorting", el); return el; })
      .slice(0, limit)
      // .map(el => { console.debug("wa after limit", el); return el; })
      .forEach(article => {
        const examples = wiki.filterTitles("[tag[" + article.src + "]tag[$:/lls/tags/usageExample]]")
          // .map(el => { console.debug("usage example for ", article.src, el); return el; })
          .map(ue => {
            const srsData = wiki.getSrsData(ue)
            return article.direction === "forward" ? srsData.forward : srsData.backward;
          })
          .filter(isExists);
        if (!examples.length && !articleMap[article.src]) {
          article["type"] = "$:/lls/tags/wordArticle";
          articleMap[article.src] = article;
          count++;
          return;
        }
        examples.filter(el => !articleMap[el.src])
          .sort(dueDateComparator)
          .slice(0, 1)
          .forEach(el => {
            el["type"] = "$:/lls/tags/usageExample";
            articleMap[el.src] = el;
            count++;
          });
      });
    // console.debug("articleMap", Object.keys(articleMap))
    // console.debug("articleMap", articleMap)
    if (count >= limit) {
      return Object.values(articleMap).slice(0, limit).sort(dueDateComparator);

    }
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
      .filter(isNewOrOverdue)
      // .map(el => { console.debug("rule 7", el); return el; })
      .forEach(ruleEl => {
        return wiki.filterTitles("[tag[" + ruleEl.src + "]tag[$:/lls/tags/usageExample]]")
          // .map(el => { console.debug("usage example for ", ruleEl.src, el); return el; })
          .filter(el => !articleMap[el])
          .map(ue => {
            const srsData = wiki.getSrsData(ue)
            return ruleEl.direction === "forward" ? srsData.forward : srsData.backward;
          })
          .filter(el => !!el && !ruleMap[el.src])
          .sort(dueDateComparator)
          .slice(0, 1)
          .forEach(el => {
            el["type"] = "$:/lls/tags/usageExample";
            ruleMap[el.src] = el;
          });
      })

    // console.debug("ruleMap", Object.keys(ruleMap))
    // console.debug("ruleMap", ruleMap)
    return Object.values(articleMap).concat(Object.values(ruleMap).slice(0, limit - count)).sort(dueDateComparator);
  };

})();