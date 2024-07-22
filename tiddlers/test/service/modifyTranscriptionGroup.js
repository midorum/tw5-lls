
const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;


describe("The modifyTranscriptionGroup service", () => {
    var consoleSpy;
    var loggerSpy;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        loggerSpy = spyOn(Logger, 'alert');
    });

    it("should be defined", () => {
        expect(messageHandler.modifyTranscriptionGroup).toBeDefined();
    })

    it("should fail if not passed transcriptionGroup argument", () => {
        const options = utils.setupWiki();
        const transcriptionGroup = undefined;
        const newTranscriptionsTag = undefined;
        const idle = true;
        const expectedMessage = "transcriptionGroup cannot be empty";
        expect(messageHandler.modifyTranscriptionGroup(transcriptionGroup, newTranscriptionsTag, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail if not passed newTranscriptionsTag argument", () => {
        const options = utils.setupWiki();
        const transcriptionGroup = "some";
        const newTranscriptionsTag = undefined;
        const idle = true;
        const expectedMessage = "newTranscriptionsTag cannot be empty";
        expect(messageHandler.modifyTranscriptionGroup(transcriptionGroup, newTranscriptionsTag, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail if the transcriptionGroup does not exist", () => {
        const options = utils.setupWiki();
        const transcriptionGroup = "some";
        const newTranscriptionsTag = "some";
        const idle = true;
        const expectedMessage = transcriptionGroup + " does not exist";
        expect(messageHandler.modifyTranscriptionGroup(transcriptionGroup, newTranscriptionsTag, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should delete all old attached transcriptions"
        + " and create new transcriptions by tag"
        + " and attach them to the transcription group", () => {
            const options = utils.setupWiki();
            const context = utils.getLlsContext();
            const transcriptionGroup = context.prefixes.transcriptionGroup + "fakeTranscriptionGroup";
            const newTranscriptionsTag = "someTag";
            const oldTranscription1 = context.prefixes.wordTranscription + "someOldTranscription1";
            const oldTranscription2 = context.prefixes.wordTranscription + "someOldTranscription2";
            const newTranscription1 = "someNewTranscription1";
            const newTranscription1Text = "someNewTranscription1Text";
            const newTranscription1Src = "someNewTranscription1Src";
            const newTranscription2 = "someNewTranscription2";
            const newTranscription2Text = "someNewTranscription2Text";
            const newTranscription2Src = "someNewTranscription2Src";
            const idle = false;
            options.widget.wiki.addTiddler({ title: oldTranscription1, tags: [context.tags.wordTranscription] });
            options.widget.wiki.addTiddler({ title: oldTranscription2, tags: [context.tags.wordTranscription] });
            options.widget.wiki.addTiddler({ title: transcriptionGroup, tags: [context.tags.transcriptionGroup, oldTranscription1, oldTranscription2] });
            options.widget.wiki.addTiddler({ "title": newTranscription1, tags: [newTranscriptionsTag], text: newTranscription1Text, src: newTranscription1Src });
            options.widget.wiki.addTiddler({ "title": newTranscription2, tags: [newTranscriptionsTag], text: newTranscription2Text, src: newTranscription2Src });
            loggerSpy.and.callThrough();
            // console.warn(options.widget.wiki.getTiddler(transcriptionGroup))
            expect(messageHandler.modifyTranscriptionGroup(transcriptionGroup, newTranscriptionsTag, idle, options.widget)).nothing();
            // console.warn(options.widget.wiki.getTiddler(transcriptionGroup))
            expect(Logger.alert).toHaveBeenCalledTimes(0);
            const transcriptionGroupTiddler = options.widget.wiki.getTiddler(transcriptionGroup);
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
            expect(options.widget.wiki.getTiddler(oldTranscription1)).toBeUndefined();
            expect(options.widget.wiki.getTiddler(oldTranscription2)).toBeUndefined();
        })

});
