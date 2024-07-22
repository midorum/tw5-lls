
const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;

describe("The composeTranscriptionGroup service", () => {
    var consoleSpy;
    var loggerSpy;

    beforeEach(function () {
        consoleSpy = spyOn(console, 'log');
        loggerSpy = spyOn(Logger, 'alert');
    });

    it("should be defined", () => {
        expect(messageHandler.composeTranscriptionGroup).toBeDefined();
    })

    it("should fail if the transcriptionGroup argument does not passed", () => {
        const options = utils.setupWiki();
        const transcriptionGroup = undefined,
            targetGroup = undefined,
            transcriptions = undefined,
            mode = undefined,
            idle = true;
        const expectedMessage = "transcriptionGroup cannot be empty";
        expect(messageHandler.composeTranscriptionGroup(transcriptionGroup, targetGroup, transcriptions, mode, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail if the targetGroup argument does not passed", () => {
        const options = utils.setupWiki();
        const transcriptionGroup = "some",
            targetGroup = undefined,
            transcriptions = undefined,
            mode = undefined,
            idle = true;
        const expectedMessage = "targetGroup cannot be empty";
        expect(messageHandler.composeTranscriptionGroup(transcriptionGroup, targetGroup, transcriptions, mode, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail if the transcriptions argument does not passed", () => {
        const options = utils.setupWiki();
        const transcriptionGroup = "some",
            targetGroup = "some",
            transcriptions = undefined,
            mode = undefined,
            idle = true;
        const expectedMessage = "transcriptions cannot be empty";
        expect(messageHandler.composeTranscriptionGroup(transcriptionGroup, targetGroup, transcriptions, mode, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail if the mode argument does not passed", () => {
        const options = utils.setupWiki();
        const transcriptionGroup = "some",
            targetGroup = "some",
            transcriptions = "some",
            mode = undefined,
            idle = true;
        const expectedMessage = "mode cannot be empty";
        expect(messageHandler.composeTranscriptionGroup(transcriptionGroup, targetGroup, transcriptions, mode, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail if the transcriptionGroup argument is wrong", () => {
        const options = utils.setupWiki();
        const transcriptionGroup = "some",
            targetGroup = "some",
            transcriptions = "some",
            mode = "copy",
            idle = true;
        const expectedMessage = "wrong transcription group reference " + transcriptionGroup;
        expect(messageHandler.composeTranscriptionGroup(transcriptionGroup, targetGroup, transcriptions, mode, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail if the transcription group does not exist", () => {
        const options = utils.setupWiki();
        const context = utils.getLlsContext();
        const transcriptionGroup = context.prefixes.transcriptionGroup + "fakeTranscriptionGroup",
            targetGroup = "some",
            transcriptions = "some",
            mode = "copy",
            idle = true;
        const expectedMessage = transcriptionGroup + " does not exist";
        expect(messageHandler.composeTranscriptionGroup(transcriptionGroup, targetGroup, transcriptions, mode, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail if the targetGroup argument is wrong", () => {
        const options = utils.setupWiki();
        const context = utils.getLlsContext();
        const transcriptionGroup = context.prefixes.transcriptionGroup + "fakeTranscriptionGroup",
            targetGroup = "some",
            transcriptions = "some",
            mode = "copy",
            idle = true;
        const expectedMessage = "wrong target group reference " + targetGroup;
        options.widget.wiki.addTiddler({ title: transcriptionGroup, tags: [context.tags.transcriptionGroup] });
        expect(messageHandler.composeTranscriptionGroup(transcriptionGroup, targetGroup, transcriptions, mode, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail if the target transcription group does not exist", () => {
        const options = utils.setupWiki();
        const context = utils.getLlsContext();
        const transcriptionGroup = context.prefixes.transcriptionGroup + "fakeTranscriptionGroup",
            targetGroup = context.prefixes.transcriptionGroup + "fakeTargetTranscriptionGroup",
            transcriptions = "some",
            mode = "copy",
            idle = true;
        const expectedMessage = targetGroup + " does not exist";
        options.widget.wiki.addTiddler({ title: transcriptionGroup, tags: [context.tags.transcriptionGroup] });
        expect(messageHandler.composeTranscriptionGroup(transcriptionGroup, targetGroup, transcriptions, mode, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail if the mode argument is wrong", () => {
        const options = utils.setupWiki();
        const context = utils.getLlsContext();
        const transcriptionGroup = context.prefixes.transcriptionGroup + "fakeTranscriptionGroup",
            targetGroup = context.prefixes.transcriptionGroup + "fakeTargetTranscriptionGroup",
            transcriptions = "some",
            mode = "wrong",
            idle = true;
        const expectedMessage = "mode should be one of: copy,move";
        options.widget.wiki.addTiddler({ title: transcriptionGroup, tags: [context.tags.transcriptionGroup] });
        options.widget.wiki.addTiddler({ title: targetGroup, tags: [context.tags.transcriptionGroup] });
        expect(messageHandler.composeTranscriptionGroup(transcriptionGroup, targetGroup, transcriptions, mode, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail if the transcriptions argument is empty", () => {
        const options = utils.setupWiki();
        const context = utils.getLlsContext();
        const transcriptionGroup = context.prefixes.transcriptionGroup + "fakeTranscriptionGroup",
            targetGroup = context.prefixes.transcriptionGroup + "fakeTargetTranscriptionGroup",
            transcriptions = "",
            mode = "copy",
            idle = true;
        const expectedMessage = "transcriptions cannot be empty";
        options.widget.wiki.addTiddler({ title: transcriptionGroup, tags: [context.tags.transcriptionGroup] });
        options.widget.wiki.addTiddler({ title: targetGroup, tags: [context.tags.transcriptionGroup] });
        expect(messageHandler.composeTranscriptionGroup(transcriptionGroup, targetGroup, transcriptions, mode, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should create the target transcription group"
        + " and make copy transcriptions"
        + " and link them with the target transcription group"
        + " when mode is 'copy' and targetGroup is '_'", () => {
            const options = utils.setupWiki();
            const context = utils.getLlsContext();
            const word = utils.createWord("fakeWord");
            const transcription1 = utils.createTranscription("tr1");
            const transcription2 = utils.createTranscription("tr2");
            const transcription3 = utils.createTranscription("tr3");
            const transcription4 = utils.createTranscription("tr4");
            const transcriptionsListA = [transcription1.title, transcription3.title];
            const transcriptionsListB = [transcription2.title, transcription4.title];
            const transcriptionsListC = transcriptionsListA.concat(transcriptionsListB);
            const transcriptionGroup = utils.createTranscriptionGroup("fakeTranscriptionGroup", [word.title], transcriptionsListC);
            const targetGroup = "_";
            const transcriptions = $tw.utils.stringifyList(transcriptionsListB);
            const mode = "copy";
            const idle = false;
            const wordArticle = utils.createWordArticle("fakeWordArticle", word.title, [transcriptionGroup.title]);
            loggerSpy.and.callThrough();
            options.widget.wiki.addTiddler(word);
            options.widget.wiki.addTiddler(wordArticle);
            options.widget.wiki.addTiddler(transcriptionGroup);
            options.widget.wiki.addTiddler(transcription1);
            options.widget.wiki.addTiddler(transcription2);
            options.widget.wiki.addTiddler(transcription3);
            options.widget.wiki.addTiddler(transcription4);
            expect(messageHandler.composeTranscriptionGroup(transcriptionGroup.title, targetGroup, transcriptions, mode, idle, options.widget)).nothing();
            expect(Logger.alert).toHaveBeenCalledTimes(0);
            // word article should stay linked with old transcription group
            // console.warn(options.widget.wiki.getTiddler(wordArticle.title));
            const articleTranscriptions = options.widget.wiki.getTiddler(wordArticle.title).fields.tags
                .filter(tag => tag.startsWith(context.prefixes.transcriptionGroup));
            expect(articleTranscriptions.length).toEqual(1);
            expect(articleTranscriptions[0]).toEqual(transcriptionGroup.title);
            // the old transcription group should stay linked with all transcriptions
            // console.warn(options.widget.wiki.getTiddler(transcriptionGroup.title));
            const oldTranscriptionGroupTranscriptions = options.widget.wiki.getTiddler(transcriptionGroup.title).fields.tags
                .filter(tag => transcriptionsListC.includes(tag));
            expect(oldTranscriptionGroupTranscriptions.length).toEqual(4);
            expect(oldTranscriptionGroupTranscriptions.includes(transcription1.title));
            expect(oldTranscriptionGroupTranscriptions.includes(transcription2.title));
            expect(oldTranscriptionGroupTranscriptions.includes(transcription3.title));
            expect(oldTranscriptionGroupTranscriptions.includes(transcription4.title));
            // the new transcription group should refer to the same word
            const newTranscriptionGroup = options.widget.wiki.filterTiddlers("[[" + word.title + "]tagging[]tag[" + context.tags.transcriptionGroup + "]!compare:string:eq[" + transcriptionGroup.title + "]]")[0];
            // console.warn("newTranscriptionGroup",newTranscriptionGroup);
            expect(newTranscriptionGroup).toBeDefined();
            // the new trancsription group shoud refer to the copied tags for 'transcriptions' list
            const newTranscriptionGroupTranscriptions = options.widget.wiki.getTiddler(newTranscriptionGroup).fields.tags
                .filter(tag => tag.startsWith(context.prefixes.wordTranscription));
            expect(newTranscriptionGroupTranscriptions.length).toEqual(2);
            newTranscriptionGroupTranscriptions.forEach(tag => {
                // console.warn(tag);
                const createdTranscriptionTiddler = options.widget.wiki.getTiddler(tag);
                if (createdTranscriptionTiddler.fields.text === transcription2.text) {
                    expect(createdTranscriptionTiddler.fields.title).not.toEqual(transcription2.title);
                    expect(createdTranscriptionTiddler.fields.src).toEqual(transcription2.src);
                } else if (createdTranscriptionTiddler.fields.text === transcription4.text) {
                    expect(createdTranscriptionTiddler.fields.title).not.toEqual(transcription4.title);
                    expect(createdTranscriptionTiddler.fields.src).toEqual(transcription4.src);
                } else {
                    fail("redundant transcription tag: we should never reach this point");
                }
            });
        })

    it("should make copy transcriptions"
        + " and link them with the target transcription group"
        + " when mode is 'copy' and targetGroup is not '_'", () => {
            const options = utils.setupWiki();
            const context = utils.getLlsContext();
            const word = utils.createWord("fakeWord1");
            const transcription1 = utils.createTranscription("tr1");
            const transcription2 = utils.createTranscription("tr2");
            const transcription3 = utils.createTranscription("tr3");
            const transcription4 = utils.createTranscription("tr4");
            const transcriptionsListA = [transcription1.title, transcription3.title];
            const transcriptionsListB = [transcription2.title, transcription4.title];
            const transcriptionsListC = transcriptionsListA.concat(transcriptionsListB);
            const transcriptionGroup = utils.createTranscriptionGroup("fakeTranscriptionGroup", [word.title], transcriptionsListC);
            const targetGroup = utils.createTranscriptionGroup("targetTranscriptionGroup", [word.title], []);
            const transcriptions = $tw.utils.stringifyList(transcriptionsListB);
            const mode = "copy";
            const idle = false;
            const wordArticle = utils.createWordArticle("fakeWordArticle", word.title, [transcriptionGroup.title]);
            loggerSpy.and.callThrough();
            options.widget.wiki.addTiddler(word);
            options.widget.wiki.addTiddler(wordArticle);
            options.widget.wiki.addTiddler(transcriptionGroup);
            options.widget.wiki.addTiddler(transcription1);
            options.widget.wiki.addTiddler(transcription2);
            options.widget.wiki.addTiddler(transcription3);
            options.widget.wiki.addTiddler(transcription4);
            options.widget.wiki.addTiddler(targetGroup);
            expect(messageHandler.composeTranscriptionGroup(transcriptionGroup.title, targetGroup.title, transcriptions, mode, idle, options.widget)).nothing();
            expect(Logger.alert).toHaveBeenCalledTimes(0);
            // word article should stay linked with old transcription group
            // console.warn(options.widget.wiki.getTiddler(wordArticle.title));
            const articleTranscriptions = options.widget.wiki.getTiddler(wordArticle.title).fields.tags
                .filter(tag => tag.startsWith(context.prefixes.transcriptionGroup));
            expect(articleTranscriptions.length).toEqual(1);
            expect(articleTranscriptions[0]).toEqual(transcriptionGroup.title);
            // the old transcription group should stay linked with all transcriptions
            // console.warn(options.widget.wiki.getTiddler(transcriptionGroup.title));
            const oldTranscriptionGroupTranscriptions = options.widget.wiki.getTiddler(transcriptionGroup.title).fields.tags
                .filter(tag => transcriptionsListC.includes(tag));
            expect(oldTranscriptionGroupTranscriptions.length).toEqual(4);
            expect(oldTranscriptionGroupTranscriptions.includes(transcription1.title));
            expect(oldTranscriptionGroupTranscriptions.includes(transcription2.title));
            expect(oldTranscriptionGroupTranscriptions.includes(transcription3.title));
            expect(oldTranscriptionGroupTranscriptions.includes(transcription4.title));
            // the target trancsription group shoud refer to the copied tags for 'transcriptions' list
            const targetTranscriptionGroupTranscriptions = options.widget.wiki.getTiddler(targetGroup.title).fields.tags
                .filter(tag => tag.startsWith(context.prefixes.wordTranscription));
            expect(targetTranscriptionGroupTranscriptions.length).toEqual(2);
            targetTranscriptionGroupTranscriptions.forEach(tag => {
                // console.warn("targetGroup tag", tag);
                const createdTranscriptionTiddler = options.widget.wiki.getTiddler(tag);
                if (createdTranscriptionTiddler.fields.text === transcription2.text) {
                    expect(createdTranscriptionTiddler.fields.title).not.toEqual(transcription2.title);
                    expect(createdTranscriptionTiddler.fields.src).toEqual(transcription2.src);
                } else if (createdTranscriptionTiddler.fields.text === transcription4.text) {
                    expect(createdTranscriptionTiddler.fields.title).not.toEqual(transcription4.title);
                    expect(createdTranscriptionTiddler.fields.src).toEqual(transcription4.src);
                } else {
                    fail("redundant transcription tag: we should never reach this point");
                }
            });
        })

    it("should create the target transcription group"
        + " and detach the transcriptions from old transcription group"
        + " and attach them to the target transcription group"
        + " when mode is 'move' and targetGroup is '_'", () => {
            const options = utils.setupWiki();
            const context = utils.getLlsContext();
            const word = utils.createWord("fakeWord");
            const transcription1 = utils.createTranscription("tr1");
            const transcription2 = utils.createTranscription("tr2");
            const transcription3 = utils.createTranscription("tr3");
            const transcription4 = utils.createTranscription("tr4");
            const transcriptionsListA = [transcription1.title, transcription3.title];
            const transcriptionsListB = [transcription2.title, transcription4.title];
            const transcriptionsListC = transcriptionsListA.concat(transcriptionsListB);
            const transcriptionGroup = utils.createTranscriptionGroup("fakeTranscriptionGroup", [word.title], transcriptionsListC);
            const targetGroup = "_";
            const transcriptions = $tw.utils.stringifyList(transcriptionsListB);
            const mode = "move";
            const idle = false;
            const wordArticle = utils.createWordArticle("fakeWordArticle", word.title, [transcriptionGroup.title]);
            loggerSpy.and.callThrough();
            options.widget.wiki.addTiddler(word);
            options.widget.wiki.addTiddler(wordArticle);
            options.widget.wiki.addTiddler(transcriptionGroup);
            options.widget.wiki.addTiddler(transcription1);
            options.widget.wiki.addTiddler(transcription2);
            options.widget.wiki.addTiddler(transcription3);
            options.widget.wiki.addTiddler(transcription4);
            expect(messageHandler.composeTranscriptionGroup(transcriptionGroup.title, targetGroup, transcriptions, mode, idle, options.widget)).nothing();
            expect(Logger.alert).toHaveBeenCalledTimes(0);
            // word article should stay linked with old transcription group
            // console.warn(options.widget.wiki.getTiddler(wordArticle.title));
            const articleTranscriptions = options.widget.wiki.getTiddler(wordArticle.title).fields.tags
                .filter(tag => tag.startsWith(context.prefixes.transcriptionGroup));
            expect(articleTranscriptions.length).toEqual(1);
            expect(articleTranscriptions[0]).toEqual(transcriptionGroup.title);
            // the old transcription group should stay linked with transcriptions outside the 'transcriptions' list
            // console.warn(options.widget.wiki.getTiddler(transcriptionGroup.title));
            const oldTranscriptionGroupTranscriptions = options.widget.wiki.getTiddler(transcriptionGroup.title).fields.tags
                .filter(tag => transcriptionsListC.includes(tag));
            expect(oldTranscriptionGroupTranscriptions.length).toEqual(2);
            expect(oldTranscriptionGroupTranscriptions.includes(transcription1.title));
            expect(oldTranscriptionGroupTranscriptions.includes(transcription3.title));
            // the new transcription group should refer to the same word
            const newTranscriptionGroup = options.widget.wiki.filterTiddlers("[[" + word.title + "]tagging[]tag[" + context.tags.transcriptionGroup + "]!compare:string:eq[" + transcriptionGroup.title + "]]")[0];
            // console.warn(newTranscriptionGroup);
            expect(newTranscriptionGroup).toBeDefined();
            // the new trancsription group shoud refer to the copied tags for 'transcriptions' list
            const newTranscriptionGroupTranscriptions = options.widget.wiki.getTiddler(newTranscriptionGroup).fields.tags
                .filter(tag => tag.startsWith(context.prefixes.wordTranscription));
            expect(newTranscriptionGroupTranscriptions.length).toEqual(2);
            newTranscriptionGroupTranscriptions.forEach(tag => {
                // console.warn(tag);
                const createdTranscriptionTiddler = options.widget.wiki.getTiddler(tag);
                if (createdTranscriptionTiddler.fields.text === transcription2.text) {
                    expect(createdTranscriptionTiddler.fields.title).toEqual(transcription2.title);
                    expect(createdTranscriptionTiddler.fields.src).toEqual(transcription2.src);
                } else if (createdTranscriptionTiddler.fields.text === transcription4.text) {
                    expect(createdTranscriptionTiddler.fields.title).toEqual(transcription4.title);
                    expect(createdTranscriptionTiddler.fields.src).toEqual(transcription4.src);
                } else {
                    fail("redundant transcription tag: we should never reach this point");
                }
            });
        })

    it("should detach the transcriptions from old transcription group"
        + " and attach them to the target transcription group"
        + " when mode is 'move' and targetGroup is not '_'", () => {
            const options = utils.setupWiki();
            const context = utils.getLlsContext();
            const word = utils.createWord("fakeWord");
            const transcription1 = utils.createTranscription("tr1");
            const transcription2 = utils.createTranscription("tr2");
            const transcription3 = utils.createTranscription("tr3");
            const transcription4 = utils.createTranscription("tr4");
            const transcriptionsListA = [transcription1.title, transcription3.title];
            const transcriptionsListB = [transcription2.title, transcription4.title];
            const transcriptionsListC = transcriptionsListA.concat(transcriptionsListB);
            const transcriptionGroup = utils.createTranscriptionGroup("fakeTranscriptionGroup", [word.title], transcriptionsListC);
            const targetGroup = utils.createTranscriptionGroup("targetTranscriptionGroup", [word.title], []);
            const transcriptions = $tw.utils.stringifyList(transcriptionsListB);
            const mode = "move";
            const idle = false;
            const wordArticle = utils.createWordArticle("fakeWordArticle", word.title, [transcriptionGroup.title]);
            loggerSpy.and.callThrough();
            options.widget.wiki.addTiddler(word);
            options.widget.wiki.addTiddler(wordArticle);
            options.widget.wiki.addTiddler(transcriptionGroup);
            options.widget.wiki.addTiddler(transcription1);
            options.widget.wiki.addTiddler(transcription2);
            options.widget.wiki.addTiddler(transcription3);
            options.widget.wiki.addTiddler(transcription4);
            options.widget.wiki.addTiddler(targetGroup);
            expect(messageHandler.composeTranscriptionGroup(transcriptionGroup.title, targetGroup.title, transcriptions, mode, idle, options.widget)).nothing();
            expect(Logger.alert).toHaveBeenCalledTimes(0);
            // word article should stay linked with old transcription group
            // console.warn(options.widget.wiki.getTiddler(wordArticle.title));
            const articleTranscriptions = options.widget.wiki.getTiddler(wordArticle.title).fields.tags
                .filter(tag => tag.startsWith(context.prefixes.transcriptionGroup));
            expect(articleTranscriptions.length).toEqual(1);
            expect(articleTranscriptions[0]).toEqual(transcriptionGroup.title);
            // the old transcription group should stay linked with all transcriptions
            // console.warn(options.widget.wiki.getTiddler(transcriptionGroup.title));
            const oldTranscriptionGroupTranscriptions = options.widget.wiki.getTiddler(transcriptionGroup.title).fields.tags
                .filter(tag => transcriptionsListC.includes(tag));
            expect(oldTranscriptionGroupTranscriptions.length).toEqual(2);
            expect(oldTranscriptionGroupTranscriptions.includes(transcription1.title));
            expect(oldTranscriptionGroupTranscriptions.includes(transcription3.title));
            // the target trancsription group shoud refer to the copied tags for 'transcriptions' list
            const targetTranscriptionGroupTranscriptions = options.widget.wiki.getTiddler(targetGroup.title).fields.tags
                .filter(tag => tag.startsWith(context.prefixes.wordTranscription));
            expect(targetTranscriptionGroupTranscriptions.length).toEqual(2);
            targetTranscriptionGroupTranscriptions.forEach(tag => {
                // console.warn(tag);
                const createdTranscriptionTiddler = options.widget.wiki.getTiddler(tag);
                if (createdTranscriptionTiddler.fields.text === transcription2.text) {
                    expect(createdTranscriptionTiddler.fields.title).toEqual(transcription2.title);
                    expect(createdTranscriptionTiddler.fields.src).toEqual(transcription2.src);
                } else if (createdTranscriptionTiddler.fields.text === transcription4.text) {
                    expect(createdTranscriptionTiddler.fields.title).toEqual(transcription4.title);
                    expect(createdTranscriptionTiddler.fields.src).toEqual(transcription4.src);
                } else {
                    fail("redundant transcription tag: we should never reach this point");
                }
            });
        })

});
