
const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;

describe("The deleteUserTagValue service", () => {
    var consoleSpy;
    var loggerSpy;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        loggerSpy = spyOn(Logger, 'alert');
    });

    it("should be defined", () => {
        expect(messageHandler.deleteUserTagValue).toBeDefined();
    });

    it("should fail when ref argument is not defined", () => {
        const options = utils.setupWiki();
        const ref = undefined;
        const tagRef = undefined;
        const idle = true;
        const expectedMessage = "ref cannot be empty";
        expect(messageHandler.deleteUserTagValue(ref, tagRef, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })


    it("should fail when tagRef argument is not defined", () => {
        const options = utils.setupWiki();
        const ref = "some";
        const tagRef = undefined;
        const idle = true;
        const expectedMessage = "tagRef cannot be empty";
        expect(messageHandler.deleteUserTagValue(ref, tagRef, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when tagRef argument is wrong", () => {
        const options = utils.setupWiki();
        const ref = "some";
        const tagRef = "wrong";
        const idle = true;
        const expectedMessage = "Wrong user tag reference: " + tagRef;
        expect(messageHandler.deleteUserTagValue(ref, tagRef, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should delete an exist user tag value if it does exist", () => {
        const options = utils.setupWiki();
        const context = utils.getLlsContext();
        const wordArticleTemplate = utils.createWordArticle("some article", "some word", []);
        const ref = wordArticleTemplate.title;
        const userTagTemplate = utils.createUserTag("some user tag");
        const tagRef = userTagTemplate.title;
        const existUserTagValue = utils.createUserTagValue("exist user tag value", [wordArticleTemplate.title, userTagTemplate.title], "some value");
        const idle = false;
        options.widget.wiki.addTiddler(wordArticleTemplate);
        options.widget.wiki.addTiddler(userTagTemplate);
        options.widget.wiki.addTiddler(existUserTagValue);
        // console.warn(options.widget.wiki.getTiddler(existUserTagValue.title));
        loggerSpy.and.callThrough();
        expect(messageHandler.deleteUserTagValue(ref, tagRef, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(0);
        const userTagValues = options.widget.wiki.filterTiddlers("[tag[" + context.tags.userTagValue + "]]");
        expect(userTagValues.length).toEqual(0);
        expect(options.widget.wiki.getTiddler(existUserTagValue.title)).toBeUndefined();
    })

});
