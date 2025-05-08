
const utils = require("test/utils").llsTestUtils;
const llsUtils = require("$:/plugins/midorum/lls/modules/utils.js").llsUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;
const offset_24h = 86400000;

describe("The lls-session-data-provider macro", () => {
    var consoleSpy;
    var consoleInfoSpy;
    var consoleDebugSpy;
    var loggerSpy;
    var sessionDataProvider;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        consoleInfoSpy = spyOn(console, 'info');
        consoleDebugSpy = spyOn(console, 'debug');
        loggerSpy = spyOn(Logger, 'alert');
        sessionDataProvider = $tw.macros["lls-session-data-provider"]
    });

    it("should select word articles and usage examples in the following order (with the specified priority)", () => {
        // consoleInfoSpy.and.callThrough();
        // consoleDebugSpy.and.callThrough();
        // consoleSpy.and.callThrough();
        const options = utils.setupWiki();
        const proxyWiki = utils.getSrsProxyWiki(options.wiki);
        const direction = "forward";
        const time = new Date().getTime();
        const overdueTime = new Date().getTime() - offset_24h;
        const inFutureTime = new Date().getTime() + offset_24h;

        const items = createItems({
            focusedNewQuestionsBasedOnArticles: [
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
            ],
            focusedOverdueQuestionsBasedOnArticles: [
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
            ],
            focusedInFutureQuestionsBasedOnArticles: [
                { wa: { focused: false, due: inFutureTime }, ue: { focused: true } },
                { wa: { focused: false, due: inFutureTime }, ue: { focused: true, due: overdueTime } },
                { wa: { focused: true, due: inFutureTime }, ue: { focused: false } },
                { wa: { focused: true, due: inFutureTime }, ue: { focused: true } },
                { wa: { focused: true, due: inFutureTime }, ue: { focused: false, due: overdueTime } },
                { wa: { focused: true, due: inFutureTime }, ue: { focused: true, due: overdueTime } },
            ],
            ordinaryNewQuestionsBasedOnArticles: [
                { wa: { focused: false } },
                { wa: { focused: false }, ue: { focused: false } },
                { wa: { focused: false }, ue: { focused: false, due: overdueTime } },
                { wa: { focused: false }, ue: { focused: false, due: inFutureTime } },
            ],
            ordinaryOverdueQuestionsBasedOnArticles: [
                { wa: { focused: false, due: overdueTime } },
                { wa: { focused: false, due: overdueTime }, ue: { focused: false } },
                { wa: { focused: false, due: overdueTime }, ue: { focused: false, due: overdueTime } },
                { wa: { focused: false, due: overdueTime }, ue: { focused: false, due: inFutureTime } },
            ],
            focusedNewQuestionsBasedOnRules: [
                { gr: {}, ue: { focused: true } },
                { gr: {}, ue: { focused: true, due: overdueTime } },
                { gr: {}, ue: { focused: true, due: inFutureTime } },
            ],
            focusedOverdueQuestionsBasedOnRules: [
                { gr: { due: overdueTime }, ue: { focused: true } },
                { gr: { due: overdueTime }, ue: { focused: true, due: overdueTime } },
                { gr: { due: overdueTime }, ue: { focused: true, due: inFutureTime } },
            ],
            focusedInFutureQuestionsBasedOnRules: [
                { gr: { due: inFutureTime }, ue: { focused: true } },
                { gr: { due: inFutureTime }, ue: { focused: true, due: overdueTime } },
            ],
            ordinaryNewQuestionsBasedOnRules: [
                { gr: {}, ue: { focused: false } },
                { gr: {}, ue: { focused: false, due: overdueTime } },
                { gr: {}, ue: { focused: false, due: inFutureTime } },
            ],
            ordinaryOverdueQuestionsBasedOnRules: [
                { gr: { due: overdueTime }, ue: { focused: false } },
                { gr: { due: overdueTime }, ue: { focused: false, due: overdueTime } },
                { gr: { due: overdueTime }, ue: { focused: false, due: inFutureTime } },
            ],
            ordinaryInFutureQuestionsBasedOnRules: [
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

        // verify source data
        // I follow second variant of sorting described on https://midorum-notes.tiddlyhost.com/#LLS%3A%20%D0%A3%D1%87%D0%B8%D1%82%D1%8B%D0%B2%D0%B0%D1%82%D1%8C%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D0%B8%20%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D0%BE%D0%B2%20%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D1%8F%20%D0%BF%D1%80%D0%B8%20%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8%20%D1%83%D1%87%D0%B5%D0%B1%D0%BD%D0%BE%D0%B9%20%D1%81%D0%B5%D1%81%D1%81%D0%B8%D0%B8
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
        const focusedNewQuestionsBasedOnArticlesCount = items.focusedNewQuestionsBasedOnArticles.length;
        const focusedOverdueQuestionsBasedOnArticlesCount = items.focusedOverdueQuestionsBasedOnArticles.length;
        const focusedInFutureQuestionsBasedOnArticlesCount = items.focusedInFutureQuestionsBasedOnArticles.length;
        const ordinaryNewQuestionsBasedOnArticlesCount = items.ordinaryNewQuestionsBasedOnArticles.length;
        const ordinaryOverdueQuestionsBasedOnArticlesCount = items.ordinaryOverdueQuestionsBasedOnArticles.length;
        const focusedNewQuestionsBasedOnRulesCount = items.focusedNewQuestionsBasedOnRules.length;
        const focusedOverdueQuestionsBasedOnRulesCount = items.focusedOverdueQuestionsBasedOnRules.length;
        const focusedInFutureQuestionsBasedOnRulesCount = items.focusedInFutureQuestionsBasedOnRules.length;
        const ordinaryNewQuestionsBasedOnRulesCount = items.ordinaryNewQuestionsBasedOnRules.length;
        const ordinaryOverdueQuestionsBasedOnRulesCount = items.ordinaryOverdueQuestionsBasedOnRules.length;
        const ordinaryInFutureQuestionsBasedOnRulesCount = items.ordinaryInFutureQuestionsBasedOnRules.length;
        const totalQuestionsThatCanBeAsked = focusedNewQuestionsBasedOnArticlesCount
            + focusedOverdueQuestionsBasedOnArticlesCount
            + focusedInFutureQuestionsBasedOnArticlesCount
            + ordinaryNewQuestionsBasedOnArticlesCount
            + ordinaryOverdueQuestionsBasedOnArticlesCount
            + focusedNewQuestionsBasedOnRulesCount
            + focusedOverdueQuestionsBasedOnRulesCount
            + focusedInFutureQuestionsBasedOnRulesCount
            + ordinaryNewQuestionsBasedOnRulesCount
            + ordinaryOverdueQuestionsBasedOnRulesCount
            + ordinaryInFutureQuestionsBasedOnRulesCount;
        const totalQuestions = totalQuestionsThatCanBeAsked + items.questionsThatShouldNotBeSelected.length;
        expect(totalQuestions).toEqual(63);

        // obtain data for learning session
        // const limit = 50;
        // testForLimit(limit);
        llsUtils.range(0, totalQuestions + 1, 1).forEach(i => testForLimit(i));

        function testForLimit(limit) {
            console.info("test the session data provided when the limit equal to", limit);
            const data = sessionDataProvider.run(proxyWiki, direction, limit, time);
            console.info("got data total", data.length);
            console.debug("data", data);
            expect(Array.isArray(data)).toBeTruthy();
            const expectedCount = Math.min(limit, totalQuestionsThatCanBeAsked);
            expect(data.length).toEqual(expectedCount);
            const srcs = data.map(el => el.src);
            const countProvidedQuestionsFromGroup = function (questions) {
                questions.forEach(question => {
                    console.debug(question, srcs.indexOf(question), "/", bound - 1);
                    const idx = srcs.indexOf(question);
                    if (idx > -1 && idx < bound) questionCounter++;
                });
            };
            var questionCounter = 0;
            console.debug("-- focused new questions based on articles --");
            var bound = Math.min(focusedNewQuestionsBasedOnArticlesCount, expectedCount);
            countProvidedQuestionsFromGroup(items.focusedNewQuestionsBasedOnArticles);
            expect(questionCounter).toEqual(bound);
            console.debug("-- focused overdue questions based on articles --");
            bound = Math.min(bound + focusedOverdueQuestionsBasedOnArticlesCount, expectedCount);
            countProvidedQuestionsFromGroup(items.focusedOverdueQuestionsBasedOnArticles);
            expect(questionCounter).toEqual(bound);
            console.debug("-- focused in-future questions based on articles --");
            bound = Math.min(bound + focusedInFutureQuestionsBasedOnArticlesCount, expectedCount);
            countProvidedQuestionsFromGroup(items.focusedInFutureQuestionsBasedOnArticles);
            expect(questionCounter).toEqual(bound);
            console.debug("-- ordinary new questions based on articles --");
            bound = Math.min(bound + ordinaryNewQuestionsBasedOnArticlesCount, expectedCount);
            countProvidedQuestionsFromGroup(items.ordinaryNewQuestionsBasedOnArticles);
            expect(questionCounter).toEqual(bound);
            console.debug("-- ordinary overdue questions based on articles --");
            bound = Math.min(bound + ordinaryOverdueQuestionsBasedOnArticlesCount, expectedCount);
            countProvidedQuestionsFromGroup(items.ordinaryOverdueQuestionsBasedOnArticles);
            expect(questionCounter).toEqual(bound);
            console.debug("-- focused new questions based on rules --");
            bound = Math.min(bound + focusedNewQuestionsBasedOnRulesCount, expectedCount);
            countProvidedQuestionsFromGroup(items.focusedNewQuestionsBasedOnRules);
            expect(questionCounter).toEqual(bound);
            console.debug("-- focused overdue questions based on rules --");
            bound = Math.min(bound + focusedOverdueQuestionsBasedOnRulesCount, expectedCount);
            countProvidedQuestionsFromGroup(items.focusedOverdueQuestionsBasedOnRules);
            expect(questionCounter).toEqual(bound);
            console.debug("-- focused in-future questions based on rules --");
            bound = Math.min(bound + focusedInFutureQuestionsBasedOnRulesCount, expectedCount);
            countProvidedQuestionsFromGroup(items.focusedInFutureQuestionsBasedOnRules);
            expect(questionCounter).toEqual(bound);
            console.debug("-- ordinary new questions based on rules --");
            bound = Math.min(bound + ordinaryNewQuestionsBasedOnRulesCount, expectedCount);
            countProvidedQuestionsFromGroup(items.ordinaryNewQuestionsBasedOnRules);
            expect(questionCounter).toEqual(bound);
            console.debug("-- ordinary overdue questions based on rules --");
            bound = Math.min(bound + ordinaryOverdueQuestionsBasedOnRulesCount, expectedCount);
            countProvidedQuestionsFromGroup(items.ordinaryOverdueQuestionsBasedOnRules);
            expect(questionCounter).toEqual(bound);
            console.debug("-- ordinary in-future questions based on rules --");
            bound = Math.min(bound + ordinaryInFutureQuestionsBasedOnRulesCount, expectedCount);
            countProvidedQuestionsFromGroup(items.ordinaryInFutureQuestionsBasedOnRules);
            expect(questionCounter).toEqual(bound);
            console.debug("-- questions that should not be selected (index must be -1) --");
            items.questionsThatShouldNotBeSelected.forEach(el => {
                console.debug(el, srcs.indexOf(el));
                expect(srcs.includes(el)).toBeFalsy();
            });
        }
    })

    function createItems(data, overdueTime, inFutureTime, options) {
        const stringifyDueTime = (time) => !time ? "n" : time === overdueTime ? "o" : time === inFutureTime ? "f" : time;
        const ordinaryTag = options.push.userTag("ordinary_tag");
        const focusedTag = options.push.userTag("focused_tag", { focus: true });
        const result = {};
        var index = 0;
        const putGroup = function (groupData) {
            const items = [];
            groupData.toReversed() // we put items in the reerse order to eliminate involving their position in the database
                .forEach(el => {
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
        // we put items in the reerse order to eliminate involving their position in the database
        result.questionsThatShouldNotBeSelected = putGroup(data.doNotSelectTheseQuestions);
        result.ordinaryInFutureQuestionsBasedOnRules = putGroup(data.ordinaryInFutureQuestionsBasedOnRules);
        result.ordinaryOverdueQuestionsBasedOnRules = putGroup(data.ordinaryOverdueQuestionsBasedOnRules);
        result.ordinaryNewQuestionsBasedOnRules = putGroup(data.ordinaryNewQuestionsBasedOnRules);
        result.focusedInFutureQuestionsBasedOnRules = putGroup(data.focusedInFutureQuestionsBasedOnRules);
        result.focusedOverdueQuestionsBasedOnRules = putGroup(data.focusedOverdueQuestionsBasedOnRules);
        result.focusedNewQuestionsBasedOnRules = putGroup(data.focusedNewQuestionsBasedOnRules);
        result.ordinaryOverdueQuestionsBasedOnArticles = putGroup(data.ordinaryOverdueQuestionsBasedOnArticles);
        result.ordinaryNewQuestionsBasedOnArticles = putGroup(data.ordinaryNewQuestionsBasedOnArticles);
        result.focusedInFutureQuestionsBasedOnArticles = putGroup(data.focusedInFutureQuestionsBasedOnArticles);
        result.focusedOverdueQuestionsBasedOnArticles = putGroup(data.focusedOverdueQuestionsBasedOnArticles);
        result.focusedNewQuestionsBasedOnArticles = putGroup(data.focusedNewQuestionsBasedOnArticles);
        return result;
    }

    // Fisher–Yates shuffle
    // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
    // https://www.freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/
    // https://coureywong.medium.com/how-to-shuffle-an-array-of-items-in-javascript-39b9efe4b567
    function shuffleArray(array) {
        const resultArray = Array.from(array);
        for (let i = resultArray.length - 1; i >= 1; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [resultArray[i], resultArray[j]] = [resultArray[j], resultArray[i]];
        }
        return resultArray;
    }

});
