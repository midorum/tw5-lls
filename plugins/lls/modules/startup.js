/*\
title: $:/plugins/midorum/lls/modules/startup.js
type: application/javascript
module-type: startup

Adds listeners for lls messages.

\*/
(function () {

  /*jslint node: true, browser: true */
  /*global $tw: false */
  "use strict";

  const messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");

  // Export name and synchronous status
  exports.name = "lls-startup";
  exports.after = ["startup"];
  exports.synchronous = true;

  exports.startup = function () {

    $tw.rootWidget.addEventListener("tm-lls-create-new-article", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.createNewArticle(params.word, params.meaning, params.speechPart,
        params.transcriptionGroup, params.newTranscriptionsTag,
        params.usageExamplesTag, params.usageExamplesBulkData, params.schedule, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-create-new-temp-tiddler", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.createNewTempTiddler(params.tag, params.text, params.src, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-delete-temp-tiddler", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.deleteTempTiddler(params.title, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-delete-all-temp-tiddlers", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.deleteAllTempTiddlers(params.tag, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-detach-transcription-group", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.detachTranscriptionGroup(params.article, params.transcriptionGroup, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-delete-transcription-group", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.deleteTranscriptionGroup(params.ref, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-attach-transcriptions", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.attachTranscriptions(params.article, params.transcriptionGroup, params.newTranscriptionsTag, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-modify-transcription-group", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.modifyTranscriptionGroup(params.transcriptionGroup, params.newTranscriptionsTag, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-compose-transcription-group", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.composeTranscriptionGroup(params.transcriptionGroup, params.targetGroup, params.transcriptions, params.mode, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-modify-word-spelling", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.modifyWordSpelling(params.word, params.newSpelling, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-modify-word-meaning", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.modifyWordMeaning(params.ref, params.newMeaning, params.newSpeechPart, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-attach-word-article-to-usage-example", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.attachWordArticleToUsageExample(params.example, params.article, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-detach-word-article-from-usage-example", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.detachWordArticleFromUsageExample(params.example, params.article, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-add-usage-examples-to-word-article", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.addUsageExamplesToWordArticle(params.article, params.newExamplesTag, params.newExamplesBulkData, params.schedule, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-modify-usage-example", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.modifyUsageExample(params.example, params.original, params.translation, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-delete-word-article", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.deleteWordArticle(params.ref, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-delete-usage-example", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.deleteUsageExample(params.usageExample, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-anki-import", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.ankiImport(params.data, params.limit, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-import-trancriptions-data", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.importTranscriptionsData(params.data, params.limit, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-save-semantic-relation-group", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.saveSemanticRelationGroup(params.semanticRelationType, params.semanticRelation, params.state, params.wordArticle, params.contextIndex, params.wordListIndex, params.wordStyleIndexPrefix, params.log, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-create-user-tag", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.createUserTag(params.name, params.description, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-attach-user-tag", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.attachUserTag(params.ref, params.tagRef, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-detach-user-tag", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.detachUserTag(params.ref, params.tagRef, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-set-user-tag-value", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.setUserTagValue(params.ref, params.tagRef, params.tagValue, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-delete-user-tag-value", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.deleteUserTagValue(params.ref, params.tagRef, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-set-notes-to-word-article", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.setNotesToWordArticle(params.ref, params.notes, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-create-rule", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.createRule(params.brief, params.description,
        params.usageExamplesTag, params.usageExamplesBulkData, params.schedule,
        params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-save-rule", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.saveRule(params.rule, params.brief, params.description,
        params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-add-usage-examples-to-rule", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.addUsageExamplesToRule(params.rule,
        params.usageExamplesTag, params.usageExamplesBulkData, params.schedule,
        params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-attach-rule-to-usage-example", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.attachRuleToUsageExample(params.example, params.rule, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-detach-rule-from-usage-example", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.detachRuleFromUsageExample(params.example, params.rule, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-attach-rule-to-word-article", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.attachRuleToWordArticle(params.article, params.rule, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-detach-rule-from-word-article", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.detachRuleFromWordArticle(params.article, params.rule, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-attach-parent-rule", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.attachParentRule(params.rule, params.parentRule, params.idle, widget);
    });

    $tw.rootWidget.addEventListener("tm-lls-detach-parent-rule", function (event) {
      const widget = event.widget || $tw.rootWidget;
      const params = event.paramObject || {};
      messageHandler.detachParentRule(params.rule, params.parentRule, params.idle, widget);
    });


  };

})();