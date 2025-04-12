
const utils = require("test/utils").llsTestUtils;
const cache = require("$:/plugins/midorum/lls/modules/cache.js");
const Logger = $tw.utils.Logger.prototype;

describe("The lls-pre-create-hook macro", () => {
    var consoleSpy;
    var consoleDebugSpy;
    var loggerSpy;
    var preCreateHookMacro;
    var tags;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        consoleDebugSpy = spyOn(console, 'debug');
        loggerSpy = spyOn(Logger, 'alert');
        preCreateHookMacro = $tw.macros["lls-pre-create-hook"]
        tags = cache.getTags({});
    });

    it("should be defined", () => {
        expect(preCreateHookMacro).toBeDefined();
    })

    it("should create log tiddlers if they do not exist and the last answer time in the past", () => {
        const options = utils.setupWiki();
        // consoleSpy.and.callThrough();
        // consoleDebugSpy.and.callThrough();
        const lastAnswerTime = new Date(2000, 3, 4).getTime();
        options.widget.wiki.addTiddler({
            title: tags.lastAnswerTime,
            text: lastAnswerTime
        });
        preCreateHookMacro.run(options.wiki, {});
        verifyLog({
            title: tags.wordArticleStatisticLog,
            records: 1,
            time: lastAnswerTime
        }, options)
        verifyLog({
            title: tags.ruleStatisticLog,
            records: 1,
            time: lastAnswerTime
        }, options)
        verifyLog({
            title: tags.usageExampleStatisticLog,
            records: 1,
            time: lastAnswerTime
        }, options)
    })

    it("should update log tiddlers if they do exist and the last answer time in the past", () => {
        const options = utils.setupWiki();
        // consoleSpy.and.callThrough();
        // consoleDebugSpy.and.callThrough();
        const lastRecordTime = new Date(2000, 4, 3).getTime();
        const lastAnswerTime = new Date(2001, 4, 3).getTime();
        options.widget.wiki.addTiddler({
            title: tags.lastAnswerTime,
            text: lastAnswerTime
        });
        options.widget.wiki.addTiddler({
            title: tags.wordArticleStatisticLog,
            text: lastRecordTime + ";some data"
        });
        options.widget.wiki.addTiddler({
            title: tags.ruleStatisticLog,
            text: lastRecordTime + ";some data"
        });
        options.widget.wiki.addTiddler({
            title: tags.usageExampleStatisticLog,
            text: lastRecordTime + ";some data"
        });
        preCreateHookMacro.run(options.wiki, {});
        verifyLog({
            title: tags.wordArticleStatisticLog,
            records: 2,
            time: lastAnswerTime
        }, options)
        verifyLog({
            title: tags.ruleStatisticLog,
            records: 2,
            time: lastAnswerTime
        }, options)
        verifyLog({
            title: tags.usageExampleStatisticLog,
            records: 2,
            time: lastAnswerTime
        }, options)
    })

    it("should not update log tiddlers if the last answer time is today", () => {
        const options = utils.setupWiki();
        // consoleSpy.and.callThrough();
        // consoleDebugSpy.and.callThrough();
        const lastRecordTime = new Date(2000, 3, 3, 12, 5).getTime();
        const lsatAnswerTime = new Date().getTime();
        options.widget.wiki.addTiddler({
            title: tags.lastAnswerTime,
            text: lsatAnswerTime
        });
        options.widget.wiki.addTiddler({
            title: tags.wordArticleStatisticLog,
            text: lastRecordTime + ";some data"
        });
        options.widget.wiki.addTiddler({
            title: tags.ruleStatisticLog,
            text: lastRecordTime + ";some data"
        });
        options.widget.wiki.addTiddler({
            title: tags.usageExampleStatisticLog,
            text: lastRecordTime + ";some data"
        });
        preCreateHookMacro.run(options.wiki, {});
        verifyLog({
            title: tags.wordArticleStatisticLog,
            records: 1,
            time: lastRecordTime
        }, options)
        verifyLog({
            title: tags.ruleStatisticLog,
            records: 1,
            time: lastRecordTime
        }, options)
        verifyLog({
            title: tags.usageExampleStatisticLog,
            records: 1,
            time: lastRecordTime
        }, options)
    })

    function verifyLog(logData, options) {
        const logInstance = options.widget.wiki.getTiddler(logData.title);
        console.debug(logData.title, logInstance);
        expect(logInstance).toBeDefined();
        const content = logInstance.fields.text;
        const records = content.split("\n");
        expect(records.length).toEqual(logData.records);
        console.debug("log records", records)
        expect(records[records.length - 1].indexOf(logData.time)).toEqual(0);
    }

});
