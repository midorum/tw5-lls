
const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;

describe("The createRule service", () => {
    var consoleSpy;
    var loggerSpy;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        loggerSpy = spyOn(Logger, 'alert');
    });

    it("should be defined", () => {
        expect(messageHandler.createRule).toBeDefined();
    })

    it("should fail if brief argument does not passed", () => {
        const options = utils.setupWiki();
        const brief = undefined;
        const description = undefined;
        const usageExamplesTag = undefined;
        const usageExamplesBulkData = undefined;
        const schedule = undefined;
        const idle = true;
        const expectedMessage = "brief cannot be empty";
        expect(messageHandler.createRule(brief, description, usageExamplesTag, usageExamplesBulkData, schedule, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should create a new rule", () => {
        const options = utils.setupWiki();
        const context = utils.getLlsContext();
        const brief = "some rule";
        const description = "some description";
        const usageExamplesTag = undefined;
        const usageExamplesBulkData = undefined;
        const schedule = undefined;
        const idle = false;
        loggerSpy.and.callThrough();
        expect(messageHandler.createRule(brief, description, usageExamplesTag, usageExamplesBulkData, schedule, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(0);
        const createdRules = options.widget.wiki.filterTiddlers("[tag[" + context.tags.rule + "]]");
        expect(createdRules.length).toEqual(1);
        const createdRule = options.widget.wiki.getTiddler(createdRules[0]);
        expect(createdRule).toBeDefined();
        expect(createdRule.fields.brief).toEqual(brief);
        expect(createdRule.fields.text).toEqual(description);
    })

    it("should create a new rule"
        + " and should create usage examples by the newExamplesTag if they are not exist"
        + " and link both new and existed usage examples with the new rule"
        + " when newExamplesTag is passed", () => {
            const options = utils.setupWiki();
            const context = utils.getLlsContext();
            const brief = "some rule";
            const description = "some description";
            const newExamplesTag = "someTag";
            const usageExamplesBulkData = undefined;
            const schedule = undefined;
            const idle = false;
            const oldUsageExample1Template = utils.createUsageExample("fakeUsageExample1", []);
            const temporaryUsageExapmle1Template = utils.createTemporaryUsageExampleDataHolder("temporaryUsageExapmle1", newExamplesTag);
            const temporaryUsageExapmle2Template = utils.createTemporaryUsageExampleDataHolder("temporaryUsageExapmle2", newExamplesTag);
            const temporaryUsageExapmle3Template = utils.createTemporaryUsageExampleDataHolder("fakeUsageExample1", newExamplesTag); // duplicates exist usage example
            options.widget.wiki.addTiddler(oldUsageExample1Template);
            options.widget.wiki.addTiddler(temporaryUsageExapmle1Template);
            options.widget.wiki.addTiddler(temporaryUsageExapmle2Template);
            options.widget.wiki.addTiddler(temporaryUsageExapmle3Template);
            loggerSpy.and.callThrough();
            expect(messageHandler.createRule(brief, description, newExamplesTag, usageExamplesBulkData, schedule, idle, options.widget)).nothing();
            expect(Logger.alert).toHaveBeenCalledTimes(0);
            const createdRules = options.widget.wiki.filterTiddlers("[tag[" + context.tags.rule + "]]");
            expect(createdRules.length).toEqual(1);
            const createdRule = options.widget.wiki.getTiddler(createdRules[0]);
            expect(createdRule).toBeDefined();
            expect(createdRule.fields.brief).toEqual(brief);
            expect(createdRule.fields.text).toEqual(description);
            // verifying usage examples
            const realatedUsageExamples = options.widget.wiki.filterTiddlers("[[" + createdRule.fields.title + "]tagging[]tag[" + context.tags.usageExample + "]]");
            expect(realatedUsageExamples.length).toEqual(3);
            // all uasge examples should exist
            const verifyUsageExample = (instance, template) => {
                // console.warn(instance);
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

    it("should create a new rule"
        + " and should create usage examples from the newExamplesBulkData if they are not exist"
        + " and link both new and existed usage examples with the new rule"
        + " when newExamplesBulkData is passed", () => {
            const options = utils.setupWiki();
            const context = utils.getLlsContext();
            const brief = "some rule";
            const description = "some description";
            const newExamplesTag = undefined;
            const schedule = undefined;
            const idle = false;
            const newUsageExample1Original = "newUsageExample1Original";
            const newUsageExample1Translation = "newUsageExample1Translation";
            const newUsageExample2Original = "newUsageExample2Original";
            const newUsageExample2Translation = "newUsageExample2Translation";
            const newExamplesBulkDataTemplate = utils.createTemporaryUsageExampleBulkDataHolder("newExamplesBulkData",
                newUsageExample1Original + "\n" + newUsageExample2Original,
                newUsageExample1Translation + "\n" + newUsageExample2Translation);
            options.widget.wiki.addTiddler(newExamplesBulkDataTemplate);
            loggerSpy.and.callThrough();
            expect(messageHandler.createRule(brief, description, newExamplesTag, newExamplesBulkDataTemplate.title, schedule, idle, options.widget)).nothing();
            expect(Logger.alert).toHaveBeenCalledTimes(0);
            const createdRules = options.widget.wiki.filterTiddlers("[tag[" + context.tags.rule + "]]");
            expect(createdRules.length).toEqual(1);
            const createdRule = options.widget.wiki.getTiddler(createdRules[0]);
            expect(createdRule).toBeDefined();
            expect(createdRule.fields.brief).toEqual(brief);
            expect(createdRule.fields.text).toEqual(description);
            // verifying usage examples
            const realatedUsageExamples = options.widget.wiki.filterTiddlers("[[" + createdRule.fields.title + "]tagging[]tag[" + context.tags.usageExample + "]]");
            // all uasge examples should exist
            expect(realatedUsageExamples.length).toEqual(2);
            realatedUsageExamples.forEach(tag => {
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
