/*\
module-type: library

Utilities for test.

\*/

const llsContextCache = (function () {
    var context;
    return {
        get: function () {
            if (!context) {
                context = {
                    tags: $tw.wiki.getTiddlerData("$:/plugins/midorum/lls/data/tags", []),
                    prefixes: $tw.wiki.getTiddlerData("$:/plugins/midorum/lls/data/prefixes", [])
                };
            }
            return context;
        }
    }
})();

function setupWiki(wikiOptions) {
    wikiOptions = wikiOptions || {};
    // Create a wiki
    var wiki = new $tw.Wiki(wikiOptions);
    var tiddlers = [{
        title: "Root",
        text: "Some dummy content"
    }];
    wiki.addTiddlers(tiddlers);
    wiki.addIndexersToWiki();
    var widgetNode = wiki.makeTranscludeWidget("Root", { document: $tw.fakeDocument, parseAsInline: true });
    var container = $tw.fakeDocument.createElement("div");
    widgetNode.render(container, null);
    return {
        wiki: wiki,
        widget: widgetNode,
        contaienr: container
    };
}

function getLlsContext() {
    return llsContextCache.get();
}

function createWord(title) {
    if (!title) throw new Error("title is required");
    const context = llsContextCache.get();
    return {
        title: context.prefixes.word + title,
        text: title + "Text",
        tags: [context.tags.word]
    };
}

function createWordBySpelling(spelling) {
    if (!spelling) throw new Error("spelling is required");
    const context = llsContextCache.get();
    return {
        title: context.prefixes.word + spelling,
        text: spelling,
        tags: [context.tags.word]
    };
}

function createWordMeaning(title, partOfSpeech) {
    if (!title) throw new Error("title is required");
    if (!partOfSpeech) throw new Error("partOfSpeech is required");
    const context = llsContextCache.get();
    return {
        title: context.prefixes.wordMeaning + title,
        text: title,
        tags: [context.tags.wordMeaning, partOfSpeech]
    };
}

function createTranscription(title) {
    if (!title) throw new Error("title is required");
    const context = llsContextCache.get();
    return {
        title: context.prefixes.wordTranscription + title,
        text: title + "Text",
        src: title + "Src",
        tags: [context.tags.wordTranscription]
    };
}

function createTemporaryTranscriptionDataHolder(title, tag) {
    if (!title) throw new Error("title is required");
    if (!tag) throw new Error("tag is required");
    const context = llsContextCache.get();
    return {
        title: context.prefixes.temp + title,
        text: title + "Text",
        src: title + "Src",
        tags: [tag]
    };
}

function createTranscriptionGroup(title, words, transcriptions) {
    if (!title) throw new Error("title is required");
    if (!words) throw new Error("words is required");
    if (!transcriptions) throw new Error("transcriptions is required");
    const context = llsContextCache.get();
    return {
        title: context.prefixes.transcriptionGroup + title,
        tags: [context.tags.transcriptionGroup].concat(words).concat(transcriptions)
    };
}

function createWordArticle(title, word, transcriptionGroup, tags) {
    if (!title) throw new Error("title is required");
    if (!word) throw new Error("word is required");
    if (!transcriptionGroup) throw new Error("transcriptionGroups is required");
    const context = llsContextCache.get();
    return {
        title: context.prefixes.wordArticle + title,
        tags: [context.tags.wordArticle, word].concat(transcriptionGroup).concat(tags ? tags : [])
    };
}

function createWordArticleWithoutTranscriptionGroup(title, word) {
    if (!title) throw new Error("title is required");
    if (!word) throw new Error("word is required");
    const context = llsContextCache.get();
    return {
        title: context.prefixes.wordArticle + title,
        tags: [context.tags.wordArticle, word]
    };
}

function createUsageExample(title, references) {
    if (!title) throw new Error("title is required");
    const context = llsContextCache.get();
    return {
        title: context.prefixes.usageExample + title,
        text: title + "Notes",
        original: title + "Original",
        translation: title + "Translation",
        tags: [context.tags.usageExample].concat(references ? references : [])
    };
}

