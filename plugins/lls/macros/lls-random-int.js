/*\
title: $:/lls/macros/lls-random-int.js
type: application/javascript
module-type: macro



\*/

(function(){
"use strict";

exports.name = "lls-random-int";
exports.params = [
    {name: "max"}
];
exports.run = function(max) {
    const m = max || Date.now();
    return Math.floor(Math.random() * m);
};

})();