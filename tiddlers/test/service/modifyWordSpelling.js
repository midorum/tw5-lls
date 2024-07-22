
const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;

describe("The modifyWordSpelling service", () => {
    var consoleSpy;
    var loggerSpy;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        loggerSpy = spyOn(Logger, 'alert');
    });

    it("should be defined", () => {
        expect(messageHandler.modifyWordSpelling).toBeDefined();
    });

    it("should fail when word argument is not defined", () => {
        const options = utils.setupWiki();
        const word = undefined;
        const newSpelling = undefined;
        const idle = true;
        const expectedMessage = "word cannot be empty";
        expect(messageHandler.modifyWordSpelling(word, newSpelling, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when newSpelling argument is not defined", () => {
        const options = utils.setupWiki();
        const word = "some";
        const newSpelling = undefined;
        const idle = true;
        const expectedMessage = "newSpelling cannot be empty";
        expect(messageHandler.modifyWordSpelling(word, newSpelling, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail if word with new spelling already exist", () => {
        const options = utils.setupWiki();
        const context = utils.getLlsContext();
        const word = "some word";
        const wordTemplate = utils.createWordBySpelling(word);
        const newSpelling = word;
        const idle = true;
        const expectedMessage = "The word \"" + newSpelling + "\" already exists in the database";
        options.widget.wiki.addTiddler(wordTemplate);
        expect(messageHandler.modifyWordSpelling(word, newSpelling, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should change word spelling", () => {
        const options = utils.setupWiki();
        const context = utils.getLlsContext();
        const word = "some word";
        const wordTemplate = utils.createWordBySpelling(word);
        const newSpelling = "new word spelling";
        const idle = false;
        options.widget.wiki.addTiddler(wordTemplate);
        expect(messageHandler.modifyWordSpelling(wordTemplate.title, newSpelling, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(0);
        const words = options.widget.wiki.filterTiddlers("[all[tiddlers]tag[" + context.tags.word + "]]");
        expect(words.length).toEqual(1);
        const wordTitle = words[0];
        expect(wordTitle).toBeDefined();
        expect(options.widget.wiki.getTiddler(wordTitle).fields.text).toEqual(newSpelling);
    })

});
