/*\
title: $:/plugins/midorum/lls/filterrunprefixes/glue.js
type: application/javascript
module-type: filterrunprefix

\*/
(function () {

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";

	/*
	Export our filter prefix function
	*/
	exports.glue = function (operationSubFunction) {
		return function (results, source, widget) {
			const firstRunResults = results.toArray();
			const secondRunResults = operationSubFunction(source, widget);
			const maxLength = Math.max(firstRunResults.length, secondRunResults.length);
			results.clear();
			for (let i = 0; i < maxLength; i++) {
				if (firstRunResults[i] && secondRunResults[i]) results.push(firstRunResults[i] + "" + secondRunResults[i]);
				else if (firstRunResults[i]) results.push(firstRunResults[i]);
				else if (secondRunResults[i]) results.push(secondRunResults[i]);
			}
		};
	};

})();
