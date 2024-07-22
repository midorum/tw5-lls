/*\
$:/plugins/midorum/lls/filteroperators/absent.js
type: application/javascript
module-type: llsfilteroperator

Filters tiddlers with absent lls tags

TODO: Also filter tiddlers with non-existent lls tags

\*/

(function () {

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";

	const utils = require("$:/plugins/midorum/lls/modules/utils.js").llsUtils;
	const cache = require("$:/plugins/midorum/lls/modules/cache.js");

	exports.absent = function (source, operator, options) {
		if (!operator.operands || !operator.operands.length || utils.trim(operator.operands[0]) === "") {
			return ["Error: 'absent' operator requires at least one operand"];
		}
		const operands = operator.operands.map(operand => utils.trim(operand));
		const prefixes = cache.getPrefixes(operands);
		const values = Object.values(prefixes);
		const valuesCount = values.length;
		if (valuesCount == 0) return ["Error: unknown operand(s): " + operands];
		if (valuesCount != 1) return ["Error: 'absent' operator supports only one operand for now"];
		const prefix = values[0];
		const isNegated = operator.prefix === "!";
		var results = new $tw.utils.LinkedList();
		source(function (tiddler, title) {
			const tiddlerTags = tiddler.fields.tags || [];
			const foundTag = tiddlerTags.find(tag => tag && tag.startsWith(prefix));
			if ((isNegated && foundTag) || (!isNegated && !foundTag))
				results.pushTop(tiddler.fields.title);
		});
		return results.makeTiddlerIterator(options.wiki);
	};

})();