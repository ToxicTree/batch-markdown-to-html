// Generate Tree
var generateTREE = function(entry, level){
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
            o[name] = generateTREE(entry[i].content, level+1);
        else
            a.push(name);
    }
    o['files'] = a;
    return o;
}

module.exports = generateTREE;
