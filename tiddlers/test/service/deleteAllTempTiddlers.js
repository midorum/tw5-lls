
const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;

describe("The deleteAllTempTiddlers service", () => {
    var consoleSpy;
    var loggerSpy;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        loggerSpy = spyOn(Logger, 'alert');
    });

    it("should be defined", () => {
        expect(messageHandler.deleteAllTempTiddlers).toBeDefined();
    })

    it("should fail when tag argument is not defined", () => {
        const options = utils.setupWiki();
        const tag = undefined;
        const idle = true;
        const expectedMessage = "Internal Error: Missing 'tag' parameter";
        expect(messageHandler.deleteAllTempTiddlers(tag, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should delete only temporary tiddlers by tag", () => {
        const options = utils.setupWiki();
        const context = utils.getLlsContext();
        const someTag = context.tags.wordTranscription;
        const temporaryTiddlerTemplate = utils.createTemporaryTranscriptionDataHolder("some title", someTag);
        const ordinaryTiddlerTemplate = utils.createTranscription("some title");
        const idle = false;
        options.widget.wiki.addTiddler(temporaryTiddlerTemplate);
        options.widget.wiki.addTiddler(ordinaryTiddlerTemplate);
        // console.warn(options.widget.wiki.getTiddler(temporaryTiddlerTemplate.title))
        loggerSpy.and.callThrough();
        expect(messageHandler.deleteAllTempTiddlers(someTag, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(0);
        expect(options.widget.wiki.getTiddler(temporaryTiddlerTemplate.title)).toBeUndefined();
        expect(options.widget.wiki.getTiddler(ordinaryTiddlerTemplate.title)).toBeDefined();
    })

});
