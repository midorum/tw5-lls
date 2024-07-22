
const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;

describe("The addUsageExamplesToWordArticle service", () => {
    var consoleSpy;
    var loggerSpy;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        loggerSpy = spyOn(Logger, 'alert');
    });

    it("should be defined", () => {
        expect(messageHandler.addUsageExamplesToWordArticle).toBeDefined();
    })

    it("should fail if article argument does not passed", () => {
        const options = utils.setupWiki();
        const article = undefined;
        const newExamplesTag = undefined;
        const newExamplesBulkData = undefined;
        const schedule = undefined;
        const idle = true;
        const expectedMessage = "article cannot be empty";
        expect(messageHandler.addUsageExamplesToWordArticle(article, newExamplesTag, newExamplesBulkData, schedule, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail if both newExamplesTag and newExamplesBulkData arguments do not passed", () => {
        const options = utils.setupWiki();
        const article = utils.createWordArticle("fakeArticle", utils.createWord("fakeWord").title, []);
        const newExamplesTag = undefined;
        const newExamplesBulkData = undefined;
        const schedule = undefined;
        const idle = true;
        const expectedMessage = "either newExamplesTag or newExamplesBulkData should be set";
        expect(messageHandler.addUsageExamplesToWordArticle(article.title, newExamplesTag, newExamplesBulkData, schedule, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail if article argument is wrong", () => {
        const options = utils.setupWiki();
        const article = utils.createWord("wrongReference");
        const newExamplesTag = "someTag";
        const newExamplesBulkData = undefined;
        const schedule = undefined;
        const idle = true;
        const expectedMessage = "Wrong word article reference: " + article.title;
        expect(messageHandler.addUsageExamplesToWordArticle(article.title, newExamplesTag, newExamplesBulkData, schedule, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should create usage examples by the newExamplesTag if they are not exist"
        + " and link both new and existed usage examples with word article"
        + " when newExamplesTag is passed", () => {
            const options = utils.setupWiki();
            const context = utils.getLlsContext();
            const wordArticleTemplate = utils.createWordArticle("fakeArticle", utils.createWord("fakeWord").title, []);
            const newExamplesTag = "someTag";
            const newExamplesBulkData = undefined;
            const schedule = undefined;
            const idle = false;
            const oldUsageExample1Template = utils.createUsageExample("fakeUsageExample1", [wordArticleTemplate.title]);
            const temporaryUsageExapmle1Template = utils.createTemporaryUsageExampleDataHolder("temporaryUsageExapmle1", newExamplesTag);
            const temporaryUsageExapmle2Template = utils.createTemporaryUsageExampleDataHolder("temporaryUsageExapmle2", newExamplesTag);
            const temporaryUsageExapmle3Template = utils.createTemporaryUsageExampleDataHolder("fakeUsageExample1", newExamplesTag); // duplicates exist usage example
            options.widget.wiki.addTiddler(oldUsageExample1Template);
            options.widget.wiki.addTiddler(wordArticleTemplate);
            options.widget.wiki.addTiddler(temporaryUsageExapmle1Template);
            options.widget.wiki.addTiddler(temporaryUsageExapmle2Template);
            options.widget.wiki.addTiddler(temporaryUsageExapmle3Template);
            loggerSpy.and.callThrough();
            // console.warn(options.widget.wiki.getTiddler(wordArticleTemplate.title))
            expect(messageHandler.addUsageExamplesToWordArticle(wordArticleTemplate.title, newExamplesTag, newExamplesBulkData, schedule, idle, options.widget)).nothing();
            expect(Logger.alert).toHaveBeenCalledTimes(0);
            // console.warn(options.widget.wiki.getTiddler(oldUsageExample1Template.title))
            // word article should be reachable from all old and new usage examples; no dublicates allowed
            const realatedUsageExamples = options.widget.wiki.filterTiddlers("[[" + wordArticleTemplate.title + "]tagging[]tag[" + context.tags.usageExample + "]]");
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

    it("should create usage examples from the newExamplesBulkData if they are not exist"
        + " and link both new and existed usage examples with word article"
        + " when newExamplesBulkData is passed", () => {
            const options = utils.setupWiki();
            const context = utils.getLlsContext();
            const wordArticleTemplate = utils.createWordArticle("fakeArticle", utils.createWord("fakeWord").title, []);
            const newExamplesTag = undefined;
            const schedule = undefined;
            const idle = false;
            const oldUsageExample1Template = utils.createUsageExample("fakeUsageExample1", [wordArticleTemplate.title]);
            const newUsageExample1Original = "newUsageExample1Original";
            const newUsageExample1Translation = "newUsageExample1Translation";
            const newUsageExample2Original = "newUsageExample2Original";
            const newUsageExample2Translation = "newUsageExample2Translation";
            const newExamplesBulkDataTemplate = utils.createTemporaryUsageExampleBulkDataHolder("newExamplesBulkData",
                newUsageExample1Original + "\n" + newUsageExample2Original,
                newUsageExample1Translation + "\n" + newUsageExample2Translation);
            options.widget.wiki.addTiddler(oldUsageExample1Template);
            options.widget.wiki.addTiddler(wordArticleTemplate);
            options.widget.wiki.addTiddler(newExamplesBulkDataTemplate);
            loggerSpy.and.callThrough();
            // console.warn(options.widget.wiki.getTiddler(wordArticleTemplate.title))
            // console.warn(options.widget.wiki.getTiddler(temporaryUsageExamplesBulkTemplate.title))
            expect(messageHandler.addUsageExamplesToWordArticle(wordArticleTemplate.title, newExamplesTag, newExamplesBulkDataTemplate.title, schedule, idle, options.widget)).nothing();
            expect(Logger.alert).toHaveBeenCalledTimes(0);
            // console.warn(options.widget.wiki.getTiddler(oldUsageExample1Template.title))
            // word article should be reachable from all old and new usage examples; no dublicates allowed
            const realatedUsageExamples = options.widget.wiki.filterTiddlers("[[" + wordArticleTemplate.title + "]tagging[]tag[" + context.tags.usageExample + "]]");
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
