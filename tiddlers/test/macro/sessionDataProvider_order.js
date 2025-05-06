
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

    it("should select word articles and usage examples in the following order (with the specified priority)", () => {
        consoleDebugSpy.and.callThrough();
        // consoleSpy.and.callThrough();
        const options = utils.setupWiki();
        const proxyWiki = utils.getSrsProxyWiki(options.wiki);
        const direction = "forward";
        const limit = 100;
        const time = new Date().getTime();
        const overdueTime = new Date().getTime() - offset_24h;
        const inFutureTime = new Date().getTime() + offset_24h;

        const items = createItems({
            focusedNewQuestions: [
                { wa: { focused: true } },
                { wa: { focused: false }, ue: { focused: true } },
                { wa: { focused: false }, ue: { focused: true, due: overdueTime } },
                { wa: { focused: false }, ue: { focused: true, due: inFutureTime } },
                { wa: { focused: true }, ue: { focused: false } },
                { wa: { focused: true }, ue: { focused: true } },
                { wa: { focused: true }, ue: { focused: false, due: overdueTime } },
                { wa: { focused: true }, ue: { focused: true, due: overdueTime } },
                { wa: { focused: true }, ue: { focused: false, due: inFutureTime } },
                { wa: { focused: true }, ue: { focused: true, due: inFutureTime } },
                { gr: {}, ue: { focused: true } },
                { gr: {}, ue: { focused: true, due: overdueTime } },
                { gr: {}, ue: { focused: true, due: inFutureTime } },
            ],
            focusedOverdueQuestions: [
                { wa: { focused: true, due: overdueTime } },
                { wa: { focused: false, due: overdueTime }, ue: { focused: true } },
                { wa: { focused: false, due: overdueTime }, ue: { focused: true, due: overdueTime } },
                { wa: { focused: false, due: overdueTime }, ue: { focused: true, due: inFutureTime } },
                { wa: { focused: true, due: overdueTime }, ue: { focused: false } },
                { wa: { focused: true, due: overdueTime }, ue: { focused: true } },
                { wa: { focused: true, due: overdueTime }, ue: { focused: false, due: overdueTime } },
                { wa: { focused: true, due: overdueTime }, ue: { focused: true, due: overdueTime } },
                { wa: { focused: true, due: overdueTime }, ue: { focused: false, due: inFutureTime } },
                { wa: { focused: true, due: overdueTime }, ue: { focused: true, due: inFutureTime } },
                { gr: { due: overdueTime }, ue: { focused: true } },
                { gr: { due: overdueTime }, ue: { focused: true, due: overdueTime } },
                { gr: { due: overdueTime }, ue: { focused: true, due: inFutureTime } },
            ],
            focusedInFutureQuestions: [
                { wa: { focused: false, due: inFutureTime }, ue: { focused: true } },
                { wa: { focused: false, due: inFutureTime }, ue: { focused: true, due: overdueTime } },
                { wa: { focused: true, due: inFutureTime }, ue: { focused: false } },
                { wa: { focused: true, due: inFutureTime }, ue: { focused: true } },
                { wa: { focused: true, due: inFutureTime }, ue: { focused: false, due: overdueTime } },
                { wa: { focused: true, due: inFutureTime }, ue: { focused: true, due: overdueTime } },
                { gr: { due: inFutureTime }, ue: { focused: true } },
                { gr: { due: inFutureTime }, ue: { focused: true, due: overdueTime } },
            ],
            ordinaryNewQuestions: [
                { wa: { focused: false } },
                { wa: { focused: false }, ue: { focused: false } },
                { wa: { focused: false }, ue: { focused: false, due: overdueTime } },
                { wa: { focused: false }, ue: { focused: false, due: inFutureTime } },
                { gr: {}, ue: { focused: false } },
                { gr: {}, ue: { focused: false, due: overdueTime } },
                { gr: {}, ue: { focused: false, due: inFutureTime } },
            ],
            ordinaryOverdueQuestions: [
                { wa: { focused: false, due: overdueTime } },
                { wa: { focused: false, due: overdueTime }, ue: { focused: false } },
                { wa: { focused: false, due: overdueTime }, ue: { focused: false, due: overdueTime } },
                { wa: { focused: false, due: overdueTime }, ue: { focused: false, due: inFutureTime } },
                { gr: { due: overdueTime }, ue: { focused: false } },
                { gr: { due: overdueTime }, ue: { focused: false, due: overdueTime } },
                { gr: { due: overdueTime }, ue: { focused: false, due: inFutureTime } },
            ],
            ordinaryInFutureQuestions: [
                { gr: { due: inFutureTime }, ue: { focused: false } },
                { gr: { due: inFutureTime }, ue: { focused: false, due: overdueTime } },
            ],
            doNotSelectTheseQuestions: [
                { wa: { focused: false, due: inFutureTime } },
                { wa: { focused: true, due: inFutureTime } },
                { wa: { focused: false, due: inFutureTime }, ue: { focused: false } },
                { wa: { focused: false, due: inFutureTime }, ue: { focused: false, due: overdueTime } },
                { wa: { focused: false, due: inFutureTime }, ue: { focused: false, due: inFutureTime } },
                { wa: { focused: false, due: inFutureTime }, ue: { focused: true, due: inFutureTime } },
                { wa: { focused: true, due: inFutureTime }, ue: { focused: false, due: inFutureTime } },
                { wa: { focused: true, due: inFutureTime }, ue: { focused: true, due: inFutureTime } },
                { gr: {} },
                { gr: { due: overdueTime } },
                { gr: { due: inFutureTime } },
                { gr: { due: inFutureTime }, ue: { focused: false, due: inFutureTime } },
                { gr: { due: inFutureTime }, ue: { focused: true, due: inFutureTime } },
            ]
        }, overdueTime, inFutureTime, options);
        // console.debug("items", items)
        // options.wiki.filterTiddlers("[prefix[$:/lls/db/wa]]").forEach(el => console.debug(options.wiki.getTiddler(el)))
        // options.wiki.filterTiddlers("[prefix[$:/lls/db/ue]]").forEach(el => console.debug(options.wiki.getTiddler(el)))

        const focusedNewQuestionsCount = items.focusedNewQuestions.length;
        const focusedOverdueQuestionsCount = items.focusedOverdueQuestions.length;
        const focusedInFutureQuestionsCount = items.focusedInFutureQuestions.length;
        const ordinaryNewQuestionsCount = items.ordinaryNewQuestions.length;
        const ordinaryOverdueQuestionsCount = items.ordinaryOverdueQuestions.length;
        const ordinaryInFutureQuestionsCount = items.ordinaryInFutureQuestions.length;
        // https://midorum-notes.tiddlyhost.com/#LLS%3A%20%D0%A3%D1%87%D0%B8%D1%82%D1%8B%D0%B2%D0%B0%D1%82%D1%8C%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D0%B8%20%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D0%BE%D0%B2%20%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D1%8F%20%D0%BF%D1%80%D0%B8%20%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8%20%D1%83%D1%87%D0%B5%D0%B1%D0%BD%D0%BE%D0%B9%20%D1%81%D0%B5%D1%81%D1%81%D0%B8%D0%B8
        // word articles: without usage examples / with usage examples (2)
        // word articles: new / overdue / in the future (3)
        // word articles: ordinary / focused (2)
        // usage examples: new / overdue / in the future (3)
        // usage examples: ordinary / focused (2)
        // grammar rules: without usage examples / with usage examples (2)
        // grammar rules: new / overdue / in the future (3)
        // word articles without usage examples: 3*2 = 6 variants
        // word articles with usage examples: 3*2*3*2 = 36 variants
        // grammar rules without usage examples: 3 variants
        // grammar rules with usage examples: 3*6 = 18 variants
        // total: 6+36+3+18 = 63 variants
        expect(focusedNewQuestionsCount
            + focusedOverdueQuestionsCount
            + focusedInFutureQuestionsCount
            + ordinaryNewQuestionsCount
            + ordinaryOverdueQuestionsCount
            + ordinaryInFutureQuestionsCount
            + items.questionsThatShouldNotBeSelected.length).toEqual(63);
        const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
        console.debug("data", data)
        expect(Array.isArray(data)).toBeTruthy();
        expect(data.length).toEqual(focusedNewQuestionsCount
            + focusedOverdueQuestionsCount
            + focusedInFutureQuestionsCount
            + ordinaryNewQuestionsCount
            + ordinaryOverdueQuestionsCount
            + ordinaryInFutureQuestionsCount);
        const srcs = data.map(el => el.src);
        var bound = focusedNewQuestionsCount;
        items.focusedNewQuestions.forEach(el => {
            console.debug(el, srcs.indexOf(el), "/", bound - 1);
            expect(srcs.includes(el)).toBeTruthy();
            expect(srcs.indexOf(el)).toBeLessThan(bound);
        })
        bound += focusedOverdueQuestionsCount;
        items.focusedOverdueQuestions.forEach(el => {
            console.debug(el, srcs.indexOf(el), "/", bound - 1);
            expect(srcs.includes(el)).toBeTruthy();
            expect(srcs.indexOf(el)).toBeLessThan(bound);
        })
        bound += focusedInFutureQuestionsCount;
        items.focusedInFutureQuestions.forEach(el => {
            console.debug(el, srcs.indexOf(el), "/", bound - 1);
            expect(srcs.includes(el)).toBeTruthy();
            expect(srcs.indexOf(el)).toBeLessThan(bound);
        })
        bound += ordinaryNewQuestionsCount;
        items.ordinaryNewQuestions.forEach(el => {
            console.debug(el, srcs.indexOf(el), "/", bound - 1);
            expect(srcs.includes(el)).toBeTruthy();
            expect(srcs.indexOf(el)).toBeLessThan(bound);
        })
        bound += ordinaryOverdueQuestionsCount;
        items.ordinaryOverdueQuestions.forEach(el => {
            console.debug(el, srcs.indexOf(el), "/", bound - 1);
            expect(srcs.includes(el)).toBeTruthy();
            expect(srcs.indexOf(el)).toBeLessThan(bound);
        })
        bound += ordinaryInFutureQuestionsCount;
        items.ordinaryInFutureQuestions.forEach(el => {
            console.debug(el, srcs.indexOf(el), "/", bound - 1);
            expect(srcs.includes(el)).toBeTruthy();
            expect(srcs.indexOf(el)).toBeLessThan(bound);
        })
        console.debug("-- questions that should not be selected (index must be -1) --")
        items.questionsThatShouldNotBeSelected.forEach(el => {
            console.debug(el, srcs.indexOf(el));
            expect(srcs.includes(el)).toBeFalsy();
        })
    })

    function createItems(data, overdueTime, inFutureTime, options) {
        const stringifyDueTime = (time) => !time ? "n" : time === overdueTime ? "o" : time === inFutureTime ? "f" : time;
        const ordinaryTag = options.push.userTag("ordinary_tag");
        const focusedTag = options.push.userTag("focused_tag", { focus: true });
        const result = {};
        var index = 0;
        const putGroup = function (groupData) {
            const items = [];
            groupData.forEach(el => {
                if (el.wa) {
                    const waKey = index + "_a" + (el.wa.focused ? "f" : "o") + stringifyDueTime(el.wa.due);
                    const userTag = el.wa.focused ? focusedTag : ordinaryTag;
                    const wordArticle = options.push.wordArticle(waKey, {
                        tags: [userTag.userTag.title],
                        scheduledForward: {
                            due: el.wa.due
                        }
                    });
                    if (el.ue) {
                        const ueKey = waKey + "_e" + (el.ue.focused ? "f" : "o") + stringifyDueTime(el.ue.due);
                        const userTag = el.ue.focused ? focusedTag : ordinaryTag;
                        const usageExample = options.push.usageExample(ueKey, {
                            tags: [wordArticle.wordArticle.title, userTag.userTag.title],
                            scheduledForward: {
                                due: el.ue.due
                            }
                        });
                        items.push(usageExample.usageExample.title);
                    } else {
                        items.push(wordArticle.wordArticle.title);
                    }
                } else if (el.gr) {
                    const grKey = index + "_r" + stringifyDueTime(el.gr.due);
                    const grammarRule = options.push.rule(grKey, {
                        scheduledForward: {
                            due: el.gr.due
                        }
                    });
                    if (el.ue) {
                        const ueKey = grKey + "_e" + (el.ue.focused ? "f" : "o") + stringifyDueTime(el.ue.due);
                        const userTag = el.ue.focused ? focusedTag : ordinaryTag;
                        const usageExample = options.push.usageExample(ueKey, {
                            tags: [grammarRule.rule.title, userTag.userTag.title],
                            scheduledForward: {
                                due: el.ue.due
                            }
                        });
                        items.push(usageExample.usageExample.title);
                    } else {
                        items.push(grammarRule.rule.title);
                    }
                }
                index++;
            });
            return items;
        };
        result.focusedNewQuestions = putGroup(data.focusedNewQuestions);
        result.focusedOverdueQuestions = putGroup(data.focusedOverdueQuestions);
        result.focusedInFutureQuestions = putGroup(data.focusedInFutureQuestions);
        result.ordinaryNewQuestions = putGroup(data.ordinaryNewQuestions);
        result.ordinaryOverdueQuestions = putGroup(data.ordinaryOverdueQuestions);
        result.ordinaryInFutureQuestions = putGroup(data.ordinaryInFutureQuestions);
        result.questionsThatShouldNotBeSelected = putGroup(data.doNotSelectTheseQuestions);
        return result;
    }

});
