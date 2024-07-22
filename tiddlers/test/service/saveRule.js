
const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;

describe("The saveRule service", () => {
    var consoleSpy;
    var loggerSpy;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        loggerSpy = spyOn(Logger, 'alert');
    });

    it("should be defined", () => {
        expect(messageHandler.saveRule).toBeDefined();
    })

    it("should fail if rule argument does not passed", () => {
        const options = utils.setupWiki();
        const rule = undefined;
        const brief = undefined;
        const description = undefined;
        const idle = true;
        const expectedMessage = "rule cannot be empty";
        expect(messageHandler.saveRule(rule, brief, description, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail if brief argument does not passed", () => {
        const options = utils.setupWiki();
        const ruleTemplate = utils.getRule("some");
        const rule = ruleTemplate.title;
        const brief = undefined;
        const description = undefined;
        const idle = true;
        const expectedMessage = "brief cannot be empty";
        expect(messageHandler.saveRule(rule, brief, description, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail if rule argument is wrong", () => {
        const options = utils.setupWiki();
        const rule = "wrong";
        const brief = "some rule";
        const description = undefined;
        const idle = true;
        const expectedMessage = "Wrong rule reference: " + rule;
        expect(messageHandler.saveRule(rule, brief, description, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should update a rule when rule argument is defined", () => {
        const options = utils.setupWiki();
        const context = utils.getLlsContext();
        const ruleTemplate = utils.getRule("some");
        const rule = ruleTemplate.title;
        const brief = "some rule";
        const description = "some description";
        const idle = false;
        options.widget.wiki.addTiddler(ruleTemplate);
        loggerSpy.and.callThrough();
        expect(messageHandler.saveRule(rule, brief, description, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(0);
        const createdRules = options.widget.wiki.filterTiddlers("[tag[" + context.tags.rule + "]]");
        expect(createdRules.length).toEqual(1);
        const createdRule = options.widget.wiki.getTiddler(createdRules[0]);
        expect(createdRule).toBeDefined();
        expect(createdRule.fields.brief).toEqual(brief);
        expect(createdRule.fields.text).toEqual(description);
    })

});
