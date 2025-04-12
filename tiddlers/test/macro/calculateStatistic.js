
const utils = require("test/utils").llsTestUtils;
const llsUtils = require("$:/plugins/midorum/lls/modules/utils.js").llsUtils;
const stateTitle = require("$:/plugins/midorum/lls/modules/cache.js").getTags({}).lastAnswerTime;
const Logger = $tw.utils.Logger.prototype;

describe("The lls-calculate-statistic macro", () => {
    var consoleSpy;
    var consoleDebugSpy;
    var loggerSpy;
    var calculateStaticticMacro;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        consoleDebugSpy = spyOn(console, 'debug');
        loggerSpy = spyOn(Logger, 'alert');
        calculateStaticticMacro = $tw.macros["lls-calculate-statistic"]
    });

    it("should be defined", () => {
        expect(calculateStaticticMacro).toBeDefined();
    })

    it("should return an error if the 'filter' attribute is not defined", () => {
        // consoleSpy.and.callThrough();
        // consoleDebugSpy.and.callThrough();
        const result = calculateStaticticMacro.run();
        console.debug("result", result);
        expect(result).toEqual("Error: The 'filter' attribute should be defined");
    })

    it("should return statistic when the 'filter' attribute is defined", () => {
        const options = utils.setupWiki();
        const c = llsUtils.statistic;
        // consoleSpy.and.callThrough();
        // consoleDebugSpy.and.callThrough();
        const filter = "[tag[$:/lls/tags/wordArticle]]";
        const time = new Date(2020, 7, 3).getTime();
        options.wiki.addTiddler({ title: stateTitle, text: time });
        options.push.wordArticle("greater than 1 year in forward", { scheduledForward: { due: time + c.Y1 * c.DAY_MS + 1 } });
        llsUtils.range(0, 2, 1).forEach(i =>
            options.push.wordArticle("greater than 6 months in forward" + i, { scheduledForward: { due: time + c.M6 * c.DAY_MS + 1 + i } }));
        llsUtils.range(0, 3, 1).forEach(i =>
            options.push.wordArticle("greater than 3 months in forward" + i, { scheduledForward: { due: time + c.M3 * c.DAY_MS + 1 + i } }));
        llsUtils.range(0, 4, 1).forEach(i =>
            options.push.wordArticle("greater than 1 month in forward" + i, { scheduledForward: { due: time + c.M1 * c.DAY_MS + 1 + i } }));
        llsUtils.range(0, 5, 1).forEach(i =>
            options.push.wordArticle("greater than 2 weeks in forward" + i, { scheduledForward: { due: time + c.W2 * c.DAY_MS + 1 + i } }));
        llsUtils.range(0, 6, 1).forEach(i =>
            options.push.wordArticle("greater than 1 week in forward" + i, { scheduledForward: { due: time + c.W1 * c.DAY_MS + 1 + i } }));
        llsUtils.range(0, 7, 1).forEach(i =>
            options.push.wordArticle("greater than 3 days in forward" + i, { scheduledForward: { due: time + c.D3 * c.DAY_MS + 1 + i } }));
        llsUtils.range(0, 8, 1).forEach(i =>
            options.push.wordArticle("greater than 2 days in forward" + i, { scheduledForward: { due: time + c.D2 * c.DAY_MS + 1 + i } }));
        llsUtils.range(0, 9, 1).forEach(i =>
            options.push.wordArticle("greater than 1 day in forward" + i, { scheduledForward: { due: time + c.D1 * c.DAY_MS + 1 + i } }));
        llsUtils.range(0, 10, 1).forEach(i =>
            options.push.wordArticle("overdue in forward" + i, { scheduledForward: { due: time + 1 + i } }));
        llsUtils.range(0, 11, 1).forEach(i =>
            options.push.wordArticle("greater than 1 year in backward" + i, { scheduledBackward: { due: time + c.Y1 * c.DAY_MS + 1 + i } }));
        llsUtils.range(0, 12, 1).forEach(i =>
            options.push.wordArticle("greater than 6 months in backward" + i, { scheduledBackward: { due: time + c.M6 * c.DAY_MS + 1 + i } }));
        llsUtils.range(0, 13, 1).forEach(i =>
            options.push.wordArticle("greater than 3 months in backward" + i, { scheduledBackward: { due: time + c.M3 * c.DAY_MS + 1 + i } }));
        llsUtils.range(0, 14, 1).forEach(i =>
            options.push.wordArticle("greater than 1 month in backward" + i, { scheduledBackward: { due: time + c.M1 * c.DAY_MS + 1 + i } }));
        llsUtils.range(0, 15, 1).forEach(i =>
            options.push.wordArticle("greater than 2 weeks in backward" + i, { scheduledBackward: { due: time + c.W2 * c.DAY_MS + 1 + i } }));
        llsUtils.range(0, 16, 1).forEach(i =>
            options.push.wordArticle("greater than 1 week in backward" + i, { scheduledBackward: { due: time + c.W1 * c.DAY_MS + 1 + i } }));
        llsUtils.range(0, 17, 1).forEach(i =>
            options.push.wordArticle("greater than 3 days in backward" + i, { scheduledBackward: { due: time + c.D3 * c.DAY_MS + 1 + i } }));
        llsUtils.range(0, 18, 1).forEach(i =>
            options.push.wordArticle("greater than 2 days in backward" + i, { scheduledBackward: { due: time + c.D2 * c.DAY_MS + 1 + i } }));
        llsUtils.range(0, 19, 1).forEach(i =>
            options.push.wordArticle("greater than 1 day in backward" + i, { scheduledBackward: { due: time + c.D1 * c.DAY_MS + 1 + i } }));
        llsUtils.range(0, 20, 1).forEach(i =>
            options.push.wordArticle("overdue in backward" + i, { scheduledBackward: { due: time + 1 + i } }));
        const result = calculateStaticticMacro.run(filter, undefined, options.wiki);
        console.debug("result", result);
        expect(typeof result === 'string' || result instanceof String).toBeTruthy();
        const chanks = result.split(";");
        expect(chanks.length).toEqual(4);
        expect(llsUtils.parseInteger(chanks[0])).toEqual(time);
        expect(llsUtils.parseInteger(chanks[1])).toEqual(options.wiki.filterTiddlers(filter).length); // total items
        const forwardStatistic = chanks[2].split(",");
        expect(forwardStatistic.length).toEqual(10);
        expect(llsUtils.parseInteger(forwardStatistic[0])).toEqual(10); // overdue in forward
        expect(llsUtils.parseInteger(forwardStatistic[1])).toEqual(9); // greater than 1 day in forward
        expect(llsUtils.parseInteger(forwardStatistic[2])).toEqual(8); // greater than 2 days in forward
        expect(llsUtils.parseInteger(forwardStatistic[3])).toEqual(7); // greater than 3 days in forward
        expect(llsUtils.parseInteger(forwardStatistic[4])).toEqual(6); // greater than 1 week in forward
        expect(llsUtils.parseInteger(forwardStatistic[5])).toEqual(5); // greater than 2 weeks in forward
        expect(llsUtils.parseInteger(forwardStatistic[6])).toEqual(4); // greater than 1 month in forward
        expect(llsUtils.parseInteger(forwardStatistic[7])).toEqual(3); // greater than 3 months in forward
        expect(llsUtils.parseInteger(forwardStatistic[8])).toEqual(2); // greater than 6 months in forward
        expect(llsUtils.parseInteger(forwardStatistic[9])).toEqual(1); // greater than 1 year in forward
        const backwardStatistic = chanks[3].split(",");
        expect(backwardStatistic.length).toEqual(10);
        expect(llsUtils.parseInteger(backwardStatistic[0])).toEqual(20); // overdue in backward
        expect(llsUtils.parseInteger(backwardStatistic[1])).toEqual(19); // greater than 1 day in backward
        expect(llsUtils.parseInteger(backwardStatistic[2])).toEqual(18); // greater than 2 days in backward
        expect(llsUtils.parseInteger(backwardStatistic[3])).toEqual(17); // greater than 3 days in backward
        expect(llsUtils.parseInteger(backwardStatistic[4])).toEqual(16); // greater than 1 week in backward
        expect(llsUtils.parseInteger(backwardStatistic[5])).toEqual(15); // greater than 2 weeks in backward
        expect(llsUtils.parseInteger(backwardStatistic[6])).toEqual(14); // greater than 1 month in backward
        expect(llsUtils.parseInteger(backwardStatistic[7])).toEqual(13); // greater than 3 months in backward
        expect(llsUtils.parseInteger(backwardStatistic[8])).toEqual(12); // greater than 6 months in backward
        expect(llsUtils.parseInteger(backwardStatistic[9])).toEqual(11); // greater than 1 year in backward
    })

});
