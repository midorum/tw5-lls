/*\
title: $:/plugins/midorum/lls/filteroperators/lls.js
type: application/javascript
module-type: filteroperator

A namespace for lls filters.

\*/

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

const cache = require("$:/plugins/midorum/lls/modules/cache.js");

exports.lls = function (source, operator, options) {
	const suffixOperator = operator.suffixes[0];
	var llsFilterOperator = cache.getLlsFilterOperator(suffixOperator);
	if (!llsFilterOperator) {
		return ["Error: Operator not found: " + suffixOperator];
	}
	return llsFilterOperator(source, operator, options);
};