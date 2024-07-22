
const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;

describe("The modifyUsageExample service", () => {
    var consoleSpy;
    var loggerSpy;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        loggerSpy = spyOn(Logger, 'alert');
    });

    it("should be defined", () => {
        expect(messageHandler.modifyUsageExample).toBeDefined();
    })

    it("should fail when example argument is not defined", () => {
        const options = utils.setupWiki();
        const example = undefined;
        const original = undefined;
        const translation = undefined;
        const idle = true;
        const expectedMessage = "example cannot be empty";
        expect(messageHandler.modifyUsageExample(example, original, translation, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when original argument is not defined", () => {
        const options = utils.setupWiki();
        const example = "some";
        const original = undefined;
        const translation = undefined;
        const idle = true;
        const expectedMessage = "original cannot be empty";
        expect(messageHandler.modifyUsageExample(example, original, translation, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when translation argument is not defined", () => {
        const options = utils.setupWiki();
        const example = "some";
        const original = "some";
        const translation = undefined;
        const idle = true;
        const expectedMessage = "translation cannot be empty";
        expect(messageHandler.modifyUsageExample(example, original, translation, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when example is a wrong reference", () => {
        const options = utils.setupWiki();
        const example = "some";
        const original = "some";
        const translation = "some";
        const idle = true;
        const expectedMessage = "Wrong usage example reference: " + example;
        expect(messageHandler.modifyUsageExample(example, original, translation, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when example does not found", () => {
        const options = utils.setupWiki();
        const usageExampleOriginal = "some original";
        const usageExampleTranslation = "some translation";
        const usageExampleTemplate = utils.createUsageExampleWithContent("some", usageExampleOriginal, usageExampleTranslation);
        const original = "some";
        const translation = "some";
        const idle = false;
        const expectedMessage = "Usage example not found: " + usageExampleTemplate.title;
        expect(messageHandler.modifyUsageExample(usageExampleTemplate.title, original, translation, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should change example original text"
        + " when there is not another example with this original text"
        + " and should change example translation text anyway", () => {
            const options = utils.setupWiki();
            const usageExampleOriginal = "some original";
            const usageExampleTranslation = "some translation";
            const usageExampleTemplate = utils.createUsageExampleWithContent("some", usageExampleOriginal, usageExampleTranslation);
            const original = "some new original text";
            const translation = "some new translation text";
            const idle = false;
            options.widget.wiki.addTiddler(usageExampleTemplate);
            loggerSpy.and.callThrough();
            expect(messageHandler.modifyUsageExample(usageExampleTemplate.title, original, translation, idle, options.widget)).nothing();
            expect(Logger.alert).toHaveBeenCalledTimes(0);
            const usageExampleTiddler = options.widget.wiki.getTiddler(usageExampleTemplate.title);
            expect(usageExampleTiddler.fields.original).toEqual(original);
            expect(usageExampleTiddler.fields.translation).toEqual(translation);
        })

    it("should change example original text"
        + " when there is another example with this original text"
        + " and should change example translation text anyway", () => {
            const options = utils.setupWiki();
            const usageExampleOriginal = "some original";
            const usageExampleTranslation = "some translation";
            const usageExampleTemplate = utils.createUsageExampleWithContent("some", usageExampleOriginal, usageExampleTranslation);
            const anotherUsageExampleTemplate = utils.createUsageExampleWithContent("another", usageExampleOriginal, "another translation");
            const original = "some new original text";
            const translation = "some new translation text";
            const idle = false;
            options.widget.wiki.addTiddler(usageExampleTemplate);
            options.widget.wiki.addTiddler(anotherUsageExampleTemplate);
            loggerSpy.and.callThrough();
            expect(messageHandler.modifyUsageExample(usageExampleTemplate.title, original, translation, idle, options.widget)).nothing();
            expect(Logger.alert).toHaveBeenCalledTimes(0);
            const usageExampleTiddler = options.widget.wiki.getTiddler(usageExampleTemplate.title);
            expect(usageExampleTiddler.fields.original).toEqual(original);
            expect(usageExampleTiddler.fields.translation).toEqual(translation);
            // another usage example shouldn't change
            const anotherUsageExampleTiddler = options.widget.wiki.getTiddler(anotherUsageExampleTemplate.title);
            expect(anotherUsageExampleTiddler.fields.original).toEqual(anotherUsageExampleTemplate.original);
            expect(anotherUsageExampleTiddler.fields.translation).toEqual(anotherUsageExampleTemplate.translation);
        })

});
