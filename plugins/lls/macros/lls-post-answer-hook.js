/*\
title: $:/plugins/midorum/lls/macros/lls-post-answer-hook.js
type: application/javascript
module-type: macro

\*/
(function () {
  "use strict";

  const stateTitle = require("$:/plugins/midorum/lls/modules/cache.js").getTags({}).lastAnswerTime;

  exports.name = "lls-post-answer-hook";
  exports.params = [
    { name: "wiki" },
    { name: "params" }
  ];
  exports.run = function (wiki, params) {
    wiki.addTiddler(new $tw.Tiddler(
      {
        title: stateTitle,
        type: "text/plain",
        text: params.time
      },
      wiki.getModificationFields()));
  };

})();