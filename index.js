/**
 *  Use showdown to generate documentaion html
 *  https://github.com/showdownjs/showdown
 */
var showdown  = require('showdown'),
    converter = new showdown.Converter();

    // Github flavor
    converter.setFlavor('github');

/**
 * Use fs to perform filesystem operations
 */
var fs = require('fs');

// Get arguments
INPUT = process.argv[2];
OUTPUT = process.argv[3];
CONFIG = (process.argv[4]) ? require( require('path').resolve(process.cwd(), process.argv[4]) ) : {};
VERBOSE = (process.argv[5]) ? true : false;

// Check arguments
if (!INPUT || !OUTPUT)
    return console.log('Usage: batch-showdown <source_folder> <destination_folder> [config_file] [Verbose?]');

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
            if (result.content.length!=0)
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

if (VERBOSE) {
    console.log("Source: '"+INPUT+"'  Destination: '"+OUTPUT+"'  Files: "+files +"\n");
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
            var html_content = converter.makeHtml(data);

            // Create wrappers
            var head = ['<head>', '', '</head>'];
            var body = ['<body>', '', '</body>'];

            // Insert CSS into head
            if (CONFIG.css)
                for (var c=0 ; c<CONFIG.css.length ; c++)
                    head[1] = head[1] + "<link rel='stylesheet' href='"+CONFIG.css[c]+"'>"

            // Insert generated html into body
            body[1] = html_content;

            // Append scripts to body
            if (CONFIG.js)
                for (var j=0 ; j<CONFIG.js.length ; j++)
                    body[1] = body[1] + "<script src='"+CONFIG.js[j]+"'></script>"

            // Append onload js to body
            if (CONFIG.onload)
                body[1] = body[1] + "<script>"+CONFIG.onload+"</script>"

            // Insert head and body into html
            var result = "<html>" + head.join('') + body.join('') + "</html>";

            // Put html into entry
            entry[i].html = result;

            if (VERBOSE) {
                console.log( entry[i].html )
                console.log( "=============" )
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

generate(batch);

// Generate batch tree
var batch_tree = function(entry, level){
    var o = {};
    var a = [];
    for (var i=0 ; i<entry.length ; i++){
        // Set indentation
        var indent = "";
        for (var d=0 ; d<level ; d++)
            indent+="  ";
        // Replace extention to html
        var name = entry[i].name;
            name = name.replace('.md', '.html');
            name = name.replace('.markdown', '.html');
        // Print
        if (VERBOSE)
            console.log(indent+name);
        // Add folder or file
        if (entry[i].content && entry[i].content.length>0)
            o[name] = batch_tree(entry[i].content, level+1);
        else
            a.push(name);
    }
    o['files'] = a;
    return o;
}

var json = batch_tree(batch, 1);

// Save reference to tree.json
fs.writeFileSync( OUTPUT+'/tree.json', JSON.stringify(json) )

if (files==1)
    console.log("\nDone! 1 file written.");
if (files>1)
    console.log("\nDone! "+files+" files written.")
