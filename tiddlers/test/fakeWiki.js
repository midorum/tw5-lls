
var utils = require("test/utils").llsTestUtils;
var Logger = $tw.utils.Logger.prototype;

describe("A fake wiki", () => {

    it("should work", () => {
        const options = utils.setupWiki();
        expect(options.widget.wiki).toBeDefined();
        expect(options.widget.wiki.deleteTiddler).toBeDefined();
        expect(options.widget.wiki.tiddlerExists).toBeDefined();
        expect(options.widget.wiki.getTiddler).toBeDefined();
        expect(options.widget.wiki.filterTiddlers).toBeDefined();
        expect(options.widget.wiki.getModificationFields).toBeDefined();
        expect(options.widget.wiki.addTiddler).toBeDefined();
        expect(options.widget.wiki.generateNewTitle).toBeDefined();
        expect(options.widget.wiki.getTiddlerDataCached).toBeDefined();
        expect(options.widget.wiki.extractTiddlerDataItem).toBeDefined();
        expect(options.widget.wiki.getCreationFields).toBeDefined();
        expect(options.widget.wiki.setText).toBeDefined();
        expect(options.widget.wiki.getTiddlerData).toBeDefined();
        expect(options.widget.wiki.setTiddlerData).toBeDefined();
        expect(options.widget.wiki.each).toBeDefined();
        expect(options.widget.wiki.getTiddlersWithTag).toBeDefined();

        // console.log(options.widget.wiki.generateNewTitle("test title"));
    })

}); 