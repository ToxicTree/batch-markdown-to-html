/**
 *  Use showdown to generate documentaion html
 *  https://github.com/showdownjs/showdown
 */
showdown  = require('showdown');
converter = new showdown.Converter();

// Github flavor
converter.setFlavor('github');

/**
 * Use fs and path to perform filesystem operations
 */
fs = require('fs');
path = require('path');

/**
 * Define function to run a batch
 */
var run = function(){

    // Get batch ready
    var batch = require('./generateBatch')(INPUT);

    // Check destination folder
    OUTPUT.split('/').forEach((dir, index, splits) => {
        var parent = splits.slice(0, index).join('/');
        var dirPath = path.resolve(parent, dir);
        if (!fs.existsSync(dirPath))
            fs.mkdirSync(dirPath);
    });

    // Check configuration file
    if (!CONFIG || CONFIG == '')
        CONFIG = {};

    else if (fs.existsSync(CONFIG))
        CONFIG = require( path.resolve(process.cwd(), CONFIG) );

    // Generate HTML
    var files = [];
    require('./generateHTML')(batch, files);

    // Generate JSON tree
    var json = require('./generateTREE')(batch, 1);

    // Save HTML
    for (var i = 0 ; i < files.length ; i++){
        // Check destination
        var folder = files[i].dest.substr(0, files[i].dest.lastIndexOf('/'))
        if (!fs.existsSync(folder))
            fs.mkdirSync(folder);

        // Write
        fs.writeFileSync( files[i].dest, files[i].html )
        if (VERBOSE) {
            console.log('.');
        }
    }

    // Save reference to tree.json
    fs.writeFileSync( OUTPUT+'/tree.json', JSON.stringify(json) )
    fs.writeFileSync( INPUT+'/tree.json', JSON.stringify(json) )

    // Done
    if (files.length==1)
        console.log("\nDone! 1 file written.");
    if (files.length>1)
        console.log("\nDone! "+files.length+" files written.")

}

module.exports = {
    run: run
};