function createUsageExampleWithContent(title, originalText, translationText, references) {
    if (!title) throw new Error("title is required");
    if (!originalText) throw new Error("originalText is required");
    if (!translationText) throw new Error("translationText is required");
    const context = llsContextCache.get();
    return {
        title: context.prefixes.usageExample + title,
        text: originalText + "Notes",
        original: originalText,
        translation: translationText,
        tags: [context.tags.usageExample].concat(references ? references : [])
    };
}

function createTemporaryUsageExampleDataHolder(title, tag) {
    if (!title) throw new Error("title is required");
    if (!tag) throw new Error("tag is required");
    const context = llsContextCache.get();
    return {
        title: context.prefixes.temp + title,
        text: title + "Notes",
        original: title + "Original",
        translation: title + "Translation",
        tags: [tag]
    };
}

function createTemporaryUsageExampleBulkDataHolder(title, originals, translations) {
    if (!title) throw new Error("title is required");
    if (!originals) throw new Error("originals is required");
    if (!translations) throw new Error("translations is required");
    const context = llsContextCache.get();
    return {
        title: context.prefixes.temp + title,
        original: originals,
        translation: translations
    };
}

function createPartOfSpeech(title) {
    if (!title) throw new Error("title is required");
    const context = llsContextCache.get();
    return {
        title: title,
        tags: [context.tags.speechPart]
    };
}

function createUserTag(title) {
    if (!title) throw new Error("title is required");
    const context = llsContextCache.get();
    return {
        title: context.prefixes.userTag + title,
        name: title,
        description: title + "Description",
        tags: [context.tags.userTag]
    };
}

function createUserTagValue(title, tags, value) {
    if (!title) throw new Error("title is required");
    if (!tags) throw new Error("tags is required");
    const context = llsContextCache.get();
    return {
        title: context.prefixes.userTagValue + title,
        text: value,
        tags: [context.tags.userTagValue].concat(tags)
    };
}

function createStateTiddler(title, dataObj, tags) {
    if (!title) throw new Error("title is required");
    const context = llsContextCache.get();
    return {
        title: title,
        text: $tw.utils.makeTiddlerDictionary(dataObj),
        type: "application/x-tiddler-dictionary",
        tags: tags
    };
}

function createSynonymSemanticRelationType() {
    const context = llsContextCache.get();
    return {
        title: "synonym",
        tags: [context.tags.semanticRelationType]
    };
}

function createSynonymsGroup(title, tags) {
    if (!title) throw new Error("title is required");
    if (!tags) throw new Error("tags is required");
    const context = llsContextCache.get();
    return {
        title: context.prefixes.semanticRelation + title,
        tags: [context.tags.synonymsGroup].concat(tags)
    };
}

function getRule(title){
    if (!title) throw new Error("title is required");
    const context = llsContextCache.get();
    return {
        title: context.prefixes.rule + title,
        tags: [context.tags.rule],
        brief: title + "_brief",
        text: title + "_description"
    };
}

function stringifyValuesToList(valueOrValues) {
    return $tw.utils.stringifyList(valueOrValues);
}

exports.llsTestUtils = {
    setupWiki: setupWiki,
    getLlsContext: getLlsContext,
    createWord: createWord,
    createWordBySpelling: createWordBySpelling,
    createWordMeaning: createWordMeaning,
    createTranscription: createTranscription,
    createTemporaryTranscriptionDataHolder: createTemporaryTranscriptionDataHolder,
    createTranscriptionGroup: createTranscriptionGroup,
    createWordArticle: createWordArticle,
    createWordArticleWithoutTranscriptionGroup: createWordArticleWithoutTranscriptionGroup,
    createUsageExample: createUsageExample,
    createUsageExampleWithContent: createUsageExampleWithContent,
    createTemporaryUsageExampleDataHolder: createTemporaryUsageExampleDataHolder,
    createTemporaryUsageExampleBulkDataHolder: createTemporaryUsageExampleBulkDataHolder,
    createPartOfSpeech: createPartOfSpeech,
    createUserTag: createUserTag,
    createUserTagValue: createUserTagValue,
    createStateTiddler: createStateTiddler,
    createSynonymSemanticRelationType: createSynonymSemanticRelationType,
    createSynonymsGroup: createSynonymsGroup,
    stringifyValuesToList: stringifyValuesToList,
    getRule: getRule,
}
