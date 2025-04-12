/*\
module-type: library

Utilities for test.

\*/

const llsUtils = require("$:/plugins/midorum/lls/modules/utils.js").llsUtils;

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
        contaienr: container,
        push: new Pusher(wiki)
    };
}

const Pusher = function (wiki) {
    return {
        /*
        options: {
            tg: [
                {
                    transriptions: ["t1", ...],
                    wag: [
                        {
                            scheduledForward: {
                                due: 1585688400000,
                                last: 1585688390000
                            },
                            scheduledBackward: {
                                due: 1585688400000,
                                last: 1585688390000
                            }
                        }, ...
                    ]
                }, ...
            ],
            wag: [
                {
                    scheduledForward: {
                        due: 1585688400000,
                        last: 1585688390000
                    },
                    scheduledBackward: {
                        due: 1585688400000,
                        last: 1585688390000
                    }
                }, ...
            ]
        }
        */
        wordArticleGroup: function (name, options) {
            if (!name) throw new Error("name is required");
            options = options || {};
            if (!options.tg && !options.wag) throw new Error("either tg or wag array is required");
            const result = {};
            const word = createWord(name + "_w");
            wiki.addTiddler(word);
            result.word = word;
            if (options.tg) {
                result.tg = {};
                options.tg.forEach((tg, i) => {
                    const tgName = name + "_tg" + i;
                    result.tg[tgName] = {};
                    const transcriptionTitles = tg.transriptions || [tgName + "_t"];
                    const transcriptions = transcriptionTitles.map(t => createTranscription(t));
                    transcriptions.forEach(t => wiki.addTiddler(t));
                    result.tg[tgName].transcriptions = transcriptions;
                    const transcriptionGroup = createTranscriptionGroup(tgName, [word.title], transcriptionTitles);
                    wiki.addTiddler(transcriptionGroup);
                    result.tg[tgName].transcriptionGroup = transcriptionGroup;
                    if (tg.wag) {
                        result.tg[tgName].wag = {};
                        tg.wag.forEach((wa, j) => {
                            const waName = wa.title || tgName + "_wa" + j;
                            const wordArticle = createWordArticle(waName, word.title, [transcriptionGroup.title]);
                            if (wa.scheduledForward) {
                                wordArticle.tags.push("$:/srs/tags/scheduledForward");
                                if (wa.scheduledForward.due) wordArticle["srs-forward-due"] = wa.scheduledForward.due;
                                if (wa.scheduledForward.last) wordArticle["srs-forward-last"] = wa.scheduledForward.last;
                            }
                            if (wa.scheduledBackward) {
                                wordArticle.tags.push("$:/srs/tags/scheduledBackward");
                                if (wa.scheduledBackward.due) wordArticle["srs-backward-due"] = wa.scheduledBackward.due;
                                if (wa.scheduledBackward.last) wordArticle["srs-backward-last"] = wa.scheduledBackward.last;
                            }
                            wiki.addTiddler(wordArticle);
                            result.tg[tgName].wag[waName] = wordArticle;
                        });
                    }
                });
            }
            if (options.wag) {
                result.wag = {};
                options.wag.forEach((wa, j) => {
                    const waName = wa.title || name + "_wa" + j;
                    const wordArticle = createWordArticle(waName, word.title, []);
                    if (wa.scheduledForward) {
                        wordArticle.tags.push("$:/srs/tags/scheduledForward");
                        if (wa.scheduledForward.due) wordArticle["srs-forward-due"] = wa.scheduledForward.due;
                        if (wa.scheduledForward.last) wordArticle["srs-forward-last"] = wa.scheduledForward.last;
                    }
                    if (wa.scheduledBackward) {
                        wordArticle.tags.push("$:/srs/tags/scheduledBackward");
                        if (wa.scheduledBackward.due) wordArticle["srs-backward-due"] = wa.scheduledBackward.due;
                        if (wa.scheduledBackward.last) wordArticle["srs-backward-last"] = wa.scheduledBackward.last;
                    }
                    wiki.addTiddler(wordArticle);
                    result.wag[waName] = wordArticle;
                });
            }
            return result;
        },
        /*
        options: {
            transriptions: ["t1", ...],
            scheduledForward: {
                due: 1585688400000,
                last: 1585688390000
            },
            scheduledBackward: {
                due: 1585688400000,
                last: 1585688390000
            }
        }
        */
        wordArticle: function (name, options) {
            if (!name) throw new Error("name is required");
            options = options || {};
            const word = createWord(name + "_w");
            const transcriptionTitles = options.transriptions || [name + "_t"];
            const transcriptions = transcriptionTitles.map(t => createTranscription(t));
            const transcriptionGroup = createTranscriptionGroup(name + "_tg", [word.title], transcriptionTitles);
            const wordArticle = createWordArticle(name + "_wa", word.title, [transcriptionGroup.title]);
            if (options.scheduledForward) {
                wordArticle.tags.push("$:/srs/tags/scheduledForward");
                if (options.scheduledForward.due) wordArticle["srs-forward-due"] = options.scheduledForward.due;
                if (options.scheduledForward.last) wordArticle["srs-forward-last"] = options.scheduledForward.last;
            }
            if (options.scheduledBackward) {
                wordArticle.tags.push("$:/srs/tags/scheduledBackward");
                if (options.scheduledBackward.due) wordArticle["srs-backward-due"] = options.scheduledBackward.due;
                if (options.scheduledBackward.last) wordArticle["srs-backward-last"] = options.scheduledBackward.last;
            }
            wiki.addTiddler(word);
            transcriptions.forEach(t => wiki.addTiddler(t));
            wiki.addTiddler(transcriptionGroup);
            wiki.addTiddler(wordArticle);
            return {
                word: word,
                transcriptions: transcriptions,
                transcriptionGroup: transcriptionGroup,
                wordArticle: wordArticle
            };
        },
        /*
        options: {
            tags: ["t1", ...],
            scheduledForward: {
                due: 1585688400000,
                last: 1585688390000
            },
            scheduledBackward: {
                due: 1585688400000,
                last: 1585688390000
            }
        }
        */
        rule: function (name, options) {
            if (!name) throw new Error("name is required");
            options = options || {};
            const rule = getRule(name + "_r", options.tags || []);
            if (options.scheduledForward) {
                rule.tags.push("$:/srs/tags/scheduledForward");
                if (options.scheduledForward.due) rule["srs-forward-due"] = options.scheduledForward.due;
                if (options.scheduledForward.last) rule["srs-forward-last"] = options.scheduledForward.last;
            }
            if (options.scheduledBackward) {
                rule.tags.push("$:/srs/tags/scheduledBackward");
                if (options.scheduledBackward.due) rule["srs-backward-due"] = options.scheduledBackward.due;
                if (options.scheduledBackward.last) rule["srs-backward-last"] = options.scheduledBackward.last;
            }
            wiki.addTiddler(rule);
            return {
                rule: rule
            }
        },
        /*
        options: {
            tags: ["t1", ...],
            scheduledForward: {
                due: 1585688400000,
                last: 1585688390000
            },
            scheduledBackward: {
                due: 1585688400000,
                last: 1585688390000
            },
            originalText: "text",
            translationText: "text"
        }
        */
        usageExample: function (name, options) {
            if (!name) throw new Error("name is required");
            options = options || {};
            const title = name + "_ue";
            const tags = options.tags || [];
            const ue = options.originalText || options.translationText
                ? createUsageExampleWithContent(title, options.originalText, options.translationText, tags)
                : createUsageExample(title, tags);
            if (options.scheduledForward) {
                ue.tags.push("$:/srs/tags/scheduledForward");
                if (options.scheduledForward.due) ue["srs-forward-due"] = options.scheduledForward.due;
                if (options.scheduledForward.last) ue["srs-forward-last"] = options.scheduledForward.last;
            }
            if (options.scheduledBackward) {
                ue.tags.push("$:/srs/tags/scheduledBackward");
                if (options.scheduledBackward.due) ue["srs-backward-due"] = options.scheduledBackward.due;
                if (options.scheduledBackward.last) ue["srs-backward-last"] = options.scheduledBackward.last;
            }
            wiki.addTiddler(ue);
            return {
                usageExample: ue
            }
        }
    };
};


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

