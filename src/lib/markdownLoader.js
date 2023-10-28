const fs = require('fs');
const { BlogData } = require('../../blogdata.js');
const showdown  = require('showdown');

converter = new showdown.Converter();

async function loadAllMarkdown() {
  let markdowns = {}
  for(let i = 0; i < BlogData.length; i++) {
    let blog = BlogData[i]
    const fullPath = path.join(process.cwd(), blog.filePath);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    markdowns[blog.title] = converter.makeHtml(fileContents);
  }

  const outputPath = path.join(process.cwd(), 'ladedMarkdown.json')
  fs.writeFile('loadedMarkdown.json', JSON.stringify(markdowns), (error) => {
    if (error) throw error;
  });
}

console.log("Loading the development content!")
loadAllMarkdown();
console.log("Loaded the development content!!")