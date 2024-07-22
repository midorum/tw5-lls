const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;

describe("The detachRuleFromUsageExample service", () => {
    var consoleSpy;
    var loggerSpy;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        loggerSpy = spyOn(Logger, 'alert');
    });

    it("should be defined", () => {
        expect(messageHandler.detachRuleFromUsageExample).toBeDefined();
    })

    it("should fail when example argument is not defined", () => {
        const options = utils.setupWiki();
        const example = undefined;
        const rule = undefined;
        const idle = true;
        const expectedMessage = "example cannot be empty";
        expect(messageHandler.detachRuleFromUsageExample(example, rule, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when rule argument is not defined", () => {
        const options = utils.setupWiki();
        const example = "some";
        const rule = undefined;
        const idle = true;
        const expectedMessage = "rule cannot be empty";
        expect(messageHandler.detachRuleFromUsageExample(example, rule, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when example argument is wrong", () => {
        const options = utils.setupWiki();
        const example = "some";
        const rule = "some";
        const idle = true;
        const expectedMessage = "Wrong usage example reference: " + example;
        expect(messageHandler.detachRuleFromUsageExample(example, rule, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when rule argument is wrong", () => {
        const options = utils.setupWiki();
        const usageExampleTemplate = utils.createUsageExample("some usage example");
        const rule = "some";
        const idle = true;
        const expectedMessage = "Wrong rule reference: " + rule;
        expect(messageHandler.detachRuleFromUsageExample(usageExampleTemplate.title, rule, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when usage exapmle is not found", () => {
        const options = utils.setupWiki();
        const usageExampleTemplate = utils.createUsageExample("some usage example");
        const ruleTemplate = utils.getRule("some");
        const idle = false;
        const expectedMessage = "Usage example not found: " + usageExampleTemplate.title;
        expect(messageHandler.detachRuleFromUsageExample(usageExampleTemplate.title, ruleTemplate.title, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should deatch the word article from the the usage example", () => {
        const options = utils.setupWiki();
        const ruleTemplate = utils.getRule("some");
        const anotherReference = "another reference";
        const usageExampleTemplate = utils.createUsageExample("some usage example", [ruleTemplate.title, anotherReference]);
        const idle = false;
        options.widget.wiki.addTiddler(usageExampleTemplate);
        options.widget.wiki.addTiddler(ruleTemplate);
        loggerSpy.and.callThrough();
        expect(messageHandler.detachRuleFromUsageExample(usageExampleTemplate.title, ruleTemplate.title, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(0);
        const usageExampleInstance = options.widget.wiki.getTiddler(usageExampleTemplate.title);
        // console.warn(usageExampleInstance);
        expect(usageExampleInstance.fields.tags.includes(ruleTemplate.title)).toBeFalsy();
        expect(usageExampleInstance.fields.tags.includes(anotherReference)).toBeTruthy();
    })

});