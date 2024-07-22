
const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;


describe("The deleteUsageExample service", () => {
    var consoleSpy;
    var loggerSpy;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        loggerSpy = spyOn(Logger, 'alert');
    });

    it("should be defined", () => {
        expect(messageHandler.deleteUsageExample).toBeDefined();
    });

    it("should fail when usageExample argument is not defined", () => {
        const options = utils.setupWiki();
        const usageExample = undefined;
        const idle = true;
        const expectedMessage = "usageExample cannot be empty";
        expect(messageHandler.deleteUsageExample(usageExample, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when usageExample argument is wrong", () => {
        const options = utils.setupWiki();
        const usageExample = "wrong";
        const idle = true;
        const expectedMessage = "You can delete only a usage example with this message";
        expect(messageHandler.deleteUsageExample(usageExample, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should delete usage example", () => {
        const options = utils.setupWiki();
        const uasgeExampleTemplate = utils.createUsageExample("some");
        const idle = false;
        options.widget.wiki.addTiddler(uasgeExampleTemplate);
        loggerSpy.and.callThrough();
        expect(options.widget.wiki.getTiddler(uasgeExampleTemplate.title)).toBeDefined();
        expect(messageHandler.deleteUsageExample(uasgeExampleTemplate.title, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(0);
        expect(options.widget.wiki.getTiddler(uasgeExampleTemplate.title)).toBeUndefined();
    })

});
