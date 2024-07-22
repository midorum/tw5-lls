
const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;

describe("The detachTranscriptionGroup service", () => {
    var consoleSpy;
    var loggerSpy;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        loggerSpy = spyOn(Logger, 'alert');
    });

    it("should be defined", () => {
        expect(messageHandler.detachTranscriptionGroup).toBeDefined();
    })

    it("should fail when article argument is not defined", () => {
        const options = utils.setupWiki();
        const article = undefined;
        const transcriptionGroup = undefined;
        const idle = true;
        const expectedMessage = "article cannot be empty";
        expect(messageHandler.detachTranscriptionGroup(article, transcriptionGroup, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when transcriptionGroup argument is not defined", () => {
        const options = utils.setupWiki();
        const article = "some";
        const transcriptionGroup = undefined;
        const idle = true;
        const expectedMessage = "transcription group cannot be empty";
        expect(messageHandler.detachTranscriptionGroup(article, transcriptionGroup, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when transcriptionGroup argument is not defined", () => {
        const options = utils.setupWiki();
        const context = utils.getLlsContext();
        const someWord = "some word";
        const transcriptionGroup1Template = utils.createTranscriptionGroup("transcriptionGroup1", [someWord], []);
        const transcriptionGroup2Template = utils.createTranscriptionGroup("transcriptionGroup2", [someWord], []);
        const wordArticleTemplate = utils.createWordArticle("some article", someWord, [transcriptionGroup1Template.title, transcriptionGroup2Template.title]);
        const idle = false;
        options.widget.wiki.addTiddler(transcriptionGroup1Template);
        options.widget.wiki.addTiddler(transcriptionGroup2Template);
        options.widget.wiki.addTiddler(wordArticleTemplate);
        loggerSpy.and.callThrough();
        expect(messageHandler.detachTranscriptionGroup(wordArticleTemplate.title, transcriptionGroup1Template.title, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(0);
        const transcriptionGroups = options.widget.wiki.filterTiddlers("[tag[" + context.tags.transcriptionGroup + "]]");
        expect(transcriptionGroups.length).toEqual(2);
        expect(transcriptionGroups.includes(transcriptionGroup1Template.title));
        expect(transcriptionGroups.includes(transcriptionGroup2Template.title));
        const articleTranscriptionGroups = options.widget.wiki.filterTiddlers("[[" + wordArticleTemplate.title + "]tags[]tag[" + context.tags.transcriptionGroup + "]]");
        expect(articleTranscriptionGroups.length).toEqual(1);
        expect(articleTranscriptionGroups.includes(transcriptionGroup2Template.title));
    })

});
