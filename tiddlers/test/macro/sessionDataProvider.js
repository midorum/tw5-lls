
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

    it("should select usage examples for scheduled word articles", () => {
        const options = utils.setupWiki();
        const proxyWiki = utils.getSrsProxyWiki(options.wiki);
        const direction = "forward";
        const limit = 100;
        const time = new Date().getTime();
        const overdueTime = new Date().getTime() - offset_24h;
        const inFutureTime = new Date().getTime() + offset_24h;
        // consoleDebugSpy.and.callThrough();
        // consoleSpy.and.callThrough();
        const wag1 = options.push.wordArticleGroup("wag1", {// should be taken as an article
            scheduledForward: {
                due: overdueTime
            }
        });
        const wag2 = options.push.wordArticleGroup("wag2", {// should be taken as an example ue2
            scheduledForward: {}
        });
        const wag3 = options.push.wordArticleGroup("wag3", {// should not be taken because it isn't overdue
            scheduledForward: {
                due: inFutureTime
            }
        });
        const wag4 = options.push.wordArticleGroup("wag4", {// should be taken as an example ue4
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
        const ue2 = options.push.usageExample("ue2", {// should be taken for wag2 and rule2
            tags: [wag2.wordArticle.title, rule2.rule.title],
            scheduledForward: {}
        });
        const ue3 = options.push.usageExample("ue3", {// should not be taken because the linked article isn't overdue
            tags: [wag3.wordArticle.title],
            scheduledForward: {}
        });
        const ue4 = options.push.usageExample("ue4", {// should be taken because the linked article is overdue
            tags: [wag4.wordArticle.title],
            scheduledForward: {
                due: inFutureTime
            }
        });
        const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
        console.debug("data", data)
        expect(Array.isArray(data)).toBeTruthy();
        expect(data.length).toEqual(3);
        const srcs = data.map(el => el.src);
        expect(srcs.includes(wag1.wordArticle.title)).toBeTruthy();
        expect(srcs.includes(wag2.wordArticle.title)).toBeFalsy();
        expect(srcs.includes(wag3.wordArticle.title)).toBeFalsy();
        expect(srcs.includes(wag4.wordArticle.title)).toBeFalsy();
        expect(srcs.includes(rule1.rule.title)).toBeFalsy();
        expect(srcs.includes(rule2.rule.title)).toBeFalsy();
        expect(srcs.includes(ue2.usageExample.title)).toBeTruthy();
        expect(srcs.includes(ue3.usageExample.title)).toBeFalsy();
        expect(srcs.includes(ue4.usageExample.title)).toBeTruthy();
    })

});
