import fs from 'node:fs';
import vm from 'node:vm';
const htmlPath = new URL('../index.html', import.meta.url);
let html = fs.readFileSync(htmlPath, 'utf8');
const elements = new Map();
const document = {
  getElementById(id) { if (!elements.has(id)) elements.set(id, {innerHTML: '', dataset: {}}); return elements.get(id); },
  addEventListener() {}
};
const context = vm.createContext({document, window: {}, console});
vm.runInContext(fs.readFileSync(new URL('../assets/js/hero-scenes.js', import.meta.url), 'utf8'), context);
vm.runInContext(fs.readFileSync(new URL('../assets/js/content-renderer.js', import.meta.url), 'utf8'), context);
const renderer = context.window.MatIQContent;
for (const [file, method] of Object.entries({site:'renderSite',people:'renderPeople',research:'renderResearch',publications:'renderPublications',software:'renderSoftware',news:'renderNews',openings:'renderOpenings'})) {
 renderer[method](JSON.parse(fs.readFileSync(new URL(`../data/${file}.json`, import.meta.url), 'utf8')));
}
// Mark generated regions so reruns replace only the generated material.
html = html.replace(/<!-- content:([\w-]+) -->[\s\S]*?<!-- \/content:\1 -->/g, (_, id) => `<!-- content:${id} --><!-- /content:${id} -->`);
for (const [id, element] of elements) {
 if (!element.innerHTML) continue;
 const start = `<!-- content:${id} -->`, end = `<!-- /content:${id} -->`;
 if (html.includes(start)) html = html.replace(start + end, () => start + element.innerHTML + end);
 else {
   const expression = new RegExp(`(<div[^>]*\\bid="${id}"[^>]*>)([\\s\\S]*?)(</div>)`);
   html = html.replace(expression, (_, open) => open + start + element.innerHTML + end + '</div>');
 }
}
// The initial hero placeholder had one nested loading div.
html = html.replace('<!-- /content:hero-data --></div></div></section>', '<!-- /content:hero-data --></div></section>');
fs.writeFileSync(htmlPath, html);
console.log('Updated static content from data/*.json');
