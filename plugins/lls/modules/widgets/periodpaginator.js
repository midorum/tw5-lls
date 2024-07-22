/*\
title: $:/plugins/midorum/lls/modules/widgets/periodpaginator.js
type: application/javascript
module-type: widget

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
	const OFFSET_DEFAULT = 0;
	const utils = require("$:/plugins/midorum/lls/modules/utils.js").llsUtils;

	const Widget = require("$:/core/modules/widgets/widget.js").widget;

	const PeriodPaginatorWidget = function (parseTreeNode, options) {
		// console.log("PeriodPaginatorWidget:initialise", options);
		this.initialise(parseTreeNode, options);
		this.wikiUtils = utils.getWikiUtils(options.wiki);
	};

	/*
	Inherit from the base widget class
	*/
	PeriodPaginatorWidget.prototype = new Widget();

	/*
	Render this widget into the DOM
	*/
	PeriodPaginatorWidget.prototype.render = function (parent, nextSibling) {
		// console.log("PeriodPaginatorWidget:render",
		// 	"\nparent", parent,
		// 	"\nnextSibling", nextSibling,
		// 	"\nthis.domNodes", this.domNodes,
		// 	"\nthis.children", this.children);
		var self = this;
		// Remember parent
		this.parentDomNode = parent;
		// Compute attributes and execute state
		this.computeAttributes();
		this.execute();
		const externalState = this.getExternalState();
		this.setSelectedPeriod(externalState.selectedPeriod);
		this.setPeriodOffset(externalState.periodOffset);
		// Create elements
		this.radioList = [];
		this.buttonList = [];
		this.radioList.push(this.createRadio("hour", HOUR));
		this.radioList.push(this.createRadio("day", DAY));
		this.radioList.push(this.createRadio("week", WEEK));
		this.radioList.push(this.createRadio("month", MONTH));
		this.radioList.push(this.createRadio("quarter", QUARTER));
		this.radioList.push(this.createRadio("year", YEAR));
		this.buttonList.push(this.createButton("<<", -1));
		this.buttonList.push(this.createButton("0", 0));
		this.buttonList.push(this.createButton(">>", 1));
		// Insert elements
		this.radioList.forEach(radioObj => {
			parent.insertBefore(this.document.createTextNode(" "), nextSibling);
			parent.insertBefore(radioObj.labelNode, nextSibling);
			self.domNodes.push(radioObj.labelNode);
		});
		this.buttonList.forEach(button => {
			parent.insertBefore(this.document.createTextNode(" "), nextSibling);
			parent.insertBefore(button, nextSibling);
			self.domNodes.push(button);
		});
		// Create container for child widgets
		this.containerNode = this.document.createElement("section");
		parent.insertBefore(this.containerNode, nextSibling);
		this.domNodes.push(this.containerNode);
		this.renderChildren(this.containerNode, null);
		// console.log("PeriodPaginatorWidget:render:done",
		// 	"\nthis.domNodes", this.domNodes,
		// 	"\nthis.children", this.children);

	};

	PeriodPaginatorWidget.prototype.createRadio = function (label, radioValue) {
		var self = this;
		const isChecked = this.getSelectedPeriod() === radioValue;
		const labelNode = this.document.createElement("label");
		labelNode.setAttribute("class",
			"tc-radio " + this.radioClass + (isChecked ? " tc-radio-selected" : "")
		);
		const inputNode = this.document.createElement("input");
		inputNode.setAttribute("type", "radio");
		this.assignAttributes(inputNode, {
			sourcePrefix: "data-",
			destPrefix: "data-"
		});
		if (isChecked) {
			inputNode.checked = true;
		}
		labelNode.appendChild(inputNode);
		const spanNode = this.document.createElement("span");
		spanNode.appendChild(this.document.createTextNode("\u00A0"));// &nbsp;
		spanNode.appendChild(this.document.createTextNode(label));
		labelNode.appendChild(spanNode);
		// Add a click event handler
		inputNode.addEventListener("change", function (event) {
			// console.log("PeriodPaginatorWidget:radio change", "event", event);
			if (inputNode.checked) {
				self.setSelectedPeriod(radioValue);
			}
			event.preventDefault();
			event.stopPropagation();
			self.setExternalState();
		}, false);
		return {
			labelNode: labelNode,
			inputNode: inputNode,
			value: radioValue
		};
	}

	PeriodPaginatorWidget.prototype.createButton = function (label, offsetValue) {
		var self = this,
			tag = "button",
			domNode;
		// Create element
		domNode = this.document.createElement(tag);
		const textNode = this.document.createTextNode(label);
		domNode.appendChild(textNode);
		// Assign data- attributes
		this.assignAttributes(domNode, {
			sourcePrefix: "data-",
			destPrefix: "data-"
		});
		// Add a click event handler
		domNode.addEventListener("click", function (event) {
			// console.log("PeriodPaginatorWidget:click", "event", event);
			self.shiftPeriodOffset(offsetValue);
			event.preventDefault();
			event.stopPropagation();
			self.setExternalState();
			return true;
		}, false);
		return domNode;
	}

	PeriodPaginatorWidget.prototype.shiftPeriodOffset = function (value) {
		if (value) {
			this.periodOffset = this.periodOffset + value;
		} else {
			this.periodOffset = 0;
		}
	};

	PeriodPaginatorWidget.prototype.getPeriodOffset = function () {
		return this.periodOffset;
	};

	PeriodPaginatorWidget.prototype.setPeriodOffset = function (periodOffset) {
		this.periodOffset = periodOffset;
	};

	PeriodPaginatorWidget.prototype.getSelectedPeriod = function () {
		return this.selectedPeriod;
	};

	PeriodPaginatorWidget.prototype.setSelectedPeriod = function (value) {
		this.selectedPeriod = value;
	};

	/*
	Compute the internal state of the widget
	*/
	PeriodPaginatorWidget.prototype.execute = function () {
		// console.log("PeriodPaginatorWidget:execute");
		// Get our parameters
		this.stateTitle = this.getAttribute("$stateTitle", "$:/temp/lls/state/PeriodPaginatorWidget");
		this.startIndex = this.getAttribute("$startIndex", "periodStart");
		this.endIndex = this.getAttribute("$endIndex", "periodEnd");
		this.selectedPeriodIndex = this.getAttribute("$selectedPeriodIndex", "selectedPeriod");
		this.periodOffsetIndex = this.getAttribute("$periodOffsetIndex", "periodOffset");
		this.periodOffsetDefault = this.getAttribute("$periodOffsetDefault", OFFSET_DEFAULT);
		// Construct the child widgets
		this.makeChildWidgets();
	};

	PeriodPaginatorWidget.prototype.setExternalState = function () {
		const selectedPeriod = this.getSelectedPeriod();
		const periodOffset = this.getPeriodOffset();
		const periodBounds = getPeriodBounds(selectedPeriod, periodOffset);
		const data = {};
		data[this.selectedPeriodIndex] = selectedPeriod;
		data[this.periodOffsetIndex] = periodOffset;
		data[this.startIndex] = periodBounds.start;
		data[this.endIndex] = periodBounds.end;
		this.wikiUtils.withTiddler(this.stateTitle).doNotInvokeSequentiallyOnSameTiddler.setOrCreateTiddlerData(data);
	};

	PeriodPaginatorWidget.prototype.getExternalState = function () {
		const tiddler = this.wiki.getTiddler(this.stateTitle);
		if (tiddler) {
			return {
				selectedPeriod: this.wiki.extractTiddlerDataItem(this.stateTitle, this.selectedPeriodIndex),
				periodOffset: utils.parseInteger(this.wiki.extractTiddlerDataItem(this.stateTitle, this.periodOffsetIndex, this.periodOffsetDefault))
			};
		} else {
			return {
				periodOffset: OFFSET_DEFAULT
			};
		}
	};

	/*
	Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
	*/
	PeriodPaginatorWidget.prototype.refresh = function (changedTiddlers) {
		var changedAttributes = this.computeAttributes();
		// console.log("PeriodPaginatorWidget:refresh",
		// 	"\nchangedTiddlers", changedTiddlers,
		// 	"\nchangedAttributes", changedAttributes,
		// 	"\nthis.domNodes", this.domNodes);
		if ($tw.utils.count(changedAttributes) > 0) {
			// console.log("PeriodPaginatorWidget:refreshSelf",
			// 	"\n$tw.utils.count(changedAttributes) > 0", (!!$tw.utils.count(changedAttributes) > 0));
			this.refreshSelf();
			return true;
		} else if (changedTiddlers[this.stateTitle]) {
			const selectedPeriod = this.getSelectedPeriod();
			this.radioList.forEach(radioObj => {
				radioObj.inputNode.checked = radioObj.value === selectedPeriod;
				$tw.utils.toggleClass(radioObj.labelNode, "tc-radio-selected", radioObj.inputNode.checked);
			});
			// console.log("PeriodPaginatorWidget:refreshSelf",
			// 	"\nchangedTiddlers[this.stateTitle]", (!!changedTiddlers[this.stateTitle]),
			// 	"\nthis.domNodes", this.domNodes);
			// this.refreshSelf();
			// return true;
			return this.refreshChildren(changedTiddlers);
		} else {
			// console.log("PeriodPaginatorWidget:refreshChildren");
			return this.refreshChildren(changedTiddlers);
		}
	};

	exports["lls-period-paginator"] = PeriodPaginatorWidget;

	function getPeriodBounds(currentPeriod, offset) {
		return currentPeriod === HOUR ? getHourBounds(offset)
			: currentPeriod === DAY ? getDayBounds(offset)
				: currentPeriod === WEEK ? getWeekBounds(offset)
					: currentPeriod === MONTH ? getMonthBounds(offset)
						: currentPeriod === QUARTER ? getQuarterBounds(offset)
							: currentPeriod === YEAR ? getYearBounds(offset)
								: {
									start: undefined,
									end: undefined
								};
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
