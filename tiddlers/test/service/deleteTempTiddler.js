
const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;

describe("The deleteTempTiddler service", () => {
    var consoleSpy;
    var loggerSpy;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        loggerSpy = spyOn(Logger, 'alert');
    });

    it("should be defined", () => {
        expect(messageHandler.deleteTempTiddler).toBeDefined();
    })

    it("should fail when title argument is not defined", () => {
        const options = utils.setupWiki();
        const title = undefined;
        const idle = true;
        const expectedMessage = "Internal Error: Missing 'title' parameter";
        expect(messageHandler.deleteTempTiddler(title, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail while attempt to delete ordinary tiddler", () => {
        const options = utils.setupWiki();
        const context = utils.getLlsContext();
        const someTag = "some tag";
        const ordinaryTiddlerTemplate = utils.createTranscription("some title");
        const idle = true;
        const expectedMessage = "Internal Error: You can delete only 'temp' tiddlers with this message. For others use 'tm-delete-tiddler' message.";
        options.widget.wiki.addTiddler(ordinaryTiddlerTemplate);
        expect(messageHandler.deleteTempTiddler(ordinaryTiddlerTemplate.title, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should delete temporary tiddler by title", () => {
        const options = utils.setupWiki();
        const context = utils.getLlsContext();
        const someTag = "some tag";
        const temporaryTiddlerTemplate = utils.createTemporaryTranscriptionDataHolder("some title", someTag);
        const idle = false;
        options.widget.wiki.addTiddler(temporaryTiddlerTemplate);
        // console.warn(options.widget.wiki.getTiddler(temporaryTiddlerTemplate.title))
        loggerSpy.and.callThrough();
        expect(messageHandler.deleteTempTiddler(temporaryTiddlerTemplate.title, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(0);
        expect(options.widget.wiki.getTiddler(temporaryTiddlerTemplate.title)).toBeUndefined();
        expect(options.widget.wiki.filterTiddlers("[all[tiddlers]tag[" + someTag + "]]").length).toEqual(0);
    })

});
