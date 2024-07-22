
const utils = require("test/utils").llsTestUtils;
var messageHandler = require("$:/plugins/midorum/lls/modules/message-handler.js");
var Logger = $tw.utils.Logger.prototype;

describe("A simple test", () => {
    var wiki;

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
            widgetNode: widgetNode,
            contaienr: container
        };
    }

    it("should have wiki inside fake widget", () => {
        const options = setupWiki();
        // console.log("wiki", options.wiki);
        // console.log("widget", options.widgetNode);
        expect(options.widgetNode.wiki).toBeDefined();
        expect(options.widgetNode.wiki.deleteTiddler).toBeDefined();
        expect(options.widgetNode.wiki.tiddlerExists).toBeDefined();
        expect(options.widgetNode.wiki.getTiddler).toBeDefined();
        expect(options.widgetNode.wiki.filterTiddlers).toBeDefined();
        expect(options.widgetNode.wiki.getModificationFields).toBeDefined();
        expect(options.widgetNode.wiki.addTiddler).toBeDefined();
        expect(options.widgetNode.wiki.generateNewTitle).toBeDefined();
        expect(options.widgetNode.wiki.getTiddlerDataCached).toBeDefined();
        expect(options.widgetNode.wiki.extractTiddlerDataItem).toBeDefined();
        expect(options.widgetNode.wiki.getCreationFields).toBeDefined();
        expect(options.widgetNode.wiki.setText).toBeDefined();
        expect(options.widgetNode.wiki.getTiddlerData).toBeDefined();
        expect(options.widgetNode.wiki.setTiddlerData).toBeDefined();
        expect(options.widgetNode.wiki.each).toBeDefined();
        expect(options.widgetNode.wiki.getTiddlersWithTag).toBeDefined();

        // console.log(options.widgetNode.wiki.generateNewTitle("test title"));
    })

    beforeEach(function () {
        wiki = new $tw.Wiki();
    });

    it('should work', () => {
        // console.log("simple test");

        const tags = $tw.wiki.getTiddlerData("$:/plugins/midorum/lls/data/tags", []);
        // console.log(tags.word);
        const wordsCount = $tw.wiki.filterTiddlers("[tag[" + tags.word + "]count[]]");
        // console.log("wordsCount", wordsCount);


        const tags2 = wiki.getTiddlerData("$:/plugins/midorum/lls/data/tags", []);
        // console.log(tags2.word);
        const wordsCount2 = wiki.filterTiddlers("[tag[" + tags.word + "]count[]]");
        // console.log("wordsCount2", wordsCount2);


        spyOn(Logger, 'alert');

        expect().nothing();
        expect(1).toEqual(1);
        expect(messageHandler.attachTranscriptions).toBeDefined();
        expect(messageHandler.attachTranscriptions(undefined, undefined, undefined, "true", utils.setupWiki().widget)).nothing();
        expect(Logger.alert).toHaveBeenCalledTimes(1);
        const expectedMessage = "article cannot be empty";
        const results = Logger.alert.calls.first().args;
        expect(results[0]).toContain(expectedMessage);
    });

    it('fake wiki should work', () => {
        const title = "FakeTiddler";
        expect(wiki.getTiddler(title)).toBeUndefined();
        wiki.addTiddler({ "title": "FakeTiddler", "text": "FakeTiddlerText" });
        expect(wiki.getTiddler(title)).toBeDefined();
        expect($tw.wiki.getTiddler(title)).toBeUndefined();
    });

    describe('a nested thing', () => {

        it('should work', () => {
            expect().nothing();
        });

    });

}); 