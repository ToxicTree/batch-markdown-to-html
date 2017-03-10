# batch-showdown <a href="https://www.npmjs.com/package/batch-showdown"><img src="https://img.shields.io/npm/v/batch-showdown.svg" alt="Version"></a>

A small node.js script that takes a folder path to markdown files and then generate html files using [showdown](https://www.npmjs.com/package/showdown).

See configuration on how to include css and js into the generated files.

When done, all markdown files will be at the destination as .html files and a reference can be found at tree.json (in both source and destination folders)

### Install

```bash
npm install batch-showdown -g
```

### Usage

```bash
batch-showdown <source_folder> <destination_folder> [configuration.js] [verbose?]

# Example
batch-showdown src/docs public/docs
```

### In another project?

Install and add it to dependencies
```bash
npm install batch-showdown --save
```
Make a script in package.json
```json
"scripts":{
  "docs": "batch-showdown src/docs public/docs"
}
```
Run script from project folder
```bash
npm run docs
```


### Configure (optional)
Pass a configuration (.js) file as third argument.
Configuration looks like this:
```js
module.exports = {
  css: ["path/to/some/style.css"],
  js: ["path/to/some/script.js"],
  onload: "runScript();"
}
```
