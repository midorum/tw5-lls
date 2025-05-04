
const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;

describe("The attachUserFocus service", () => {
    var consoleSpy;
    var consoleDebugSpy;
    var loggerSpy;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        consoleDebugSpy = spyOn(console, 'debug');
        loggerSpy = spyOn(Logger, 'alert');
    });

    it("should be defined", () => {
        expect(messageHandler.attachUserFocus).toBeDefined();
    })

    it("should fail when ref argument is not defined", () => {
        const options = utils.setupWiki();
        const ref = undefined;
        const idle = true;
        const expectedMessage = "ref cannot be empty";
        expect(messageHandler.attachUserFocus(ref, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should link the item with the user focus tag", () => {
        const options = utils.setupWiki();
        const context = utils.getLlsContext();
        const userTagTemplate = utils.createUserTag("some user tag");
        const idle = false;
        options.widget.wiki.addTiddler(userTagTemplate);
        // consoleDebugSpy.and.callThrough();
        loggerSpy.and.callThrough();
        var userTagTiddler = options.widget.wiki.getTiddler(userTagTemplate.title);
        console.debug("userTagTiddler before attaching", userTagTiddler);
        expect(userTagTiddler).toBeDefined();
        expect(userTagTiddler.fields.tags.includes(context.tags.userTag)).toBeTruthy();
        expect(userTagTiddler.fields.tags.includes(context.tags.userFocus)).toBeFalsy();
        expect(messageHandler.attachUserFocus(userTagTemplate.title, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(0);
        userTagTiddler = options.widget.wiki.getTiddler(userTagTemplate.title);
        console.debug("userTagTiddler after attaching", userTagTiddler);
        expect(userTagTiddler).toBeDefined();
        expect(userTagTiddler.fields.tags.includes(context.tags.userTag)).toBeTruthy();
        expect(userTagTiddler.fields.tags.includes(context.tags.userFocus)).toBeTruthy();
    })

});
