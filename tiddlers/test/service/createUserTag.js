
const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;

describe("The createUserTag service", () => {
    var consoleSpy;
    var loggerSpy;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        loggerSpy = spyOn(Logger, 'alert');
    });

    it("should be defined", () => {
        expect(messageHandler.createUserTag).toBeDefined();
    })

    it("should fail when name argument is not defined", () => {
        const options = utils.setupWiki();
        const name = undefined;
        const description = undefined;
        const idle = true;
        const expectedMessage = "name cannot be empty";
        expect(messageHandler.createUserTag(name, description, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when a user tag with the same name already exists", () => {
        const options = utils.setupWiki();
        const name = "some name";
        const existUserTagTemplate = utils.createUserTag(name);
        const description = undefined;
        const idle = true;
        const expectedMessage = "Tag with name \"" + name + "\" already exists";
        options.widget.wiki.addTiddler(existUserTagTemplate);
        expect(messageHandler.createUserTag(name, description, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should create a new user tag instance with specified name and description", () => {
        const options = utils.setupWiki();
        const context = utils.getLlsContext();
        const name = "some name";
        const description = "some description";
        const idle = false;
        loggerSpy.and.callThrough();
        expect(messageHandler.createUserTag(name, description, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(0);
        const createdUserTag = options.widget.wiki.filterTiddlers("[tag[" + context.tags.userTag + "]]")[0];
        const userTagTiddler = options.widget.wiki.getTiddler(createdUserTag);
        // console.warn(userTagTiddler);
        expect(userTagTiddler).toBeDefined();
        expect(userTagTiddler.fields.name).toEqual(name);
        expect(userTagTiddler.fields.text).toEqual(description);
    })

});
