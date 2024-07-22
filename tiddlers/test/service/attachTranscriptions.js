
const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;

describe("The attachTranscriptions service", () => {
    var consoleSpy;
    var loggerSpy;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        loggerSpy = spyOn(Logger, 'alert');
    });

    it("should be defined", () => {
        expect(messageHandler.attachTranscriptions).toBeDefined();
    })

    it("should fail without article argument", () => {
        const options = utils.setupWiki();
        const article = undefined;
        const transcriptionGroup = undefined;
        const newTranscriptionsTag = undefined;
        const idle = true;
        const expectedMessage = "article cannot be empty";
        expect(messageHandler.attachTranscriptions(article, transcriptionGroup, newTranscriptionsTag, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail without transcriptionGroup and newTranscriptionsTag", () => {
        const options = utils.setupWiki();
        const article = "some article";
        const transcriptionGroup = undefined;
        const newTranscriptionsTag = undefined;
        const idle = true;
        const expectedMessage = "you should specify either transcriptionGroup or newTranscriptionsTag";
        expect(messageHandler.attachTranscriptions(article, transcriptionGroup, newTranscriptionsTag, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should create a new transcription group"
        + " and link it with word article"
        + " and create new transcriptions"
        + " and link them to the transcription group", () => {
            const options = utils.setupWiki();
            const context = utils.getLlsContext();
            const word = context.prefixes.word + "fakeWord";
            const wordText = context.prefixes.word + "fakeWordText";
            const article = context.prefixes.wordArticle + "fakeWordArticle";
            const transcriptionGroup = undefined;
            const newTranscriptionsTag = "someTag";
            const newTranscription1 = "someNewTranscription1";
            const newTranscription1Text = "someNewTranscription1Text";
            const newTranscription1Src = "someNewTranscription1Src";
            const newTranscription2 = "someNewTranscription2";
            const newTranscription2Text = "someNewTranscription2Text";
            const newTranscription2Src = "someNewTranscription2Src";
            const idle = false;
            options.widget.wiki.addTiddler({ "title": word, tags: [context.tags.word], text: wordText });
            options.widget.wiki.addTiddler({ "title": article, tags: [context.tags.wordArticle, word] });
            options.widget.wiki.addTiddler({ "title": newTranscription1, tags: [newTranscriptionsTag], text: newTranscription1Text, src: newTranscription1Src });
            options.widget.wiki.addTiddler({ "title": newTranscription2, tags: [newTranscriptionsTag], text: newTranscription2Text, src: newTranscription2Src });
            // loggerSpy.and.callThrough();
            expect(messageHandler.attachTranscriptions(article, transcriptionGroup, newTranscriptionsTag, idle, options.widget)).nothing();
            expect(Logger.alert).toHaveBeenCalledTimes(0);
            const articleTiddler = options.widget.wiki.getTiddler(article);
            const transcriptionGroupTag = articleTiddler.fields.tags.find(tag => tag.startsWith(context.prefixes.transcriptionGroup));
            expect(transcriptionGroupTag).toBeDefined();
            const transcriptionGroupTiddler = options.widget.wiki.getTiddler(transcriptionGroupTag);
            const transcriptionGroupLinkedWords = transcriptionGroupTiddler.fields.tags.filter(tag => tag.startsWith(context.prefixes.word));
            expect(transcriptionGroupLinkedWords.length).toEqual(1);
            transcriptionGroupLinkedWords.forEach(tag => {
                expect(tag).toEqual(word);
            });
            const transcriptionGroupTranscriptions = transcriptionGroupTiddler.fields.tags.filter(tag => tag.startsWith(context.prefixes.wordTranscription));
            expect(transcriptionGroupTranscriptions.length).toEqual(2);
            transcriptionGroupTranscriptions.forEach(tag => {
                const createdTranscriptionTiddler = options.widget.wiki.getTiddler(tag);
                if (createdTranscriptionTiddler.fields.text === newTranscription1Text) {
                    expect(createdTranscriptionTiddler.fields.src).toEqual(newTranscription1Src);
                } else if (createdTranscriptionTiddler.fields.text === newTranscription2Text) {
                    expect(createdTranscriptionTiddler.fields.src).toEqual(newTranscription2Src);
                } else {
                    fail("redundant transcription tag: we should never reach this point");
                }
            });
        })

    it("should link exist transcription group with word article", () => {
        const options = utils.setupWiki();
        const context = utils.getLlsContext();
        const newTranscriptionsTag = undefined;
        const wordTemplate = utils.createWord("fake word");
        const wordArticleTemplate = utils.createWordArticleWithoutTranscriptionGroup("fake article", wordTemplate.title);
        const transcriptionGroupTemplate = utils.createTranscriptionGroup("fake transcription group", [wordTemplate.title], []);
        const idle = false;
        options.widget.wiki.addTiddler(wordTemplate);
        options.widget.wiki.addTiddler(wordArticleTemplate);
        options.widget.wiki.addTiddler(transcriptionGroupTemplate);
        loggerSpy.and.callThrough();
        // console.warn(options.widget.wiki.getTiddler(wordArticleTemplate.title))
        expect(messageHandler.attachTranscriptions(wordArticleTemplate.title, transcriptionGroupTemplate.title, newTranscriptionsTag, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(0);
        const articleTiddler = options.widget.wiki.getTiddler(wordArticleTemplate.title);
        const transcriptionGroupTag = articleTiddler.fields.tags.find(tag => tag.startsWith(context.prefixes.transcriptionGroup));
        expect(transcriptionGroupTag).toBeDefined();
        expect(transcriptionGroupTag).toEqual(transcriptionGroupTemplate.title);
        const transcriptionGroupTiddler = options.widget.wiki.getTiddler(transcriptionGroupTag);
        const transcriptionGroupLinkedWords = transcriptionGroupTiddler.fields.tags.filter(tag => tag.startsWith(context.prefixes.word));
        expect(transcriptionGroupLinkedWords.length).toEqual(1);
        transcriptionGroupLinkedWords.forEach(tag => {
            expect(tag).toEqual(wordTemplate.title);
        });
    })

}); 