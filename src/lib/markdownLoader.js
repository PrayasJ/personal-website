const fs = require('fs');
const path = require('path');
const remark = require('remark');
const html = require('remark-html');

export async function loadMarkdown(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const processedContent = await remark().use(html).process(fileContents);
  return processedContent.toString();
}

/* USAGE */

/*

import { loadMarkdown } from '../utils/markdownLoader';

export default function Home({ markdownContent }) {
  return <div dangerouslySetInnerHTML={{ __html: markdownContent }} />;
}

export async function getServerSideProps() {
  const markdownFilePath = './blogs/GSoC - Week 1.md';
  const markdownContent = await loadMarkdown(markdownFilePath);

  return {
    props: {
      markdownContent,
    },
  };
}

*/