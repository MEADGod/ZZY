export function finite(value,name){if(typeof value!=='number'||!Number.isFinite(value)||value<0)throw new Error(`${name} must be a finite non-negative number`);}

export function evaluateSnapshot(snapshot,config,now=new Date()){
  if(!snapshot||typeof snapshot!=='object')throw new Error('snapshot is required');
  if(!snapshot.source)throw new Error('source is required');
  if(!snapshot.asset?.symbol)throw new Error('asset symbol is required');
  const observed=new Date(snapshot.observedAt);if(Number.isNaN(observed.getTime()))throw new Error('observedAt must be an ISO timestamp');
  const ageSeconds=Math.max(0,(now-observed)/1000),m=snapshot.market||{},a=snapshot.account||{};
  for(const [key,value] of Object.entries({priceUsd:m.priceUsd,pricePreviewUsd:m.pricePreviewUsd,priceMove5mPercent:m.priceMove5mPercent,volume24hUsd:m.volume24hUsd,volatilityScore:m.volatilityScore,buyingPowerUsd:a.buyingPowerUsd,currentExposureUsd:a.currentExposureUsd,openOrders:a.openOrders}))finite(value,key);
  const failures=[];
  if(ageSeconds>config.policy.maxSnapshotAgeSeconds)failures.push('snapshot-stale');
  if(m.priceMove5mPercent>config.policy.maxPriceMovePercent)failures.push('price-move-above-maximum');
  if(a.openOrders>=config.policy.maxOpenOrders)failures.push('open-order-limit-reached');
  if(a.currentExposureUsd>=config.policy.maxTotalExposureUsd)failures.push('exposure-limit-reached');
  return {accepted:failures.length===0,failures,ageSeconds};
}

export function assertPreviewMode(config){if(config.mode!=='preview')throw new Error('Live order submission is structurally disabled in this scaffold');}
