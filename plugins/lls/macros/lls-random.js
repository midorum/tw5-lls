/*\
title: $:/lls/macros/lls-random.js
type: application/javascript
module-type: macro



\*/

(function(){
"use strict";

exports.name = "lls-random";
exports.params = [];
exports.run = function() {
  const random = Math.random();
  return random === 0 ? random : random - 0.0000000000000001;
};

})();