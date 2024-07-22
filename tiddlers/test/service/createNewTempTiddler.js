
const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;

describe("The createNewTempTiddler service", () => {
    var consoleSpy;
    var loggerSpy;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        loggerSpy = spyOn(Logger, 'alert');
    });

    it("should be defined", () => {
        expect(messageHandler.createNewTempTiddler).toBeDefined();
    })

    it("should fail when tag argument is not defined", () => {
        const options = utils.setupWiki();
        const tag = undefined;
        const text = undefined;
        const src = undefined;
        const idle = true;
        const expectedMessage = "Internal Error: Missing 'tag' parameter";
        expect(messageHandler.createNewTempTiddler(tag, text, src, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should create new temporary tiddler", () => {
        const options = utils.setupWiki();
        const context = utils.getLlsContext();
        const tag = "some tag";
        const text = "some text";
        const src = "some src";
        const idle = false;
        expect(messageHandler.createNewTempTiddler(tag, text, src, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(0);
        const createdTiddlers = options.widget.wiki.filterTiddlers("[all[tiddlers]tag[" + tag + "]]");
        expect(createdTiddlers.length).toEqual(1);
        const createdTemporaryTiddlerInstance = options.widget.wiki.getTiddler(createdTiddlers[0]);
        // console.warn(createdTemporaryTiddlerInstance);
        expect(createdTemporaryTiddlerInstance.fields.text).toEqual(text);
        expect(createdTemporaryTiddlerInstance.fields.src).toEqual(src);
    })

});
