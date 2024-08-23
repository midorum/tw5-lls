const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;

describe("The detachParentRule service", () => {
    var consoleSpy;
    var consoleDebugSpy;
    var loggerSpy;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        consoleDebugSpy = spyOn(console, 'debug');
        loggerSpy = spyOn(Logger, 'alert');
    });

    it("should be defined", () => {
        expect(messageHandler.detachParentRule).toBeDefined();
    })

    it("should fail when rule argument is not defined", () => {
        const options = utils.setupWiki();
        const rule = undefined;
        const parentRule = undefined;
        const idle = true;
        const expectedMessage = "rule cannot be empty";
        // consoleDebugSpy.and.callThrough();
        expect(messageHandler.detachParentRule(rule, parentRule, idle, options.widget)).nothing();
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
        expect(messageHandler.detachParentRule(rule, parentRule, idle, options.widget)).nothing();
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
        expect(messageHandler.detachParentRule(ruleTemplate.title, parentRule, idle, options.widget)).nothing();
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
        expect(messageHandler.detachParentRule(ruleTemplate.title, parentRule, idle, options.widget)).nothing();
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
        expect(messageHandler.detachParentRule(ruleTemplate.title, parentRuleTemplate.title, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should detach the parentRule from the target rule if all checks are passed", () => {
        const options = utils.setupWiki();
        const ancestor1 = utils.getRule("ancestor1");
        const ancestor2 = utils.getRule("ancestor2");
        const parentRuleTemplate = utils.getRule("parent", [ancestor2.title]);
        const ruleTemplate = utils.getRule("rule", [ancestor1.title, parentRuleTemplate.title]);
        const idle = false;
        options.widget.wiki.addTiddler(ruleTemplate);
        options.widget.wiki.addTiddler(parentRuleTemplate);
        options.widget.wiki.addTiddler(ancestor1);
        options.widget.wiki.addTiddler(ancestor2);
        // consoleDebugSpy.and.callThrough();
        console.debug("initial rule instance", options.widget.wiki.getTiddler(ruleTemplate.title));
        expect(messageHandler.detachParentRule(ruleTemplate.title, parentRuleTemplate.title, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(0);
        const ruleInstance = options.widget.wiki.getTiddler(ruleTemplate.title);
        console.debug("ruleInstance", ruleInstance);
        expect(ruleInstance.fields.tags.includes(parentRuleTemplate.title)).toBeFalsy();
        expect(ruleInstance.fields.tags.includes(ancestor1.title)).toBeTruthy();
    })

});
