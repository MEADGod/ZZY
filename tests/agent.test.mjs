import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {buildDecision,buildOrderPreview} from '../src/decision.mjs';
import {assertPreviewMode,evaluateSnapshot} from '../src/policy.mjs';
const config=JSON.parse(await readFile(new URL('../config/default.json',import.meta.url),'utf8'));
const fixture=JSON.parse(await readFile(new URL('../data/crypto-market.example.json',import.meta.url),'utf8'));
const observed=new Date(fixture.observedAt);

test('agent identity and preview boundary are configured',()=>{assert.equal(config.agentName,'ZZY');assert.equal(config.mode,'preview');assert.equal(config.agenticAccountId,null);});
test('sample fixture passes basic policy at observation time',()=>assert.equal(evaluateSnapshot(fixture,config,observed).accepted,true));
test('sample fixture cannot prepare an order',()=>assert.notEqual(buildDecision(fixture,config,observed).decision,'PREPARE'));
test('stale observation is rejected',()=>assert.equal(buildDecision(fixture,config,new Date(observed.getTime()+31_000)).decision,'REJECT'));
test('large short-term price movement is rejected',()=>{const bad=structuredClone(fixture);bad.market.priceMove5mPercent=4;assert.equal(buildDecision(bad,config,observed).decision,'REJECT');});
test('order preview does not submit',()=>assert.equal(buildOrderPreview(buildDecision(fixture,config,observed),config).submitted,false));
test('live mode fails closed',()=>assert.throws(()=>assertPreviewMode({...config,mode:'live'}),/structurally disabled/));
