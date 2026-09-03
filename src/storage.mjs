import {mkdir,readFile,readdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
export async function readJson(file){return JSON.parse(await readFile(file,'utf8'));}
export async function saveDecision(decision,directory='decisions'){
  await mkdir(directory,{recursive:true});const symbol=decision.asset.symbol.replace(/[^a-z0-9_-]/gi,'').toLowerCase()||'asset';const stamp=decision.generatedAt.replace(/[:.]/g,'-');const file=path.join(directory,`${stamp}-${symbol}.json`);await writeFile(file,`${JSON.stringify(decision,null,2)}\n`,{flag:'wx'});return file;
}
export async function latestDecision(directory='decisions'){const files=(await readdir(directory)).filter(f=>f.endsWith('.json')).sort();if(!files.length)throw new Error('No decision found. Run npm run demo first.');return readJson(path.join(directory,files.at(-1)));}
