// Get arguments
INPUT = process.argv[2];
OUTPUT = process.argv[3];
CONFIG = process.argv[4];
VERBOSE = (process.argv[5]) ? true : false;

// Check arguments
if (!INPUT || !OUTPUT)
    return console.log('Usage: batch-showdown <source_folder> <destination_folder> [config_file] [Verbose?]');

// Run
else
    require('./../run').run();

process.exit(0);
