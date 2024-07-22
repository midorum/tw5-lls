
const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;

describe("The setUserTagValue service", () => {
    var consoleSpy;
    var loggerSpy;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        loggerSpy = spyOn(Logger, 'alert');
    });

    it("should be defined", () => {
        expect(messageHandler.setUserTagValue).toBeDefined();
    });

    it("should fail when ref argument is not defined", () => {
        const options = utils.setupWiki();
        const ref = undefined;
        const tagRef = undefined;
        const tagValue = undefined;
        const idle = true;
        const expectedMessage = "ref cannot be empty";
        expect(messageHandler.setUserTagValue(ref, tagRef, tagValue, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when tagRef argument is not defined", () => {
        const options = utils.setupWiki();
        const ref = "some";
        const tagRef = undefined;
        const tagValue = undefined;
        const idle = true;
        const expectedMessage = "tagRef cannot be empty";
        expect(messageHandler.setUserTagValue(ref, tagRef, tagValue, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when tagRef argument is wrong", () => {
        const options = utils.setupWiki();
        const ref = "some";
        const tagRef = "wrong";
        const tagValue = undefined;
        const idle = true;
        const expectedMessage = "Wrong user tag reference: " + tagRef;
        expect(messageHandler.setUserTagValue(ref, tagRef, tagValue, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should create a new user tag value if it does not exist", () => {
        const options = utils.setupWiki();
        const context = utils.getLlsContext();
        const wordArticleTemplate = utils.createWordArticle("some article", "some word", []);
        const ref = wordArticleTemplate.title;
        const userTagTemplate = utils.createUserTag("some user tag");
        const tagRef = userTagTemplate.title;
        const tagValue = "some value";
        const idle = false;
        options.widget.wiki.addTiddler(wordArticleTemplate);
        options.widget.wiki.addTiddler(userTagTemplate);
        loggerSpy.and.callThrough();
        expect(messageHandler.setUserTagValue(ref, tagRef, tagValue, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(0);
        const createdUserTagValue = options.widget.wiki.filterTiddlers("[tag[" + context.tags.userTagValue + "]]")[0];
        expect(createdUserTagValue).toBeDefined();
        const userTagValueInstance = options.widget.wiki.getTiddler(createdUserTagValue);
        // console.warn(userTagValueInstance);
        expect(userTagValueInstance).toBeDefined();
        expect(userTagValueInstance.fields.tags.includes(wordArticleTemplate.title)).toBeTruthy();
        expect(userTagValueInstance.fields.tags.includes(userTagTemplate.title)).toBeTruthy();
        expect(userTagValueInstance.fields.text).toEqual(tagValue);
    })

    it("should update an exist user tag value if it does exist", () => {
        const options = utils.setupWiki();
        const context = utils.getLlsContext();
        const wordArticleTemplate = utils.createWordArticle("some article", "some word", []);
        const ref = wordArticleTemplate.title;
        const userTagTemplate = utils.createUserTag("some user tag");
        const tagRef = userTagTemplate.title;
        const tagValue = "some value";
        const existUserTagValue = utils.createUserTagValue("exist user tag value", [wordArticleTemplate.title, userTagTemplate.title], "some old value");
        const idle = false;
        options.widget.wiki.addTiddler(wordArticleTemplate);
        options.widget.wiki.addTiddler(userTagTemplate);
        options.widget.wiki.addTiddler(existUserTagValue);
        // console.warn(options.widget.wiki.getTiddler(existUserTagValue.title));
        loggerSpy.and.callThrough();
        expect(messageHandler.setUserTagValue(ref, tagRef, tagValue, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(0);
        const userTagValues = options.widget.wiki.filterTiddlers("[tag[" + context.tags.userTagValue + "]]");
        expect(userTagValues.length).toEqual(1);
        const userTagValueTitle = userTagValues[0];
        expect(userTagValueTitle).toEqual(existUserTagValue.title);
        const userTagValueInstance = options.widget.wiki.getTiddler(userTagValueTitle);
        // console.warn(userTagValueInstance);
        expect(userTagValueInstance).toBeDefined();
        expect(userTagValueInstance.fields.tags.includes(wordArticleTemplate.title)).toBeTruthy();
        expect(userTagValueInstance.fields.tags.includes(userTagTemplate.title)).toBeTruthy();
        expect(userTagValueInstance.fields.text).toEqual(tagValue);
    })

});
