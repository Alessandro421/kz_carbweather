/* KZ CarbWeather v1.5 — race presentation layer */
(function(){
  function q(id){return document.getElementById(id)}
  function ensureRaceStrip(){
    if(q('raceStrip')) return;
    const header=document.querySelector('header');
    if(!header) return;
    const bar=document.createElement('div');
    bar.id='raceStrip';
    bar.className='raceStrip';
    bar.innerHTML=`
      <div class="raceStripCell track"><div class="rk"><span class="raceLive">LIVE TRACK</span></div><div class="rv" id="rTrack">NO TRACK DATA</div></div>
      <div class="raceStripCell weather"><div class="rk">AIR</div><div class="rv" id="rWeather">—</div></div>
      <div class="raceStripCell mainJet"><div class="rk">MAIN JET</div><div class="rv" id="rMain">—</div></div>
      <div class="raceStripCell atom"><div class="rk">ATOMIZER</div><div class="rv" id="rAtom">—</div></div>
      <div class="raceStripCell egtMin"><div class="rk">EGT MIN REAL</div><div class="rv" id="rEgtMin">—</div></div>
      <div class="raceStripCell egtMax"><div class="rk">EGT MAX</div><div class="rv" id="rEgtMax">—</div></div>`;
    header.after(bar);
  }
  function tagCards(){
    const p=q('sMain')?.closest('.card'); if(p) p.classList.add('racePrimary');
    const t=q('egtMax')?.closest('.card'); if(t) t.classList.add('raceTelemetry');
    const c=q('zones')?.closest('.card'); if(c) c.classList.add('raceComparator');
    document.querySelectorAll('.card .kicker').forEach(k=>{
      const card=k.closest('.card');
      const m=k.textContent.trim().match(/^(\d{2})/);
      if(card&&m) card.dataset.raceSection=m[1];
    });
  }
  function syncRaceStrip(){
    ensureRaceStrip();
    tagCards();
    const w=(typeof weather!=='undefined')?weather:null;
    const s=(typeof suggestedSetup!=='undefined')?suggestedSetup:null;
    const b=window.telemetryData?.best;
    if(q('rTrack')) q('rTrack').textContent=w?.label||q('logPlace')?.value||'NO TRACK DATA';
    if(q('rWeather')) q('rWeather').textContent=w?`${w.temp.toFixed(1)}° · ${Math.round(w.press)} hPa`:'—';
    if(q('rMain')) q('rMain').textContent=s?.main??'—';
    if(q('rAtom')) q('rAtom').textContent=s?.atom??'—';
    if(q('rEgtMin')) q('rEgtMin').textContent=b&&Number.isFinite(b.validMin)?`${Math.round(b.validMin)}°`:'—';
    if(q('rEgtMax')){
      q('rEgtMax').textContent=b&&Number.isFinite(b.max)?`${Math.round(b.max)}°`:'—';
      q('rEgtMax').classList.toggle('hot',!!(b&&Number.isFinite(b.max)&&b.max>630));
    }
  }
  const oldMobile=window.updateMobileHero;
  if(typeof oldMobile==='function'){
    window.updateMobileHero=function(){oldMobile.apply(this,arguments);syncRaceStrip()};
  }
  syncRaceStrip();
  const mo=new MutationObserver(()=>syncRaceStrip());
  ['suggestedWeather','sMain','sAtom','egtMinValid','egtMax','weatherMsg'].forEach(id=>{const el=q(id);if(el)mo.observe(el,{childList:true,subtree:true,characterData:true})});
  window.addEventListener('resize',syncRaceStrip,{passive:true});
})();
