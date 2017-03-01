/**
 *  Use showdown to generate documentaion html
 *  https://github.com/showdownjs/showdown
 */
var showdown  = require('showdown'),
    converter = new showdown.Converter();

/**
 * Use fs to perform filesystem operations
 */
var fs = require('fs');

// Get arguments
INPUT = process.argv[2];
OUTPUT = process.argv[3];
VERBOSE = (process.argv[4]) ? true : false;

// Check arguments
if (!INPUT || !OUTPUT)
    return console.log('Usage: batch-markdown-to-html <source_folder> <destination_folder> [Verbose?]');

// Get batch ready
var batch = [],
    files = 0;

var ls = function(folder){
    // Check folder
    if (!folder || typeof folder != 'string')
        return;
    if (folder.lastIndexOf('/')+1<folder.length)
        folder += '/';
    if (!fs.existsSync(folder)){
        return [];
    }
    var results = [];
    var content = fs.readdirSync(folder);
    for (var c=0 ; c<content.length ; c++){
        var result = {
            name: content[c],
            path: folder + content[c]
        }
        // Replace source with destination
        result.dest = result.path.replace(INPUT, OUTPUT);
        // Replace extention to html
        result.dest = result.dest.replace('.md', '.html');
        result.dest = result.dest.replace('.markdown', '.html');
        // If it´s a folder, run this recursively
        if (fs.statSync(result.path).isDirectory()){
            result.content = ls(folder+content[c]);
            results.push(result);
            continue;
        }
        // Only grab markdown files
        if (content[c].indexOf('.md')>0 || content[c].indexOf('.markdown')>0){
            results.push(result);
            files++;
        }
    }
    return results;
}

batch = ls(INPUT);

// Print batch tree
if (VERBOSE) {
    console.log("Source: '"+INPUT+"'  Destination: '"+OUTPUT+"'  Files: "+files);
    console.log("Batch tree:");
    var print_tree = function(entry, level){
        for (var i=0 ; i<entry.length ; i++){
            var indent = "";
            for (var d=0 ; d<level ; d++)
                indent+="  ";
            console.log(indent+entry[i].name);
            if (entry[i].content && entry[i].content.length>0){
                print_tree(entry[i].content,level+1);
            }
        }
    }
    print_tree(batch, 1);
    console.log(" ")
}

// Generate html
var generate = function(entry){
    for (var i=0 ; i<entry.length ; i++){
        if (typeof entry[i].content != 'undefined')
            generate(entry[i].content);
        else {
            if (VERBOSE) {
                console.log( entry[i].name + ' (' + entry[i].path + ' -> ' + entry[i].dest + ')' )
                console.log( "=============" )
            }
            // Read file
            var data = fs.readFileSync(entry[i].path) + ' ';

            // Generate HTML
            entry[i].html = converter.makeHtml(data);
            if (VERBOSE) {
                console.log( entry[i].html )
            }

            // Check destination
            var folder = entry[i].dest.substr(0, entry[i].dest.lastIndexOf('/'))
            if (!fs.existsSync(folder))
                fs.mkdirSync(folder);

            // Write
            fs.writeFileSync( entry[i].dest, entry[i].html )
            if (VERBOSE) {
                console.log('Write OK');
                console.log( ' ' )
            }
        }
    }
}

generate(batch)

if (files==1)
    console.log("Done! 1 file written.");
if (files>1)
    console.log("Done! "+files+" files written.")
