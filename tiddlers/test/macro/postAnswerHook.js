
const utils = require("test/utils").llsTestUtils;
const stateTitle = require("$:/plugins/midorum/lls/modules/cache.js").getTags({}).lastAnswerTime;
const Logger = $tw.utils.Logger.prototype;

describe("The lls-post-answer-hook macro", () => {
    var consoleSpy;
    var consoleDebugSpy;
    var loggerSpy;
    var postAnswerHookMacro;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        consoleDebugSpy = spyOn(console, 'debug');
        loggerSpy = spyOn(Logger, 'alert');
        postAnswerHookMacro = $tw.macros["lls-post-answer-hook"]
    });

    it("should be defined", () => {
        expect(postAnswerHookMacro).toBeDefined();
    })

    it("should create the state tiddler with the last answer time if it does not exist", () => {
        const options = utils.setupWiki();
        // consoleSpy.and.callThrough();
        // consoleDebugSpy.and.callThrough();
        const time = new Date().getTime();
        postAnswerHookMacro.run(options.wiki, {
            time: time
        });
        const lastAnswerTimeInstance = options.widget.wiki.getTiddler(stateTitle);
        console.debug("lastAnswerTimeInstance", lastAnswerTimeInstance);
        expect(lastAnswerTimeInstance.fields.text).toEqual(time);
    })

    it("should update the state tiddler with the last answer time if it exists", () => {
        const options = utils.setupWiki();
        // consoleSpy.and.callThrough();
        // consoleDebugSpy.and.callThrough();
        const time = new Date().getTime();
        options.widget.wiki.addTiddler({
            title: stateTitle,
            text: 123
        });
        postAnswerHookMacro.run(options.wiki, {
            time: time
        });
        const lastAnswerTimeInstance = options.widget.wiki.getTiddler(stateTitle);
        console.debug("lastAnswerTimeInstance", lastAnswerTimeInstance);
        expect(lastAnswerTimeInstance.fields.text).toEqual(time);
    })

});
