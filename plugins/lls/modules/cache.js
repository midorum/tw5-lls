/*\
title: $:/plugins/midorum/lls/modules/cache.js
type: application/javascript
module-type: utils

Simple cache.

\*/
(function () {

  /*jslint node: true, browser: true */
  /*global $tw: false */
  "use strict";

  const prefixesCache = (function () {
    var prefixes;
    return {
      get: function (keys) {
        if (!prefixes) {
          prefixes = $tw.wiki.getTiddlerData("$:/plugins/midorum/lls/data/prefixes", []);
        }
        const result = {};
        if (!keys.length) {
          Object.assign(result, prefixes);
        } else {
          keys.filter(key => prefixes[key]).forEach(key => result[key] = prefixes[key]);
        }
        return result;
      }
    }
  })();

  const tagsCache = (function () {
    var tags;
    return {
      get: function (keys) {
        if (!tags) {
          tags = $tw.wiki.getTiddlerData("$:/plugins/midorum/lls/data/tags", []);
        }
        const result = {};
        if (!keys.length) {
          Object.assign(result, tags);
        } else {
          keys.filter(key => tags[key]).forEach(key => result[key] = tags[key]);
        }
        return result;
      }
    }
  })();

  const llsFilterOperatorsCache = (function () {
    var operators;
    return {
      get: function (operator) {
        if (!operators) {
          operators = {};
          $tw.modules.applyMethods("llsfilteroperator", operators);
        }
        return operators[operator];
      }
    }
  })();

  exports.getPrefixes = function (keys) {
    return prefixesCache.get(keys);
  };

  exports.getTags = function (keys) {
    return tagsCache.get(keys);
  };

  exports.getLlsFilterOperator = function (operator) {
    return llsFilterOperatorsCache.get(operator)
  }

})();