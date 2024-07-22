
const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;

describe("The setNotesToWordArticle service", () => {
    var consoleSpy;
    var loggerSpy;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        loggerSpy = spyOn(Logger, 'alert');
    });

    it("should be defined", () => {
        expect(messageHandler.setNotesToWordArticle).toBeDefined();
    });

    it("should fail when ref argument is not defined", () => {
        const options = utils.setupWiki();
        const ref = undefined;
        const notes = undefined;
        const idle = true;
        const expectedMessage = "ref cannot be empty";
        expect(messageHandler.setNotesToWordArticle(ref, notes, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when ref argument is wrong", () => {
        const options = utils.setupWiki();
        const ref = "some";
        const notes = undefined;
        const idle = true;
        const expectedMessage = "Wrong word article reference: " + ref;
        expect(messageHandler.setNotesToWordArticle(ref, notes, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should update notes field in word article tiddler", () => {
        const options = utils.setupWiki();
        const wordArticleTemplate = utils.createWordArticle("some word article", "some word", []);
        const ref = wordArticleTemplate.title;
        const notes = "new notes value";
        const idle = false;
        options.widget.wiki.addTiddler(wordArticleTemplate);
        loggerSpy.and.callThrough();
        expect(messageHandler.setNotesToWordArticle(ref, notes, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(0);
        const wordArticleInstance = options.widget.wiki.getTiddler(wordArticleTemplate.title);
        expect(wordArticleInstance.fields.notes).toEqual(notes);
    })

});
