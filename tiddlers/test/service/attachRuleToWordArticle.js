const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;

describe("The attachRuleToWordArticle service", () => {
    var consoleSpy;
    var loggerSpy;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        loggerSpy = spyOn(Logger, 'alert');
    });

    it("should be defined", () => {
        expect(messageHandler.attachRuleToWordArticle).toBeDefined();
    })

    it("should fail when article argument is not defined", () => {
        const options = utils.setupWiki();
        const article = undefined;
        const rule = undefined;
        const idle = true;
        const expectedMessage = "article cannot be empty";
        expect(messageHandler.attachRuleToWordArticle(article, rule, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when article argument is wrong", () => {
        const options = utils.setupWiki();
        const article = "some";
        const rule = "some";
        const idle = true;
        const expectedMessage = "Wrong word article reference: " + article;
        expect(messageHandler.attachRuleToWordArticle(article, rule, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when rule argument is not defined", () => {
        const options = utils.setupWiki();
        const wordArticleTemplate = utils.createWordArticle("some word article", "some word", []);
        const rule = undefined;
        const idle = true;
        const expectedMessage = "rule cannot be empty";
        expect(messageHandler.attachRuleToWordArticle(wordArticleTemplate.title, rule, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when rule argument is wrong", () => {
        const options = utils.setupWiki();
        const wordArticleTemplate = utils.createWordArticle("some word article", "some word", []);
        const rule = "some";
        const idle = true;
        const expectedMessage = "Wrong rule reference: " + rule;
        expect(messageHandler.attachRuleToWordArticle(wordArticleTemplate.title, rule, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when word article is not found", () => {
        const options = utils.setupWiki();
        const wordArticleTemplate = utils.createWordArticle("some word article", "some word", []);
        const ruleTemplate = utils.getRule("some");
        const idle = false;
        const expectedMessage = "Word article not found: " + wordArticleTemplate.title;
        expect(messageHandler.attachRuleToWordArticle(wordArticleTemplate.title, ruleTemplate.title, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should attach rule to word article", () => {
        const options = utils.setupWiki();
        const wordArticleTemplate = utils.createWordArticle("some word article", "some word", []);
        const ruleTemplate = utils.getRule("some");
        const idle = false;
        options.widget.wiki.addTiddler(wordArticleTemplate);
        options.widget.wiki.addTiddler(ruleTemplate);
        loggerSpy.and.callThrough();
        expect(messageHandler.attachRuleToWordArticle(wordArticleTemplate.title, ruleTemplate.title, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(0);
        const wordArticleInstance = options.widget.wiki.getTiddler(wordArticleTemplate.title);
        expect(wordArticleInstance.fields.tags.includes(ruleTemplate.title)).toBeTruthy();
    })

});