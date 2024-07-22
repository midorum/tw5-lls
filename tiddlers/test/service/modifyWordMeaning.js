
const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;

describe("The modifyWordMeaning service", () => {
    var consoleSpy;
    var loggerSpy;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        loggerSpy = spyOn(Logger, 'alert');
    });

    it("should be defined", () => {
        expect(messageHandler.modifyWordMeaning).toBeDefined();
    })

    it("should fail when ref argument is not defined", () => {
        const options = utils.setupWiki();
        const ref = undefined;
        const newMeaning = undefined;
        const newSpeechPart = undefined;
        const idle = true;
        const expectedMessage = "ref cannot be empty";
        expect(messageHandler.modifyWordMeaning(ref, newMeaning, newSpeechPart, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when newMeaning argument is not defined", () => {
        const options = utils.setupWiki();
        const ref = "some";
        const newMeaning = undefined;
        const newSpeechPart = undefined;
        const idle = true;
        const expectedMessage = "newMeaning cannot be empty";
        expect(messageHandler.modifyWordMeaning(ref, newMeaning, newSpeechPart, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when newSpeechPart argument is not defined", () => {
        const options = utils.setupWiki();
        const ref = "some";
        const newMeaning = "some";
        const newSpeechPart = undefined;
        const idle = true;
        const expectedMessage = "newSpeechPart cannot be empty";
        expect(messageHandler.modifyWordMeaning(ref, newMeaning, newSpeechPart, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when newSpeechPart argument is wrong", () => {
        const options = utils.setupWiki();
        const ref = "some";
        const newMeaning = "some";
        const newSpeechPart = "wrong";
        const idle = true;
        const expectedMessage = "Part of speech not found: " + newSpeechPart;
        expect(messageHandler.modifyWordMeaning(ref, newMeaning, newSpeechPart, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when word meaning tiddler is not found", () => {
        const options = utils.setupWiki();
        const ref = "some";
        const newMeaning = "some";
        const newSpeechPart = "noun";
        const partOfSpeechTemplate = utils.createPartOfSpeech(newSpeechPart);
        const idle = false;
        const expectedMessage = "Tillder not found: " + ref;
        options.widget.wiki.addTiddler(partOfSpeechTemplate);
        expect(messageHandler.modifyWordMeaning(ref, newMeaning, newSpeechPart, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should change the word meaning tiddler", () => {
        const options = utils.setupWiki();
        const oldPartOfSpeech = "old part of speech";
        const oldPartOfSpeechTemplate = utils.createPartOfSpeech(oldPartOfSpeech);
        const meaningTemplate = utils.createWordMeaning("old meaning", oldPartOfSpeech);
        const newMeaning = "new meaning";
        const newPartOfSpeech = "new part of speech";
        const newPartOfSpeechTemplate = utils.createPartOfSpeech(newPartOfSpeech);
        const idle = false;
        options.widget.wiki.addTiddler(meaningTemplate);
        options.widget.wiki.addTiddler(oldPartOfSpeechTemplate);
        options.widget.wiki.addTiddler(newPartOfSpeechTemplate);
        loggerSpy.and.callThrough();
        expect(messageHandler.modifyWordMeaning(meaningTemplate.title, newMeaning, newPartOfSpeech, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(0);
        const wordMeaningInstance = options.widget.wiki.getTiddler(meaningTemplate.title);
        // console.warn(wordMeaningInstance);
        expect(wordMeaningInstance.fields.text).toEqual(newMeaning);
        expect(wordMeaningInstance.fields.tags.includes(newPartOfSpeech)).toBeTruthy();
        expect(wordMeaningInstance.fields.tags.includes(oldPartOfSpeech)).toBeFalsy();

    })


});
