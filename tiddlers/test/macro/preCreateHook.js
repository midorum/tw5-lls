
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

    it("should create log tiddlers if they do not exist", () => {
        const options = utils.setupWiki();
        // consoleSpy.and.callThrough();
        // consoleDebugSpy.and.callThrough();
        const time = new Date().getTime();
        options.widget.wiki.addTiddler({
            title: tags.lastAnswerTime,
            text: time
        });
        preCreateHookMacro.run(options.wiki, {});
        verifyLog({
            title: tags.wordArticleStatisticLog,
            records: 1,
            time: time
        }, options)
        verifyLog({
            title: tags.ruleStatisticLog,
            records: 1,
            time: time
        }, options)
        verifyLog({
            title: tags.usageExampleStatisticLog,
            records: 1,
            time: time
        }, options)
    })

    it("should update log tiddlers if they do exist", () => {
        const options = utils.setupWiki();
        // consoleSpy.and.callThrough();
        // consoleDebugSpy.and.callThrough();
        const previousRecordTime = new Date().getTime();
        const time = previousRecordTime + 1000 * 60 * 60 * 24;
        options.widget.wiki.addTiddler({
            title: tags.lastAnswerTime,
            text: time
        });
        options.widget.wiki.addTiddler({
            title: tags.wordArticleStatisticLog,
            text: previousRecordTime + ";some data"
        });
        options.widget.wiki.addTiddler({
            title: tags.ruleStatisticLog,
            text: previousRecordTime + ";some data"
        });
        options.widget.wiki.addTiddler({
            title: tags.usageExampleStatisticLog,
            text: previousRecordTime + ";some data"
        });
        preCreateHookMacro.run(options.wiki, {});
        verifyLog({
            title: tags.wordArticleStatisticLog,
            records: 2,
            time: time
        }, options)
        verifyLog({
            title: tags.ruleStatisticLog,
            records: 2,
            time: time
        }, options)
        verifyLog({
            title: tags.usageExampleStatisticLog,
            records: 2,
            time: time
        }, options)
    })

    it("should not update log tiddlers if the previous record has made in the same day", () => {
        const options = utils.setupWiki();
        // consoleSpy.and.callThrough();
        // consoleDebugSpy.and.callThrough();
        const previousDate = new Date(2000, 3, 3, 12, 5);
        const previousRecordTime = previousDate.getTime();
        const time = previousRecordTime + 1000;
        options.widget.wiki.addTiddler({
            title: tags.lastAnswerTime,
            text: time
        });
        options.widget.wiki.addTiddler({
            title: tags.wordArticleStatisticLog,
            text: previousRecordTime + ";some data"
        });
        options.widget.wiki.addTiddler({
            title: tags.ruleStatisticLog,
            text: previousRecordTime + ";some data"
        });
        options.widget.wiki.addTiddler({
            title: tags.usageExampleStatisticLog,
            text: previousRecordTime + ";some data"
        });
        preCreateHookMacro.run(options.wiki, {});
        verifyLog({
            title: tags.wordArticleStatisticLog,
            records: 1,
            time: previousRecordTime
        }, options)
        verifyLog({
            title: tags.ruleStatisticLog,
            records: 1,
            time: previousRecordTime
        }, options)
        verifyLog({
            title: tags.usageExampleStatisticLog,
            records: 1,
            time: previousRecordTime
        }, options)
    })

    function verifyLog(logData, options) {
        const logInstance = options.widget.wiki.getTiddler(logData.title);
        console.debug(logData.title, logInstance);
        expect(logInstance).toBeDefined();
        const content = logInstance.fields.text;
        const records = content.split("\n");
        expect(records.length).toEqual(logData.records);
        expect(records[records.length - 1].indexOf(logData.time)).toEqual(0);
    }
});
