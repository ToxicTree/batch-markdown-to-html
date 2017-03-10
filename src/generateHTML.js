// Generate html
var generateHTML = function(entry, files){
    for (var i=0 ; i<entry.length ; i++){
        if (typeof entry[i].content != 'undefined')
            generateHTML(entry[i].content, files);
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
            var head = ['<head>', '\n', '</head>'];
            var body = ['<body>', '\n', '</body>'];

            // Title
            var title = entry[i].name;
            // Remove ordering prefix 00_
            if (title.indexOf('_')>0)
                title = title.substr(title.indexOf('_')+1);
            // Remove extension
            if (title.indexOf('.')>0)
                title = title.substr(0,title.lastIndexOf('.'));
            // Replace _ with spaces
            title = title.replace(/_/g,' ');
            // Insert
            head[1] += "<title>"+title+"</title>\n";

            // Insert basic meta
            head[1] += "<meta charset='UTF-8'>\n";
            head[1] += "<meta name='viewport' content='width=device-width, initial-scale=1'>\n";

            // Insert CSS into head
            if (CONFIG.css)
                for (var c=0 ; c<CONFIG.css.length ; c++)
                    head[1] += "<link rel='stylesheet' href='"+CONFIG.css[c]+"'>\n"

            // Insert generated html into body
            body[1] += "<div class='container'>\n" + html_content + "\n</div>\n";

            // Append scripts to body
            if (CONFIG.js)
                for (var j=0 ; j<CONFIG.js.length ; j++)
                    body[1] += "<script src='"+CONFIG.js[j]+"'></script>\n"

            // Append onload js to body
            if (CONFIG.onload)
                body[1] += "<script>"+CONFIG.onload+"</script>\n"

            // Assemble result
            var result =
                "<!DOCTYPE html>\n" +
                "<html>\n" +
                head.join('') +
                body.join('') +
                "</html>";

            // Put html into entry
            entry[i].html = result;

            if (VERBOSE) {
                console.log( entry[i].html )
                console.log( "=============" )
            }

            // Add to files
            files.push(entry[i]);
        }
    }
}

module.exports = generateHTML;
