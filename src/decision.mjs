import {evaluateSnapshot} from './policy.mjs';
const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));

export function buildDecision(snapshot,config,now=new Date()){
  const policy=evaluateSnapshot(snapshot,config,now),m=snapshot.market,a=snapshot.account;
  let confidence=50;
  if(snapshot.signals?.momentum==='positive')confidence+=12;
  if(snapshot.signals?.liquidity==='high')confidence+=8;
  if(m.volatilityScore>80)confidence-=15;
  if(m.priceMove5mPercent>2)confidence-=8;
  confidence-=Math.min(20,(snapshot.riskFlags||[]).length*5);
  confidence=clamp(Math.round(confidence),0,100);
  let decision='WATCH';
  if(!policy.accepted)decision='REJECT';
  else if(!snapshot.sample&&confidence>=config.policy.minConfidenceToPrepare)decision='PREPARE';
  const maxAffordable=Math.min(config.policy.maxOrderUsd,a.buyingPowerUsd,Math.max(0,config.policy.maxTotalExposureUsd-a.currentExposureUsd));
  return {schemaVersion:1,agent:config.agentName,generatedAt:now.toISOString(),source:snapshot.source,sample:Boolean(snapshot.sample),asset:snapshot.asset,market:m,accountSnapshot:a,signals:snapshot.signals,riskFlags:snapshot.riskFlags||[],policy,confidence,decision,maxAffordableOrderUsd:maxAffordable,summary:decision==='REJECT'?`Rejected because: ${policy.failures.join(', ')}.`:snapshot.sample?'Sample data was evaluated. Sample fixtures cannot produce a live order.':'The observation passed mandatory checks and remains subject to expiry.',evidenceFor:[snapshot.signals?.momentum==='positive'?'Positive momentum was reported.':'No positive momentum signal was reported.',snapshot.signals?.liquidity==='high'?'High liquidity was reported.':'Liquidity was not confirmed as high.'],evidenceAgainst:[...(snapshot.riskFlags||[]),m.volatilityScore>80?'Reported volatility is elevated.':'Reported volatility remains below the rejection threshold.'],invalidation:['The observation becomes stale.','The price moves beyond the configured tolerance.','An existing order reaches the configured limit.','Total exposure reaches the configured maximum.']};
}

export function buildOrderPreview(decision,config){
  if(decision.decision!=='PREPARE')return {mode:'preview',status:'blocked',reason:`Decision is ${decision.decision}`,submitted:false};
  if(!config.agenticAccountId)return {mode:'preview',status:'blocked',reason:'No Agentic Account is configured',submitted:false};
  return {mode:'preview',status:'ready-for-manual-review',submitted:false,agenticAccountId:config.agenticAccountId,asset:decision.asset.symbol,side:'BUY',maximumNotionalUsd:decision.maxAffordableOrderUsd,note:'No Robinhood order was prepared or submitted.'};
}
