/*\
$:/plugins/midorum/lls/filteroperators/tokens.js
type: application/javascript
module-type: llsfilteroperator

Splits usage example to tokens and find for each apropriate word article

\*/

(function () {

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";

	const utils = require("$:/plugins/midorum/lls/modules/utils.js").llsUtils;
	const cache = require("$:/plugins/midorum/lls/modules/cache.js");

	exports.tokens = function (source, operator, options) {
		if (!operator.operands || !operator.operands.length || utils.trim(operator.operands[0]) === "") {
			return ["Error: 'tokens' operator requires at least one operand"];
		}
		const context = {
			prefixes: cache.getPrefixes(["word", "wordArticle", "usageExample"]),
			tags: cache.getTags(["word"]),
			wiki: options.wiki
		}
		const usageExampleTitle = utils.trimToUndefined(operator.operands[0]);
		if (!usageExampleTitle || !usageExampleTitle.startsWith(context.prefixes.usageExample)) {
			return ["Error: 'tokens' operator requires word uasge example tiddler title as an operand"];
		}
		const usageExampleTiddler = options.wiki.getTiddler(usageExampleTitle);
		if (!usageExampleTiddler) {
			return ["Error: 'tokens' operator cannot find word uasge example tiddler"];
		}
		const original = usageExampleTiddler.fields.original;
		if (!original) {
			return [];
		}
		const splittedOriginal = original.split(new RegExp("\\s|\\.|,|:|;"));
		const linkedArticles = (usageExampleTiddler.fields.tags || [])
			.filter(tag => tag.startsWith(context.prefixes.wordArticle))
			.map(tag => options.wiki.getTiddler(tag));
		const linkedWords = {};
		linkedArticles.forEach(article => {
			const wordTiddler = getWordTiddlerByArticle(article, context);
			if (wordTiddler && wordTiddler.fields.text) {
				if (!linkedWords[wordTiddler.fields.text]) {
					linkedWords[wordTiddler.fields.text] = [article];
				} else {
					linkedWords[wordTiddler.fields.text].push(article);
				}
			}
		});
		const allWords = {};
		utils.allTiddlersWithTag(context.tags.word)
			.map(t => {
				return {
					spelling: t.fields.text,
					tiddler: t
				};
			})
			.forEach(w => allWords[w.spelling] = w.tiddler);
		const tokens = usageExampleTiddler.fields.tokens || [];
		if (!tokens.length) {
			splittedOriginal
				.filter(entry => entry !== "")
				.map(entry => {
					const token = {
						word: entry
					};
					if (linkedWords[entry]) {
						if (linkedWords[entry].length === 1) {
							token.ref = linkedWords[entry][0].fields.title;
							token.type = "wordArticle";
						} else if (linkedWords[entry].length > 1) {
							token.type = "word";
						}
					} else if(allWords[entry]){
						token.type = "word";
					} else {
						token.type = "new";
					}
					tokens.push(token);
				});
		}

		console.log("tokens", tokens);
		return [JSON.stringify(tokens)];
	};

	function getWordTiddlerByArticle(article, context) {
		const wordTitile = (article.fields.tags || [])
			.find(tag => tag.startsWith(context.prefixes.word));
		return wordTitile ? context.wiki.getTiddler(wordTitile) : undefined;
	}

})();