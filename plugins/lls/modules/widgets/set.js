/*\
title: $:/plugins/midorum/lls/modules/widgets/set.js
type: application/javascript
module-type: widget

Set variable widget

\*/
(function () {

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";

	var Widget = require("$:/core/modules/widgets/widget.js").widget;

	var LlsSetWidget = function (parseTreeNode, options) {
		this.initialise(parseTreeNode, options);
		// console.log("LlsSetWidget:initialise");
	};

	/*
	Inherit from the base widget class
	*/
	LlsSetWidget.prototype = new Widget();

	/*
	Render this widget into the DOM
	*/
	LlsSetWidget.prototype.render = function (parent, nextSibling) {
		this.parentDomNode = parent;
		this.computeAttributes();
		//~~~
		this.llsWidgetId = this.getAttribute("$id", new Date().getTime());
		console.log("LlsSetWidget:render", "llsWidgetId", this.llsWidgetId);
		//~~~
		this.execute();
		this.renderChildren(parent, nextSibling);
	};

	/*
	Compute the internal state of the widget
	*/
	LlsSetWidget.prototype.execute = function () {
		// Get our parameters		
		this.setName = this.getAttribute("name", "currentTiddler");
		this.setFilter = this.getAttribute("filter");
		this.setSelect = this.getAttribute("select");
		this.setTiddler = this.getAttribute("tiddler");
		this.setSubTiddler = this.getAttribute("subtiddler");
		this.setField = this.getAttribute("field");
		this.setIndex = this.getAttribute("index");
		this.setValue = this.getAttribute("value");
		this.setEmptyValue = this.getAttribute("emptyValue");
		// Set context variable
		if (this.parseTreeNode.isMacroDefinition) {
			this.setVariable(this.setName, this.getValue(), this.parseTreeNode.params, true);
		} else if (this.parseTreeNode.isFunctionDefinition) {
			this.setVariable(this.setName, this.getValue(), this.parseTreeNode.params, undefined, { isFunctionDefinition: true });
		} else if (this.parseTreeNode.isProcedureDefinition) {
			this.setVariable(this.setName, this.getValue(), this.parseTreeNode.params, undefined, { isProcedureDefinition: true, configTrimWhiteSpace: this.parseTreeNode.configTrimWhiteSpace });
		} else if (this.parseTreeNode.isWidgetDefinition) {
			this.setVariable(this.setName, this.getValue(), this.parseTreeNode.params, undefined, { isWidgetDefinition: true, configTrimWhiteSpace: this.parseTreeNode.configTrimWhiteSpace });
		} else {
			this.setVariable(this.setName, this.getValue());
		}
		// console.log("LlsSetWidget:execute", "llsWidgetId", this.llsWidgetId,
		//  "\nthis.variables", this.variables);
		// Construct the child widgets
		this.makeChildWidgets();
	};

	/*
	Get the value to be assigned
	*/
	LlsSetWidget.prototype.getValue = function () {
		var value = this.setValue;
		if (this.setTiddler) {
			var tiddler;
			if (this.setSubTiddler) {
				tiddler = this.wiki.getSubTiddler(this.setTiddler, this.setSubTiddler);
			} else {
				tiddler = this.wiki.getTiddler(this.setTiddler);
			}
			if (!tiddler) {
				value = this.setEmptyValue;
			} else if (this.setField) {
				value = tiddler.getFieldString(this.setField) || this.setEmptyValue;
			} else if (this.setIndex) {
				value = this.wiki.extractTiddlerDataItem(this.setTiddler, this.setIndex, this.setEmptyValue);
			} else {
				value = tiddler.fields.text || this.setEmptyValue;
			}
		} else if (this.setFilter) {
			var results = this.wiki.filterTiddlers(this.setFilter, this);
			if (this.setValue == null) {
				var select;
				if (this.setSelect) {
					select = parseInt(this.setSelect, 10);
				}
				if (select !== undefined) {
					value = results[select] || "";
				} else {
					value = $tw.utils.stringifyList(results);
				}
			}
			if (results.length === 0 && this.setEmptyValue !== undefined) {
				value = this.setEmptyValue;
			}
		} else if (!value && this.setEmptyValue) {
			value = this.setEmptyValue;
		}
		return value || "";
	};

	/*
	Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
	*/
	LlsSetWidget.prototype.refresh = function (changedTiddlers) {
		var changedAttributes = this.computeAttributes();
		// console.log("LlsSetWidget:refresh", "llsWidgetId", this.llsWidgetId,
		// 	"\nchangedTiddlers", changedTiddlers,
		// 	"\nchangedAttributes", changedAttributes);
		if (changedAttributes.name || changedAttributes.filter || changedAttributes.select
			|| changedAttributes.tiddler || (this.setTiddler && changedTiddlers[this.setTiddler])
			|| changedAttributes.field || changedAttributes.index || changedAttributes.value || changedAttributes.emptyValue ||
			(this.setFilter && this.getValue() != this.variables[this.setName].value)) {
			// console.log("LlsSetWidget:refreshSelf", "llsWidgetId", this.llsWidgetId,
			// 	"\nchangedAttributes.name", (!!changedAttributes.names),
			// 	"\nchangedAttributes.filter", (!!changedAttributes.filter),
			// 	"\nchangedAttributes.select", (!!changedAttributes.select),
			// 	"\nchangedAttributes.tiddler", (!!changedAttributes.tiddler),
			// 	"\n(this.setTiddler && changedTiddlers[this.setTiddler])", (!!(this.setTiddler && changedTiddlers[this.setTiddler])),
			// 		"\nchangedAttributes.field", (!!changedAttributes.field),
			// 		"\nchangedAttributes.index", (!!changedAttributes.index),
			// 		"\nchangedAttributes.value", (!!changedAttributes.value),
			// 		"\nchangedAttributes.emptyValue", (!!changedAttributes.emptyValue),
			// 		"\n(this.setFilter && this.getValue() != this.variables[this.setName].value)", (!!(this.setFilter && this.getValue() != this.variables[this.setName].value)));
			this.refreshSelf();
			return true;
		} else {
			// console.log("LlsSetWidget:refreshChildren", "llsWidgetId", this.llsWidgetId);
			return this.refreshChildren(changedTiddlers);
		}
	};

	exports["lls-set"] = LlsSetWidget;

})();
