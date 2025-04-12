
const utils = require("test/utils").llsTestUtils;
const llsUtils = require("$:/plugins/midorum/lls/modules/utils.js").llsUtils;
const cache = require("$:/plugins/midorum/lls/modules/cache.js");
const Logger = $tw.utils.Logger.prototype;

describe("The lls-get-statistic macro", () => {
    var consoleSpy;
    var consoleDebugSpy;
    var loggerSpy;
    var getStaticticMacro;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        consoleDebugSpy = spyOn(console, 'debug');
        loggerSpy = spyOn(Logger, 'alert');
        getStaticticMacro = $tw.macros["lls-get-statistic"]
    });

    it("should be defined", () => {
        expect(getStaticticMacro).toBeDefined();
    })

    it("should return 3 rows of compiled statistic data as a json string", () => {
        const options = utils.setupWiki();
        const tags = cache.getTags({});
        const totalRows = 3;
        const time = new Date().getTime();
        options.wiki.addTiddler({
            title: tags.wordArticleStatisticLog,
            text: (time - llsUtils.statistic.DAY_MS * 5) + ";123;28,19,8,7,0,5,3,0,1,0;40,3,0,5,7,9,0,3,2,1"
                + "\n" + (time - llsUtils.statistic.DAY_MS * 3) + ";138;40,8,12,7,0,5,3,0,1,0;29,3,0,5,7,9,0,3,2,1"
                + "\n" + (time - llsUtils.statistic.DAY_MS) + ";150;35,9,8,7,0,5,3,0,1,0;40,3,0,5,7,9,0,3,2,1"
        });
        options.wiki.addTiddler({
            title: tags.ruleStatisticLog,
            text: (time - llsUtils.statistic.DAY_MS * 5) + ";123;28,19,8,7,0,5,3,0,1,0;40,3,0,5,7,9,0,3,2,1"
        });
        // consoleSpy.and.callThrough();
        // consoleDebugSpy.and.callThrough();
        const result = getStaticticMacro.run(totalRows, options.wiki);
        console.debug("result", result);
        const s = llsUtils.parseJson(result);
        expect(s).toBeDefined();
        expect(s.count).toEqual(totalRows);
        expect(s.wordAricleLog.length).toEqual(totalRows - 1);
        expect(s.ruleLog.length).toEqual(1);
        expect(s.usageExampleLog.length).toEqual(0);
        expect(s.wordArticleCurrent).toBeDefined();
        expect(s.ruleCurrent).toBeDefined();
        expect(s.usageExampleCurrent).toBeDefined();
    })

    it("should return 2 rows of compiled statistic data as a json string", () => {
        const options = utils.setupWiki();
        const tags = cache.getTags({});
        const totalRows = 2;
        const time = new Date().getTime();
        options.wiki.addTiddler({
            title: tags.wordArticleStatisticLog,
            text: (time - llsUtils.statistic.DAY_MS * 5) + ";123;28,19,8,7,0,5,3,0,1,0;40,3,0,5,7,9,0,3,2,1"
                + "\n" + (time - llsUtils.statistic.DAY_MS * 3) + ";138;40,8,12,7,0,5,3,0,1,0;29,3,0,5,7,9,0,3,2,1"
                + "\n" + (time - llsUtils.statistic.DAY_MS) + ";150;35,9,8,7,0,5,3,0,1,0;40,3,0,5,7,9,0,3,2,1"
        });
        options.wiki.addTiddler({
            title: tags.ruleStatisticLog,
            text: (time - llsUtils.statistic.DAY_MS * 5) + ";123;28,19,8,7,0,5,3,0,1,0;40,3,0,5,7,9,0,3,2,1"
        });
        // consoleSpy.and.callThrough();
        // consoleDebugSpy.and.callThrough();
        const result = getStaticticMacro.run(totalRows, options.wiki);
        console.debug("result", result);
        const s = llsUtils.parseJson(result);
        expect(s).toBeDefined();
        expect(s.count).toEqual(totalRows);
        expect(s.wordAricleLog.length).toEqual(totalRows - 1);
        expect(s.ruleLog.length).toEqual(1);
        expect(s.usageExampleLog.length).toEqual(0);
        expect(s.wordArticleCurrent).toBeDefined();
        expect(s.ruleCurrent).toBeDefined();
        expect(s.usageExampleCurrent).toBeDefined();
    })

});
