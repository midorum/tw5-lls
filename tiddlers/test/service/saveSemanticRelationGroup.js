
const utils = require("test/utils").llsTestUtils;
const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
const Logger = $tw.utils.Logger.prototype;

describe("The saveSemanticRelationGroup service", () => {
    var consoleSpyLog;
    var loggerSpy;

    beforeEach(function () {
        consoleSpyLog = spyOn(console, 'log');
        loggerSpy = spyOn(Logger, 'alert');
    });

    it("should be defined", () => {
        expect(messageHandler.saveSemanticRelationGroup).toBeDefined();
    });

    it("should fail when state argument is not defined", () => {
        const options = utils.setupWiki();
        const semanticRelationType = undefined;
        const semanticRelation = undefined;
        const state = undefined;
        const wordArticle = undefined;
        const contextIndex = undefined;
        const wordListIndex = undefined;
        const wordStyleIndexPrefix = undefined;
        const log = undefined;
        const idle = true;
        const expectedMessage = "state cannot be empty";
        expect(messageHandler.saveSemanticRelationGroup(semanticRelationType, semanticRelation, state, wordArticle, contextIndex, wordListIndex, wordStyleIndexPrefix, log, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when contextIndex argument is not defined", () => {
        const options = utils.setupWiki();
        const semanticRelationType = undefined;
        const semanticRelation = undefined;
        const state = "some";
        const wordArticle = undefined;
        const contextIndex = undefined;
        const wordListIndex = undefined;
        const wordStyleIndexPrefix = undefined;
        const log = undefined;
        const idle = true;
        const expectedMessage = "contextIndex cannot be empty";
        expect(messageHandler.saveSemanticRelationGroup(semanticRelationType, semanticRelation, state, wordArticle, contextIndex, wordListIndex, wordStyleIndexPrefix, log, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when wordListIndex argument is not defined", () => {
        const options = utils.setupWiki();
        const state = "some";
        const contextIndex = "contextIndex";
        const wordListIndex = undefined;
        const semanticRelationType = undefined;
        const semanticRelation = undefined;
        const wordArticle = undefined;
        const wordStyleIndexPrefix = undefined;
        const log = undefined;
        const idle = true;
        const expectedMessage = "wordListIndex cannot be empty";
        expect(messageHandler.saveSemanticRelationGroup(semanticRelationType, semanticRelation, state, wordArticle, contextIndex, wordListIndex, wordStyleIndexPrefix, log, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when wordStyleIndexPrefix argument is not defined", () => {
        const options = utils.setupWiki();
        const state = "some";
        const contextIndex = "contextIndex";
        const wordListIndex = "wordListIndex";
        const wordStyleIndexPrefix = undefined;
        const semanticRelationType = undefined;
        const semanticRelation = undefined;
        const wordArticle = undefined;
        const log = undefined;
        const idle = true;
        const expectedMessage = "wordStyleIndexPrefix cannot be empty";
        expect(messageHandler.saveSemanticRelationGroup(semanticRelationType, semanticRelation, state, wordArticle, contextIndex, wordListIndex, wordStyleIndexPrefix, log, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when neither semanticRelation or semanticRelationType argument is defined", () => {
        const options = utils.setupWiki();
        const state = "some";
        const contextIndex = "contextIndex";
        const wordListIndex = "wordListIndex";
        const wordStyleIndexPrefix = "wordStyleIndexPrefix";
        const semanticRelationType = undefined;
        const semanticRelation = undefined;
        const wordArticle = undefined;
        const log = undefined;
        const idle = true;
        const expectedMessage = "You should specify either semanticRelation or semanticRelationType";
        expect(messageHandler.saveSemanticRelationGroup(semanticRelationType, semanticRelation, state, wordArticle, contextIndex, wordListIndex, wordStyleIndexPrefix, log, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when semanticRelationType argument is wrong", () => {
        const options = utils.setupWiki();
        const state = "some";
        const contextIndex = "contextIndex";
        const wordListIndex = "wordListIndex";
        const wordStyleIndexPrefix = "wordStyleIndexPrefix";
        const semanticRelationType = "wrong";
        const semanticRelation = undefined;
        const wordArticle = undefined;
        const log = undefined;
        const idle = true;
        const expectedMessage = "Wrong semantic relation type: " + semanticRelationType;
        expect(messageHandler.saveSemanticRelationGroup(semanticRelationType, semanticRelation, state, wordArticle, contextIndex, wordListIndex, wordStyleIndexPrefix, log, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when semanticRelation argument is wrong", () => {
        const options = utils.setupWiki();
        const state = "some";
        const contextIndex = "contextIndex";
        const wordListIndex = "wordListIndex";
        const wordStyleIndexPrefix = "wordStyleIndexPrefix";
        const semanticRelationType = undefined;
        const semanticRelation = "wrong";
        const wordArticle = undefined;
        const log = undefined;
        const idle = true;
        const expectedMessage = "Wrong semantic relation tiddler: " + semanticRelation;
        expect(messageHandler.saveSemanticRelationGroup(semanticRelationType, semanticRelation, state, wordArticle, contextIndex, wordListIndex, wordStyleIndexPrefix, log, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when wordArticle argument is wrong", () => {
        const options = utils.setupWiki();
        const state = "some";
        const contextIndex = "contextIndex";
        const wordListIndex = "wordListIndex";
        const wordStyleIndexPrefix = "wordStyleIndexPrefix";
        const semanticRelationTypeTemplate = utils.createSynonymSemanticRelationType();
        const semanticRelationType = semanticRelationTypeTemplate.title;
        const semanticRelation = undefined;
        const wordArticle = "wrong";
        const log = undefined;
        const idle = true;
        const expectedMessage = "Wrong word article tiddler: " + wordArticle;
        options.widget.wiki.addTiddler(semanticRelationTypeTemplate);
        expect(messageHandler.saveSemanticRelationGroup(semanticRelationType, semanticRelation, state, wordArticle, contextIndex, wordListIndex, wordStyleIndexPrefix, log, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when word list is not found in the state tiddler", () => {
        const options = utils.setupWiki();
        const stateTiddlerTemplate = utils.createStateTiddler("some state", {});
        const state = stateTiddlerTemplate.title;
        const contextIndex = "contextIndex";
        const wordListIndex = "wordListIndex";
        const wordStyleIndexPrefix = "wordStyleIndexPrefix";
        const semanticRelationTypeTemplate = utils.createSynonymSemanticRelationType();
        const semanticRelationType = semanticRelationTypeTemplate.title;
        const semanticRelation = undefined;
        const wordArticle = undefined;
        const log = undefined;
        const idle = true;
        const expectedMessage = "Word list not found in the state tiddler: " + state;
        options.widget.wiki.addTiddler(semanticRelationTypeTemplate);
        expect(messageHandler.saveSemanticRelationGroup(semanticRelationType, semanticRelation, state, wordArticle, contextIndex, wordListIndex, wordStyleIndexPrefix, log, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when word list does not contain at least one existing word", () => {
        const options = utils.setupWiki();
        const contextIndex = "contextIndex";
        const wordListIndex = "wordListIndex";
        const wordStyleIndexPrefix = "wordStyleIndexPrefix";
        const stateObj = {};
        stateObj[wordListIndex] = "word1 [[complex word2]] word3";
        const stateTiddlerTemplate = utils.createStateTiddler("some state", stateObj);
        const state = stateTiddlerTemplate.title;
        const semanticRelationTypeTemplate = utils.createSynonymSemanticRelationType();
        const semanticRelationType = semanticRelationTypeTemplate.title;
        const semanticRelation = undefined;
        const wordArticle = undefined;
        const log = undefined;
        const idle = true;
        const expectedMessage = "You should provide at least one exist word meaning for the semantic relation group";
        options.widget.wiki.addTiddler(stateTiddlerTemplate);
        options.widget.wiki.addTiddler(semanticRelationTypeTemplate);
        // console.warn(options.widget.wiki.getTiddler(stateTiddlerTemplate.title));
        expect(messageHandler.saveSemanticRelationGroup(semanticRelationType, semanticRelation, state, wordArticle, contextIndex, wordListIndex, wordStyleIndexPrefix, log, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when trying to link two articles of the same word", () => {
        const options = utils.setupWiki();
        const contextIndex = "contextIndex";
        const wordListIndex = "wordListIndex";
        const wordStyleIndexPrefix = "wordStyleIndexPrefix";
        const wordTemplate = utils.createWord("existingWord");
        const wordArticleTemplate = utils.createWordArticle("some", wordTemplate.title, []);
        const anotherWordArticleTemplate = utils.createWordArticle("another", wordTemplate.title, []);
        const stateObj = {};
        stateObj[wordListIndex] = "word1 [[complex word2]] word3 " + wordArticleTemplate.title + " " + anotherWordArticleTemplate.title;
        const stateTiddlerTemplate = utils.createStateTiddler("some state", stateObj);
        const state = stateTiddlerTemplate.title;
        const semanticRelationTypeTemplate = utils.createSynonymSemanticRelationType();
        const semanticRelationType = semanticRelationTypeTemplate.title;
        const semanticRelation = undefined;
        const wordArticle = undefined;
        const log = undefined;
        const idle = true;
        const expectedMessage = "Different word meanings of the same word cannot be linked with the same semantic relation group: " + wordTemplate.text;
        options.widget.wiki.addTiddler(wordTemplate);
        options.widget.wiki.addTiddler(wordArticleTemplate);
        options.widget.wiki.addTiddler(anotherWordArticleTemplate);
        options.widget.wiki.addTiddler(stateTiddlerTemplate);
        options.widget.wiki.addTiddler(semanticRelationTypeTemplate);
        // console.warn(options.widget.wiki.getTiddler(wordTemplate.title));
        // console.warn(options.widget.wiki.getTiddler(wordArticleTemplate.title));
        // console.warn(options.widget.wiki.getTiddler(stateTiddlerTemplate.title));
        expect(messageHandler.saveSemanticRelationGroup(semanticRelationType, semanticRelation, state, wordArticle, contextIndex, wordListIndex, wordStyleIndexPrefix, log, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when trying to link already linked article", () => {
        const options = utils.setupWiki();
        const contextIndex = "contextIndex";
        const wordListIndex = "wordListIndex";
        const wordStyleIndexPrefix = "wordStyleIndexPrefix";
        const wordTemplate = utils.createWord("existingWord");
        const wordArticleTemplate = utils.createWordArticle("some", wordTemplate.title, []);
        const stateObj = {};
        stateObj[wordListIndex] = "word1 [[complex word2]] word3 " + wordArticleTemplate.title;
        const stateTiddlerTemplate = utils.createStateTiddler("some state", stateObj);
        const state = stateTiddlerTemplate.title;
        const semanticRelationTypeTemplate = utils.createSynonymSemanticRelationType();
        const semanticRelationType = semanticRelationTypeTemplate.title;
        const semanticRelation = undefined;
        const wordArticle = undefined;
        const log = undefined;
        const idle = true;
        const anotherSemanticRealtionGroupTemplate = utils.createSynonymsGroup("another", [wordArticleTemplate.title]);
        const expectedMessage = "Word meaning already linked with another semantic relation group of the same type: " + wordTemplate.text;
        spyOn(console, 'error');
        options.widget.wiki.addTiddler(wordTemplate);
        options.widget.wiki.addTiddler(wordArticleTemplate);
        options.widget.wiki.addTiddler(stateTiddlerTemplate);
        options.widget.wiki.addTiddler(semanticRelationTypeTemplate);
        options.widget.wiki.addTiddler(anotherSemanticRealtionGroupTemplate);
        // console.warn(options.widget.wiki.getTiddler(wordTemplate.title));
        // console.warn(options.widget.wiki.getTiddler(wordArticleTemplate.title));
        // console.warn(options.widget.wiki.getTiddler(stateTiddlerTemplate.title));
        expect(messageHandler.saveSemanticRelationGroup(semanticRelationType, semanticRelation, state, wordArticle, contextIndex, wordListIndex, wordStyleIndexPrefix, log, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should fail when provided less than two words to create semantic group", () => {
        const options = utils.setupWiki();
        const contextIndex = "contextIndex";
        const wordListIndex = "wordListIndex";
        const wordStyleIndexPrefix = "wordStyleIndexPrefix";
        const wordTemplate = utils.createWord("existingWord");
        const wordArticleTemplate = utils.createWordArticle("some", wordTemplate.title, []);
        const stateObj = {};
        stateObj[wordListIndex] = wordArticleTemplate.title;
        const stateTiddlerTemplate = utils.createStateTiddler("some state", stateObj);
        const state = stateTiddlerTemplate.title;
        const semanticRelationTypeTemplate = utils.createSynonymSemanticRelationType();
        const semanticRelationType = semanticRelationTypeTemplate.title;
        const semanticRelation = undefined;
        const wordArticle = undefined;
        const log = undefined;
        const idle = true;
        const expectedMessage = "You should provide at least two words for the semantic relation group";
        options.widget.wiki.addTiddler(wordTemplate);
        options.widget.wiki.addTiddler(wordArticleTemplate);
        options.widget.wiki.addTiddler(stateTiddlerTemplate);
        options.widget.wiki.addTiddler(semanticRelationTypeTemplate);
        // console.warn(options.widget.wiki.getTiddler(wordTemplate.title));
        // console.warn(options.widget.wiki.getTiddler(wordArticleTemplate.title));
        // console.warn(options.widget.wiki.getTiddler(stateTiddlerTemplate.title));
        expect(messageHandler.saveSemanticRelationGroup(semanticRelationType, semanticRelation, state, wordArticle, contextIndex, wordListIndex, wordStyleIndexPrefix, log, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    })

    it("should create a new semantic relation group"
    + " when semanticRelationType argument is defined"
    + " when semanticRelation argument is not defined"
    + " and when wordArticle argument is not defined", () => {
        const options = utils.setupWiki();
        const context = utils.getLlsContext();
        const semanticRelationContextText = "semanticRelationContextText";
        const contextIndex = "contextIndex";
        const wordListIndex = "wordListIndex";
        const wordStyleIndexPrefix = "wordStyleIndexPrefix";
        const wordTemplate = utils.createWord("existingWord");
        const wordArticleTemplate = utils.createWordArticle("some", wordTemplate.title, []);
        const unknownWord1 = "unkwounWord";
        const unknownWord2 = "unknown complex word";
        const stateObj = {};
        stateObj[wordListIndex] = utils.stringifyValuesToList([unknownWord1, unknownWord2, wordArticleTemplate.title]);
        stateObj[contextIndex] = semanticRelationContextText;
        const stateTiddlerTemplate = utils.createStateTiddler("some state", stateObj);
        const state = stateTiddlerTemplate.title;
        const semanticRelationTypeTemplate = utils.createSynonymSemanticRelationType();
        const semanticRelationType = semanticRelationTypeTemplate.title;
        const semanticRelation = undefined;
        const wordArticle = undefined;
        const log = undefined;
        const idle = false;
        options.widget.wiki.addTiddler(wordTemplate);
        options.widget.wiki.addTiddler(wordArticleTemplate);
        options.widget.wiki.addTiddler(stateTiddlerTemplate);
        options.widget.wiki.addTiddler(semanticRelationTypeTemplate);
        // console.warn(options.widget.wiki.getTiddler(wordTemplate.title));
        // console.warn(options.widget.wiki.getTiddler(wordArticleTemplate.title));
        // console.warn(options.widget.wiki.getTiddler(stateTiddlerTemplate.title));
        loggerSpy.and.callThrough();
        expect(messageHandler.saveSemanticRelationGroup(semanticRelationType, semanticRelation, state, wordArticle, contextIndex, wordListIndex, wordStyleIndexPrefix, log, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(0);
        const semanticRelations = options.widget.wiki.filterTiddlers("[tag[" + context.tags.synonymsGroup + "]]");
        expect(semanticRelations.length).toEqual(1);
        const createdSemanticRelation = options.widget.wiki.getTiddler(semanticRelations[0]);
        // console.warn(createdSemanticRelation)
        expect(createdSemanticRelation).toBeDefined();
        expect(createdSemanticRelation.fields.tags.includes(wordArticleTemplate.title)).toBeTruthy();
        const semanticRealtionListField = createdSemanticRelation.fields['semanticRelationList'];
        // console.warn(semanticRealtionListField)
        expect(semanticRealtionListField.includes(wordArticleTemplate.title)).toBeTruthy();
        expect(semanticRealtionListField.includes(unknownWord1)).toBeTruthy();
        expect(semanticRealtionListField.includes(unknownWord2)).toBeTruthy();
        expect(createdSemanticRelation.fields.text).toEqual(semanticRelationContextText);
    })

    it("should create a new semantic relation group"
    + " when semanticRelationType argument is defined"
    + " when semanticRelation argument is not defined"
    + " and when wordArticle argument is defined", () => {
        const options = utils.setupWiki();
        const context = utils.getLlsContext();
        const semanticRelationContextText = "semanticRelationContextText";
        const contextIndex = "contextIndex";
        const wordListIndex = "wordListIndex";
        const wordStyleIndexPrefix = "wordStyleIndexPrefix";
        const wordTemplate = utils.createWord("existingWord");
        const wordArticleTemplate = utils.createWordArticle("some", wordTemplate.title, []);
        const unknownWord1 = "unkwounWord";
        const unknownWord2 = "unknown complex word";
        const stateObj = {};
        stateObj[wordListIndex] = utils.stringifyValuesToList([unknownWord1, unknownWord2]);
        stateObj[contextIndex] = semanticRelationContextText;
        const stateTiddlerTemplate = utils.createStateTiddler("some state", stateObj);
        const state = stateTiddlerTemplate.title;
        const semanticRelationTypeTemplate = utils.createSynonymSemanticRelationType();
        const semanticRelationType = semanticRelationTypeTemplate.title;
        const semanticRelation = undefined;
        const wordArticle = wordArticleTemplate.title;
        const log = undefined;
        const idle = false;
        options.widget.wiki.addTiddler(wordTemplate);
        options.widget.wiki.addTiddler(wordArticleTemplate);
        options.widget.wiki.addTiddler(stateTiddlerTemplate);
        options.widget.wiki.addTiddler(semanticRelationTypeTemplate);
        // console.warn(options.widget.wiki.getTiddler(wordTemplate.title));
        // console.warn(options.widget.wiki.getTiddler(wordArticleTemplate.title));
        // console.warn(options.widget.wiki.getTiddler(stateTiddlerTemplate.title));
        loggerSpy.and.callThrough();
        expect(messageHandler.saveSemanticRelationGroup(semanticRelationType, semanticRelation, state, wordArticle, contextIndex, wordListIndex, wordStyleIndexPrefix, log, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(0);
        const semanticRelations = options.widget.wiki.filterTiddlers("[tag[" + context.tags.synonymsGroup + "]]");
        expect(semanticRelations.length).toEqual(1);
        const createdSemanticRelation = options.widget.wiki.getTiddler(semanticRelations[0]);
        // console.warn(createdSemanticRelation)
        expect(createdSemanticRelation).toBeDefined();
        expect(createdSemanticRelation.fields.tags.includes(wordArticleTemplate.title)).toBeTruthy();
        const semanticRealtionListField = createdSemanticRelation.fields['semanticRelationList'];
        // console.warn(semanticRealtionListField)
        expect(semanticRealtionListField.includes(wordArticleTemplate.title)).toBeTruthy();
        expect(semanticRealtionListField.includes(unknownWord1)).toBeTruthy();
        expect(semanticRealtionListField.includes(unknownWord2)).toBeTruthy();
        expect(createdSemanticRelation.fields.text).toEqual(semanticRelationContextText);
    })

    it("should update an existing semantic relation group"
    + " when semanticRelationType argument is not defined"
    + " when semanticRelation argument is defined"
    + " and when wordArticle argument is not defined", () => {
        const options = utils.setupWiki();
        const context = utils.getLlsContext();
        const semanticRelationContextText = "semanticRelationContextText";
        const contextIndex = "contextIndex";
        const wordListIndex = "wordListIndex";
        const wordStyleIndexPrefix = "wordStyleIndexPrefix";
        const wordTemplate = utils.createWord("existingWord");
        const wordArticleTemplate = utils.createWordArticle("some", wordTemplate.title, []);
        const unknownWord1 = "unkwounWord";
        const unknownWord2 = "unknown complex word";
        const stateObj = {};
        stateObj[wordListIndex] = utils.stringifyValuesToList([unknownWord1, unknownWord2, wordArticleTemplate.title]);
        stateObj[contextIndex] = semanticRelationContextText;
        const stateTiddlerTemplate = utils.createStateTiddler("some state", stateObj);
        const state = stateTiddlerTemplate.title;
        const semanticRelationType = undefined;
        const semanticRealtionTemplate = utils.createSynonymsGroup("exist", [wordArticleTemplate.title]);
        const semanticRelation = semanticRealtionTemplate.title;
        const wordArticle = undefined;
        const log = undefined;
        const idle = false;
        options.widget.wiki.addTiddler(wordTemplate);
        options.widget.wiki.addTiddler(wordArticleTemplate);
        options.widget.wiki.addTiddler(stateTiddlerTemplate);
        options.widget.wiki.addTiddler(semanticRealtionTemplate);
        // console.warn(options.widget.wiki.getTiddler(stateTiddlerTemplate.title));
        loggerSpy.and.callThrough();
        expect(messageHandler.saveSemanticRelationGroup(semanticRelationType, semanticRelation, state, wordArticle, contextIndex, wordListIndex, wordStyleIndexPrefix, log, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(0);
        const semanticRelations = options.widget.wiki.filterTiddlers("[tag[" + context.tags.synonymsGroup + "]]");
        expect(semanticRelations.length).toEqual(1);
        const createdSemanticRelation = options.widget.wiki.getTiddler(semanticRelations[0]);
        // console.warn(createdSemanticRelation)
        expect(createdSemanticRelation).toBeDefined();
        expect(createdSemanticRelation.fields.tags.includes(wordArticleTemplate.title)).toBeTruthy();
        const semanticRealtionListField = createdSemanticRelation.fields['semanticRelationList'];
        // console.warn(semanticRealtionListField)
        expect(semanticRealtionListField.includes(wordArticleTemplate.title)).toBeTruthy();
        expect(semanticRealtionListField.includes(unknownWord1)).toBeTruthy();
        expect(semanticRealtionListField.includes(unknownWord2)).toBeTruthy();
        expect(createdSemanticRelation.fields.text).toEqual(semanticRelationContextText);
    })

    it("should update an existing semantic relation group"
    + " when semanticRelationType argument is not defined"
    + " when semanticRelation argument is defined"
    + " and when wordArticle argument is defined", () => {
        const options = utils.setupWiki();
        const context = utils.getLlsContext();
        const semanticRelationContextText = "semanticRelationContextText";
        const contextIndex = "contextIndex";
        const wordListIndex = "wordListIndex";
        const wordStyleIndexPrefix = "wordStyleIndexPrefix";
        const wordTemplate = utils.createWord("existingWord");
        const wordArticleTemplate = utils.createWordArticle("some", wordTemplate.title, []);
        const unknownWord1 = "unkwounWord";
        const unknownWord2 = "unknown complex word";
        const stateObj = {};
        stateObj[wordListIndex] = utils.stringifyValuesToList([unknownWord1, unknownWord2]);
        stateObj[contextIndex] = semanticRelationContextText;
        const stateTiddlerTemplate = utils.createStateTiddler("some state", stateObj);
        const state = stateTiddlerTemplate.title;
        const semanticRelationType = undefined;
        const semanticRealtionTemplate = utils.createSynonymsGroup("exist", [wordArticleTemplate.title]);
        const semanticRelation = semanticRealtionTemplate.title;
        const wordArticle = wordArticleTemplate.title;
        const log = undefined;
        const idle = false;
        options.widget.wiki.addTiddler(wordTemplate);
        options.widget.wiki.addTiddler(wordArticleTemplate);
        options.widget.wiki.addTiddler(stateTiddlerTemplate);
        options.widget.wiki.addTiddler(semanticRealtionTemplate);
        // console.warn(options.widget.wiki.getTiddler(stateTiddlerTemplate.title));
        loggerSpy.and.callThrough();
        expect(messageHandler.saveSemanticRelationGroup(semanticRelationType, semanticRelation, state, wordArticle, contextIndex, wordListIndex, wordStyleIndexPrefix, log, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(0);
        const semanticRelations = options.widget.wiki.filterTiddlers("[tag[" + context.tags.synonymsGroup + "]]");
        expect(semanticRelations.length).toEqual(1);
        const createdSemanticRelation = options.widget.wiki.getTiddler(semanticRelations[0]);
        // console.warn(createdSemanticRelation)
        expect(createdSemanticRelation).toBeDefined();
        expect(createdSemanticRelation.fields.tags.includes(wordArticleTemplate.title)).toBeTruthy();
        const semanticRealtionListField = createdSemanticRelation.fields['semanticRelationList'];
        // console.warn(semanticRealtionListField)
        expect(semanticRealtionListField.includes(wordArticleTemplate.title)).toBeTruthy();
        expect(semanticRealtionListField.includes(unknownWord1)).toBeTruthy();
        expect(semanticRealtionListField.includes(unknownWord2)).toBeTruthy();
        expect(createdSemanticRelation.fields.text).toEqual(semanticRelationContextText);
    })

    it("should update an existing semantic relation group"
    + " when semanticRelationType argument is not defined"
    + " when semanticRelation argument is defined"
    + " and when wordArticle argument is not defined"
    + " and should unlink old word article if it doesn't present it the state tiddler", () => {
        const options = utils.setupWiki();
        const context = utils.getLlsContext();
        const semanticRelationContextText = "semanticRelationContextText";
        const contextIndex = "contextIndex";
        const wordListIndex = "wordListIndex";
        const wordStyleIndexPrefix = "wordStyleIndexPrefix";
        const wordTemplate = utils.createWord("existingWord");
        const wordArticleTemplate = utils.createWordArticle("some", wordTemplate.title, []);
        const oldWordArticleTemplate = utils.createWordArticle("old", "some word", []);
        const unknownWord1 = "unkwounWord";
        const unknownWord2 = "unknown complex word";
        const stateObj = {};
        stateObj[wordListIndex] = utils.stringifyValuesToList([unknownWord1, unknownWord2, wordArticleTemplate.title]);
        stateObj[contextIndex] = semanticRelationContextText;
        const stateTiddlerTemplate = utils.createStateTiddler("some state", stateObj);
        const state = stateTiddlerTemplate.title;
        const semanticRelationType = undefined;
        const semanticRealtionTemplate = utils.createSynonymsGroup("exist", [oldWordArticleTemplate.title]);
        const semanticRelation = semanticRealtionTemplate.title;
        const wordArticle = undefined;
        const log = undefined;
        const idle = false;
        options.widget.wiki.addTiddler(wordTemplate);
        options.widget.wiki.addTiddler(wordArticleTemplate);
        options.widget.wiki.addTiddler(stateTiddlerTemplate);
        options.widget.wiki.addTiddler(semanticRealtionTemplate);
        // console.warn(options.widget.wiki.getTiddler(stateTiddlerTemplate.title));
        loggerSpy.and.callThrough();
        expect(messageHandler.saveSemanticRelationGroup(semanticRelationType, semanticRelation, state, wordArticle, contextIndex, wordListIndex, wordStyleIndexPrefix, log, idle, options.widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(0);
        const semanticRelations = options.widget.wiki.filterTiddlers("[tag[" + context.tags.synonymsGroup + "]]");
        expect(semanticRelations.length).toEqual(1);
        const createdSemanticRelation = options.widget.wiki.getTiddler(semanticRelations[0]);
        // console.warn(createdSemanticRelation)
        expect(createdSemanticRelation).toBeDefined();
        expect(createdSemanticRelation.fields.tags.includes(wordArticleTemplate.title)).toBeTruthy();
        const semanticRealtionListField = createdSemanticRelation.fields['semanticRelationList'];
        // console.warn(semanticRealtionListField)
        expect(semanticRealtionListField.includes(oldWordArticleTemplate.title)).toBeFalsy();
        expect(semanticRealtionListField.includes(wordArticleTemplate.title)).toBeTruthy();
        expect(semanticRealtionListField.includes(unknownWord1)).toBeTruthy();
        expect(semanticRealtionListField.includes(unknownWord2)).toBeTruthy();
        expect(createdSemanticRelation.fields.text).toEqual(semanticRelationContextText);
    })









    // xit("should fail when cannot retrieve tag for semantic relation from semanticRelationType argument", () => {
    //     const options = utils.setupWiki();
    //     const state = "some";
    //     const contextIndex = "contextIndex";
    //     const wordListIndex = "wordListIndex";
    //     const wordStyleIndexPrefix = "wordStyleIndexPrefix";
    //     const semanticRelationTypeTemplate = utils.createSynonymSemanticRelationType();
    //     const semanticRelationType = semanticRelationTypeTemplate.title;
    //     const semanticRelation = undefined;
    //     const wordArticle = undefined;
    //     const log = undefined;
    //     const idle = true;
    //     const expectedMessage = "Cannot retrieve tag for semantic relation: " + semanticRelation + "/" + semanticRelationType;
    //     options.widget.wiki.addTiddler(semanticRelationTypeTemplate);
    //     expect(messageHandler.saveSemanticRelationGroup(semanticRelationType, semanticRelation, state, wordArticle, contextIndex, wordListIndex, wordStyleIndexPrefix, log, idle, options.widget)).nothing();
    //     expect(Logger.alert).toHaveBeenCalledTimes(1);
    //     const results = Logger.alert.calls.first().args;
    //     expect(results[0]).toContain(expectedMessage);
    // })


});
