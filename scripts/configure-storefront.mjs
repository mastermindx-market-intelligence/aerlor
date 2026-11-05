import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
for(const name of ['config','checkout','inquiry','order','webhook']){
  mkdirSync(resolve(root,'api'),{recursive:true});
  writeFileSync(resolve(root,`api/${name}.js`),`import {createHandler} from '../server/http.mjs';\nconst handle=createHandler('${name}');\nexport default {fetch:handle};\n`);
}
const pkg=JSON.parse(readFileSync(resolve(root,'package.json'),'utf8'));
pkg.version='0.3.0';pkg.description='AERLOR hospitality collection, project procurement and gated secure commerce.';
pkg.scripts.prebuild='node scripts/create-collection-assets.mjs && node scripts/build-storefront.mjs';
pkg.scripts.build='tsc --noEmit && vite build';pkg.scripts.preview='node scripts/preview-server.mjs';
pkg.scripts['test:server']='node --test tests/domain.test.mjs tests/server.test.mjs';
pkg.scripts['build:showcase']='node scripts/build-design-showcase.mjs';
writeFileSync(resolve(root,'package.json'),JSON.stringify(pkg,null,2)+'\n');
const pw=readFileSync(resolve(root,'playwright.config.ts'),'utf8').replaceAll('4187','4188');writeFileSync(resolve(root,'playwright.config.ts'),pw);
console.log('Prepared Web Standard API entry points and isolated local preview commands.');
