const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;

describe("The attachParentRule service", () => {
    var consoleSpy;
    var consoleDebugSpy;
    var loggerSpy;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        consoleDebugSpy = spyOn(console, 'debug');
        loggerSpy = spyOn(Logger, 'alert');
    });

    it("should be defined", () => {
        expect(messageHandler.attachParentRule).toBeDefined();
    })

    it("should fail when rule argument is not defined", () => {
        const options = utils.setupWiki();
        const rule = undefined;
        const parentRule = undefined;
        const idle = true;
        const expectedMessage = "rule cannot be empty";
        // consoleDebugSpy.and.callThrough();
        expect(messageHandler.attachParentRule(rule, parentRule, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when rule argument is wrong", () => {
        const options = utils.setupWiki();
        const rule = "some";
        const parentRule = undefined;
        const idle = true;
        const expectedMessage = "Wrong rule reference: " + rule;
        // consoleDebugSpy.and.callThrough();
        expect(messageHandler.attachParentRule(rule, parentRule, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when parentRule argument is not defined", () => {
        const options = utils.setupWiki();
        const ruleTemplate = utils.getRule("some");
        const parentRule = undefined;
        const idle = true;
        const expectedMessage = "parentRule cannot be empty";
        // consoleDebugSpy.and.callThrough();
        expect(messageHandler.attachParentRule(ruleTemplate.title, parentRule, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when parentRule argument is wrong", () => {
        const options = utils.setupWiki();
        const ruleTemplate = utils.getRule("some");
        const parentRule = "some";
        const idle = true;
        const expectedMessage = "Wrong parentRule reference: " + parentRule;
        // consoleDebugSpy.and.callThrough();
        expect(messageHandler.attachParentRule(ruleTemplate.title, parentRule, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when rule is not found", () => {
        const options = utils.setupWiki();
        const ruleTemplate = utils.getRule("rule");
        const parentRuleTemplate = utils.getRule("parent");
        const idle = false;
        const expectedMessage = "Rule not found: " + ruleTemplate.title;
        // consoleDebugSpy.and.callThrough();
        expect(messageHandler.attachParentRule(ruleTemplate.title, parentRuleTemplate.title, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when parentRule is not found", () => {
        const options = utils.setupWiki();
        const ruleTemplate = utils.getRule("rule");
        const parentRuleTemplate = utils.getRule("parent");
        const idle = false;
        const expectedMessage = "Parent rule not found: " + parentRuleTemplate.title;
        options.widget.wiki.addTiddler(ruleTemplate);
        // consoleDebugSpy.and.callThrough();
        expect(messageHandler.attachParentRule(ruleTemplate.title, parentRuleTemplate.title, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when rule and parentRule are same", () => {
        const options = utils.setupWiki();
        const ruleTemplate = utils.getRule("rule");
        const idle = false;
        const expectedMessage = "The rule " + ruleTemplate.title + " is same as the target rule";
        options.widget.wiki.addTiddler(ruleTemplate);
        // consoleDebugSpy.and.callThrough();
        expect(messageHandler.attachParentRule(ruleTemplate.title, ruleTemplate.title, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when parentRule is already a child of rule", () => {
        const options = utils.setupWiki();
        const ruleTemplate = utils.getRule("rule");
        const parentRuleTemplate = utils.getRule("parent", [ruleTemplate.title]);
        const idle = false;
        const expectedMessage = "The rule " + parentRuleTemplate.title + " is already a child of the rule " + ruleTemplate.title;
        options.widget.wiki.addTiddler(ruleTemplate);
        options.widget.wiki.addTiddler(parentRuleTemplate);
        // consoleDebugSpy.and.callThrough();
        expect(messageHandler.attachParentRule(ruleTemplate.title, parentRuleTemplate.title, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when parentRule is already a child of rule throwgh other several rules", () => {
        const options = utils.setupWiki();
        const ruleTemplate = utils.getRule("rule");
        const descendant1 = utils.getRule("descendant1", [ruleTemplate.title]);
        const descendant2 = utils.getRule("descendant2", [descendant1.title]);
        const parentRuleTemplate = utils.getRule("parent", [descendant2.title]);
        const idle = false;
        const expectedMessage = "The rule " + parentRuleTemplate.title + " is already a child of the rule " + ruleTemplate.title;
        options.widget.wiki.addTiddler(ruleTemplate);
        options.widget.wiki.addTiddler(parentRuleTemplate);
        options.widget.wiki.addTiddler(descendant1);
        options.widget.wiki.addTiddler(descendant2);
        // consoleDebugSpy.and.callThrough();
        expect(messageHandler.attachParentRule(ruleTemplate.title, parentRuleTemplate.title, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should attach the parentRule to the target rule if all checks are passed", () => {
        const options = utils.setupWiki();
        const ancestor1 = utils.getRule("ancestor1");
        const ruleTemplate = utils.getRule("rule", [ancestor1.title]);
        const descendant1 = utils.getRule("descendant1", [ruleTemplate.title]);
        const ancestor2 = utils.getRule("ancestor2");
        const parentRuleTemplate = utils.getRule("parent", [ancestor2.title]);
        const descendant2 = utils.getRule("descendant2", [parentRuleTemplate.title]);
        const idle = false;
        options.widget.wiki.addTiddler(ruleTemplate);
        options.widget.wiki.addTiddler(parentRuleTemplate);
        options.widget.wiki.addTiddler(ancestor1);
        options.widget.wiki.addTiddler(ancestor2);
        options.widget.wiki.addTiddler(descendant1);
        options.widget.wiki.addTiddler(descendant2);
        // consoleDebugSpy.and.callThrough();
        expect(messageHandler.attachParentRule(ruleTemplate.title, parentRuleTemplate.title, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(0);
        const ruleInstance = options.widget.wiki.getTiddler(ruleTemplate.title);
        console.debug("ruleInstance", ruleInstance);
        expect(ruleInstance.fields.tags.includes(parentRuleTemplate.title)).toBeTruthy();
        expect(ruleInstance.fields.tags.includes(ancestor1.title)).toBeTruthy();
    })

});
