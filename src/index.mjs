#!/usr/bin/env node
import {resolve} from 'node:path';
import {buildDecision,buildOrderPreview} from './decision.mjs';
import {assertPreviewMode} from './policy.mjs';
import {latestDecision,readJson,saveDecision} from './storage.mjs';
const config=await readJson(resolve('config/default.json'));assertPreviewMode(config);
const [command,...args]=process.argv.slice(2);
if(command==='analyze'){
  const i=args.indexOf('--input');if(i===-1||!args[i+1])throw new Error('Usage: analyze --input <snapshot.json>');
  const snapshot=await readJson(resolve(args[i+1]));const now=snapshot.sample?new Date(snapshot.observedAt):new Date();const decision=buildDecision(snapshot,config,now);const file=await saveDecision(decision);console.log(JSON.stringify({file,decision:decision.decision,confidence:decision.confidence,sample:decision.sample},null,2));
}else if(command==='preview'&&args.includes('--latest'))console.log(JSON.stringify(buildOrderPreview(await latestDecision(),config),null,2));
else console.log('ZZY commands:\n  analyze --input <snapshot.json>\n  preview --latest');
