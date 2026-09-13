const fs = require('fs');
const path = require('path');
const htmlparser2 = require("htmlparser2");
const showdown  = require('showdown');

const { BlogData } = require('../../blogdata.js');

converter = new showdown.Converter({tables: true, strikethrough: true, ghCodeBlocks: true});

function extractContent(html) {
  const handler = new htmlparser2.DomHandler();
  const parser = new htmlparser2.Parser(handler);
  parser.write(html);
  parser.end();
  
  let summary = htmlparser2.DomUtils.textContent(handler.root.childNodes);
  summary = summary.replace(/\n\n/g, '\n').replace(/---/g, '')
  summary = summary.substring(summary.indexOf("\n") + 1).substring(0, 250)
  return summary;
}

async function loadAllMarkdown() {
  let markdowns = {}
  let index = {}
  for(let i = 0; i < BlogData.length; i++) {
    let blog = BlogData[i]
    const fullPath = path.join(process.cwd(), blog.filePath);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const html = converter.makeHtml(fileContents)
    const summary = extractContent(html)
    markdowns[blog.title] = {
      html: html,
      summary
    };
    index[blog.title] = { summary };
  }

  fs.writeFileSync(
    path.join(process.cwd(), "loadedMarkdown.json"),
    JSON.stringify(markdowns),
  );
  // Slim index for homepage list — full HTML loads on demand.
  fs.writeFileSync(
    path.join(process.cwd(), "loadedMarkdown.index.json"),
    JSON.stringify(index),
  );
}

console.log("Loading the development content!")
loadAllMarkdown();
console.log("Loaded the development content!!")