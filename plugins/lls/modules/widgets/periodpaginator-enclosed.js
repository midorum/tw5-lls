/*\
title: $:/plugins/midorum/lls/modules/widgets/periodpaginator-enclosed.js
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

	var Widget = require("$:/core/modules/widgets/widget.js").widget;

	var PeriodPaginatorEnclosedWidget = function (parseTreeNode, options) {
		// console.log("PeriodPaginatorWidget:initialise");
		this.initialise(parseTreeNode, options);
		this.periodOffset = 0;
	};

	/*
	Inherit from the base widget class
	*/
	PeriodPaginatorEnclosedWidget.prototype = new Widget();

	/*
	Render this widget into the DOM
	*/
	PeriodPaginatorEnclosedWidget.prototype.render = function (parent, nextSibling) {
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

	PeriodPaginatorEnclosedWidget.prototype.createRadio = function (label, radioValue) {
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
			self.setContextVariables();
			event.preventDefault();
			event.stopPropagation();
			self.refreshInternal();
		}, false);
		return {
			labelNode: labelNode,
			inputNode: inputNode,
			value: radioValue
		};
	}

	PeriodPaginatorEnclosedWidget.prototype.createButton = function (label, offsetValue) {
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
			self.setContextVariables();
			event.preventDefault();
			event.stopPropagation();
			self.refreshInternal();
			return true;
		}, false);
		return domNode;
	}

	PeriodPaginatorEnclosedWidget.prototype.shiftPeriodOffset = function (value) {
		if (value) {
			this.periodOffset = this.periodOffset + value;
		} else {
			this.periodOffset = 0;
		}
		// console.log("PeriodPaginatorWidget:shiftPeriodOffset", "this.periodOffset", this.periodOffset);
	};

	PeriodPaginatorEnclosedWidget.prototype.getPeriodOffset = function () {
		return this.periodOffset;
	};

	PeriodPaginatorEnclosedWidget.prototype.setSelectedPeriod = function (value) {
		if (value) {
			this.selectedPeriod = value;
		} else {
			this.selectedPeriod = DAY;
		}
		// console.log("PeriodPaginatorWidget:setSelectedPeriod", "this.selectedPeriod", this.selectedPeriod);
	};

	PeriodPaginatorEnclosedWidget.prototype.getSelectedPeriod = function () {
		return this.selectedPeriod;
	};

	/*
	Compute the internal state of the widget
	*/
	PeriodPaginatorEnclosedWidget.prototype.execute = function () {
		// console.log("PeriodPaginatorWidget:execute");
		// Get our parameters
		this.selectedPeriodVariable = this.getAttribute("$selectedPeriodVariable", "selectedPeriod");
		this.periodOffsetVariable = this.getAttribute("$periodOffsetVariable", "periodOffset");
		this.periodStartVariable = this.getAttribute("$periodStartVariable", "periodStart");
		this.periodEndVariable = this.getAttribute("$periodEndVariable", "periodEnd");
		// Set context variables
		this.setContextVariables();
		// Construct the child widgets
		this.makeChildWidgets();
	};

	PeriodPaginatorEnclosedWidget.prototype.setContextVariables = function () {
		const selectedPeriod = this.getSelectedPeriod();
		const periodOffset = this.getPeriodOffset();
		const periodBounds = getPeriodBounds(selectedPeriod, periodOffset);
		this.setVariable(this.selectedPeriodVariable, "" + (selectedPeriod ? selectedPeriod : ""));
		this.setVariable(this.periodOffsetVariable, "" + periodOffset);
		this.setVariable(this.periodStartVariable, "" + (periodBounds.start ? periodBounds.start : ""));
		this.setVariable(this.periodEndVariable, "" + (periodBounds.end ? periodBounds.end : ""));
	};

	/*
	Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
	*/
	PeriodPaginatorEnclosedWidget.prototype.refresh = function (changedTiddlers) {
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
		} else {
			// console.log("PeriodPaginatorWidget:refreshChildren");
			return this.refreshChildren(changedTiddlers);
		}
	};

	PeriodPaginatorEnclosedWidget.prototype.refreshInternal = function () {
		// console.log("PeriodPaginatorWidget:refreshInternal",
		// 	"\nthis.containerNode", this.containerNode);
		const selectedPeriod = this.getSelectedPeriod();
		this.radioList.forEach(radioObj => {
			radioObj.inputNode.checked = radioObj.value === selectedPeriod;
			$tw.utils.toggleClass(radioObj.labelNode, "tc-radio-selected", radioObj.inputNode.checked);
		});
		this.rebuildContainerNode();
	};

	PeriodPaginatorEnclosedWidget.prototype.rebuildContainerNode = function () {
		// console.log("PeriodPaginatorWidget:rebuildContainerNode",
		// "\nthis.containerNode", this.containerNode,
		// "\nthis.containerNode.children", this.containerNode.children);
		const self = this;
		// ask the child widgets to delete their DOM nodes
		$tw.utils.each(this.children,function(childWidget) {
			childWidget.removeChildDomNodes();
		});
		// while (this.containerNode.children.length) {
		// 	self.containerNode.removeChild(this.containerNode.children[0]);
		// }
		this.renderChildren(this.containerNode, null);
	};

	exports["lls-period-paginator-enclosed"] = PeriodPaginatorEnclosedWidget;

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
