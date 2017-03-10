var generateBatch = function(folder){
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
            result.content = generateBatch(folder+content[c]);
            if (result.content.length!=0)
                results.push(result);
            continue;
        }
        // Only grab markdown files
        if (content[c].indexOf('.md')>0 || content[c].indexOf('.markdown')>0){
            results.push(result);
        }
    }
    return results;
}

module.exports = generateBatch;
