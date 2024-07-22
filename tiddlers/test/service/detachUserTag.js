
const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;

describe("The detachUserTag service", () => {
    var consoleSpy;
    var loggerSpy;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        loggerSpy = spyOn(Logger, 'alert');
    });

    it("should be defined", () => {
        expect(messageHandler.detachUserTag).toBeDefined();
    })

    it("should fail when ref argument is not defined", () => {
        const options = utils.setupWiki();
        const ref = undefined;
        const tagRef = undefined;
        const idle = true;
        const expectedMessage = "ref cannot be empty";
        expect(messageHandler.detachUserTag(ref, tagRef, idle, options.widget)).nothing();
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
        expect(messageHandler.detachUserTag(ref, tagRef, idle, options.widget)).nothing();
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
        expect(messageHandler.detachUserTag(ref, tagRef, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should delete link user tag with target tiddler", () => {
        const options = utils.setupWiki();
        const context = utils.getLlsContext();
        const userTagTemplate = utils.createUserTag("some user tag");
        const wordArticleTemplate = utils.createWordArticle("some word article", "some word", [], [userTagTemplate.title]);
        const idle = false;
        options.widget.wiki.addTiddler(wordArticleTemplate);
        options.widget.wiki.addTiddler(userTagTemplate);
        loggerSpy.and.callThrough();
        expect(messageHandler.detachUserTag(wordArticleTemplate.title, userTagTemplate.title, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(0);
        const wordArticleTiddler = options.widget.wiki.getTiddler(wordArticleTemplate.title);
        expect(wordArticleTiddler).toBeDefined();
        expect(wordArticleTiddler.fields.tags.includes(context.tags.wordArticle)).toBeTruthy();
        expect(wordArticleTiddler.fields.tags.includes(userTagTemplate.title)).toBeFalsy();
    })

});
