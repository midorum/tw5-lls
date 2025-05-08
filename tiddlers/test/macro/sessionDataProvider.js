
const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;
const offset_24h = 86400000;

describe("The lls-session-data-provider macro", () => {
    var consoleSpy;
    var consoleDebugSpy;
    var loggerSpy;
    var sessionDataProvider;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        consoleDebugSpy = spyOn(console, 'debug');
        loggerSpy = spyOn(Logger, 'alert');
        sessionDataProvider = $tw.macros["lls-session-data-provider"]
    });

    it("should be defined", () => {
        expect(sessionDataProvider).toBeDefined();
    })


    describe("", () => {

        it("should select a word article as word article"
            + " when it is ordinary (not focused)"
            + " and its next check time is missed (new)"
            + " and it has not any usage example", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [ordinaryTag.userTag.title],
                    scheduledForward: {}
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeTruthy();
            })

        it("should select a word article as word article"
            + " when it is focused"
            + " and its next check time is missed (new)"
            + " and it has not any usage example", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [focusedTag.userTag.title],
                    scheduledForward: {}
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeTruthy();
            })

        it("should select a word article as word article"
            + " when it is ordinary (not focused)"
            + " and its next check time is overdue"
            + " and it has not any usage example", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeTruthy();
            })

        it("should select a word article as word article"
            + " when it is focused"
            + " and its next check time is overdue"
            + " and it has not any usage example", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [focusedTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeTruthy();
            })

        it("should not select a word article"
            + " when it is ordinary (not focused)"
            + " and its next check time is in the future"
            + " and it has not any usage example", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(0);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
            })

        it("should not select a word article"
            + " when it is focused"
            + " and its next check time is in the future"
            + " and it has not any usage example", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [focusedTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(0);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
            })

    });


    describe("", () => {

        it("should select a word article as usage example"
            + " when the article is ordinary (not focused)"
            + " and its next check time is missed (new)"
            + " and it has a usage example"
            + " and the usage example is ordinary (not focused)"
            + " and its next check time is missed (new)", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [ordinaryTag.userTag.title],
                    scheduledForward: {}
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, ordinaryTag.userTag.title],
                    scheduledForward: {}
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a word article as usage example"
            + " when the article is ordinary (not focused)"
            + " and its next check time is missed (new)"
            + " and it has a usage example"
            + " and the usage example is focused"
            + " and its next check time is missed (new)", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [ordinaryTag.userTag.title],
                    scheduledForward: {}
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, focusedTag.userTag.title],
                    scheduledForward: {}
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a word article as usage example"
            + " when the article is ordinary (not focused)"
            + " and its next check time is missed (new)"
            + " and it has a usage example"
            + " and the usage example is ordinary (not focused)"
            + " and its next check time is overdue", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [ordinaryTag.userTag.title],
                    scheduledForward: {}
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a word article as usage example"
            + " when the article is ordinary (not focused)"
            + " and its next check time is missed (new)"
            + " and it has a usage example"
            + " and the usage example is focused"
            + " and its next check time is overdue", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [ordinaryTag.userTag.title],
                    scheduledForward: {}
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, focusedTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a word article as usage example"
            + " when the article is ordinary (not focused)"
            + " and its next check time is missed (new)"
            + " and it has a usage example"
            + " and the usage example is ordinary (not focused)"
            + " and its next check time is in the future", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [ordinaryTag.userTag.title],
                    scheduledForward: {}
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a word article as usage example"
            + " when the article is ordinary (not focused)"
            + " and its next check time is missed (new)"
            + " and it has a usage example"
            + " and the usage example is focused"
            + " and its next check time is in the future", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [ordinaryTag.userTag.title],
                    scheduledForward: {}
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, focusedTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

    });

    describe("", () => {

        it("should select a word article as usage example"
            + " when the article is focused"
            + " and its next check time is missed (new)"
            + " and it has a usage example"
            + " and the usage example is ordinary (not focused)"
            + " and its next check time is missed (new)", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [focusedTag.userTag.title],
                    scheduledForward: {}
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, ordinaryTag.userTag.title],
                    scheduledForward: {}
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a word article as usage example"
            + " when the article is focused"
            + " and its next check time is missed (new)"
            + " and it has a usage example"
            + " and the usage example is focused"
            + " and its next check time is missed (new)", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [focusedTag.userTag.title],
                    scheduledForward: {}
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, focusedTag.userTag.title],
                    scheduledForward: {}
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a word article as usage example"
            + " when the article is focused"
            + " and its next check time is missed (new)"
            + " and it has a usage example"
            + " and the usage example is ordinary (not focused)"
            + " and its next check time is overdue", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [focusedTag.userTag.title],
                    scheduledForward: {}
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a word article as usage example"
            + " when the article is focused"
            + " and its next check time is missed (new)"
            + " and it has a usage example"
            + " and the usage example is focused"
            + " and its next check time is overdue", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [focusedTag.userTag.title],
                    scheduledForward: {}
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, focusedTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a word article as usage example"
            + " when the article is focused"
            + " and its next check time is missed (new)"
            + " and it has a usage example"
            + " and the usage example is ordinary (not focused)"
            + " and its next check time is in the future", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [focusedTag.userTag.title],
                    scheduledForward: {}
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a word article as usage example"
            + " when the article is focused"
            + " and its next check time is missed (new)"
            + " and it has a usage example"
            + " and the usage example is focused"
            + " and its next check time is in the future", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [focusedTag.userTag.title],
                    scheduledForward: {}
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, focusedTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

    });

    describe("", () => {

        it("should select a word article as usage example"
            + " when the article is ordinary (not focused)"
            + " and its next check time is overdue"
            + " and it has a usage example"
            + " and the usage example is ordinary (not focused)"
            + " and its next check time is missed (new)", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, ordinaryTag.userTag.title],
                    scheduledForward: {}
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a word article as usage example"
            + " when the article is ordinary (not focused)"
            + " and its next check time is overdue"
            + " and it has a usage example"
            + " and the usage example is focused"
            + " and its next check time is missed (new)", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, focusedTag.userTag.title],
                    scheduledForward: {}
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a word article as usage example"
            + " when the article is ordinary (not focused)"
            + " and its next check time is overdue"
            + " and it has a usage example"
            + " and the usage example is ordinary (not focused)"
            + " and its next check time is overdue", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a word article as usage example"
            + " when the article is ordinary (not focused)"
            + " and its next check time is overdue"
            + " and it has a usage example"
            + " and the usage example is focused"
            + " and its next check time is overdue", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, focusedTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a word article as usage example"
            + " when the article is ordinary (not focused)"
            + " and its next check time is overdue"
            + " and it has a usage example"
            + " and the usage example is ordinary (not focused)"
            + " and its next check time is in the future", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a word article as usage example"
            + " when the article is ordinary (not focused)"
            + " and its next check time is overdue"
            + " and it has a usage example"
            + " and the usage example is focused"
            + " and its next check time is in the future", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, focusedTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

    });

    describe("", () => {

        it("should select a word article as usage example"
            + " when the article is focused"
            + " and its next check time is overdue"
            + " and it has a usage example"
            + " and the usage example is ordinary (not focused)"
            + " and its next check time is missed (new)", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [focusedTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, ordinaryTag.userTag.title],
                    scheduledForward: {}
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a word article as usage example"
            + " when the article is focused"
            + " and its next check time is overdue"
            + " and it has a usage example"
            + " and the usage example is focused"
            + " and its next check time is missed (new)", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [focusedTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, focusedTag.userTag.title],
                    scheduledForward: {}
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a word article as usage example"
            + " when the article is focused"
            + " and its next check time is overdue"
            + " and it has a usage example"
            + " and the usage example is ordinary (not focused)"
            + " and its next check time is overdue", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [focusedTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a word article as usage example"
            + " when the article is focused"
            + " and its next check time is overdue"
            + " and it has a usage example"
            + " and the usage example is focused"
            + " and its next check time is overdue", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [focusedTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, focusedTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a word article as usage example"
            + " when the article is focused"
            + " and its next check time is overdue"
            + " and it has a usage example"
            + " and the usage example is ordinary (not focused)"
            + " and its next check time is in the future", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [focusedTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a word article as usage example"
            + " when the article is focused"
            + " and its next check time is overdue"
            + " and it has a usage example"
            + " and the usage example is focused"
            + " and its next check time is in the future", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [focusedTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, focusedTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

    });

    describe("", () => {

        it("should not select a word article"
            + " when the article is ordinary (not focused)"
            + " and its next check time is in the future"
            + " and it has a usage example"
            + " and the usage example is ordinary (not focused)"
            + " and its next check time is missed (new)", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, ordinaryTag.userTag.title],
                    scheduledForward: {}
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(0);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeFalsy();
            })

        it("should select a word article as usage example"
            + " when the article is ordinary (not focused)"
            + " and its next check time is in the future"
            + " and it has a usage example"
            + " and the usage example is focused"
            + " and its next check time is missed (new)", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, focusedTag.userTag.title],
                    scheduledForward: {}
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should not select a word article"
            + " when the article is ordinary (not focused)"
            + " and its next check time is in the future"
            + " and it has a usage example"
            + " and the usage example is ordinary (not focused)"
            + " and its next check time is overdue", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(0);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeFalsy();
            })

        it("should select a word article as usage example"
            + " when the article is ordinary (not focused)"
            + " and its next check time is in the future"
            + " and it has a usage example"
            + " and the usage example is focused"
            + " and its next check time is overdue", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, focusedTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should not select a word article"
            + " when the article is ordinary (not focused)"
            + " and its next check time is in the future"
            + " and it has a usage example"
            + " and the usage example is ordinary (not focused)"
            + " and its next check time is in the future", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(0);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeFalsy();
            })

        it("should not select a word article"
            + " when the article is ordinary (not focused)"
            + " and its next check time is in the future"
            + " and it has a usage example"
            + " and the usage example is focused"
            + " and its next check time is in the future", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, focusedTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(0);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeFalsy();
            })

    });

    describe("", () => {

        it("should select a word article as usage example"
            + " when the article is focused"
            + " and its next check time is in the future"
            + " and it has a usage example"
            + " and the usage example is ordinary (not focused)"
            + " and its next check time is missed (new)", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [focusedTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, ordinaryTag.userTag.title],
                    scheduledForward: {}
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a word article as usage example"
            + " when the article is focused"
            + " and its next check time is in the future"
            + " and it has a usage example"
            + " and the usage example is focused"
            + " and its next check time is missed (new)", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [focusedTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, focusedTag.userTag.title],
                    scheduledForward: {}
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a word article as usage example"
            + " when the article is focused"
            + " and its next check time is in the future"
            + " and it has a usage example"
            + " and the usage example is ordinary (not focused)"
            + " and its next check time is overdue", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [focusedTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a word article as usage example"
            + " when the article is focused"
            + " and its next check time is in the future"
            + " and it has a usage example"
            + " and the usage example is focused"
            + " and its next check time is overdue", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [focusedTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, focusedTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should not select a word article"
            + " when the article is focused"
            + " and its next check time is in the future"
            + " and it has a usage example"
            + " and the usage example is ordinary (not focused)"
            + " and its next check time is in the future", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [focusedTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(0);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeFalsy();
            })

        it("should not select a word article"
            + " when the article is focused"
            + " and its next check time is in the future"
            + " and it has a usage example"
            + " and the usage example is focused"
            + " and its next check time is in the future", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const wordArticle = options.push.wordArticle("wordArticle", {
                    tags: [focusedTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [wordArticle.wordArticle.title, focusedTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(0);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(wordArticle.wordArticle.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeFalsy();
            })

    });


    describe("", () => {

        it("should not select a grammar rule"
            + " when its next check time is missed (new)"
            + " and it has not any usage example", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const grammarRule = options.push.rule("grammarRule", {
                    scheduledForward: {}
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(0);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(grammarRule.rule.title)).toBeFalsy();
            })

        it("should not select a grammar rule"
            + " when its next check time is overdue"
            + " and it has not any usage example", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const grammarRule = options.push.rule("grammarRule", {
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(0);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(grammarRule.rule.title)).toBeFalsy();
            })

        it("should not select a grammar rule"
            + " when its next check time is in the future"
            + " and it has not any usage example", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const grammarRule = options.push.rule("grammarRule", {
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(0);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(grammarRule.rule.title)).toBeFalsy();
            })

    });

    describe("", () => {

        it("should select a grammar rule as usage example"
            + " when the rule's next check time is missed (new)"
            + " and it has a usage example"
            + " and the usage example is ordinary (not focused)"
            + " and its next check time is missed (new)", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const grammarRule = options.push.rule("grammarRule", {
                    scheduledForward: {}
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [grammarRule.rule.title, ordinaryTag.userTag.title],
                    scheduledForward: {}
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(grammarRule.rule.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a grammar rule as usage example"
            + " when the rule's next check time is missed (new)"
            + " and it has a usage example"
            + " and the usage example is focused"
            + " and its next check time is missed (new)", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const grammarRule = options.push.rule("grammarRule", {
                    scheduledForward: {}
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [grammarRule.rule.title, focusedTag.userTag.title],
                    scheduledForward: {}
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(grammarRule.rule.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a grammar rule as usage example"
            + " when the rule's next check time is missed (new)"
            + " and it has a usage example"
            + " and the usage example is ordinary (not focused)"
            + " and its next check time is overdue", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const grammarRule = options.push.rule("grammarRule", {
                    scheduledForward: {}
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [grammarRule.rule.title, ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(grammarRule.rule.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a grammar rule as usage example"
            + " when the rule's next check time is missed (new)"
            + " and it has a usage example"
            + " and the usage example is focused"
            + " and its next check time is overdue", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const grammarRule = options.push.rule("grammarRule", {
                    scheduledForward: {}
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [grammarRule.rule.title, focusedTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(grammarRule.rule.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a grammar rule as usage example"
            + " when the rule's next check time is missed (new)"
            + " and it has a usage example"
            + " and the usage example is ordinary (not focused)"
            + " and its next check time is in the future", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const grammarRule = options.push.rule("grammarRule", {
                    scheduledForward: {}
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [grammarRule.rule.title, ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(grammarRule.rule.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a grammar rule as usage example"
            + " when the rule's next check time is missed (new)"
            + " and it has a usage example"
            + " and the usage example is focused"
            + " and its next check time is in the future", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const grammarRule = options.push.rule("grammarRule", {
                    scheduledForward: {}
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [grammarRule.rule.title, focusedTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(grammarRule.rule.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

    });

    describe("", () => {

        it("should select a grammar rule as usage example"
            + " when the rule's next check time is overdue"
            + " and it has a usage example"
            + " and the usage example is ordinary (not focused)"
            + " and its next check time is missed (new)", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const grammarRule = options.push.rule("grammarRule", {
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [grammarRule.rule.title, ordinaryTag.userTag.title],
                    scheduledForward: {}
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(grammarRule.rule.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a grammar rule as usage example"
            + " when the rule's next check time is overdue"
            + " and it has a usage example"
            + " and the usage example is focused"
            + " and its next check time is missed (new)", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const grammarRule = options.push.rule("grammarRule", {
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [grammarRule.rule.title, focusedTag.userTag.title],
                    scheduledForward: {}
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(grammarRule.rule.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a grammar rule as usage example"
            + " when the rule's next check time is overdue"
            + " and it has a usage example"
            + " and the usage example is ordinary (not focused)"
            + " and its next check time is overdue", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const grammarRule = options.push.rule("grammarRule", {
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [grammarRule.rule.title, ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(grammarRule.rule.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a grammar rule as usage example"
            + " when the rule's next check time is overdue"
            + " and it has a usage example"
            + " and the usage example is focused"
            + " and its next check time is overdue", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const grammarRule = options.push.rule("grammarRule", {
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [grammarRule.rule.title, focusedTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(grammarRule.rule.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a grammar rule as usage example"
            + " when the rule's next check time is overdue"
            + " and it has a usage example"
            + " and the usage example is ordinary (not focused)"
            + " and its next check time is in the future", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const grammarRule = options.push.rule("grammarRule", {
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [grammarRule.rule.title, ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(grammarRule.rule.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a grammar rule as usage example"
            + " when the rule's next check time is overdue"
            + " and it has a usage example"
            + " and the usage example is focused"
            + " and its next check time is in the future", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const grammarRule = options.push.rule("grammarRule", {
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [grammarRule.rule.title, focusedTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(grammarRule.rule.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

    });

    describe("", () => {

        it("should select a grammar rule as usage example"
            + " when the rule's next check time is in the future"
            + " and it has a usage example"
            + " and the usage example is ordinary (not focused)"
            + " and its next check time is missed (new)", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const grammarRule = options.push.rule("grammarRule", {
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [grammarRule.rule.title, ordinaryTag.userTag.title],
                    scheduledForward: {}
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(grammarRule.rule.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a grammar rule as usage example"
            + " when the rule's next check time is in the future"
            + " and it has a usage example"
            + " and the usage example is focused"
            + " and its next check time is missed (new)", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const grammarRule = options.push.rule("grammarRule", {
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [grammarRule.rule.title, focusedTag.userTag.title],
                    scheduledForward: {}
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(grammarRule.rule.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a grammar rule as usage example"
            + " when the rule's next check time is in the future"
            + " and it has a usage example"
            + " and the usage example is ordinary (not focused)"
            + " and its next check time is overdue", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const grammarRule = options.push.rule("grammarRule", {
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [grammarRule.rule.title, ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(grammarRule.rule.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should select a grammar rule as usage example"
            + " when the rule's next check time is in the future"
            + " and it has a usage example"
            + " and the usage example is focused"
            + " and its next check time is overdue", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const grammarRule = options.push.rule("grammarRule", {
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [grammarRule.rule.title, focusedTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(1);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(grammarRule.rule.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeTruthy();
            })

        it("should not select a grammar rule"
            + " when the rule's next check time is in the future"
            + " and it has a usage example"
            + " and the usage example is ordinary (not focused)"
            + " and its next check time is in the future", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const grammarRule = options.push.rule("grammarRule", {
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [grammarRule.rule.title, ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(0);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(grammarRule.rule.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeFalsy();
            })

        it("should not select a grammar rule"
            + " when the rule's next check time is in the future"
            + " and it has a usage example"
            + " and the usage example is focused"
            + " and its next check time is in the future", () => {
                // consoleDebugSpy.and.callThrough();
                // consoleSpy.and.callThrough();
                const options = utils.setupWiki();
                const proxyWiki = utils.getSrsProxyWiki(options.wiki);
                const direction = "forward";
                const limit = 100;
                const time = new Date().getTime();
                const overdueTime = new Date().getTime() - offset_24h;
                const inFutureTime = new Date().getTime() + offset_24h;
                const ordinaryTag = options.push.userTag("ordinary_tag");
                const focusedTag = options.push.userTag("focused_tag", { focus: true });
                const grammarRule = options.push.rule("grammarRule", {
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const usageExample = options.push.usageExample("usageExample", {
                    tags: [grammarRule.rule.title, focusedTag.userTag.title],
                    scheduledForward: {
                        due: inFutureTime
                    }
                });
                const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
                console.debug("data", data)
                expect(Array.isArray(data)).toBeTruthy();
                expect(data.length).toEqual(0);
                const srcs = data.map(el => el.src);
                expect(srcs.includes(grammarRule.rule.title)).toBeFalsy();
                expect(srcs.includes(usageExample.usageExample.title)).toBeFalsy();
            })

    });

    it("should select usage examples for scheduled word articles", () => {
        // consoleDebugSpy.and.callThrough();
        // consoleSpy.and.callThrough();
        const options = utils.setupWiki();
        const proxyWiki = utils.getSrsProxyWiki(options.wiki);
        const direction = "forward";
        const limit = 100;
        const time = new Date().getTime();
        const overdueTime = new Date().getTime() - offset_24h;
        const inFutureTime = new Date().getTime() + offset_24h;
        const wa1 = options.push.wordArticle("wa1", {// should be taken as an article
            scheduledForward: {
                due: overdueTime
            }
        });
        const wa2 = options.push.wordArticle("wa2", {// should be taken as an example ue2
            scheduledForward: {}
        });
        const wa3 = options.push.wordArticle("wa3", {// should not be taken because it isn't overdue
            scheduledForward: {
                due: inFutureTime
            }
        });
        const wa4 = options.push.wordArticle("wa4", {// should be taken as an example ue4
            scheduledForward: {
                due: overdueTime
            }
        });
        const rule1 = options.push.rule("rule1", {// should not be taken because it does not have any usage example
            scheduledForward: {}
        });
        const rule2 = options.push.rule("rule2", {// should be taken as an example ue2
            scheduledForward: {}
        });
        const rule5 = options.push.rule("rule5", {// should be taken as an example because the usage example is new
            scheduledForward: {
                due: inFutureTime
            }
        });
        const ue2 = options.push.usageExample("ue2", {// should be taken for wa2 and rule2
            tags: [wa2.wordArticle.title, rule2.rule.title],
            scheduledForward: {}
        });
        const ue3 = options.push.usageExample("ue3", {// should not be taken because the linked article isn't overdue
            tags: [wa3.wordArticle.title],
            scheduledForward: {}
        });
        const ue4 = options.push.usageExample("ue4", {// should be taken because the linked article is overdue
            tags: [wa4.wordArticle.title],
            scheduledForward: {
                due: inFutureTime
            }
        });
        const ue5 = options.push.usageExample("ue5", {// should be taken because it's new
            tags: [rule5.rule.title],
            scheduledForward: {}
        });
        const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
        console.debug("data", data)
        expect(Array.isArray(data)).toBeTruthy();
        expect(data.length).toEqual(4);
        const srcs = data.map(el => el.src);
        expect(srcs.includes(wa1.wordArticle.title)).toBeTruthy();
        expect(srcs.includes(wa2.wordArticle.title)).toBeFalsy();
        expect(srcs.includes(wa3.wordArticle.title)).toBeFalsy();
        expect(srcs.includes(wa4.wordArticle.title)).toBeFalsy();
        expect(srcs.includes(rule1.rule.title)).toBeFalsy();
        expect(srcs.includes(rule2.rule.title)).toBeFalsy();
        expect(srcs.includes(rule5.rule.title)).toBeFalsy();
        expect(srcs.includes(ue2.usageExample.title)).toBeTruthy();
        expect(srcs.includes(ue3.usageExample.title)).toBeFalsy();
        expect(srcs.includes(ue4.usageExample.title)).toBeTruthy();
        expect(srcs.includes(ue5.usageExample.title)).toBeTruthy();
    })

    it("should select new word articles prior to overdue ones", () => {
        // consoleDebugSpy.and.callThrough();
        // consoleSpy.and.callThrough();
        const options = utils.setupWiki();
        const proxyWiki = utils.getSrsProxyWiki(options.wiki);
        const direction = "forward";
        const limit = 4;
        const time = new Date().getTime();
        const overdueTime = new Date().getTime() - offset_24h;
        const wag1 = options.push.wordArticleGroup("wag1", {
            wag: [
                {
                    title: "wag1_wa0", // should not be taken because it's not new and it has been checked later than others
                    scheduledForward: {
                        due: overdueTime + 1
                    }
                },
                {
                    title: "wag1_wa1", // should be taken as an article
                    scheduledForward: {
                        due: overdueTime
                    }
                }
            ]
        });
        const wag2 = options.push.wordArticle("wag2", {// should be taken as an example ue2
            scheduledForward: {
                due: overdueTime
            }
        });
        const wag3 = options.push.wordArticle("wag3", {// should not be taken because it's not new and it has been checked later than others
            scheduledForward: {
                due: overdueTime + 1
            }
        });
        const wag4 = options.push.wordArticle("wag4", {// should be taken as an example ue4 because it's new
            scheduledForward: {
            }
        });
        const wag5 = options.push.wordArticle("wag5", {// should be taken as an article because it's new
            scheduledForward: {
            }
        });
        const ue2 = options.push.usageExample("ue2", {// should be taken for wag2
            tags: [wag2.wordArticle.title],
            scheduledForward: {}
        });
        const ue4 = options.push.usageExample("ue4", {// should be taken for wag4
            tags: [wag4.wordArticle.title],
            scheduledForward: {
            }
        });
        const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
        console.debug("data", data)
        expect(Array.isArray(data)).toBeTruthy();
        expect(data.length).toEqual(4);
        const srcs = data.map(el => el.src);
        expect(srcs.includes(wag1.wag["wag1_wa1"].title)).toBeTruthy();
        expect(srcs.includes(wag2.wordArticle.title)).toBeFalsy();
        expect(srcs.includes(wag3.wordArticle.title)).toBeFalsy();
        expect(srcs.includes(wag4.wordArticle.title)).toBeFalsy();
        expect(srcs.includes(wag5.wordArticle.title)).toBeTruthy();
        expect(srcs.includes(ue2.usageExample.title)).toBeTruthy();
        expect(srcs.includes(ue4.usageExample.title)).toBeTruthy();
    })

    it("should select focused word articles prior to ordinary ones", () => {
        // consoleDebugSpy.and.callThrough();
        // consoleSpy.and.callThrough();
        const options = utils.setupWiki();
        const proxyWiki = utils.getSrsProxyWiki(options.wiki);
        const direction = "forward";
        const limit = 100;
        const time = new Date().getTime();
        const overdueTime = new Date().getTime() - offset_24h;
        const inFutureTime = new Date().getTime() + offset_24h;
        const ordinaryTag = options.push.userTag("ordinary_tag");
        const focusedTag = options.push.userTag("focused_tag", { focus: true });
        const withoutExamples = options.push.wordArticleGroup("without_examples", {
            wag: [
                {// should not be taken despite it has more overdue tme
                    title: "ordinary",
                    tags: [ordinaryTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime - offset_24h
                    }
                },
                {// should be taken as an article because it has the focused tag
                    title: "focused",
                    tags: [focusedTag.userTag.title],
                    scheduledForward: {
                        due: overdueTime
                    }
                }
            ]
        });
        const ordinaryNewWithExample = options.push.wordArticle("ordinary_new_with_example", {// should be taken as an example
            scheduledForward: {}
        });
        const focusedInFutureArticle = options.push.wordArticle("focused_in_future", {// should be taken as a focused new usage example
            tags: [focusedTag.userTag.title],
            scheduledForward: {
                due: inFutureTime
            }
        });
        const focusedOverdueArticle = options.push.wordArticle("focused_overdue", {// should be taken as an example
            tags: [focusedTag.userTag.title],
            scheduledForward: {
                due: overdueTime
            }
        });
        const ordinaryWithFocusedExample = options.push.wordArticle("ordinary_with_focused_example", {// should be taken as an example
            scheduledForward: {
                due: overdueTime
            }
        });
        const focusedWithOrdinaryExample = options.push.wordArticle("focused_with_ordinary_example", {// should be taken as an example
            tags: [focusedTag.userTag.title],
            scheduledForward: {
                due: overdueTime
            }
        });
        const rule1 = options.push.rule("rule1", {// should not be taken because it does not have any usage example
            scheduledForward: {}
        });
        const rule2 = options.push.rule("rule2", {// should be taken as an example ue2
            scheduledForward: {}
        });
        const rule5 = options.push.rule("rule5", {// should be taken as a usage example because the example is new
            scheduledForward: {
                due: inFutureTime
            }
        });
        const rule6 = options.push.rule("rule6", {// should be taken as an focused example
            scheduledForward: {}
        });
        const ordinaryNewUsageExample = options.push.usageExample("ordinary_new_usage_example", {// should be taken for ordinaryNewWithExample and rule2
            tags: [ordinaryNewWithExample.wordArticle.title, rule2.rule.title],
            scheduledForward: {}
        });
        const focusedNewUsageExampleForFocusedInFutureArticle = options.push.usageExample("focused_new_usage_example_for_focused_in_future_article", {// should be taken despite the linked article isn't overdue because this example is focused and new (overdue)
            tags: [focusedInFutureArticle.wordArticle.title, focusedTag.userTag.title],
            scheduledForward: {}
        });
        const focusedOverdueUsageExampleForFocusedArticle = options.push.usageExample("focused_overdue_usage_example_for_focused_article", {
            tags: [focusedOverdueArticle.wordArticle.title, focusedTag.userTag.title],
            scheduledForward: {
                due: overdueTime
            }
        });
        const focusedNewUsageExampleForFocusedOverdueArticle = options.push.usageExample("focused_new_usage_example_for_focused_overdue_article", {
            tags: [focusedOverdueArticle.wordArticle.title, focusedTag.userTag.title],
            scheduledForward: {}
        });
        const ordinaryOverdueUsageExampleForFocusedArticle = options.push.usageExample("ordinary_overdue_usage_example_for_focused_article", {
            tags: [focusedOverdueArticle.wordArticle.title],
            scheduledForward: {
                due: overdueTime
            }
        });
        const focusedUsageExampleForOrdinaryArticle = options.push.usageExample("focused_usage_example_for_ordinary_article", {// should be taken because the linked article is overdue
            tags: [ordinaryWithFocusedExample.wordArticle.title, focusedTag.userTag.title],
            scheduledForward: {
                due: inFutureTime
            }
        });
        const ordinaryUsageExampleForOrdinaryArticle = options.push.usageExample("ordinary_usage_example_for_ordinary_article", {// should be taken because the linked article is overdue
            tags: [ordinaryWithFocusedExample.wordArticle.title],
            scheduledForward: {
                due: overdueTime
            }
        });
        const ordinaryUsageExampleForFocusedArticle = options.push.usageExample("ordinary_usage_example_for_focused_article", {// should be taken because the linked article is focused and overdue
            tags: [focusedWithOrdinaryExample.wordArticle.title],
            scheduledForward: {
                due: overdueTime
            }
        });
        const ue5 = options.push.usageExample("ue5", {// should be taken because it's new
            tags: [rule5.rule.title],
            scheduledForward: {}
        });
        const rule6OrdinaryExample = options.push.usageExample("rule6_ordinary_example", {// should not be taken because a focused example exists
            tags: [rule6.rule.title],
            scheduledForward: {
                due: overdueTime
            }
        });
        const rule6FocusedExample = options.push.usageExample("rule6_focused_example", {// should be taken
            tags: [rule6.rule.title, focusedTag.userTag.title],
            scheduledForward: {}
        });
        const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
        console.debug("data", data)
        expect(Array.isArray(data)).toBeTruthy();
        expect(data.length).toEqual(8);
        const srcs = data.map(el => el.src);
        expect(srcs.includes(withoutExamples.wag["ordinary"].title)).toBeFalsy();
        expect(srcs.includes(withoutExamples.wag["focused"].title)).toBeTruthy();
        expect(srcs.includes(ordinaryNewWithExample.wordArticle.title)).toBeFalsy();
        expect(srcs.includes(focusedInFutureArticle.wordArticle.title)).toBeFalsy();
        expect(srcs.includes(ordinaryWithFocusedExample.wordArticle.title)).toBeFalsy();
        expect(srcs.includes(rule1.rule.title)).toBeFalsy();
        expect(srcs.includes(rule2.rule.title)).toBeFalsy();
        expect(srcs.includes(rule5.rule.title)).toBeFalsy();
        expect(srcs.includes(ordinaryNewUsageExample.usageExample.title)).toBeTruthy();
        expect(srcs.indexOf(withoutExamples.wag["focused"].title) < srcs.indexOf(ordinaryNewUsageExample.usageExample.title)).toBeTruthy(); //focused prior to ordinary
        expect(srcs.includes(focusedNewUsageExampleForFocusedInFutureArticle.usageExample.title)).toBeTruthy();
        expect(srcs.indexOf(focusedNewUsageExampleForFocusedInFutureArticle.usageExample.title) < srcs.indexOf(ordinaryNewUsageExample.usageExample.title)).toBeTruthy(); //focused prior to ordinary
        expect(srcs.includes(focusedNewUsageExampleForFocusedOverdueArticle.usageExample.title)).toBeTruthy();
        expect(srcs.includes(focusedOverdueUsageExampleForFocusedArticle.usageExample.title)).toBeFalsy();
        expect(srcs.includes(ordinaryOverdueUsageExampleForFocusedArticle.usageExample.title)).toBeFalsy();
        expect(srcs.includes(focusedUsageExampleForOrdinaryArticle.usageExample.title)).toBeTruthy();
        expect(srcs.includes(ordinaryUsageExampleForOrdinaryArticle.usageExample.title)).toBeFalsy();
        expect(srcs.indexOf(focusedUsageExampleForOrdinaryArticle.usageExample.title) < srcs.indexOf(ordinaryNewUsageExample.usageExample.title)).toBeTruthy(); //focused prior to ordinary
        expect(srcs.includes(ordinaryUsageExampleForFocusedArticle.usageExample.title)).toBeTruthy();
        expect(srcs.indexOf(ordinaryUsageExampleForFocusedArticle.usageExample.title) < srcs.indexOf(ordinaryNewUsageExample.usageExample.title)).toBeTruthy(); //focused prior to ordinary
        expect(srcs.includes(ue5.usageExample.title)).toBeTruthy();
        expect(srcs.includes(rule6OrdinaryExample.usageExample.title)).toBeFalsy();
        expect(srcs.includes(rule6FocusedExample.usageExample.title)).toBeTruthy();
        expect(srcs.indexOf(srcs.indexOf(ordinaryNewUsageExample.usageExample.title) < rule6FocusedExample.usageExample.title)).toBeTruthy(); //word article question prior to grammar rule question
    })

});
