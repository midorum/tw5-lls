/*\
$:/plugins/midorum/lls/filteroperators/period.js
type: application/javascript
module-type: llsfilteroperator

Full text search through lls database

\*/

(function () {

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";

	const HOUR = "hour";
	const DAY = "day";
	const WEEK = "week";
	const MONTH = "month";
	const QUARTER = "quarter";
	const YEAR = "year";
	const supportedPeriods = [HOUR, DAY, WEEK, MONTH, QUARTER, YEAR];
	const utils = require("$:/plugins/midorum/lls/modules/utils.js").llsUtils;
	const cache = require("$:/plugins/midorum/lls/modules/cache.js");

	exports.period = function (source, operator, options) {
		const predicate = utils.trim(operator.operands[0]);
		if (predicate == "") return ["Error: 'period' operator requires at least one operand"];
		if (!supportedPeriods.includes(predicate)) return ["Error: 'period' operator should be one of " + supportedPeriods];
		const offset = utils.parseInteger(utils.trim(operator.operands[1]), 0);
		const filterOptions = getFilterOptions(operator.suffix);
		const context = {
			prefixes: cache.getPrefixes([]),
			tags: cache.getTags([]),
			wiki: options.wiki
		};
		if (filterOptions.log) {
			console.log("predicate", predicate,
				"\noffset", offset,
				"\nfilterOptions", filterOptions,
				"\noperator", operator);
		}
		const result = predicate === HOUR ? getHourBounds(offset)
			: predicate === DAY ? getDayBounds(offset)
				: predicate === WEEK ? getWeekBounds(offset)
					: predicate === MONTH ? getMonthBounds(offset)
						: predicate === QUARTER ? getQuarterBounds(offset)
							: predicate === YEAR ? getYearBounds(offset)
								: {
									start: 0,
									end: 0
								};
		return ["" + result.start, "" + result.end];
	};

	function getFilterOptions(suffix) {
		const options = {
		};
		suffix.split(":").forEach(option => {
			if (option === "log") {
				options.log = true;
			}
		});
		return options;
	}

	function getHourBounds(offset) {
		const base = Date.now() + (offset * 3600000);
		return {
			start: new Date(base).setMinutes(0, 0, 0),
			end: new Date(base).setMinutes(59, 59, 999)
		}
	}

	function getDayBounds(offset) {
		const base = Date.now() + (offset * 86400000);
		return {
			start: new Date(base).setHours(0, 0, 0, 0),
			end: new Date(base).setHours(23, 59, 59, 999)
		}
	}

	function getWeekBounds(offset) {
		const base = new Date(),
			start = new Date(),
			end = new Date();
		start.setDate(base.getDate() + offset * 7 - base.getDay());
		end.setDate(base.getDate() + offset * 7 - base.getDay() + 6);
		return {
			start: start.setHours(0, 0, 0, 0),
			end: end.setHours(23, 59, 59, 999)
		}
	}

	function getMonthBounds(offset) {
		const base = new Date(),
			start = new Date(),
			end = new Date(),
			y = base.getFullYear(),
			m = base.getMonth();
		start.setFullYear(y, offset + m, 1);
		end.setFullYear(y, offset + m + 1, 0);
		return {
			start: start.setHours(0, 0, 0, 0),
			end: end.setHours(23, 59, 59, 999)
		}
	}

	function getQuarterBounds(offset) {
		const base = new Date(),
			start = new Date(),
			end = new Date(),
			y = base.getFullYear(),
			m = base.getMonth(),
			q = Math.floor(m / 3),
			qsm = (offset + q) * 3,
			qem = qsm + 3;
		start.setFullYear(y, qsm, 1);
		end.setFullYear(y, qem, 0);
		return {
			start: start.setHours(0, 0, 0, 0),
			end: end.setHours(23, 59, 59, 999)
		}
	}

	function getYearBounds(offset) {
		const base = new Date(),
			start = new Date(),
			end = new Date(),
			y = base.getFullYear();
		start.setFullYear(offset + y, 0, 1);
		end.setFullYear(offset + y, 12, 0);
		return {
			start: start.setHours(0, 0, 0, 0),
			end: end.setHours(23, 59, 59, 999)
		}
	}

})();
