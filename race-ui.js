/* KZ CarbWeather — race presentation layer. Result summary uses mobileHero on all breakpoints. */
(function(){
  function q(id){return document.getElementById(id)}
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
  tagCards();
})();