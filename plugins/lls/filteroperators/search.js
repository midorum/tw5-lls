/*\
$:/plugins/midorum/lls/filteroperators/search.js
type: application/javascript
module-type: llsfilteroperator

Full text search through lls database

\*/

(function () {

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";

	const DEFAULT_SEARCH_LIMIT = 100;
	const utils = require("$:/plugins/midorum/lls/modules/utils.js").llsUtils;
	const cache = require("$:/plugins/midorum/lls/modules/cache.js");

	exports.search = function (source, operator, options) {
		const predicate = utils.trim(operator.operands[0]);
		const defaultPeriod = getDefaultPeriodBounds(-7);
		const searchPeriod = {
			start: utils.parseInteger(utils.trim(operator.operands[1]), defaultPeriod.start),
			end: utils.parseInteger(utils.trim(operator.operands[2]), defaultPeriod.end)
		};;
		const searchOptions = getSearchOptions(operator.suffix);
		const context = {
			prefixes: cache.getPrefixes([]),
			tags: cache.getTags([]),
			wiki: options.wiki,
			wikiUtils: utils.getWikiUtils(options.wiki)
		};
		if (searchOptions.log) {
			console.log("operator", operator,
				"\npredicate", predicate,
				"\nsearchPeriod", searchPeriod, { start: new Date(searchPeriod.start), end: new Date(searchPeriod.end) },
				"\nsearchOptions", searchOptions);
		}
		// if (predicate == "") return ["Error: 'search' operator requires at least one operand"];//fixme
		if (searchOptions.searchOnly && predicate == "") return [];
		if (searchOptions.getExamples) {
			return getExamples(predicate, searchPeriod, searchOptions, source, context);
		} else if (searchOptions.getUserTags) {
			return getUserTags(predicate, searchPeriod, searchOptions, source, context);
		} else if (searchOptions.getRules) {
			return getRules(predicate, searchPeriod, searchOptions, source, context);
		}
		return getWords(predicate, searchPeriod, searchOptions, source, context);
	};

	function getWords(predicate, searchPeriod, searchOptions, source, context) {
		const exactMatch = [];
		const startsWith = [];
		const inWordMatch = [];
		const inMeaningMatch = [];
		const restWords = [];
		const articlesFromMeanings = {};
		const counter = createCounter(searchOptions.limit);
		source(function (tiddler, title) {
			if (counter.limitReached()) return;
			if (!tiddler) return;
			if (!tiddler.fields.tags) return;
			const tiddlerTags = tiddler.fields.tags;
			if (tiddlerTags.includes(context.tags.word)) {
				const articles = getRelatedArticles(title, context);
				if (!articles.length) return;
				const isInPeriod = articleRelatedInPeriod(articles, searchPeriod, context);
				if (predicate == "") {
					if (isInPeriod) {
						inWordMatch.push(tiddler);
						counter.inc();
					}
					return;
				}
				if (searchOptions.recent && !isInPeriod) {
					return;
				}
				if (tiddler.fields.text === predicate) {
					exactMatch.push(tiddler);
					counter.inc();
					return;
				}
				if (tiddler.fields.text.startsWith(predicate)) {
					startsWith.push(tiddler);
					counter.inc();
					return;
				}
				if (tiddler.fields.text.indexOf(predicate) != -1) {
					inWordMatch.push(tiddler);
					counter.inc();
					return;
				}
				restWords.push({ word: tiddler, articles: articles });
			} else if (searchOptions.searchAmongMeanings && tiddlerTags.includes(context.tags.wordMeaning)) {
				if (predicate == "") return;
				const articles = getRelatedArticles(tiddler.fields.title, context);
				if (searchOptions.recent && !articleRelatedInPeriod(articles, searchPeriod, context)) return;
				if (tiddler.fields.text.indexOf(predicate) != -1) {
					articles.forEach(article => articlesFromMeanings[article.fields.title] = article);
				}
			} else if (searchOptions.searchAmongExamples) {
				// TBD
			}
		});
		if (!counter.limitReached()) {
			restWords.forEach(entry => {
				if (counter.limitReached()) return;
				if (entry.articles.find(article => articlesFromMeanings[article.fields.title])) {
					inMeaningMatch.push(entry.word);
					counter.inc();
				}
			});
		}
		const results = exactMatch.concat(startsWith).concat(inWordMatch).concat(inMeaningMatch).map(tiddler => tiddler.fields.title);
		if (searchOptions.log) {
			console.log("exactMatch", exactMatch);
			console.log("startsWith", startsWith);
			console.log("inWordMatch", inWordMatch);
			console.log("inMeaningMatch", inMeaningMatch);
			console.log("restWords", restWords);
			console.log("articlesFromMeanings", articlesFromMeanings);
		}
		return results;
	}

	function getExamples(predicate, searchPeriod, searchOptions, source, context) {
		const match = [];
		const counter = createCounter(searchOptions.limit);
		const lo = predicate.toLowerCase();
		source(function (tiddler, title) {
			if (counter.limitReached()) return;
			if (!tiddler) return;
			if (!tiddler.fields.tags) return;
			const tiddlerTags = tiddler.fields.tags;
			if (tiddlerTags.includes(context.tags.usageExample)) {
				if (tiddler.fields.original.toLowerCase().includes(lo)
					|| tiddler.fields.translation.toLowerCase().includes(lo)) {
					match.push(tiddler);
					counter.inc();
					return;
				}
			}
		});
		const results = match.map(tiddler => tiddler.fields.title);
		if (searchOptions.log) {
			console.log("match", match);
		}
		return results;
	}

	function getUserTags(predicate, searchPeriod, searchOptions, source, context) {
		const match = [];
		const counter = createCounter(searchOptions.limit);
		const lo = predicate.toLowerCase();
		source(function (tiddler, title) {
			if (counter.limitReached()) return;
			if (!tiddler) return;
			if (!tiddler.fields.tags) return;
			const tiddlerTags = tiddler.fields.tags;
			if (tiddlerTags.includes(context.tags.userTag)) {
				if ((tiddler.fields.name && tiddler.fields.name.toLowerCase().includes(lo))
					|| (tiddler.fields.text && tiddler.fields.text.toLowerCase().includes(lo))) {
					match.push(tiddler);
					counter.inc();
					return;
				}
			}
		});
		const results = match.map(tiddler => tiddler.fields.title);
		if (searchOptions.log) {
			console.log("match", match);
		}
		return results;
	}

	function getRules(predicate, searchPeriod, searchOptions, source, context) {
		const startsWith = [];
		const contains = [];
		const textContains = [];
		const counter = createCounter(searchOptions.limit);
		const lo = predicate.toLowerCase();
		source(function (tiddler, title) {
			if (counter.limitReached()) return;
			if (!tiddler) return;
			if (!tiddler.fields.tags) return;
			const tiddlerTags = tiddler.fields.tags;
			if (!tiddlerTags.includes(context.tags.rule)) return;
			if (tiddler.fields.brief) {
				const brief = tiddler.fields.brief.toLowerCase();
				if (brief.startsWith(lo)) {
					startsWith.push(tiddler);
					counter.inc();
					return;
				}
				if (brief.includes(lo)) {
					contains.push(tiddler);
					counter.inc();
					return;
				}
			}
			if (tiddler.fields.text && tiddler.fields.text.toLowerCase().includes(lo)) {
				textContains.push(tiddler);
				counter.inc();
				return;
			}
		});
		const results = startsWith.concat(contains).concat(textContains).map(tiddler => tiddler.fields.title);
		if (searchOptions.log) {
			console.log("startsWith", startsWith,
				"\ncontains", contains,
				"\ntextContains", textContains
			);
		}
		return results;
	}

	function getRelatedArticles(relatedTiddlerTitle, context) {
		return context.wiki.getTiddlersWithTag(relatedTiddlerTitle).map(title =>
			context.wiki.getTiddler(title)).filter((tiddler) =>
				tiddler.fields && tiddler.fields.tags && tiddler.fields.tags.includes(context.tags.wordArticle));
	}

	function getSearchOptions(suffix) {
		const searchOptions = {
			limit: DEFAULT_SEARCH_LIMIT
		};
		suffix.split(":").forEach(option => {
			if (option === "log") { // log search data into console
				searchOptions.log = true;
			} if (option === "searchOnly") { // do not search when predicate is empty
				searchOptions.searchOnly = true;
			} if (option === "recent") { // consider search period (by default ignore except empty predicate)
				searchOptions.recent = true;
			} if (option === "meanings") { // search among word meanings
				searchOptions.searchAmongMeanings = true;
			} if (option === "examples") { // TBD: search among usage examples
				searchOptions.searchAmongExamples = true;
			} if (option === "caseSensitive") { // TBD: consider predicate case 
				searchOptions.caseSensitive = true;
			} if (option === "getExamples") { // search among usage examples and return usage examples (by default return words)
				searchOptions.getExamples = true;
			} if (option === "getUserTags") { // search among user tags and return user tags (by default return words)
				searchOptions.getUserTags = true;
			} if (option === "getRules") { // search among grammar rules and return grammar rules (by default return words)
				searchOptions.getRules = true;
			} if (option.startsWith("limit")) { // found entries maximum count
				const parts = option.split("=");
				if (parts[1]) {
					const parsed = Number.parseInt(parts[1]);
					if (!Number.isNaN(parsed)) {
						searchOptions.limit = parsed > 0 ? parsed : Number.MAX_SAFE_INTEGER;
					}
				}
			}
		});
		return searchOptions;
	}

	function createCounter(limit) {
		var counter = 0;
		return {
			inc: function () {
				return ++counter >= limit;
			},
			limitReached: function () {
				return counter >= limit;
			},
			log: function () {
				console.log("counter", counter, "limitReached", counter >= limit);
			}
		}
	}

	function getDefaultPeriodBounds(offset) {
		const base = new Date();
		base.setDate(base.getDate() + offset)
		return {
			start: base.getTime(),
			end: Date.now()
		}
	}

	function tiddlerInPeriod_deprecated(tiddler, searchPeriod) {
		const created = utils.parseWikiDate(tiddler.fields.created);
		if (created) {
			const time = created.getTime();
			if (time >= searchPeriod.start && time <= searchPeriod.end) return true;
		}
		const modified = utils.parseWikiDate(tiddler.fields.modified);
		if (modified) {
			const time = modified.getTime();
			if (time >= searchPeriod.start && time <= searchPeriod.end) return true;
		}
		return false;
	}

	function tiddlerInPeriod(tiddler, searchPeriod) {
		const created = utils.parseWikiDate(tiddler.getTiddlerField("created"));
		if (created) {
			const time = created.getTime();
			if (time >= searchPeriod.start && time <= searchPeriod.end) return true;
		}
		const modified = utils.parseWikiDate(tiddler.getTiddlerField("modified"));
		if (modified) {
			const time = modified.getTime();
			if (time >= searchPeriod.start && time <= searchPeriod.end) return true;
		}
		return false;
	}

	function articleRelatedInPeriod(articles, searchPeriod, context) {
		return articles.some(article => {
			if (tiddlerInPeriod_deprecated(article, searchPeriod)) return true;
			return article.fields.tags
				.filter(tag => tag.startsWith(context.prefixes.word)
					|| tag.startsWith(context.prefixes.wordMeaning)
					|| tag.startsWith(context.prefixes.transcriptionGroup))
				.map(tag => context.wikiUtils.withTiddler(tag))
				.some(tiddler => tiddlerInPeriod(tiddler, searchPeriod));
		});
	}

})();
