/* Track-aware place search + Supabase confirmation redirect fix. No carburation/EGT formulas here. */
(function(){
  const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
  const trackMatches=q=>{
    const nq=norm(q); if(nq.length<2||!Array.isArray(window.TRACK_DATABASE||TRACK_DATABASE))return [];
    return TRACK_DATABASE.filter(t=>[t.name,t.city,t.region,...(t.aliases||[])].some(a=>{const na=norm(a);return na===nq||na.includes(nq)||nq.includes(na)}));
  };
  const asPlace=t=>({kind:'track',name:t.name,admin1:`${t.city} · ${t.region}`,country:'PISTA KZ',latitude:t.latitude,longitude:t.longitude,label:`${t.name}, ${t.city}`});

  window.renderPlaceResults=function(results){
    const box=$('placeResults'); if(!box)return;
    placeSearchResults=results.slice(0,4); box.innerHTML='';
    placeSearchResults.forEach(p=>{
      const b=document.createElement('button'); b.type='button'; b.className='placeResult';
      const meta=p.kind==='track'?`PISTA · ${p.admin1}`:[p.admin1,p.country].filter(Boolean).join(' · ');
      b.innerHTML=`<strong>${p.name}</strong>${meta?`<span>${meta}</span>`:''}`;
      b.onclick=()=>{clearPlaceResults();$('place').value=p.name;loadWeather(p.latitude,p.longitude,p.label||`${p.name}${p.admin1?', '+p.admin1:''}`)};
      box.appendChild(b);
    });
    box.hidden=false;
  };

  window.searchPlace=async function(){
    const q=val('place'); clearPlaceResults();
    if(!q){setInlineMessage('weatherMsg','Inserisci una località o il nome di una pista.');return}
    setInlineMessage('weatherMsg','Ricerca pista / località...');
    const tracks=trackMatches(q);
    if(tracks.length===1){
      const p=asPlace(tracks[0]); $('place').value=p.name;
      await loadWeather(p.latitude,p.longitude,p.label); return;
    }
    try{
      const r=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=4&language=it&format=json`),j=await r.json();
      const geo=(j.results||[]).slice(0,4).map(p=>({...p,kind:'place'}));
      const combined=[...tracks.map(asPlace),...geo].filter((p,i,a)=>a.findIndex(x=>x.name===p.name&&Math.abs(x.latitude-p.latitude)<.002&&Math.abs(x.longitude-p.longitude)<.002)===i).slice(0,4);
      if(!combined.length)throw Error('Pista o località non trovata');
      if(combined.length===1){const p=combined[0];$('place').value=p.name;await loadWeather(p.latitude,p.longitude,p.label||`${p.name}${p.admin1?', '+p.admin1:''}`)}
      else{renderPlaceResults(combined);setInlineMessage('weatherMsg','Seleziona la pista o la località corretta tra i risultati.')}
    }catch(e){
      if(tracks.length){renderPlaceResults(tracks.map(asPlace));setInlineMessage('weatherMsg','Seleziona la pista corretta tra i risultati.');return}
      clearPlaceResults();setInlineMessage('weatherMsg','Errore: '+e.message,true);
    }
  };

  /* Hosted client uses implicit auth flow. Force signup confirmation back to the production app. */
  window.cloudSignup=async function(){
    const email=document.getElementById('cloudEmail')?.value.trim()||'',password=document.getElementById('cloudPassword')?.value||'';
    if(!email||password.length<6)return cloudMsg('Email valida e password di almeno 6 caratteri.');
    cloudMsg('Creazione account...');
    const base=location.hostname==='localhost'?location.origin:'https://kzcarbweather.vercel.app';
    const {data,error}=await cloud.auth.signUp({email,password,options:{emailRedirectTo:`${base}/?auth=confirmed`}});
    if(error)return cloudMsg(error.message);
    cloudMsg(data.session?'Account creato e connesso.':'Account creato. Controlla la mail di conferma, poi torna qui per il login.');
  };

  const authReturn=new URLSearchParams(location.search).get('auth');
  if(authReturn==='confirmed'){
    setTimeout(()=>{
      if(typeof showToast==='function')showToast('Email confermata. KZ Cloud è pronto.','success',4500);
      const u=new URL(location.href);u.searchParams.delete('auth');history.replaceState({},'',u.pathname+u.search+u.hash);
    },700);
  }
})();
