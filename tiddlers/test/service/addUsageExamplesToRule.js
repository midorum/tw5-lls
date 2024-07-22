
const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;

describe("The addUsageExamplesToRule service", () => {
    var consoleSpy;
    var loggerSpy;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        loggerSpy = spyOn(Logger, 'alert');
    });

    it("should be defined", () => {
        expect(messageHandler.addUsageExamplesToRule).toBeDefined();
    })

    it("should fail if rule argument does not passed", () => {
        const options = utils.setupWiki();
        const rule = undefined;
        const usageExamplesTag = undefined;
        const usageExamplesBulkData = undefined;
        const schedule = undefined;
        const idle = true;
        const expectedMessage = "rule cannot be empty";
        expect(messageHandler.addUsageExamplesToRule(rule, usageExamplesTag, usageExamplesBulkData, schedule, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail if rule argument is wrong", () => {
        const options = utils.setupWiki();
        const rule = "some";
        const usageExamplesTag = undefined;
        const usageExamplesBulkData = undefined;
        const schedule = undefined;
        const idle = true;
        const expectedMessage = "Wrong rule reference: " + rule;
        expect(messageHandler.addUsageExamplesToRule(rule, usageExamplesTag, usageExamplesBulkData, schedule, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail if both newExamplesTag and newExamplesBulkData arguments do not passed", () => {
        const options = utils.setupWiki();
        const ruleTemplate = utils.getRule("some");
        const rule = ruleTemplate.title;
        const usageExamplesTag = undefined;
        const usageExamplesBulkData = undefined;
        const schedule = undefined;
        const idle = true;
        const expectedMessage = "either newExamplesTag or newExamplesBulkData should be set";
        expect(messageHandler.addUsageExamplesToRule(rule, usageExamplesTag, usageExamplesBulkData, schedule, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should create usage examples by the usageExamplesTag if they are not exist"
        + " and link both new and existed usage examples with rule"
        + " when usageExamplesTag is passed", () => {
            const options = utils.setupWiki();
            const context = utils.getLlsContext();
            const ruleTemplate = utils.getRule("some");
            const rule = ruleTemplate.title;
            const usageExamplesTag = "someTag";
            const usageExamplesBulkData = undefined;
            const schedule = undefined;
            const idle = false;
            const oldUsageExample1Template = utils.createUsageExample("fakeUsageExample1", [ruleTemplate.title]);
            const temporaryUsageExapmle1Template = utils.createTemporaryUsageExampleDataHolder("temporaryUsageExapmle1", usageExamplesTag);
            const temporaryUsageExapmle2Template = utils.createTemporaryUsageExampleDataHolder("temporaryUsageExapmle2", usageExamplesTag);
            const temporaryUsageExapmle3Template = utils.createTemporaryUsageExampleDataHolder("fakeUsageExample1", usageExamplesTag); // duplicates exist usage example
            options.widget.wiki.addTiddler(oldUsageExample1Template);
            options.widget.wiki.addTiddler(ruleTemplate);
            options.widget.wiki.addTiddler(temporaryUsageExapmle1Template);
            options.widget.wiki.addTiddler(temporaryUsageExapmle2Template);
            options.widget.wiki.addTiddler(temporaryUsageExapmle3Template);
            loggerSpy.and.callThrough();
            // console.warn(options.widget.wiki.getTiddler(wordArticleTemplate.title))
            expect(messageHandler.addUsageExamplesToRule(rule, usageExamplesTag, usageExamplesBulkData, schedule, idle, options.widget)).nothing();
            expect(Logger.alert).toHaveBeenCalledTimes(0);
            // console.warn(options.widget.wiki.getTiddler(oldUsageExample1Template.title))
            // word article should be reachable from all old and new usage examples; no dublicates allowed
            const realatedUsageExamples = options.widget.wiki.filterTiddlers("[[" + ruleTemplate.title + "]tagging[]tag[" + context.tags.usageExample + "]]");
            // console.warn(realatedUsageExamples)
            expect(realatedUsageExamples.length).toEqual(3);
            // all uasge examples should exist
            const verifyUsageExample = (instance, template) => {
                expect(instance).toBeDefined();
                expect(instance.fields.original).toEqual(template.original);
                expect(instance.fields.translation).toEqual(template.translation);
            }
            verifyUsageExample(options.widget.wiki.getTiddler(realatedUsageExamples.find(tag => tag === oldUsageExample1Template.title)), oldUsageExample1Template);
            const newUsageExamples = realatedUsageExamples.filter(tag => tag !== oldUsageExample1Template.title);
            expect(newUsageExamples.length).toEqual(2);
            newUsageExamples.forEach(tag => {
                const createdUsageExampleInstance = options.widget.wiki.getTiddler(tag);
                if (createdUsageExampleInstance.fields.original === temporaryUsageExapmle1Template.original) {
                    verifyUsageExample(createdUsageExampleInstance, temporaryUsageExapmle1Template);
                } else if (createdUsageExampleInstance.fields.original === temporaryUsageExapmle2Template.original) {
                    verifyUsageExample(createdUsageExampleInstance, temporaryUsageExapmle2Template);
                } else {
                    fail("redundant usage example tag:" + tag
                        + " we should never reach this point");
                }
            });
        })

    it("should create usage examples from the usageExamplesBulkData if they are not exist"
        + " and link both new and existed usage examples with word article"
        + " when usageExamplesBulkData is passed", () => {
            const options = utils.setupWiki();
            const context = utils.getLlsContext();
            const ruleTemplate = utils.getRule("some");
            const rule = ruleTemplate.title;
            const usageExamplesTag = undefined;
            const schedule = undefined;
            const idle = false;
            const oldUsageExample1Template = utils.createUsageExample("fakeUsageExample1", [ruleTemplate.title]);
            const newUsageExample1Original = "newUsageExample1Original";
            const newUsageExample1Translation = "newUsageExample1Translation";
            const newUsageExample2Original = "newUsageExample2Original";
            const newUsageExample2Translation = "newUsageExample2Translation";
            const usageExamplesBulkDataTemplate = utils.createTemporaryUsageExampleBulkDataHolder("newExamplesBulkData",
                newUsageExample1Original + "\n" + newUsageExample2Original,
                newUsageExample1Translation + "\n" + newUsageExample2Translation);
            options.widget.wiki.addTiddler(oldUsageExample1Template);
            options.widget.wiki.addTiddler(ruleTemplate);
            options.widget.wiki.addTiddler(usageExamplesBulkDataTemplate);
            loggerSpy.and.callThrough();
            // console.warn(options.widget.wiki.getTiddler(wordArticleTemplate.title))
            // console.warn(options.widget.wiki.getTiddler(temporaryUsageExamplesBulkTemplate.title))
            expect(messageHandler.addUsageExamplesToRule(rule, usageExamplesTag, usageExamplesBulkDataTemplate.title, schedule, idle, options.widget)).nothing();
            expect(Logger.alert).toHaveBeenCalledTimes(0);
            // console.warn(options.widget.wiki.getTiddler(oldUsageExample1Template.title))
            // word article should be reachable from all old and new usage examples; no dublicates allowed
            const realatedUsageExamples = options.widget.wiki.filterTiddlers("[[" + ruleTemplate.title + "]tagging[]tag[" + context.tags.usageExample + "]]");
            // console.warn(realatedUsageExamples)
            expect(realatedUsageExamples.length).toEqual(3);
            // all uasge examples should exist
            const verifyUsageExample = (instance, template) => {
                expect(instance).toBeDefined();
                expect(instance.fields.original).toEqual(template.original);
                expect(instance.fields.translation).toEqual(template.translation);
            }
            verifyUsageExample(options.widget.wiki.getTiddler(realatedUsageExamples.find(tag => tag === oldUsageExample1Template.title)), oldUsageExample1Template);
            const newUsageExamples = realatedUsageExamples.filter(tag => tag !== oldUsageExample1Template.title);
            expect(newUsageExamples.length).toEqual(2);
            newUsageExamples.forEach(tag => {
                const createdUsageExampleInstance = options.widget.wiki.getTiddler(tag);
                if (createdUsageExampleInstance.fields.original === newUsageExample1Original) {
                    expect(createdUsageExampleInstance.fields.translation).toEqual(newUsageExample1Translation);
                } else if (createdUsageExampleInstance.fields.original === newUsageExample2Original) {
                    expect(createdUsageExampleInstance.fields.translation).toEqual(newUsageExample2Translation);
                } else {
                    fail("redundant usage example tag:" + tag
                        + " we should never reach this point");
                }
            });
        })

});
