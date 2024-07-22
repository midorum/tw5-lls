
const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;

describe("The attachWordArticleToUsageExample service", () => {
    var consoleSpy;
    var loggerSpy;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        loggerSpy = spyOn(Logger, 'alert');
    });

    it("should be defined", () => {
        expect(messageHandler.attachWordArticleToUsageExample).toBeDefined();
    })

    it("should fail when example argument is not defined", () => {
        const options = utils.setupWiki();
        const example = undefined;
        const article = undefined;
        const idle = true;
        const expectedMessage = "example cannot be empty";
        expect(messageHandler.attachWordArticleToUsageExample(example, article, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when article argument is not defined", () => {
        const options = utils.setupWiki();
        const example = "some";
        const article = undefined;
        const idle = true;
        const expectedMessage = "article cannot be empty";
        expect(messageHandler.attachWordArticleToUsageExample(example, article, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when example argument is wrong", () => {
        const options = utils.setupWiki();
        const example = "some";
        const article = "some";
        const idle = true;
        const expectedMessage = "Wrong usage example reference: " + example;
        expect(messageHandler.attachWordArticleToUsageExample(example, article, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when article argument is wrong", () => {
        const options = utils.setupWiki();
        const usageExampleTemplate = utils.createUsageExample("some usage example");
        const article = "some";
        const idle = true;
        const expectedMessage = "Wrong word article reference: " + article;
        expect(messageHandler.attachWordArticleToUsageExample(usageExampleTemplate.title, article, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when usage exapmle is not found", () => {
        const options = utils.setupWiki();
        const usageExampleTemplate = utils.createUsageExample("some usage example");
        const wordArticleTemplate = utils.createWordArticle("some word article", "some word", []);
        const idle = false;
        const expectedMessage = "Usage example not found: " + usageExampleTemplate.title;
        expect(messageHandler.attachWordArticleToUsageExample(usageExampleTemplate.title, wordArticleTemplate.title, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should attach word article to usage example", () => {
        const options = utils.setupWiki();
        const anotherReference = "another reference";
        const usageExampleTemplate = utils.createUsageExample("some usage example", [anotherReference]);
        const wordArticleTemplate = utils.createWordArticle("some word article", "some word", []);
        const idle = false;
        options.widget.wiki.addTiddler(usageExampleTemplate);
        options.widget.wiki.addTiddler(wordArticleTemplate);
        loggerSpy.and.callThrough();
        expect(messageHandler.attachWordArticleToUsageExample(usageExampleTemplate.title, wordArticleTemplate.title, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(0);
        const usageExampleInstance = options.widget.wiki.getTiddler(usageExampleTemplate.title);
        // console.warn(usageExampleInstance);
        expect(usageExampleInstance.fields.tags.includes(wordArticleTemplate.title)).toBeTruthy();
        expect(usageExampleInstance.fields.tags.includes(anotherReference)).toBeTruthy();
    })

});
