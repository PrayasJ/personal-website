const fs = require('fs');
const path = require('path');
const htmlparser2 = require("htmlparser2");
const showdown  = require('showdown');

const { BlogData } = require('../../blogdata.js');

converter = new showdown.Converter();

function extractContent(html) {
  const handler = new htmlparser2.DomHandler();
  const parser = new htmlparser2.Parser(handler);
  parser.write(html);
  parser.end();
  
  let summary = htmlparser2.DomUtils.textContent(handler.root.childNodes);
  summary = summary.replace(/\n\n/g, '\n').replace(/---/g, '')
  summary = summary.substring(summary.indexOf("\n") + 2).substring(0, 250)
  return summary;
}

async function loadAllMarkdown() {
  let markdowns = {}
  for(let i = 0; i < BlogData.length; i++) {
    let blog = BlogData[i]
    const fullPath = path.join(process.cwd(), blog.filePath);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    markdowns[blog.title] = {
      html: converter.makeHtml(fileContents),
      summary: extractContent(fileContents)
    };
  }

  const outputPath = path.join(process.cwd(), 'ladedMarkdown.json')
  fs.writeFile('loadedMarkdown.json', JSON.stringify(markdowns), (error) => {
    if (error) throw error;
  });
}

console.log("Loading the development content!")
loadAllMarkdown();
console.log("Loaded the development content!!")