function getRule(title, tags) {
    if (!title) throw new Error("title is required");
    const context = llsContextCache.get();
    return {
        title: context.prefixes.rule + title,
        tags: [context.tags.rule].concat(tags ? tags : []),
        brief: title + "_brief",
        text: title + "_description"
    };
}

function stringifyValuesToList(valueOrValues) {
    return $tw.utils.stringifyList(valueOrValues);
}

function getSrsProxyWiki(wiki) { // taken from $:/plugins/midorum/srs/modules/utils.js
    if (!wiki) throw new Error("wiki is required");
    const FORWARD_DIRECTION = "forward";
    const BACKWARD_DIRECTION = "backward";
    const SRS_FORWARD_DUE_FIELD = "srs-forward-due";
    const SRS_BACKWARD_DUE_FIELD = "srs-backward-due";
    const SRS_BASE_TIME = new Date(2000, 0, 1).getTime();
    const srsTags = {
        scheduledForward: "$:/srs/tags/scheduledForward",
        scheduledBackward: "$:/srs/tags/scheduledBackward"
    };
    const wikiUtils = llsUtils.getWikiUtils(wiki);
    const getSrsData = function (tiddler) {
        const title = tiddler.getTitle();
        const tags = tiddler.getTiddlerTagsShallowCopy();
        return {
            forward: tags.includes(srsTags.scheduledForward) ? {
                due: llsUtils.parseInteger(tiddler.getTiddlerField(SRS_FORWARD_DUE_FIELD)),
                direction: FORWARD_DIRECTION,
                src: title
            } : undefined,
            backward: tags.includes(srsTags.scheduledBackward) ? {
                due: llsUtils.parseInteger(tiddler.getTiddlerField(SRS_BACKWARD_DUE_FIELD)),
                direction: BACKWARD_DIRECTION,
                src: title
            } : undefined
        };
    }
    return {
        SRS_BASE_TIME: SRS_BASE_TIME,
        getTitlesWithTag: (tag) => wiki.getTiddlersWithTag(tag),
        filterTitles: (filterString) => wiki.filterTiddlers(filterString),
        allTitles: () => wiki.allTitles(),
        allShadowTitles: () => wiki.allShadowTitles(),
        tiddlerExists: (title) => wiki.tiddlerExists(title),
        isShadowTiddler: (title) => wiki.isShadowTiddler(title),
        getTiddler: (title) => wiki.getTiddler(title),
        getSrsData: (titleOrTiddler) => getSrsData(wikiUtils.withTiddler(titleOrTiddler))
    };
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
    getSrsProxyWiki: getSrsProxyWiki
}
