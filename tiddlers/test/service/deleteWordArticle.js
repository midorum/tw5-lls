
const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;

describe("The deleteWordArticle service", () => {
    var consoleSpy;
    var loggerSpy;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        loggerSpy = spyOn(Logger, 'alert');
    });

    it("should be defined", () => {
        expect(messageHandler.deleteWordArticle).toBeDefined();
    });

    it("should fail when ref argument is not defined", () => {
        const options = utils.setupWiki();
        const ref = undefined;
        const idle = true;
        const expectedMessage = "ref cannot be empty";
        expect(messageHandler.deleteWordArticle(ref, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when ref argument is wrong", () => {
        const options = utils.setupWiki();
        const ref = "wrong";
        const idle = true;
        const expectedMessage = "You can delete only a word article with this message";
        expect(messageHandler.deleteWordArticle(ref, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when target word article not found", () => {
        const options = utils.setupWiki();
        const wordArticleTemplate = utils.createWordArticle("some word article", "some word", []);
        const idle = false;
        const expectedMessage = "Word article not found: " + wordArticleTemplate.title;
        expect(messageHandler.deleteWordArticle(wordArticleTemplate.title, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when target word article is only a singe one for the word", () => {
        const options = utils.setupWiki();
        const wordTemplate = utils.createWord("some word");
        const wordArticleTemplate = utils.createWordArticle("some word article", wordTemplate.title, []);
        const idle = false;
        const expectedMessage = "You cannot delete last meaning for the word.";
        options.widget.wiki.addTiddler(wordTemplate);
        options.widget.wiki.addTiddler(wordArticleTemplate);
        expect(messageHandler.deleteWordArticle(wordArticleTemplate.title, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should delete word article and word meaning"
    + " and should not delete word, another word articles and transcription groups", () => {
        const options = utils.setupWiki();
        const wordTemplate = utils.createWord("some word");
        const transcriptionGroupTemplate = utils.createTranscriptionGroup("some tarnscription group", [wordTemplate.title], []);
        const wordMeaningTemplate = utils.createWordMeaning("some word meaning", "some part of speech");
        const wordArticleTemplate = utils.createWordArticle("some word article", wordTemplate.title, [transcriptionGroupTemplate.title], [wordMeaningTemplate.title]);
        const anotherWordMeaningTemplate = utils.createWordMeaning("another some word meaning", "some part of speech");
        const anotherWordArticleTemplate = utils.createWordArticle("another some word article", wordTemplate.title, [anotherWordMeaningTemplate.title]);
        const idle = false;
        options.widget.wiki.addTiddler(wordTemplate);
        options.widget.wiki.addTiddler(transcriptionGroupTemplate);
        options.widget.wiki.addTiddler(wordMeaningTemplate);
        options.widget.wiki.addTiddler(wordArticleTemplate);
        options.widget.wiki.addTiddler(anotherWordMeaningTemplate);
        options.widget.wiki.addTiddler(anotherWordArticleTemplate);
        loggerSpy.and.callThrough();
        expect(messageHandler.deleteWordArticle(wordArticleTemplate.title, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(0);
        expect(options.widget.wiki.getTiddler(wordArticleTemplate.title)).toBeUndefined();
        expect(options.widget.wiki.getTiddler(wordMeaningTemplate.title)).toBeUndefined();
        expect(options.widget.wiki.getTiddler(wordTemplate.title)).toBeDefined();
        expect(options.widget.wiki.getTiddler(transcriptionGroupTemplate.title)).toBeDefined();
        expect(options.widget.wiki.getTiddler(anotherWordMeaningTemplate.title)).toBeDefined();
        expect(options.widget.wiki.getTiddler(anotherWordArticleTemplate.title)).toBeDefined();
    })

    it("should delete word article"
    + " and should not delete the word meaning if it is referenced from more than one word article"
    + " and should not delete word, another word articles and transcription groups", () => {
        const options = utils.setupWiki();
        const wordTemplate = utils.createWord("some word");
        const transcriptionGroupTemplate = utils.createTranscriptionGroup("some tarnscription group", [wordTemplate.title], []);
        const wordMeaningTemplate = utils.createWordMeaning("some word meaning", "some part of speech");
        const wordArticleTemplate = utils.createWordArticle("some word article", wordTemplate.title, [transcriptionGroupTemplate.title], [wordMeaningTemplate.title]);
        const anotherWordMeaningTemplate = utils.createWordMeaning("another some word meaning", "some part of speech");
        const anotherWordArticleTemplate = utils.createWordArticle("another some word article", wordTemplate.title, [anotherWordMeaningTemplate.title]);
        const anoterWordAticleReferencedToSameWordMeaning = utils.createWordArticle("another word article referenced to same word meaning", "some another word", [], [wordMeaningTemplate.title]);
        const idle = false;
        options.widget.wiki.addTiddler(wordTemplate);
        options.widget.wiki.addTiddler(transcriptionGroupTemplate);
        options.widget.wiki.addTiddler(wordMeaningTemplate);
        options.widget.wiki.addTiddler(wordArticleTemplate);
        options.widget.wiki.addTiddler(anotherWordMeaningTemplate);
        options.widget.wiki.addTiddler(anotherWordArticleTemplate);
        options.widget.wiki.addTiddler(anoterWordAticleReferencedToSameWordMeaning);
        loggerSpy.and.callThrough();
        expect(messageHandler.deleteWordArticle(wordArticleTemplate.title, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(0);
        expect(options.widget.wiki.getTiddler(wordArticleTemplate.title)).toBeUndefined();
        expect(options.widget.wiki.getTiddler(wordMeaningTemplate.title)).toBeDefined();
        expect(options.widget.wiki.getTiddler(wordTemplate.title)).toBeDefined();
        expect(options.widget.wiki.getTiddler(transcriptionGroupTemplate.title)).toBeDefined();
        expect(options.widget.wiki.getTiddler(anotherWordMeaningTemplate.title)).toBeDefined();
        expect(options.widget.wiki.getTiddler(anotherWordArticleTemplate.title)).toBeDefined();
        expect(options.widget.wiki.getTiddler(anoterWordAticleReferencedToSameWordMeaning.title)).toBeDefined();
    })

});
