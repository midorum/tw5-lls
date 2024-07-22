
const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;

describe("The deleteTranscriptionGroup service", () => {
    var consoleSpy;
    var loggerSpy;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        loggerSpy = spyOn(Logger, 'alert');
    });

    it("should be defined", () => {
        expect(messageHandler.deleteTranscriptionGroup).toBeDefined();
    })

    it("should fail when ref argument is not defined", () => {
        const options = utils.setupWiki();
        const ref = undefined;
        const idle = true;
        const expectedMessage = "ref cannot be empty";
        expect(messageHandler.deleteTranscriptionGroup(ref, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when try to delete other than transcription group", () => {
        const options = utils.setupWiki();
        const someTiddlerTemplate = utils.createWord("some word");
        const idle = true;
        const expectedMessage = "You can delete only a group of transcriptions with this message";
        expect(messageHandler.deleteTranscriptionGroup(someTiddlerTemplate.title, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should delete transcription group"
    + " and should delete all related transcriptions"
    + " and should delete transcription group tag from word article tiddler", () => {
        const options = utils.setupWiki();
        const someWordTemplate = utils.createWord("some word");
        const transcription1Template = utils.createTranscription("transcription1");
        const transcription2Template = utils.createTranscription("transcription2");
        const transcriptionGroupTemplate = utils.createTranscriptionGroup("transcription group", [someWordTemplate], [transcription1Template.title, transcription2Template.title]);
        const anothertranscriptionGroupTemplate = utils.createTranscriptionGroup("another transcription group", [someWordTemplate], []);
        const wordArticleTemplate = utils.createWordArticle("some article", someWordTemplate.title, transcriptionGroupTemplate.title);
        const idle = false;
        options.widget.wiki.addTiddler(someWordTemplate);
        options.widget.wiki.addTiddler(transcription1Template);
        options.widget.wiki.addTiddler(transcription2Template);
        options.widget.wiki.addTiddler(transcriptionGroupTemplate);
        options.widget.wiki.addTiddler(anothertranscriptionGroupTemplate);
        options.widget.wiki.addTiddler(wordArticleTemplate);
        // console.warn(options.widget.wiki.getTiddler(wordArticleTemplate.title));
        expect(messageHandler.deleteTranscriptionGroup(transcriptionGroupTemplate.title, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(0);
        expect(options.widget.wiki.getTiddler(someWordTemplate.title)).toBeDefined();
        const wordArticleTiddler = options.widget.wiki.getTiddler(wordArticleTemplate.title);
        // console.warn(wordArticleTiddler);
        expect(wordArticleTiddler).toBeDefined();
        expect(wordArticleTiddler.fields.tags.includes(transcriptionGroupTemplate.title)).toBeFalsy();
        expect(options.widget.wiki.getTiddler(anothertranscriptionGroupTemplate.title)).toBeDefined();
        expect(options.widget.wiki.getTiddler(transcription1Template.title)).toBeUndefined();
        expect(options.widget.wiki.getTiddler(transcription2Template.title)).toBeUndefined();
        expect(options.widget.wiki.getTiddler(transcriptionGroupTemplate.title)).toBeUndefined();
    })

});
