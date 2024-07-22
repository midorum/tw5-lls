
const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;

describe("The createNewArticle service", () => {
    var consoleSpy;
    var loggerSpy;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        loggerSpy = spyOn(Logger, 'alert');
    });

    it("should be defined", () => {
        expect(messageHandler.createNewArticle).toBeDefined();
    })

    it("should fail when 'word' argument does not passed", () => {
        const options = utils.setupWiki();
        const word = undefined;
        const meaning = undefined;
        const speechPart = undefined;
        const transcriptionGroup = undefined;
        const newTranscriptionsTag = undefined;
        const usageExamplesTag = undefined;
        const usageExamplesBulkData = undefined;
        const schedule = undefined;
        const idle = true;
        const expectedMessage = "You should provide word in order to create new vocabulary article";
        expect(messageHandler.createNewArticle(
            word, meaning, speechPart,
            transcriptionGroup, newTranscriptionsTag,
            usageExamplesTag, usageExamplesBulkData,
            schedule, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })


    it("should fail when 'meaning' argument does not passed", () => {
        const options = utils.setupWiki();
        const word = "some word";
        const meaning = undefined;
        const speechPart = undefined;
        const transcriptionGroup = undefined;
        const newTranscriptionsTag = undefined;
        const usageExamplesTag = undefined;
        const usageExamplesBulkData = undefined;
        const schedule = undefined;
        const idle = true;
        const expectedMessage = "You should provide word meaning in order to create new vocabulary article";
        expect(messageHandler.createNewArticle(
            word, meaning, speechPart,
            transcriptionGroup, newTranscriptionsTag,
            usageExamplesTag, usageExamplesBulkData,
            schedule, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })


    it("should fail when 'speechPart' argument does not passed", () => {
        const options = utils.setupWiki();
        const word = "some word";
        const meaning = "some meaning";
        const speechPart = undefined;
        const transcriptionGroup = undefined;
        const newTranscriptionsTag = undefined;
        const usageExamplesTag = undefined;
        const usageExamplesBulkData = undefined;
        const schedule = undefined;
        const idle = true;
        const expectedMessage = "You should provide part of speech in order to create new vocabulary article";
        expect(messageHandler.createNewArticle(
            word, meaning, speechPart,
            transcriptionGroup, newTranscriptionsTag,
            usageExamplesTag, usageExamplesBulkData,
            schedule, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should create word because it does not exist"
        + " and create meaning"
        + " and create transcription group by tag"
        + " and create word article"
        + " and create usage examples by tag"
        + " and refer word article to word"
        + " and refer transcription group to word and word article"
        + " and refer usage examples to word article"
        + " when the 'newTranscriptionsTag' is passed"
        + " and when the 'usageExamplesTag' is passed", () => {
            const options = utils.setupWiki();
            const context = utils.getLlsContext();
            const word = "some word";
            const meaning = "some meaning";
            const speechPart = "some part of speech";
            const transcriptionGroup = undefined;
            const newTranscriptionsTag = "someTagForNewTranscriptions";
            const newTranscription1 = "someNewTranscription1";
            const newTranscription2 = "someNewTranscription2";
            const usageExamplesTag = "someTagForNewUsageExamples";
            const usageExamplesBulkData = undefined;
            const schedule = undefined;
            const idle = false;
            const temporaryTranscription1Template = utils.createTemporaryTranscriptionDataHolder(newTranscription1, newTranscriptionsTag);
            const temporaryTranscription2Template = utils.createTemporaryTranscriptionDataHolder(newTranscription2, newTranscriptionsTag);
            const temporaryUsageExapmle1Template = utils.createTemporaryUsageExampleDataHolder("temporaryUsageExapmle1", usageExamplesTag);
            const temporaryUsageExapmle2Template = utils.createTemporaryUsageExampleDataHolder("temporaryUsageExapmle2", usageExamplesTag);
            options.widget.wiki.addTiddler(temporaryTranscription1Template);
            options.widget.wiki.addTiddler(temporaryTranscription2Template);
            options.widget.wiki.addTiddler(temporaryUsageExapmle1Template);
            options.widget.wiki.addTiddler(temporaryUsageExapmle2Template);
            loggerSpy.and.callThrough();
            expect(messageHandler.createNewArticle(
                word, meaning, speechPart,
                transcriptionGroup, newTranscriptionsTag,
                usageExamplesTag, usageExamplesBulkData,
                schedule, idle, options.widget)).nothing();
            expect(Logger.alert).toHaveBeenCalledTimes(0);
            // word should exist
            const createdWord = options.widget.wiki.filterTiddlers("[all[tiddlers]tag[" + context.tags.word + "]]")[0];
            expect(createdWord).toBeDefined();
            expect(options.widget.wiki.getTiddler(createdWord).fields.text).toEqual(word);
            // word article should exist and should be linked to word
            const createdWordArticle = options.widget.wiki.filterTiddlers("[[" + createdWord + "]tagging[]tag[" + context.tags.wordArticle + "]]")[0];
            // console.warn(options.widget.wiki.getTiddler(createdWordArticle));
            expect(createdWordArticle).toBeDefined();
            // word meaning should exist and should be linked to word article
            const createdWordMeaning = options.widget.wiki.filterTiddlers("[[" + createdWordArticle + "]tags[]tag[" + context.tags.wordMeaning + "]]")[0];
            // console.warn(options.widget.wiki.getTiddler(createdWordMeaning));
            expect(createdWordMeaning).toBeDefined();
            const wordMeaningInstance = options.widget.wiki.getTiddler(createdWordMeaning);
            expect(wordMeaningInstance.fields.text).toEqual(meaning);
            // word meaning should have part of speech as a tag
            expect(wordMeaningInstance.fields.tags.includes(speechPart)).toBeTruthy();
            // transcription group should exist and should be linked to word
            const createdTranscriptionGroup = options.widget.wiki.filterTiddlers("[[" + createdWord + "]tagging[]tag[" + context.tags.transcriptionGroup + "]]")[0];
            expect(createdTranscriptionGroup).toBeDefined();
            // the same tganscription group should be linked to word article
            expect(createdTranscriptionGroup).toEqual(options.widget.wiki.filterTiddlers("[[" + createdWordArticle + "]tags[]tag[" + context.tags.transcriptionGroup + "]]")[0]);
            // transcriptions should be linked to the transcription group
            const createdTranscriptions = options.widget.wiki.filterTiddlers("[[" + createdTranscriptionGroup + "]tags[]tag[" + context.tags.wordTranscription + "]]");
            expect(createdTranscriptions.length).toEqual(2);
            createdTranscriptions.forEach(title => {
                const createdTranscriptionTiddler = options.widget.wiki.getTiddler(title);
                // console.warn(createdTranscriptionTiddler);
                if (createdTranscriptionTiddler.fields.text === temporaryTranscription1Template.text) {
                    expect(createdTranscriptionTiddler.fields.src).toEqual(temporaryTranscription1Template.src);
                } else if (createdTranscriptionTiddler.fields.text === temporaryTranscription2Template.text) {
                    expect(createdTranscriptionTiddler.fields.src).toEqual(temporaryTranscription2Template.src);
                } else {
                    fail("redundant transcription tag:" + title
                        + " we should never reach this point");
                }
            });
            // usage examples should be linked to the word article
            const createdUsageExamples = options.widget.wiki.filterTiddlers("[[" + createdWordArticle + "]tagging[]tag[" + context.tags.usageExample + "]]");
            expect(createdUsageExamples.length).toEqual(2);
            createdUsageExamples.forEach(title => {
                const createdUsageExampleInstance = options.widget.wiki.getTiddler(title);
                if (createdUsageExampleInstance.fields.original === temporaryUsageExapmle1Template.original) {
                    expect(createdUsageExampleInstance.fields.translation).toEqual(temporaryUsageExapmle1Template.translation);
                } else if (createdUsageExampleInstance.fields.original === temporaryUsageExapmle2Template.original) {
                    expect(createdUsageExampleInstance.fields.translation).toEqual(temporaryUsageExapmle2Template.translation);
                } else {
                    fail("redundant usage example tag:" + title
                        + " we should never reach this point");
                }
            })
        })

    it("should create word if neccessary"
        + " and create meaning"
        + " and create word article"
        + " and create usage examples from bulk data"
        + " and refer word article to word"
        + " and refer exist transcription group to word article"
        + " and refer usage examples to word article"
        + " when the 'transcriptionGroup' is passed"
        + " and when the 'usageExamplesBulkData' is passed", () => {
            const options = utils.setupWiki();
            const context = utils.getLlsContext();
            const word = "some word";
            const wordTemplate = utils.createWordBySpelling(word);
            const meaning = "some meaning";
            const speechPart = "some part of speech";
            const transcriptionGroupTemplate = utils.createTranscriptionGroup("fakeTranscriptionGroup", [wordTemplate.title], []);
            const newTranscriptionsTag = undefined;
            const usageExamplesTag = undefined;
            const newUsageExample1Original = "newUsageExample1Original";
            const newUsageExample1Translation = "newUsageExample1Translation";
            const newUsageExample2Original = "newUsageExample2Original";
            const newUsageExample2Translation = "newUsageExample2Translation";
            const newExamplesBulkDataTemplate = utils.createTemporaryUsageExampleBulkDataHolder("newExamplesBulkData",
                newUsageExample1Original + "\n" + newUsageExample2Original,
                newUsageExample1Translation + "\n" + newUsageExample2Translation);
            const schedule = undefined;
            const idle = false;
            options.widget.wiki.addTiddler(wordTemplate);
            options.widget.wiki.addTiddler(transcriptionGroupTemplate);
            options.widget.wiki.addTiddler(newExamplesBulkDataTemplate);
            loggerSpy.and.callThrough();
            expect(messageHandler.createNewArticle(
                word, meaning, speechPart,
                transcriptionGroupTemplate.title, newTranscriptionsTag,
                usageExamplesTag, newExamplesBulkDataTemplate.title,
                schedule, idle, options.widget)).nothing();
            expect(Logger.alert).toHaveBeenCalledTimes(0);
            // word should exist
            const wordTiddler = options.widget.wiki.filterTiddlers("[all[tiddlers]tag[" + context.tags.word + "]]")[0];
            expect(wordTiddler).toBeDefined();
            expect(options.widget.wiki.getTiddler(wordTiddler).fields.text).toEqual(word);
            // word article should exist and should be linked to word
            const createdWordArticle = options.widget.wiki.filterTiddlers("[[" + wordTiddler + "]tagging[]tag[" + context.tags.wordArticle + "]]")[0];
            // console.warn(options.widget.wiki.getTiddler(createdWordArticle));
            expect(createdWordArticle).toBeDefined();
            // word meaning should exist and should be linked to word article
            const createdWordMeaning = options.widget.wiki.filterTiddlers("[[" + createdWordArticle + "]tags[]tag[" + context.tags.wordMeaning + "]]")[0];
            // console.warn(options.widget.wiki.getTiddler(createdWordMeaning));
            expect(createdWordMeaning).toBeDefined();
            const wordMeaningInstance = options.widget.wiki.getTiddler(createdWordMeaning);
            expect(wordMeaningInstance.fields.text).toEqual(meaning);
            // word meaning should have part of speech as a tag
            expect(wordMeaningInstance.fields.tags.includes(speechPart)).toBeTruthy();
            // transcription group should exist and should be linked to word
            const transcriptionGroupTiddler = options.widget.wiki.filterTiddlers("[[" + wordTiddler + "]tagging[]tag[" + context.tags.transcriptionGroup + "]]")[0];
            expect(transcriptionGroupTiddler).toBeDefined();
            // the same tganscription group should be linked to word article
            expect(transcriptionGroupTiddler).toEqual(options.widget.wiki.filterTiddlers("[[" + createdWordArticle + "]tags[]tag[" + context.tags.transcriptionGroup + "]]")[0]);
            // usage examples should be linked to the word article
            const createdUsageExamples = options.widget.wiki.filterTiddlers("[[" + createdWordArticle + "]tagging[]tag[" + context.tags.usageExample + "]]");
            expect(createdUsageExamples.length).toEqual(2);
            createdUsageExamples.forEach(title => {
                const createdUsageExampleInstance = options.widget.wiki.getTiddler(title);
                if (createdUsageExampleInstance.fields.original === newUsageExample1Original) {
                    expect(createdUsageExampleInstance.fields.translation).toEqual(newUsageExample1Translation);

                } else if (createdUsageExampleInstance.fields.original === newUsageExample2Original) {
                    expect(createdUsageExampleInstance.fields.translation).toEqual(newUsageExample2Translation);
                } else {
                    fail("redundant usage example tag:" + title
                        + " we should never reach this point");
                }
            })
        })

});
