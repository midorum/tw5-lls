/*\
title: $:/plugins/midorum/lls/modules/message-handler.js
type: application/javascript
module-type: lls-module

Handling lls messages.

\*/
(function () {

  /*jslint node: true, browser: true */
  /*global $tw: false */
  "use strict";

  const utils = require("$:/plugins/midorum/lls/modules/utils.js").llsUtils;
  const cache = require("$:/plugins/midorum/lls/modules/cache.js");

  function lookUpWordBySpelling(spelling, context) {
    return context.wikiUtils.allTitlesWithTag(context.tags.word)
      .find((title) => context.wikiUtils.withTiddler(title).getTiddlerField("text") === spelling);
  }

  function createWordIfNeccessary(word, context) {
    const foundWord = lookUpWordBySpelling(word, context);
    if (foundWord) {
      return foundWord;
    }
    const wordTitle = context.wikiUtils.generateNewInternalTitle(context.prefixes.word);
    context.wikiUtils.addTiddler({
      title: wordTitle,
      tags: [context.tags.word],
      text: word
    });
    return wordTitle;
  }

  function createMeaning(meaning, speechPart, context) {
    const meaningTitle = context.wikiUtils.generateNewInternalTitle(context.prefixes.wordMeaning);
    const tags = [context.tags.wordMeaning];
    if (speechPart) {
      tags.push(speechPart);
    }
    context.wikiUtils.addTiddler({
      title: meaningTitle,
      tags: tags,
      text: meaning
    });
    return meaningTitle;
  }

  function createNewTranscription(src, notation, context) {
    const transcriptionTitle = context.wikiUtils.generateNewInternalTitle(context.prefixes.wordTranscription);
    context.wikiUtils.addTiddler({
      title: transcriptionTitle,
      tags: [context.tags.wordTranscription],
      text: notation,
      src: src
    });
    return transcriptionTitle;
  }

  function createNewTranscriptionGroup(wordList, transcriptionList, context) {
    const transcriptionGroupTitle = context.wikiUtils.generateNewInternalTitle(context.prefixes.transcriptionGroup);
    context.wikiUtils.addTiddler({
      title: transcriptionGroupTitle,
      tags: [context.tags.transcriptionGroup].concat(wordList).concat(transcriptionList)
    });
    return transcriptionGroupTitle;
  }

  function createNewTranscriptionsFromTag(newTranscriptionsTag, context) {
    const newTranscriptions = [];
    context.wikiUtils.allTitlesWithTag(newTranscriptionsTag)
      .forEach((title) => {
        const instance = context.wikiUtils.withTiddler(title);
        const notation = utils.trimToUndefined(instance.getTiddlerField("text"));
        if (!notation) return;
        const src = utils.trimToUndefined(instance.getTiddlerField("src"));
        newTranscriptions.push(createNewTranscription(src, notation, context));
      });
    return newTranscriptions;
  }

  function createTranscriptionGroupFromTag(newTranscriptionsTag, wordTitle, context) {
    const newTranscriptions = createNewTranscriptionsFromTag(newTranscriptionsTag, context);
    if (!newTranscriptions.length) return null;
    return createNewTranscriptionGroup([wordTitle], newTranscriptions, context);
  }

  function getExistExamplesMap(context) {
    return context.wikiUtils.allTitlesWithTag(context.tags.usageExample)
      .reduce((map, title) => {
        const original = context.wikiUtils.withTiddler(title).getTiddlerField("original");
        if (!original) return map;
        map[original] = title;
        return map;
      }, {});
  }

  function createUsageExamples(usageExamplesTag, newExamplesBulkData, relatedTitle, schedule, context) {
    const existExamplesMap = getExistExamplesMap(context);
    const existExamplesUpdateMap = {};
    const set = {};
    const relates = relatedTitle ? [relatedTitle] : [];
    const usageExampleTags = [context.tags.usageExample].concat(relates);
    if (schedule) {
      if (schedule.includes("all")) {
        usageExampleTags.push(context.tags.srsScheduledForward);
        usageExampleTags.push(context.tags.srsScheduledBackward);
      } else if (schedule.includes("wordArticle")) {
        if (schedule.includes("forward")) {
          usageExampleTags.push(context.tags.srsScheduledForward);
        }
        if (schedule.includes("backward")) {
          usageExampleTags.push(context.tags.srsScheduledBackward);
        }
      }
    }
    const createUsageExampleTiddler = (original, translation, notes) => {
      context.wikiUtils.addTiddler({
        title: context.wikiUtils.generateNewInternalTitle(context.prefixes.usageExample),
        tags: usageExampleTags,
        text: notes,
        original: original,
        translation: translation
      });
      set[original] = true;
    };
    if (usageExamplesTag) {
      context.wikiUtils.allTitlesWithTag(usageExamplesTag)
        .forEach(title => {
          const instance = context.wikiUtils.withTiddler(title);
          const original = utils.trimToUndefined(instance.getTiddlerField("original"));
          if (!original || set[original]) return;
          if (existExamplesMap[original]) {
            existExamplesUpdateMap[existExamplesMap[original]] = (existExamplesUpdateMap[existExamplesMap[original]] || []).concat(relates);
            return;
          }
          const translation = utils.trimToUndefined(instance.getTiddlerField("translation"));
          if (!translation) return;
          const notes = utils.trimToUndefined(instance.getTiddlerField("text"));
          createUsageExampleTiddler(original, translation, notes);
        });
    }
    if (newExamplesBulkData) {
      const instance = context.wikiUtils.withTiddler(newExamplesBulkData);
      const originalField = instance.getTiddlerField("original");
      const translationField = instance.getTiddlerField("translation");
      if (originalField && translationField) {
        const originals = originalField.split("\n");
        const translations = translationField.split("\n");
        const maxLength = Math.max(originals.length, translations.length);
        for (let i = 0; i < maxLength; i++) {
          const original = utils.trimToUndefined(originals[i]);
          const translation = utils.trimToUndefined(translations[i]);
          if (original) {
            if (existExamplesMap[original]) {
              existExamplesUpdateMap[existExamplesMap[original]] = (existExamplesUpdateMap[existExamplesMap[original]] || []).concat(relates);
            } else if (translation && !set[original]) {
              createUsageExampleTiddler(original, translation, undefined);
            }
          }
        }
      }
    }
    Object.keys(existExamplesUpdateMap)
      .forEach(key => context.wikiUtils.withTiddler(key).doNotInvokeSequentiallyOnSameTiddler.addTagsToTiddler(existExamplesUpdateMap[key]));
  }

  function getSemanticRelationTag(semanticRelationTiddler, semanticRelationType, context) {
    if (semanticRelationTiddler.exists()) {
      return semanticRelationTiddler.getTiddlerTagsShallowCopy().find(tag => tag.startsWith(context.prefixes.semanticRelationTag));
    }
    switch (semanticRelationType) {
      case 'synonym':
        return context.tags.synonymsGroup;
      case 'antonym':
        return context.tags.antonymsGroup;
      case 'contrast':
        return context.tags.contrastGroup;
      default: // homophones uses another mechanism of linking
        return undefined;
    }
  }

  /**
   * Creates new word article
   * @param {String} word - word representation
   * @param {String} meaning - new meaning for the word
   * @param {String} speechPart - part of speech tag title
   * @param {String} transcriptionGroup - existing transcription group apropriate for this word article
   * @param {String} newTranscriptionsTag - tag that is tagging all tiddlers that contain new transcriptions apropriate for this word article
   * @param {String} usageExamplesTag - tag that is tagging all tiddlers that contain new usage examples apropriate for this word article
   */
  // tested
  exports.createNewArticle = function (word, meaning, speechPart,
    transcriptionGroup, newTranscriptionsTag,
    usageExamplesTag, usageExamplesBulkData,
    schedule, idle, widget
  ) {
    const alertMsg = "You should provide %1 in order to create new vocabulary article";
    const logger = new $tw.utils.Logger("createNewArticle");
    const context = {
      prefixes: cache.getPrefixes([]),
      tags: cache.getTags([]),
      wikiUtils: utils.getWikiUtils(widget.wiki)
    };
    word = utils.trimToUndefined(word);
    if (!word) {
      logger.alert(utils.format(alertMsg, "word"));
      return;
    }
    meaning = utils.trimToUndefined(meaning);
    if (!meaning) {
      logger.alert(utils.format(alertMsg, "word meaning"));
      return;
    }
    speechPart = utils.trimToUndefined(speechPart);
    if (!speechPart) {
      logger.alert(utils.format(alertMsg, "part of speech"));
      return;
    }
    transcriptionGroup = utils.trimToUndefined(transcriptionGroup);
    newTranscriptionsTag = utils.trimToUndefined(newTranscriptionsTag);
    usageExamplesTag = utils.trimToUndefined(usageExamplesTag);
    usageExamplesBulkData = utils.trimToUndefined(usageExamplesBulkData)
    schedule = utils.trimToUndefined(schedule)
    if (idle) {
      console.log("createNewArticle", idle, word, meaning, speechPart, transcriptionGroup, newTranscriptionsTag, usageExamplesTag, usageExamplesBulkData, schedule);
      return;
    }
    const wordTitle = createWordIfNeccessary(word, context);
    const meaningTitle = createMeaning(meaning, speechPart, context);
    const transcriptionGroupTitle = transcriptionGroup && context.wikiUtils.withTiddler(transcriptionGroup).exists()
      ? transcriptionGroup
      : createTranscriptionGroupFromTag(newTranscriptionsTag, wordTitle, context);
    // create article tiddler and tag it with word, meaning and transcription group
    const articleTitle = context.wikiUtils.generateNewInternalTitle(context.prefixes.wordArticle);
    const tags = [context.tags.wordArticle, wordTitle, meaningTitle];
    if (transcriptionGroupTitle) {
      tags.push(transcriptionGroupTitle);
    }
    if (schedule) {
      if (schedule.includes("all")) {
        tags.push(context.tags.srsScheduledForward);
        tags.push(context.tags.srsScheduledBackward);
      } else if (schedule.includes("wordArticle")) {
        if (schedule.includes("forward")) {
          tags.push(context.tags.srsScheduledForward);
        }
        if (schedule.includes("backward")) {
          tags.push(context.tags.srsScheduledBackward);
        }
      }
    }
    context.wikiUtils.addTiddler({
      title: articleTitle,
      tags: tags
    });
    createUsageExamples(usageExamplesTag, usageExamplesBulkData, articleTitle, schedule, context);
  };

  /**
   * Creates new temporary tiddler with specified tag
   * @param {String} tag - tag for identify temporary tiddler
   */
  // tested
  exports.createNewTempTiddler = function (tag, text, src, idle, widget) {
    const logger = new $tw.utils.Logger("createNewTempTiddler");
    const prefixes = cache.getPrefixes(["temp"]);
    const wikiUtils = utils.getWikiUtils(widget.wiki);
    tag = utils.trim(tag);
    if (tag === "") {
      logger.alert("Internal Error: Missing 'tag' parameter");
      return;
    }
    text = utils.trimToNull(text);
    src = utils.trimToNull(src);
    if (idle) {
      console.log("createNewTempTiddler", idle, tag, text, src);
      return;
    }
    wikiUtils.addTiddler({
      title: wikiUtils.generateNewInternalTitle(prefixes.temp),
      tags: [tag],
      text: text,
      src: src
    });
  }

  /**
   * Silently deletes temporary tiddler by title
   * @param {String} title - title to identify temporary tiddler
   * @returns 
   */
  // tested
  exports.deleteTempTiddler = function (title, idle, widget) {
    const logger = new $tw.utils.Logger("deleteTempTiddler");
    const prefixes = cache.getPrefixes(["temp"]);
    const wikiUtils = utils.getWikiUtils(widget.wiki);
    title = utils.trim(title);
    if (title === "") {
      logger.alert("Internal Error: Missing 'title' parameter");
      return;
    }
    if (!title.startsWith(prefixes.temp)) {
      logger.alert("Internal Error: You can delete only 'temp' tiddlers with this message. For others use 'tm-delete-tiddler' message.");
      return;
    }
    if (idle) {
      console.log("deleteTempTiddler", idle, title);
      return;
    }
    wikiUtils.withTiddler(title).doNotInvokeSequentiallyOnSameTiddler.deleteTiddler();
  }

  /**
   * Silently deletes all temporary tiddlers with specified tag
   * @param {String} tag - tag to identify temporary tiddlers
   */
  // tested
  exports.deleteAllTempTiddlers = function (tag, idle, widget) {
    const logger = new $tw.utils.Logger("deleteAllTempTiddlers");
    const prefixes = cache.getPrefixes(["temp"]);
    const wikiUtils = utils.getWikiUtils(widget.wiki);
    tag = utils.trim(tag);
    if (tag === "") {
      logger.alert("Internal Error: Missing 'tag' parameter");
      return;
    }
    if (idle) {
      console.log("deleteAllTempTiddlers", idle, tag);
      return;
    }
    wikiUtils.allTitlesWithTag(tag)
      .filter(title => title.startsWith(prefixes.temp))
      .forEach(title => wikiUtils.withTiddler(title).doNotInvokeSequentiallyOnSameTiddler.deleteTiddler());
  }

  // tested
  exports.detachTranscriptionGroup = function (article, transcriptionGroup, idle, widget) {
    const alertMsg = "%1 cannot be empty";
    const logger = new $tw.utils.Logger("detachTranscriptionGroup");
    const wikiUtils = utils.getWikiUtils(widget.wiki);
    article = utils.trim(article);
    if (article === "") {
      logger.alert(utils.format(alertMsg, "article"));
      return;
    }
    transcriptionGroup = utils.trim(transcriptionGroup);
    if (transcriptionGroup === "") {
      logger.alert(utils.format(alertMsg, "transcription group"));
      return;
    }
    if (idle) {
      console.log("detachTranscriptionGroup", idle, article, transcriptionGroup);
      return;
    }
    wikiUtils.withTiddler(article).doNotInvokeSequentiallyOnSameTiddler.deleteTagsToTiddler([transcriptionGroup]);
  }

  // tested
  exports.deleteTranscriptionGroup = function (ref, idle, widget) {
    const alertMsg = "%1 cannot be empty";
    const logger = new $tw.utils.Logger("deleteTranscriptionGroup");
    const context = {
      prefixes: cache.getPrefixes([]),
      tags: cache.getTags([]),
      wikiUtils: utils.getWikiUtils(widget.wiki)
    };
    ref = utils.trimToUndefined(ref);
    if (!ref) {
      logger.alert(utils.format(alertMsg, "ref"));
      return;
    }
    if (!ref.startsWith(context.prefixes.transcriptionGroup)) {
      logger.alert("You can delete only a group of transcriptions with this message");
      return;
    }
    if (idle) {
      console.log("deleteTranscriptionGroup", idle, ref);
      return;
    }
    // delete all linked transcriptions
    context.wikiUtils.filterTiddlers("[[" + ref + "]tags[]tag[" + context.tags.wordTranscription + "]]")
      .forEach(t => context.wikiUtils.withTiddler(t).doNotInvokeSequentiallyOnSameTiddler.deleteTiddler());
    // unlink transcription group from other tiddlers
    context.wikiUtils.filterTiddlers("[[" + ref + "]tagging[]]")
      .forEach(title => context.wikiUtils.withTiddler(title).doNotInvokeSequentiallyOnSameTiddler.deleteTagsToTiddler([ref]));
    // delete transcriptions group tiddler
    context.wikiUtils.withTiddler(ref).doNotInvokeSequentiallyOnSameTiddler.deleteTiddler();
  }

  // it modifies article only once
  // it does not modify transcriptionGroup
  // tested
  exports.attachTranscriptions = function (article, transcriptionGroup, newTranscriptionsTag, idle, widget) {
    const alertMsg = "%1 cannot be empty";
    const logger = new $tw.utils.Logger("attachTranscriptions");
    const context = {
      prefixes: cache.getPrefixes([]),
      tags: cache.getTags([]),
      wikiUtils: utils.getWikiUtils(widget.wiki)
    };
    article = utils.trimToUndefined(article);
    if (!article) {
      logger.alert(utils.format(alertMsg, "article"));
      return;
    }
    transcriptionGroup = utils.trimToUndefined(transcriptionGroup);
    newTranscriptionsTag = utils.trimToUndefined(newTranscriptionsTag);
    if (!transcriptionGroup && !newTranscriptionsTag) {
      logger.alert("you should specify either transcriptionGroup or newTranscriptionsTag");
      return;
    }
    if (idle) {
      console.log("attachTranscriptions", idle, article, transcriptionGroup, newTranscriptionsTag);
      return;
    }
    const articleInstance = context.wikiUtils.withTiddler(article);
    const articleTags = articleInstance.getTiddlerTagsShallowCopy();
    const getWordTitle = () => articleTags.find(tag => tag.startsWith(context.prefixes.word));
    const transcriptionGroupTitle = transcriptionGroup && context.wikiUtils.withTiddler(transcriptionGroup).exists() ? transcriptionGroup
      : createTranscriptionGroupFromTag(newTranscriptionsTag, getWordTitle(), context);
    if (transcriptionGroupTitle) {
      articleInstance.doNotInvokeSequentiallyOnSameTiddler.updateTiddler({
        tags: articleTags.concat(transcriptionGroupTitle)
      });
    }
  }

  // it modifies transcriptionGroup only once
  // tested
  exports.modifyTranscriptionGroup = function (transcriptionGroup, newTranscriptionsTag, idle, widget) {
    const alertMsg = "%1 cannot be empty";
    const logger = new $tw.utils.Logger("modifyTranscriptionGroup");
    const context = {
      prefixes: cache.getPrefixes([]),
      tags: cache.getTags([]),
      wikiUtils: utils.getWikiUtils(widget.wiki)
    };
    transcriptionGroup = utils.trimToUndefined(transcriptionGroup);
    if (!transcriptionGroup) {
      logger.alert(utils.format(alertMsg, "transcriptionGroup"));
      return;
    }
    newTranscriptionsTag = utils.trimToUndefined(newTranscriptionsTag);
    if (!newTranscriptionsTag) {
      logger.alert(utils.format(alertMsg, "newTranscriptionsTag"));
      return;
    }
    const transcriptionGroupTiddler = context.wikiUtils.withTiddler(transcriptionGroup);
    if (!transcriptionGroupTiddler.exists()) {
      logger.alert(utils.format("%1 does not exist", transcriptionGroup));
      return;
    }
    if (idle) {
      console.log("modifyTranscriptionGroup", idle, transcriptionGroup, newTranscriptionsTag);
      return;
    }
    const newTranscriptions = createNewTranscriptionsFromTag(newTranscriptionsTag, context);
    if (!newTranscriptions.length) return null;
    const allTags = transcriptionGroupTiddler.getTiddlerTagsShallowCopy();
    const oldTranscriptions = allTags.filter(tag => tag.startsWith(context.prefixes.wordTranscription));
    oldTranscriptions.forEach(wt => context.wikiUtils.withTiddler(wt).doNotInvokeSequentiallyOnSameTiddler.deleteTiddler());
    const newTags = utils.purgeArray(allTags, oldTranscriptions).concat(newTranscriptions);
    transcriptionGroupTiddler.doNotInvokeSequentiallyOnSameTiddler.updateTiddler({
      tags: newTags
    });
  }

  // it modifies transcriptionGroup only once
  // it modifies targetGroup only once
  // it does not modify transcriptions
  // tested
  exports.composeTranscriptionGroup = function (transcriptionGroup, targetGroup, transcriptions, mode, idle, widget) {
    const alertMsg = "%1 cannot be empty";
    const logger = new $tw.utils.Logger("composeTranscriptionGroup");
    const context = {
      prefixes: cache.getPrefixes([]),
      tags: cache.getTags([]),
      wikiUtils: utils.getWikiUtils(widget.wiki)
    };
    const modeCopy = "copy";
    const modeMove = "move";
    transcriptionGroup = utils.trimToUndefined(transcriptionGroup);
    if (!transcriptionGroup) {
      logger.alert(utils.format(alertMsg, "transcriptionGroup"));
      return;
    }
    targetGroup = utils.trimToUndefined(targetGroup);
    if (!targetGroup) {
      logger.alert(utils.format(alertMsg, "targetGroup"));
      return;
    }
    transcriptions = utils.trimToUndefined(transcriptions);
    if (!transcriptions) {
      logger.alert(utils.format(alertMsg, "transcriptions"));
      return;
    }
    mode = utils.trimToUndefined(mode);
    if (!mode) {
      logger.alert(utils.format(alertMsg, "mode"));
      return;
    }
    if (!transcriptionGroup.startsWith(context.prefixes.transcriptionGroup)) {
      logger.alert(utils.format("wrong transcription group reference %1", transcriptionGroup));
      return;
    }
    const transcriptionGroupTiddler = context.wikiUtils.withTiddler(transcriptionGroup);
    if (!transcriptionGroupTiddler.exists()) {
      logger.alert(utils.format("%1 does not exist", transcriptionGroup));
      return;
    }
    const targetGroupInstance = context.wikiUtils.withTiddler(targetGroup);
    if (targetGroup !== "_") {
      if (!targetGroup.startsWith(context.prefixes.transcriptionGroup)) {
        logger.alert(utils.format("wrong target group reference %1", targetGroup));
        return;
      }
      if (!targetGroupInstance.exists()) {
        logger.alert(utils.format("%1 does not exist", targetGroup));
        return;
      }
    }
    if (mode !== modeCopy && mode !== modeMove) {
      logger.alert("mode should be one of: " + [modeCopy, modeMove]);
      return;
    }
    const transcriptionList = utils.parseStringList(transcriptions, false);
    if (!transcriptionList || !transcriptionList.length) {
      logger.alert("transcription list is empty");
      return;
    }
    if (idle) {
      console.log("composeTranscriptionGroup:", idle,
        "\ntranscriptionGroup=" + transcriptionGroup,
        "\ntargetGroup=" + targetGroup,
        "\ntranscriptions=" + transcriptions,
        "\nmode=" + mode,
        "\ntranscriptionList=" + transcriptionList
      );
      return;
    }
    const transferList = mode === modeMove ? transcriptionList
      : transcriptionList.map(tr => {
        const instance = context.wikiUtils.withTiddler(tr);
        return createNewTranscription(instance.getTiddlerField("src"), instance.getTiddlerField("text"), context);
      });
    if (targetGroup === "_") {
      const linkedWords = context.wikiUtils.filterTiddlers("[[" + transcriptionGroup + "]tags[]tag[" + context.tags.word + "]]");
      createNewTranscriptionGroup(linkedWords, transferList, context);
    } else {
      targetGroupInstance.doNotInvokeSequentiallyOnSameTiddler.addTagsToTiddler(transferList);
    }
    if (mode === modeMove) {
      transcriptionGroupTiddler.doNotInvokeSequentiallyOnSameTiddler.deleteTagsToTiddler(transcriptionList);
    }
  }

  // tested
  exports.modifyWordSpelling = function (word, newSpelling, idle, widget) {
    const alertMsg = "%1 cannot be empty";
    const logger = new $tw.utils.Logger("modifyWordSpelling");
    const context = {
      prefixes: cache.getPrefixes([]),
      tags: cache.getTags([]),
      wikiUtils: utils.getWikiUtils(widget.wiki)
    };
    word = utils.trimToUndefined(word);
    if (!word) {
      logger.alert(utils.format(alertMsg, "word"));
      return;
    }
    newSpelling = utils.trimToUndefined(newSpelling);
    if (!newSpelling) {
      logger.alert(utils.format(alertMsg, "newSpelling"));
      return;
    }
    if (lookUpWordBySpelling(newSpelling, context)) {
      logger.alert(utils.format("The word \"%1\" already exists in the database", newSpelling));
      return;
    }
    if (idle) {
      console.log("modifyWordSpelling", idle, word, newSpelling);
      return;
    }
    context.wikiUtils.withTiddler(word).doNotInvokeSequentiallyOnSameTiddler.setTiddlerField("text", newSpelling);
  }

  // tested
  exports.modifyWordMeaning = function (ref, newMeaning, newSpeechPart, idle, widget) {
    const alertMsg = "%1 cannot be empty";
    const logger = new $tw.utils.Logger("modifyWordMeaning");
    const context = {
      prefixes: cache.getPrefixes([]),
      tags: cache.getTags([]),
      wikiUtils: utils.getWikiUtils(widget.wiki)
    };
    ref = utils.trimToUndefined(ref);
    if (!ref) {
      logger.alert(utils.format(alertMsg, "ref"));
      return;
    }
    newMeaning = utils.trimToUndefined(newMeaning);
    if (!newMeaning) {
      logger.alert(utils.format(alertMsg, "newMeaning"));
      return;
    }
    newSpeechPart = utils.trimToUndefined(newSpeechPart);
    if (!newSpeechPart) {
      logger.alert(utils.format(alertMsg, "newSpeechPart"));
      return;
    }
    const speechPartTags = context.wikiUtils.allTitlesWithTag(context.tags.speechPart);
    if (!speechPartTags.includes(newSpeechPart)) {
      logger.alert("Part of speech not found: " + newSpeechPart);
      return;
    }
    const instance = context.wikiUtils.withTiddler(ref);
    if (!instance.exists()) {
      logger.alert("Tillder not found: " + ref);
      return;
    }
    if (idle) {
      console.log("modifyWordMeaning", idle, ref, newMeaning, newSpeechPart);
      return;
    }
    const meaningTiddlerCurrentTags = instance.getTiddlerTagsShallowCopy();
    const oldSpeechPart = meaningTiddlerCurrentTags.find(tag => speechPartTags.includes(tag));
    instance.doNotInvokeSequentiallyOnSameTiddler.updateTiddler({
      text: newMeaning,
      tags: utils.purgeArray(meaningTiddlerCurrentTags, [oldSpeechPart]).concat(newSpeechPart)
    });
  }

  // tested
  exports.attachWordArticleToUsageExample = function (example, article, idle, widget) {
    const alertMsg = "%1 cannot be empty";
    const logger = new $tw.utils.Logger("attachWordArticleToUsageExample");
    const context = {
      prefixes: cache.getPrefixes([]),
      tags: cache.getTags([]),
      wikiUtils: utils.getWikiUtils(widget.wiki)
    };
    example = utils.trimToUndefined(example);
    if (!example) {
      logger.alert(utils.format(alertMsg, "example"));
      return;
    }
    article = utils.trimToUndefined(article);
    if (!article) {
      logger.alert(utils.format(alertMsg, "article"));
      return;
    }
    if (!example.startsWith(context.prefixes.usageExample)) {
      logger.alert("Wrong usage example reference: " + example);
      return;
    }
    if (!article.startsWith(context.prefixes.wordArticle)) {
      logger.alert("Wrong word article reference: " + article);
      return;
    }
    const instance = context.wikiUtils.withTiddler(example);
    if (!instance.exists()) {
      logger.alert("Usage example not found: " + example);
      return;
    }
    if (idle) {
      console.log("attachWordArticleToUsageExample", idle, example, article);
      return;
    }
    instance.doNotInvokeSequentiallyOnSameTiddler.addTagsToTiddler(article);
  }

  // tested
  exports.detachWordArticleFromUsageExample = function (example, article, idle, widget) {
    const alertMsg = "%1 cannot be empty";
    const logger = new $tw.utils.Logger("detachWordArticleFromUsageExample");
    const context = {
      prefixes: cache.getPrefixes([]),
      tags: cache.getTags([]),
      wikiUtils: utils.getWikiUtils(widget.wiki)
    };
    example = utils.trimToUndefined(example);
    if (!example) {
      logger.alert(utils.format(alertMsg, "example"));
      return;
    }
    article = utils.trimToUndefined(article);
    if (!article) {
      logger.alert(utils.format(alertMsg, "article"));
      return;
    }
    if (!example.startsWith(context.prefixes.usageExample)) {
      logger.alert("Wrong usage example reference: " + example);
      return;
    }
    if (!article.startsWith(context.prefixes.wordArticle)) {
      logger.alert("Wrong word article reference: " + article);
      return;
    }
    const instance = context.wikiUtils.withTiddler(example);
    if (!instance.exists()) {
      logger.alert("Usage example not found: " + example);
      return;
    }
    if (idle) {
      console.log("detachWordArticleFromUsageExample", idle, example, article);
      return;
    }
    instance.doNotInvokeSequentiallyOnSameTiddler.deleteTagsToTiddler([article]);
  }

  // tested
  exports.addUsageExamplesToWordArticle = function (article, newExamplesTag, newExamplesBulkData, schedule, idle, widget) {
    const alertMsg = "%1 cannot be empty";
    const logger = new $tw.utils.Logger("addUsageExamplesToWordArticle");
    const context = {
      prefixes: cache.getPrefixes([]),
      tags: cache.getTags([]),
      wikiUtils: utils.getWikiUtils(widget.wiki)
    };
    article = utils.trimToUndefined(article);
    if (!article) {
      logger.alert(utils.format(alertMsg, "article"));
      return;
    }
    newExamplesTag = utils.trimToUndefined(newExamplesTag);
    newExamplesBulkData = utils.trimToUndefined(newExamplesBulkData);
    schedule = utils.trimToUndefined(schedule);
    if (!newExamplesTag && !newExamplesBulkData) {
      logger.alert("either newExamplesTag or newExamplesBulkData should be set");
      return;
    }
    if (!article.startsWith(context.prefixes.wordArticle)) {
      logger.alert("Wrong word article reference: " + article);
      return;
    }
    if (idle) {
      console.log("addUsageExamplesToWordArticle", idle, article, newExamplesTag, newExamplesBulkData, schedule);
      return;
    }
    createUsageExamples(newExamplesTag, newExamplesBulkData, article, schedule, context);
  }

  // tested
  exports.modifyUsageExample = function (example, original, translation, idle, widget) {
    const alertMsg = "%1 cannot be empty";
    const logger = new $tw.utils.Logger("modifyUsageExample");
    const context = {
      prefixes: cache.getPrefixes([]),
      tags: cache.getTags([]),
      wikiUtils: utils.getWikiUtils(widget.wiki)
    };
    example = utils.trimToUndefined(example);
    if (!example) {
      logger.alert(utils.format(alertMsg, "example"));
      return;
    }
    original = utils.trimToUndefined(original);
    if (!original) {
      logger.alert(utils.format(alertMsg, "original"));
      return;
    }
    translation = utils.trimToUndefined(translation);
    if (!translation) {
      logger.alert(utils.format(alertMsg, "translation"));
      return;
    }
    if (!example.startsWith(context.prefixes.usageExample)) {
      logger.alert("Wrong usage example reference: " + example);
      return;
    }
    const instance = context.wikiUtils.withTiddler(example);
    if (!instance.exists()) {
      logger.alert("Usage example not found: " + example);
      return;
    }
    if (idle) {
      console.log("modifyUsageExample", idle, example, original, translation);
      return;
    }
    const fields = {};
    if (instance.getTiddlerField("original") !== original && !getExistExamplesMap(context)[original]) {
      fields["original"] = original;
    }
    if (instance.getTiddlerField("translation") !== translation) {
      fields["translation"] = translation;
    }
    if (fields["original"] || fields["translation"]) {
      instance.doNotInvokeSequentiallyOnSameTiddler.updateTiddler(fields);
    }
  }

  // tested
  exports.deleteWordArticle = function (ref, idle, widget) {
    const alertMsg = "%1 cannot be empty";
    const logger = new $tw.utils.Logger("deleteWordArticle");
    const context = {
      prefixes: cache.getPrefixes([]),
      tags: cache.getTags([]),
      wikiUtils: utils.getWikiUtils(widget.wiki)
    };
    ref = utils.trimToUndefined(ref);
    if (!ref) {
      logger.alert(utils.format(alertMsg, "ref"));
      return;
    }
    if (!ref.startsWith(context.prefixes.wordArticle)) {
      logger.alert("You can delete only a word article with this message");
      return;
    }
    const instance = context.wikiUtils.withTiddler(ref);
    if (!instance.exists()) {
      logger.alert("Word article not found: " + ref);
      return;
    }
    if (idle) {
      console.log("deleteWordArticle", idle, ref);
      return;
    }
    const tags = instance.getTiddlerTagsShallowCopy();
    // check if it is the single article for the corresponding word - if yes, abort
    const wordTitle = tags.find(tag => tag.startsWith(context.prefixes.word));
    if (wordTitle && context.wikiUtils.filterTiddlers("[[" + wordTitle + "]tagging[]tag[" + context.tags.wordArticle + "]count[]]") == 1) {
      logger.alert("You cannot delete last meaning for the word.");
      return;
    }
    // check if it is the single article for the corresponding word meaning - if yes, delete the meaning tiddler
    const wordMeaningTitle = tags.find(tag => tag.startsWith(context.prefixes.wordMeaning));
    if (wordMeaningTitle && context.wikiUtils.filterTiddlers("[[" + wordMeaningTitle + "]tagging[]tag[" + context.tags.wordArticle + "]count[]]") == 1) {
      context.wikiUtils.withTiddler(wordMeaningTitle).doNotInvokeSequentiallyOnSameTiddler.deleteTiddler();
    }
    instance.doNotInvokeSequentiallyOnSameTiddler.deleteTiddler();
    // TODO: we should delete all words article tags on other tagged entities (usage examples, user tag values and so on)
  }

  // tested
  exports.deleteUsageExample = function (usageExample, idle, widget) {
    const alertMsg = "%1 cannot be empty";
    const logger = new $tw.utils.Logger("deleteUsageExample");
    const context = {
      prefixes: cache.getPrefixes([]),
      tags: cache.getTags([]),
      wikiUtils: utils.getWikiUtils(widget.wiki)
    };
    usageExample = utils.trimToUndefined(usageExample);
    if (!usageExample) {
      logger.alert(utils.format(alertMsg, "usageExample"));
      return;
    }
    if (!usageExample.startsWith(context.prefixes.usageExample)) {
      logger.alert("You can delete only a usage example with this message");
      return;
    }
    if (idle) {
      console.log("deleteUsageExample", idle, usageExample);
      return;
    }
    context.wikiUtils.withTiddler(usageExample).doNotInvokeSequentiallyOnSameTiddler.deleteTiddler();
    // TODO: we should delete all usage example tags on other tagged entities (user tag values and so on)
  }

  // supported format
  // <spelling>_#_<pronuciation_1><br><pronuciation_2>_#_<meaning_1><br><meaning_2>_#_<usage_examle_origin_1><br><usage_examle_origin_2>_#_<usage_examle_translation_1><br><usage_examle_translation_2>_#_<similar_words_group_1><br><similar_words_group_2>_#_<notes>_#_<not_used>_#_
  // not tested
  exports.ankiImport = function (data, limit, idle, widget) {
    const alertMsg = "%1 cannot be empty";
    const logger = new $tw.utils.Logger("ankiImport");
    const context = {
      prefixes: cache.getPrefixes([]),
      tags: cache.getTags([]),
      wikiUtils: utils.getWikiUtils(widget.wiki)
    };
    data = utils.trimToUndefined(data);
    if (!data) {
      logger.alert(utils.format(alertMsg, "data"));
      return;
    }
    const limitValue = utils.parseInteger(limit);
    if (!limitValue) {
      logger.alert(utils.format(alertMsg, "limit"));
      return;
    }
    const dataTiddler = $tw.wiki.getTiddler(data);
    if (!dataTiddler) {
      logger.alert("data tiddler not found: " + data);
      return;
    }
    if (idle) {
      console.log("ankiImport", idle, data, limit, limitValue);
      return;
    }
    ///////////
    function getOrCreateResultTiddler(title, tags, type) {
      const tidler = $tw.wiki.getTiddler(title);
      if (tidler) return tidler;
      context.wikiUtils.addTiddler({
        title: title,
        tags: tags,
        type: type
      });
      return $tw.wiki.getTiddler(title);
    }
    const processedTidler = getOrCreateResultTiddler((data + "_processed"), dataTiddler.fields.tags, dataTiddler.fields.type);
    const skippedTidler = getOrCreateResultTiddler((data + "_skipped"), dataTiddler.fields.tags, dataTiddler.fields.type);
    var processedData = processedTidler.fields.text || "";
    var skippedData = skippedTidler.fields.text || "";
    function isProcessed(data) {
      return processedData.includes(data) || skippedData.includes(data);
    }
    function appendProcessedData(data) {
      processedData = processedData + "\n" + data;
    }
    function appendSkippedData(data) {
      skippedData = skippedData + "\n" + data;
    }
    function storeProcessedData() {
      context.wikiUtils.withTiddler(processedTidler).doNotInvokeSequentiallyOnSameTiddler.setTiddlerField("text", processedData);
    }
    function storeSkippedData() {
      context.wikiUtils.withTiddler(skippedTidler).doNotInvokeSequentiallyOnSameTiddler.setTiddlerField("text", skippedData);
    }
    ///////////
    const rows = dataTiddler.fields.text.split("\n");
    console.log("ankiImport: rows", rows.length);
    rows.filter(row => !isProcessed(row))
      .slice(0, limitValue)
      .forEach(row => {
        console.log("ankiImport: row", row);
        const tokens = row.split("_#_");
        console.log("ankiImport: tokens", tokens);
        const spelling = utils.trimToUndefined(tokens[0].replaceAll("<br>", " / "));
        if (!spelling) {
          console.error("spelling not found", row);
          appendSkippedData("spelling not found\n" + row);
          return;
        }
        const pronunciations = tokens[1].split("<br>");// создаем одну группу транскрипций и все статьи связываем с ней
        const meanings = tokens[2].split("<br>");// для создания значения требуется часть речи, информация о которой отсутствует - создаем без части речи, в редактор слова добавляем изменение части речи
        if (!meanings.length) {
          console.error("meanings not found", row);
          appendSkippedData("meanings not found\n" + row);
          return;
        }
        const examplesOriginal = tokens[3].split("<br>");// примеры не разобраны по значениям - связывать с первым значением
        const examplesTranslation = tokens[4].split("<br>");
        if (examplesOriginal.length !== examplesTranslation.length) {
          console.error("examples and translations do not match", row);
          appendSkippedData("examples and translations do not match\n" + row);
          return;
        }
        // попробовать сопоставить похожие слова по номеру значения, если номера нет - добавить в каждое значение с пометкой необходимости проверки
        const similarsRegexp = /^(\d+)[ -:]+(.*)/;
        const similarsMap = {};
        const similars = tokens[5].split("<br>").map(entry => {
          const match = entry.match(similarsRegexp);
          if (match) {
            return match.slice(1);
          } else {
            return [entry];
          }
        }).forEach(arr => {
          if (arr.length === 0) return;
          if (arr.length === 1) {
            const s = utils.trimToUndefined(arr[0]);
            if (s) {
              if (!similarsMap["c"]) similarsMap["c"] = s;
              else similarsMap["c"] = similarsMap["c"] + "; " + s;
            }
          } else {
            const s = utils.trimToUndefined(arr[1]);
            if (s) {
              const index = utils.parseInteger(arr[0]);
              if (!similarsMap[index]) similarsMap[index] = s;
              else similarsMap[index] = similarsMap[index] + "; " + s;
            }
          }
        });
        // заметки могут относиться к конкретному значению (антонимы, синонимы), к части речи (грамматические формы), к произношению - кладем в отдельное поле тиддлера слова, вывести поле в редактор статьи и потом будем разбирать
        const notes = utils.trimToUndefined(tokens[6].split("<br>").join("\n"));
        console.log(
          "spelling", spelling,
          "\npronunciations", pronunciations,
          "\nmeanings", meanings,
          "\nexamplesOriginal", examplesOriginal,
          "\nexamplesTranslation", examplesTranslation,
          "\nsimilarsMap", similarsMap,
          "\nnotes", notes
        );
        //////////////
        function _createNewTranscriptions(arr, context) {
          const newTranscriptions = [];
          arr.forEach(entry => {
            const tr = utils.trimToUndefined(entry);
            if (!tr) return;
            const transcriptionTitle = context.wikiUtils.generateNewInternalTitle(context.prefixes.wordTranscription);
            context.wikiUtils.addTiddler({
              title: transcriptionTitle,
              tags: [context.tags.wordTranscription],
              text: tr
            });
            newTranscriptions.push(transcriptionTitle);
          });
          return newTranscriptions;
        }
        function _createTranscriptionGroupAndGetTitle(arr, wordTitle, context) {
          // create new transcriptions
          const newTranscriptions = _createNewTranscriptions(arr, context);
          if (!newTranscriptions.length) return null;
          // create new transcription group and tag it with word and created transcriptions
          const transcriptionGroupTitle = context.wikiUtils.generateNewInternalTitle(context.prefixes.transcriptionGroup);
          context.wikiUtils.addTiddler({
            title: transcriptionGroupTitle,
            tags: [context.tags.transcriptionGroup, wordTitle].concat(newTranscriptions)
          });
          return transcriptionGroupTitle;
        }
        function _createUsageExamples(examplesOriginal, examplesTranslation, articleTitle, context) {
          if (!examplesOriginal || !examplesOriginal.length || !examplesTranslation || !examplesTranslation.length || examplesOriginal.length !== examplesTranslation.length) return;
          const existExamples = getExistExamplesMap(context);
          const set = {};
          const _createUsageExampleTiddler = (original, translation) => {
            context.wikiUtils.addTiddler({
              title: context.wikiUtils.generateNewInternalTitle(context.prefixes.usageExample),
              tags: [context.tags.usageExample, articleTitle],
              original: original,
              translation: translation
            });
            set[original] = true;
          };
          for (let i = 0; i < examplesOriginal.length; i++) {
            const original = utils.trimToUndefined(examplesOriginal[i]);
            const translation = utils.trimToUndefined(examplesTranslation[i]);
            if (original && translation && !set[original] && !existExamples[original]) {
              _createUsageExampleTiddler(original, translation);
            }
          }
        }
        ////////////
        const wordTitle = createWordIfNeccessary(spelling, context);
        if (notes) {
          context.wikiUtils.withTiddler(wordTitle).doNotInvokeSequentiallyOnSameTiddler.appendTiddlerField("notes", notes, "\n");
        }
        const transcriptionGroupTitle = _createTranscriptionGroupAndGetTitle(pronunciations, wordTitle, context);
        for (let i = 0; i < meanings.length; i++) {
          var meaning = meanings[i];
          const meaningTitle = createMeaning(meaning, undefined, context);// we have no part of speech
          const tags = [context.tags.wordArticle, wordTitle, meaningTitle, "$:/srs/tags/scheduledBackward", "$:/srs/tags/scheduledForward"];
          if (transcriptionGroupTitle) {
            tags.push(transcriptionGroupTitle);
          }
          var similarWords = "";
          if (similarsMap[i + 1]) {
            similarWords = similarWords + " (similar words to this meaning: " + similarsMap[i + 1] + ")";
          }
          if (similarsMap["c"]) {
            similarWords = similarWords + " (similar words: " + similarsMap["c"] + ")";
          }
          const articleTitle = context.wikiUtils.generateNewInternalTitle(context.prefixes.wordArticle);
          context.wikiUtils.addTiddler({
            title: articleTitle,
            tags: tags,
            similarWords: utils.trimToUndefined(similarWords)
          });
          if (i === 0) {
            _createUsageExamples(examplesOriginal, examplesTranslation, articleTitle, context);
          }
        }
        appendProcessedData(row);
      });
    storeProcessedData();
    storeSkippedData();
  }

  // supported format
  // <origin>_$_<spelling>_$_<partOfSpeech>_$_<dialect>_$_<transcription>_$_<audioType>_$_<audioSrc> 
  // data should be sorted by spelling
  // not tested
  exports.importTranscriptionsData = function (data, limit, idle, widget) {
    const alertMsg = "%1 cannot be empty";
    const logger = new $tw.utils.Logger("importTranscriptionsData");
    const context = {
      prefixes: cache.getPrefixes([]),
      tags: cache.getTags([]),
      wikiUtils: utils.getWikiUtils(widget.wiki)
    };
    data = utils.trimToUndefined(data);
    if (!data) {
      logger.alert(utils.format(alertMsg, "data"));
      return;
    }
    const limitValue = utils.parseInteger(limit);
    if (!limitValue) {
      logger.alert(utils.format(alertMsg, "limit"));
      return;
    }
    const dataTiddler = $tw.wiki.getTiddler(data);
    if (!dataTiddler) {
      logger.alert("data tiddler not found: " + data);
      return;
    }
    if (idle) {
      console.log("importTranscriptionsData", idle, data, limit, limitValue);
      return;
    }
    ///////////
    function getOrCreateResultTiddler(title, tags, type) {
      const tidler = $tw.wiki.getTiddler(title);
      if (tidler) return tidler;
      context.wikiUtils.addTiddler({
        title: title,
        tags: tags,
        type: type
      });
      return $tw.wiki.getTiddler(title);
    }
    const processedTidler = getOrCreateResultTiddler((data + "_processed"), dataTiddler.fields.tags, dataTiddler.fields.type);
    const skippedTidler = getOrCreateResultTiddler((data + "_skipped"), dataTiddler.fields.tags, dataTiddler.fields.type);
    var processedWords = (processedTidler.fields.text || "").split("\n");
    var processedRows = [];
    var skippedRows = (skippedTidler.fields.text || "").split("\n");
    function isRowProcessed(row) {
      return processedRows.includes(row) || skippedRows.includes(row);
    }
    function appendProcessedRow(row) {
      processedRows.push(row);
    }
    function isWordProcessed(spelling) {
      return processedWords.includes(spelling);
    }
    function appendProcessedWord(spelling) {
      processedWords.push(spelling);
    }
    function appendSkippedRow(row) {
      skippedRows.push(row);
    }
    function storeProcessedWords() {
      context.wikiUtils.withTiddler(processedTidler).doNotInvokeSequentiallyOnSameTiddler.setTiddlerField("text", processedWords.join("\n"));
    }
    function storeSkippedRows() {
      context.wikiUtils.withTiddler(skippedTidler).doNotInvokeSequentiallyOnSameTiddler.setTiddlerField("text", skippedRows.join("\n"));
    }
    ///////////
    const transcriptionFootprints = [];
    function createTranscriptionFootprint(transcriptionGroup, src, notation) {
      return transcriptionGroup + "_" + notation + "_" + src;
    }
    function isTranscriptionArleadyCreated(transcriptionFootprint) {
      return transcriptionFootprints.includes(transcriptionFootprint);
    }
    function addTranscriptionFootprint(transcriptionFootprint) {
      transcriptionFootprints.push(transcriptionFootprint);
    }
    function clearTranscriptionFootprints() {
      transcriptionFootprints.length = 0;
    }
    const createdTranscriptions = {};
    function appendNewTranscription(transcriptionGroupTitle, transcriptionTitle) {
      if (!createdTranscriptions[transcriptionGroupTitle]) {
        createdTranscriptions[transcriptionGroupTitle] = [];
      }
      createdTranscriptions[transcriptionGroupTitle].push(transcriptionTitle);
    }
    function storeNewTranscriptions() {
      Object.entries(createdTranscriptions).forEach(([transcriptionGroup, transcriptions]) => {
        console.log("importTranscriptionsData: storing new transcriptions", transcriptionGroup, transcriptions);
        context.wikiUtils.withTiddler(transcriptionGroup).doNotInvokeSequentiallyOnSameTiddler.addTagsToTiddler(transcriptions);
        delete createdTranscriptions[transcriptionGroup];
      });
    }
    ///////////
    var currentSpelling;
    const rows = dataTiddler.fields.text.split("\n");
    console.log("importTranscriptionsData: rows:", rows.length);
    rows.filter(row => !isRowProcessed(row))
      .slice(0, limitValue)
      .forEach(row => {
        console.log("importTranscriptionsData: row:", row);
        const tokens = row.split("_$_");
        console.log("importTranscriptionsData: tokens:", tokens);
        const spelling = utils.trimToUndefined(tokens[1]);
        if (!spelling) {
          console.error("spelling not found:", row);
          appendSkippedRow("spelling not found\n" + row);
          return;
        }
        if (isWordProcessed(spelling)) {
          console.log("word is already processed:", spelling);
          return;
        }
        if (currentSpelling !== spelling) {
          if (currentSpelling) {
            appendProcessedWord(currentSpelling);
          }
          currentSpelling = spelling;
          storeNewTranscriptions();
          clearTranscriptionFootprints();
        }
        const partOfSpeech = utils.trimToUndefined(tokens[2]);
        const dialect = utils.trimToUndefined(tokens[3]);
        const ipa = utils.trimToUndefined(tokens[4]);
        const audioSrc = utils.trimToUndefined(tokens[6]);
        if (!audioSrc) {
          console.error("audioSrc not found:", row);
          appendSkippedRow("audioSrc not found\n" + row);
          return;
        }
        const wordTiddler = lookUpWordBySpelling(spelling, context);
        if (!wordTiddler) {
          console.error("word tiddler for spelling \"" + spelling + "\" not found");
          appendSkippedRow("word tiddler not found\n" + row);
          return;
        }
        console.log("found word:", spelling, wordTiddler.fields.title);
        const transcriptionGroup = $tw.wiki.filterTiddlers("[[" + wordTiddler.fields.title + "]tagging[]tag[" + context.tags.transcriptionGroup + "]]")[0];
        if (!transcriptionGroup) {
          console.error("transcriptionGroup tiddler for spelling \"" + spelling + "\" not found");
          appendSkippedRow("transcriptionGroup tiddler not found\n" + row);
          return;
        }
        console.log("found transcription group:", transcriptionGroup);
        const existTranscriptions = $tw.wiki.filterTiddlers("[[" + transcriptionGroup + "]tags[]tag[" + context.tags.wordTranscription + "]]");
        if (existTranscriptions.some(t => context.wikiUtils.withTiddler(t).getTiddlerField("src") === audioSrc)) {
          console.log("transcription with src \"" + audioSrc + "\" already exists - skip");
          appendSkippedRow("transcription already exists\n" + row);
        } else {
          const notation = dialect || ipa ? (dialect ? dialect + " " : "") + (ipa ? ipa : "") : "[generated]";
          const transcriptionFootprint = createTranscriptionFootprint(transcriptionGroup, audioSrc, notation);
          if (!isTranscriptionArleadyCreated(transcriptionFootprint)) {
            const newTranscription = createNewTranscription(audioSrc, notation, context);
            console.log("created new transcription:", newTranscription);
            appendNewTranscription(transcriptionGroup, newTranscription);
            addTranscriptionFootprint(transcriptionFootprint);
          }
        }
        // TODO
        appendProcessedRow(row);
      });
    if (currentSpelling && !isWordProcessed(currentSpelling)) {
      appendProcessedWord(currentSpelling);
      storeNewTranscriptions();
    }
    storeProcessedWords();
    storeSkippedRows();
  }

  // tested
  exports.saveSemanticRelationGroup = function (semanticRelationType, semanticRelation, state, wordArticle, contextIndex, wordListIndex, wordStyleIndexPrefix, log, idle, widget) {
    const alertMsg = "%1 cannot be empty";
    const logger = new $tw.utils.Logger("saveSemanticRelationGroup");
    const context = {
      prefixes: cache.getPrefixes([]),
      tags: cache.getTags([]),
      wikiUtils: utils.getWikiUtils(widget.wiki)
    };
    const allowDuplicates = false;
    // validate parameters
    state = utils.trimToUndefined(state);
    if (!state) {
      logger.alert(utils.format(alertMsg, "state"));
      return;
    }
    contextIndex = utils.trimToUndefined(contextIndex);
    if (!contextIndex) {
      logger.alert(utils.format(alertMsg, "contextIndex"));
      return;
    }
    wordListIndex = utils.trimToUndefined(wordListIndex);
    if (!wordListIndex) {
      logger.alert(utils.format(alertMsg, "wordListIndex"));
      return;
    }
    wordStyleIndexPrefix = utils.trimToUndefined(wordStyleIndexPrefix);
    if (!wordStyleIndexPrefix) {
      logger.alert(utils.format(alertMsg, "wordStyleIndexPrefix"));
      return;
    }
    semanticRelationType = utils.trimToUndefined(semanticRelationType);
    if (semanticRelationType && !context.wikiUtils.filterTiddlers("[tag[" + context.tags.semanticRelationType + "]]").includes(semanticRelationType)) {
      logger.alert("Wrong semantic relation type: " + semanticRelationType);
      return;
    }
    semanticRelation = utils.trimToUndefined(semanticRelation);
    if (semanticRelation && !semanticRelation.startsWith(context.prefixes.semanticRelation)) {
      logger.alert("Wrong semantic relation tiddler: " + semanticRelation);
      return;
    }
    if (!semanticRelation && !semanticRelationType) {
      logger.alert("You should specify either semanticRelation or semanticRelationType");
      return;
    }
    wordArticle = utils.trimToUndefined(wordArticle);
    if (wordArticle && !wordArticle.startsWith(context.prefixes.wordArticle)) {
      logger.alert("Wrong word article tiddler: " + wordArticle);
      return;
    }
    const semanticRelationTiddler = context.wikiUtils.withTiddler(semanticRelation, true);
    const semanticRelationTag = getSemanticRelationTag(semanticRelationTiddler, semanticRelationType, context);
    if (!semanticRelationTag) {
      logger.alert("Cannot retrieve tag for semantic relation: " + semanticRelation + "/" + semanticRelationType);
      return;
    }
    // retrieve state data
    const stateData = context.wikiUtils.withTiddler(state).getTiddlerDataOrEmpty();
    const semanticRelationGroupContext = utils.trimToUndefined(stateData[contextIndex]);
    const wordListString = stateData[wordListIndex];
    if (!wordListString) {
      logger.alert("Word list not found in the state tiddler: " + state);
      return;
    }
    const wordList = utils.parseStringList(wordListString, allowDuplicates);
    if (!wordList) {
      logger.alert("Word list not found in the state tiddler: " + state);
      return;
    }
    if (wordArticle) {
      wordList.push(wordArticle);
    }
    // process state data
    const calculated = {
      wordArticles: {},
      unknownWords: {},
      knownWords: {},
      errors: {}
    };
    wordList.forEach(el => {
      if (el.startsWith(context.prefixes.wordArticle)) {
        const word = context.wikiUtils.filterTiddlers("[[" + el + "]tags[]tag[" + context.tags.word + "]]")[0];
        if (!word) {
          calculated.errors[el] = "Not found a word linked with word meaning: " + el;
          return;
        }
        const spelling = context.wikiUtils.withTiddler(word).getTiddlerField("text");
        if (calculated.knownWords[spelling]) {
          calculated.errors[el] = "Different word meanings of the same word cannot be linked with the same semantic relation group: " + spelling;
          return;
        }
        if (calculated.unknownWords[spelling]) {
          calculated.errors[el] = "Word can be linked with same semantic relation group only once: " + spelling;
          return;
        }
        const existSemanticRelationGroups = context.wikiUtils.filterTiddlers("[[" + el + "]tagging[]tag[" + semanticRelationTag + "]]")
          .filter(srg => srg !== semanticRelation);
        if (existSemanticRelationGroups.length !== 0) {
          const errorMsg = "ERROR: Word meaning already linked with another semantic relation group of the same type: " + spelling;
          calculated.errors[el] = errorMsg;
          console.error(errorMsg,
            "existSemanticRelationGroups:" + existSemanticRelationGroups,
            "wordArticle:" + el
          );
          return;
        }
        calculated.knownWords[spelling] = el;
        calculated.wordArticles[el] = {};
        const wordStyles = stateData[wordStyleIndexPrefix + el];
        if (wordStyles) {
          calculated.wordArticles[el]["stylesFieldName"] = context.prefixes.semanticRelationLanguageStyleFieldName + el;
          calculated.wordArticles[el]["stylesField"] = wordStyles;
        }
      } else {
        if (calculated.unknownWords[el] || calculated.knownWords[el]) {
          calculated.errors[el] = "Word can be linked with same semantic relation group only once: " + el;
          return;
        }
        calculated.unknownWords[el] = {};
        const wordStyles = stateData[wordStyleIndexPrefix + el];
        if (wordStyles) {
          calculated.unknownWords[el]["stylesFieldName"] = context.prefixes.semanticRelationLanguageStyleFieldName + el;
          calculated.unknownWords[el]["stylesField"] = wordStyles;
        }
      }
    });
    // handle errors
    const errors = Object.keys(calculated.errors);
    if (errors.length) {
      logger.alert(calculated.errors[errors[0]]);
      return;
    }
    const wordArticles = Object.keys(calculated.wordArticles);
    if (wordArticles.length < 1) {
      logger.alert("You should provide at least one exist word meaning for the semantic relation group");
      return;
    }
    const unknownWords = Object.keys(calculated.unknownWords);
    if (wordArticles.length + unknownWords.length < 2) {
      logger.alert("You should provide at least two words for the semantic relation group");
      return;
    }
    // log
    if (log && log !== "false") {
      console.log(
        "saveSemanticRelationGroup:",
        "\nstateData", stateData,
        "\nsemanticRelationGroupContext", semanticRelationGroupContext,
        "\nwordList", wordList,
        "\ncalculated", calculated
      );
    }
    if (idle && idle !== "false") {
      console.log(
        "saveSemanticRelationGroup:", idle,
        "\nsemanticRelationType", semanticRelationType,
        "\nsemanticRelation", semanticRelation,
        "\nstate", state,
        "\nwordArticle", wordArticle,
        "\ncontextIndex", contextIndex,
        "\nwordListIndex", wordListIndex,
        "\nwordStyleIndexPrefix", wordStyleIndexPrefix,
        "\nlog", log
      );
      return;
    }
    // create or update semantic relation group tiddler
    if (semanticRelationTiddler.exists()) {
      const tags = semanticRelationTiddler.getTiddlerTagsShallowCopy()
        .filter(tag => !tag.startsWith(context.prefixes.wordArticle));
      wordArticles.forEach(wa => tags.push(wa));
      const fields = {
        tags: tags,
        text: semanticRelationGroupContext,
        semanticRelationList: utils.stringifyList(wordArticles.concat(unknownWords))
      };
      semanticRelationTiddler.listFields()
        .filter(field => field.startsWith(context.prefixes.semanticRelationLanguageStyleFieldName))
        .forEach(field => fields[field] = undefined);
      wordArticles.forEach(w => {
        const value = calculated.wordArticles[w];
        if (value["stylesFieldName"]) {
          fields[value["stylesFieldName"]] = value["stylesField"];
        }
      });
      unknownWords.forEach(w => {
        const value = calculated.unknownWords[w];
        if (value["stylesFieldName"]) {
          fields[value["stylesFieldName"]] = value["stylesField"];
        }
      });
      semanticRelationTiddler.doNotInvokeSequentiallyOnSameTiddler.updateTiddler(fields);
    } else {
      const tags = [semanticRelationTag];
      wordArticles.forEach(wa => tags.push(wa));
      const fields = {
        title: context.wikiUtils.generateNewInternalTitle(context.prefixes.semanticRelation),
        tags: tags,
        text: semanticRelationGroupContext,
        semanticRelationList: utils.stringifyList(wordArticles.concat(unknownWords))
      };
      wordArticles.forEach(w => {
        const value = calculated.wordArticles[w];
        if (value["stylesFieldName"]) {
          fields[value["stylesFieldName"]] = value["stylesField"];
        }
      });
      unknownWords.forEach(w => {
        const value = calculated.unknownWords[w];
        if (value["stylesFieldName"]) {
          fields[value["stylesFieldName"]] = value["stylesField"];
        }
      });
      context.wikiUtils.addTiddler(fields);
    }
  }

  // tested
  exports.createUserTag = function (name, description, idle, widget) {
    const alertMsg = "%1 cannot be empty";
    const logger = new $tw.utils.Logger("createUserTag");
    const context = {
      prefixes: cache.getPrefixes([]),
      tags: cache.getTags([]),
      wikiUtils: utils.getWikiUtils(widget.wiki)
    };
    name = utils.trimToUndefined(name);
    if (!name) {
      logger.alert(utils.format(alertMsg, "name"));
      return;
    }
    description = utils.trimToUndefined(description);
    // check if user tag with specified title arleady exists
    if (context.wikiUtils.allTitlesWithTag(context.tags.userTag)
      .some(title => context.wikiUtils.withTiddler(title).getTiddlerField("name") === name)) {
      logger.alert("Tag with name \"" + name + "\" already exists");
      return;
    }
    if (idle) {
      console.log("createUserTag", idle, name, description);
      return;
    }
    context.wikiUtils.addTiddler({
      title: context.wikiUtils.generateNewInternalTitle(context.prefixes.userTag),
      tags: [context.tags.userTag],
      name: name,
      text: description
    });
  }

  // tested
  exports.attachUserTag = function (ref, tagRef, idle, widget) {
    const alertMsg = "%1 cannot be empty";
    const logger = new $tw.utils.Logger("attachUserTag");
    const context = {
      prefixes: cache.getPrefixes([]),
      tags: cache.getTags([]),
      wikiUtils: utils.getWikiUtils(widget.wiki)
    };
    ref = utils.trimToUndefined(ref);
    if (!ref) {
      logger.alert(utils.format(alertMsg, "ref"));
      return;
    }
    tagRef = utils.trimToUndefined(tagRef);
    if (!tagRef) {
      logger.alert(utils.format(alertMsg, "tagRef"));
      return;
    }
    if (!tagRef.startsWith(context.prefixes.userTag)) {
      logger.alert("Wrong user tag reference: " + tagRef);
      return;
    }
    if (idle) {
      console.log("attachUserTag", idle, ref, tagRef);
      return;
    }
    context.wikiUtils.withTiddler(ref).doNotInvokeSequentiallyOnSameTiddler.addTagsToTiddler(tagRef);
  }

  // tested
  exports.detachUserTag = function (ref, tagRef, idle, widget) {
    const alertMsg = "%1 cannot be empty";
    const logger = new $tw.utils.Logger("detachUserTag");
    const context = {
      prefixes: cache.getPrefixes([]),
      tags: cache.getTags([]),
      wikiUtils: utils.getWikiUtils(widget.wiki)
    };
    ref = utils.trimToUndefined(ref);
    if (!ref) {
      logger.alert(utils.format(alertMsg, "ref"));
      return;
    }
    tagRef = utils.trimToUndefined(tagRef);
    if (!tagRef) {
      logger.alert(utils.format(alertMsg, "tagRef"));
      return;
    }
    if (!tagRef.startsWith(context.prefixes.userTag)) {
      logger.alert("Wrong user tag reference: " + tagRef);
      return;
    }
    if (idle) {
      console.log("detachUserTag", idle, ref, tagRef);
      return;
    }
    context.wikiUtils.withTiddler(ref).doNotInvokeSequentiallyOnSameTiddler.deleteTagsToTiddler(tagRef);
  }

  // tested
  exports.setUserTagValue = function (ref, tagRef, tagValue, idle, widget) {
    const alertMsg = "%1 cannot be empty";
    const logger = new $tw.utils.Logger("setUserTagValue");
    const context = {
      prefixes: cache.getPrefixes([]),
      tags: cache.getTags([]),
      wikiUtils: utils.getWikiUtils(widget.wiki)
    };
    ref = utils.trimToUndefined(ref);
    if (!ref) {
      logger.alert(utils.format(alertMsg, "ref"));
      return;
    }
    tagRef = utils.trimToUndefined(tagRef);
    if (!tagRef) {
      logger.alert(utils.format(alertMsg, "tagRef"));
      return;
    }
    if (!tagRef.startsWith(context.prefixes.userTag)) {
      logger.alert("Wrong user tag reference: " + tagRef);
      return;
    }
    tagValue = utils.trimToUndefined(tagValue);
    if (idle) {
      console.log("setUserTagValue", idle, ref, tagRef, tagValue);
      return;
    }
    const tagValueTiddler = context.wikiUtils.filterTiddlers("[[" + ref + "]tagging[]tag[" + context.tags.userTagValue + "]tag[" + ref + "]tag[" + tagRef + "]]")[0];
    if (tagValueTiddler) {
      context.wikiUtils.withTiddler(tagValueTiddler).doNotInvokeSequentiallyOnSameTiddler.setTiddlerField("text", tagValue);
    } else {
      context.wikiUtils.addTiddler({
        title: context.wikiUtils.generateNewInternalTitle(context.prefixes.userTagValue),
        tags: [context.tags.userTagValue, ref, tagRef],
        text: tagValue
      });
    }
  }

  // tested
  exports.deleteUserTagValue = function (ref, tagRef, idle, widget) {
    const alertMsg = "%1 cannot be empty";
    const logger = new $tw.utils.Logger("deleteUserTagValue");
    const context = {
      prefixes: cache.getPrefixes([]),
      tags: cache.getTags([]),
      wikiUtils: utils.getWikiUtils(widget.wiki)
    };
    ref = utils.trimToUndefined(ref);
    if (!ref) {
      logger.alert(utils.format(alertMsg, "ref"));
      return;
    }
    tagRef = utils.trimToUndefined(tagRef);
    if (!tagRef) {
      logger.alert(utils.format(alertMsg, "tagRef"));
      return;
    }
    if (!tagRef.startsWith(context.prefixes.userTag)) {
      logger.alert("Wrong user tag reference: " + tagRef);
      return;
    }
    if (idle) {
      console.log("deleteUserTagValue", idle, ref, tagValue, tagRef);
      return;
    }
    const tagValueTiddler = context.wikiUtils.filterTiddlers("[[" + ref + "]tagging[]tag[" + context.tags.userTagValue + "]tag[" + ref + "]tag[" + tagRef + "]]")[0];
    if (tagValueTiddler) {
      context.wikiUtils.withTiddler(tagValueTiddler).doNotInvokeSequentiallyOnSameTiddler.deleteTiddler();
    }
  }

  // tested
  exports.setNotesToWordArticle = function (ref, notes, idle, widget) {
    const alertMsg = "%1 cannot be empty";
    const logger = new $tw.utils.Logger("setNotesToWordArticle");
    const context = {
      prefixes: cache.getPrefixes([]),
      tags: cache.getTags([]),
      wikiUtils: utils.getWikiUtils(widget.wiki)
    };
    ref = utils.trimToUndefined(ref);
    if (!ref) {
      logger.alert(utils.format(alertMsg, "ref"));
      return;
    }
    if (!ref.startsWith(context.prefixes.wordArticle)) {
      logger.alert("Wrong word article reference: " + ref);
      return;
    }
    notes = utils.trimToUndefined(notes);
    if (idle) {
      console.log("setNotesToWordArticle", idle, ref, notes);
      return;
    }
    context.wikiUtils.withTiddler(ref).doNotInvokeSequentiallyOnSameTiddler.setTiddlerField("notes", notes);
  }

  // tested
  exports.createRule = function (brief, description, usageExamplesTag, usageExamplesBulkData, schedule, idle, widget) {
    const alertMsg = "%1 cannot be empty";
    const logger = new $tw.utils.Logger("createRule");
    const context = {
      prefixes: cache.getPrefixes([]),
      tags: cache.getTags([]),
      wikiUtils: utils.getWikiUtils(widget.wiki)
    };
    brief = utils.trimToUndefined(brief);
    if (!brief) {
      logger.alert(utils.format(alertMsg, "brief"));
      return;
    }
    description = utils.trimToUndefined(description);
    usageExamplesTag = utils.trimToUndefined(usageExamplesTag);
    usageExamplesBulkData = utils.trimToUndefined(usageExamplesBulkData);
    schedule = utils.trimToUndefined(schedule);
    if (idle) {
      console.log("createRule", idle, brief, description, usageExamplesTag, usageExamplesBulkData, schedule);
      return;
    }
    const ruleTitle = context.wikiUtils.generateNewInternalTitle(context.prefixes.rule);
    context.wikiUtils.addTiddler({
      title: ruleTitle,
      tags: [context.tags.rule],
      brief: brief,
      text: description
    });
    if (usageExamplesTag || usageExamplesBulkData) {
      createUsageExamples(usageExamplesTag, usageExamplesBulkData, ruleTitle, schedule, context);
    }
  }

  // tested
  exports.saveRule = function (rule, brief, description, idle, widget) {
    const alertMsg = "%1 cannot be empty";
    const logger = new $tw.utils.Logger("saveRule");
    const context = {
      prefixes: cache.getPrefixes([]),
      tags: cache.getTags([]),
      wikiUtils: utils.getWikiUtils(widget.wiki)
    };
    rule = utils.trimToUndefined(rule);
    if (!rule) {
      logger.alert(utils.format(alertMsg, "rule"));
      return;
    }
    if (rule && !rule.startsWith(context.prefixes.rule)) {
      logger.alert("Wrong rule reference: " + rule);
      return;
    }
    brief = utils.trimToUndefined(brief);
    if (!brief) {
      logger.alert(utils.format(alertMsg, "brief"));
      return;
    }
    description = utils.trimToUndefined(description);
    if (idle) {
      console.log("saveRule", idle, rule, brief, description);
      return;
    }
    context.wikiUtils.withTiddler(rule).doNotInvokeSequentiallyOnSameTiddler.updateTiddler({
      brief: brief,
      text: description
    })
  }

  // tested
  exports.addUsageExamplesToRule = function (rule, usageExamplesTag, usageExamplesBulkData, schedule, idle, widget) {
    const alertMsg = "%1 cannot be empty";
    const logger = new $tw.utils.Logger("addUsageExamplesToRule");
    const context = {
      prefixes: cache.getPrefixes([]),
      tags: cache.getTags([]),
      wikiUtils: utils.getWikiUtils(widget.wiki)
    };
    rule = utils.trimToUndefined(rule);
    if (!rule) {
      logger.alert(utils.format(alertMsg, "rule"));
      return;
    }
    if (rule && !rule.startsWith(context.prefixes.rule)) {
      logger.alert("Wrong rule reference: " + rule);
      return;
    }
    usageExamplesTag = utils.trimToUndefined(usageExamplesTag);
    usageExamplesBulkData = utils.trimToUndefined(usageExamplesBulkData);
    schedule = utils.trimToUndefined(schedule);
    if (!usageExamplesTag && !usageExamplesBulkData) {
      logger.alert("either newExamplesTag or newExamplesBulkData should be set");
      return;
    }
    if (idle) {
      console.log("addUsageExamplesToRule", idle, rule, usageExamplesTag, usageExamplesBulkData, schedule);
      return;
    }
    createUsageExamples(usageExamplesTag, usageExamplesBulkData, rule, schedule, context);
  }

  // tested
  exports.attachRuleToUsageExample = function (example, rule, idle, widget) {
    const alertMsg = "%1 cannot be empty";
    const logger = new $tw.utils.Logger("attachRuleToUsageExample");
    const context = {
      prefixes: cache.getPrefixes([]),
      tags: cache.getTags([]),
      wikiUtils: utils.getWikiUtils(widget.wiki)
    };
    example = utils.trimToUndefined(example);
    if (!example) {
      logger.alert(utils.format(alertMsg, "example"));
      return;
    }
    rule = utils.trimToUndefined(rule);
    if (!rule) {
      logger.alert(utils.format(alertMsg, "rule"));
      return;
    }
    if (!example.startsWith(context.prefixes.usageExample)) {
      logger.alert("Wrong usage example reference: " + example);
      return;
    }
    if (!rule.startsWith(context.prefixes.rule)) {
      logger.alert("Wrong rule reference: " + rule);
      return;
    }
    const instance = context.wikiUtils.withTiddler(example);
    if (!instance.exists()) {
      logger.alert("Usage example not found: " + example);
      return;
    }
    if (idle) {
      console.log("attachRuleToUsageExample", idle, example, rule);
      return;
    }
    instance.doNotInvokeSequentiallyOnSameTiddler.addTagsToTiddler(rule);
  }

  // tested
  exports.detachRuleFromUsageExample = function (example, rule, idle, widget) {
    const alertMsg = "%1 cannot be empty";
    const logger = new $tw.utils.Logger("detachRuleFromUsageExample");
    const context = {
      prefixes: cache.getPrefixes([]),
      tags: cache.getTags([]),
      wikiUtils: utils.getWikiUtils(widget.wiki)
    };
    example = utils.trimToUndefined(example);
    if (!example) {
      logger.alert(utils.format(alertMsg, "example"));
      return;
    }
    rule = utils.trimToUndefined(rule);
    if (!rule) {
      logger.alert(utils.format(alertMsg, "rule"));
      return;
    }
    if (!example.startsWith(context.prefixes.usageExample)) {
      logger.alert("Wrong usage example reference: " + example);
      return;
    }
    if (!rule.startsWith(context.prefixes.rule)) {
      logger.alert("Wrong rule reference: " + rule);
      return;
    }
    const instance = context.wikiUtils.withTiddler(example);
    if (!instance.exists()) {
      logger.alert("Usage example not found: " + example);
      return;
    }
    if (idle) {
      console.log("detachRuleFromUsageExample", idle, example, rule);
      return;
    }
    instance.doNotInvokeSequentiallyOnSameTiddler.deleteTagsToTiddler([rule]);
  }

  // tested
  exports.attachRuleToWordArticle = function (article, rule, idle, widget) {
    const alertMsg = "%1 cannot be empty";
    const logger = new $tw.utils.Logger("attachRuleToWordArticle");
    const context = {
      prefixes: cache.getPrefixes([]),
      tags: cache.getTags([]),
      wikiUtils: utils.getWikiUtils(widget.wiki)
    };
    article = utils.trimToUndefined(article);
    if (!article) {
      logger.alert(utils.format(alertMsg, "article"));
      return;
    }
    if (!article.startsWith(context.prefixes.wordArticle)) {
      logger.alert("Wrong word article reference: " + article);
      return;
    }
    rule = utils.trimToUndefined(rule);
    if (!rule) {
      logger.alert(utils.format(alertMsg, "rule"));
      return;
    }
    if (!rule.startsWith(context.prefixes.rule)) {
      logger.alert("Wrong rule reference: " + rule);
      return;
    }
    const instance = context.wikiUtils.withTiddler(article);
    if (!instance.exists()) {
      logger.alert("Word article not found: " + article);
      return;
    }
    if (idle) {
      console.log("attachRuleToWordArticle", idle, article, rule);
      return;
    }
    instance.doNotInvokeSequentiallyOnSameTiddler.addTagsToTiddler([rule]);
  }

  // tested
  exports.detachRuleFromWordArticle = function (article, rule, idle, widget) {
    const alertMsg = "%1 cannot be empty";
    const logger = new $tw.utils.Logger("detachRuleFromWordArticle");
    const context = {
      prefixes: cache.getPrefixes([]),
      tags: cache.getTags([]),
      wikiUtils: utils.getWikiUtils(widget.wiki)
    };
    article = utils.trimToUndefined(article);
    if (!article) {
      logger.alert(utils.format(alertMsg, "article"));
      return;
    }
    if (!article.startsWith(context.prefixes.wordArticle)) {
      logger.alert("Wrong word article reference: " + article);
      return;
    }
    rule = utils.trimToUndefined(rule);
    if (!rule) {
      logger.alert(utils.format(alertMsg, "rule"));
      return;
    }
    if (!rule.startsWith(context.prefixes.rule)) {
      logger.alert("Wrong rule reference: " + rule);
      return;
    }
    const instance = context.wikiUtils.withTiddler(article);
    if (!instance.exists()) {
      logger.alert("Word article not found: " + article);
      return;
    }
    if (idle) {
      console.log("detachRuleFromWordArticle", idle, article, rule);
      return;
    }
    instance.doNotInvokeSequentiallyOnSameTiddler.deleteTagsToTiddler([rule]);
  }

})();
