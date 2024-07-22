/*\
title: $:/plugins/midorum/lls/filterrunprefixes/appendMissing.js
type: application/javascript
module-type: filterrunprefix

Behaves like default dominant appending, but preserve the very first position for duplicated elements. 

\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.appendMissing = function (operationSubFunction, options) {
	return function (results, source, widget) {
		// perform current filter run in regular manner
		const currentRun = new $tw.utils.LinkedList();
		currentRun.pushTop(operationSubFunction(source, widget));
		// except from current run all previous runs results
		currentRun.remove(results.toArray());
		// append current filter run to cumulative result
		results.pushTop(currentRun.toArray());
	};
};