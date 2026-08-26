/* Track-aware place search + GPS reverse geocoding + Supabase confirmation redirect fix.
   No carburation, density or EGT formulas are changed here. */
(function(){
  const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
  const hasCoords=t=>Number.isFinite(t?.latitude)&&Number.isFinite(t?.longitude);
  const trackMatches=q=>{
    const nq=norm(q); if(nq.length<2||!Array.isArray(TRACK_DATABASE))return [];
    return TRACK_DATABASE.filter(t=>[t.name,t.city,t.province,t.region,...(t.aliases||[])].some(a=>{const na=norm(a);return na===nq||na.includes(nq)||nq.includes(na)}));
  };
  const asPlace=t=>({
    kind:'track',name:t.name,admin1:`${t.city} · ${t.region}`,country:'ACI SPORT',
    latitude:t.latitude,longitude:t.longitude,label:`${t.name}, ${t.city}`,track:t
  });

  const distanceKm=(lat1,lon1,lat2,lon2)=>{
    const R=6371,toRad=x=>x*Math.PI/180;
    const dLat=toRad(lat2-lat1),dLon=toRad(lon2-lon1);
    const a=Math.sin(dLat/2)**2+Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
    return 2*R*Math.asin(Math.sqrt(a));
  };

  function nearestKnownTrack(lat,lon,maxKm=4){
    if(!Array.isArray(TRACK_DATABASE))return null;
    let best=null;
    TRACK_DATABASE.filter(hasCoords).forEach(t=>{
      const km=distanceKm(lat,lon,t.latitude,t.longitude);
      if(km<=maxKm&&(!best||km<best.km))best={track:t,km};
    });
    return best;
  }

  async function reverseGpsLabel(lat,lon){
    const near=nearestKnownTrack(lat,lon);
    if(near)return `${near.track.name}, ${near.track.city}`;
    try{
      const r=await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&zoom=12&addressdetails=1&accept-language=it`);
      if(!r.ok)throw Error('Reverse geocoding non disponibile');
      const j=await r.json(),a=j.address||{};
      const locality=a.city||a.town||a.village||a.municipality||a.hamlet||a.suburb||a.county||j.name;
      const region=a.state||a.region;
      const parts=[locality,region].filter(Boolean).filter((x,i,arr)=>arr.indexOf(x)===i);
      return parts.length?parts.join(', '):'Posizione GPS';
    }catch{
      return 'Posizione GPS';
    }
  }

  async function geocodeTrackLocality(t){
    const expanded=String(t.city||'').replace(/^S\.\s*/i,'San ');
    const candidates=[t.city,expanded,...(t.aliases||[])]
      .filter(Boolean)
      .filter((x,i,a)=>a.findIndex(y=>norm(y)===norm(x))===i)
      .filter(x=>!/(kart|pista|circuit|track)/i.test(x))
      .slice(0,4);
    if(!candidates.length)candidates.push(t.city);

    for(const query of candidates){
      try{
        const r=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=it&format=json`);
        const j=await r.json();
        const rows=j.results||[];
        if(!rows.length)continue;
        const italian=rows.filter(p=>String(p.country_code||'').toUpperCase()==='IT'||norm(p.country)==='italia');
        const pool=italian.length?italian:rows;
        const regionMatch=pool.find(p=>norm(p.admin1)===norm(t.region)||norm(p.admin1).includes(norm(t.region))||norm(t.region).includes(norm(p.admin1)));
        const cityMatch=pool.find(p=>norm(p.name)===norm(t.city)||norm(p.name)===norm(expanded));
        const p=regionMatch||cityMatch||pool[0];
        if(Number.isFinite(p?.latitude)&&Number.isFinite(p?.longitude))return p;
      }catch{}
    }
    throw Error(`Località ACI non risolta: ${t.city}`);
  }

  async function selectSearchResult(p){
    clearPlaceResults();
    $('place').value=p.name;
    if(p.kind==='track'&&p.track&&!hasCoords(p.track)){
      setInlineMessage('weatherMsg',`Risolvo ${p.track.name} · ${p.track.city}...`);
      try{
        const g=await geocodeTrackLocality(p.track);
        await loadWeather(g.latitude,g.longitude,p.label);
      }catch(e){setInlineMessage('weatherMsg','Errore: '+e.message,true)}
      return;
    }
    await loadWeather(p.latitude,p.longitude,p.label||`${p.name}${p.admin1?', '+p.admin1:''}`);
  }

  window.renderPlaceResults=function(results){
    const box=$('placeResults'); if(!box)return;
    placeSearchResults=results.slice(0,4); box.innerHTML='';
    placeSearchResults.forEach(p=>{
      const b=document.createElement('button'); b.type='button'; b.className='placeResult';
      const meta=p.kind==='track'?`PISTA ACI · ${p.admin1}`:[p.admin1,p.country].filter(Boolean).join(' · ');
      b.innerHTML=`<strong>${p.name}</strong>${meta?`<span>${meta}</span>`:''}`;
      b.onclick=()=>selectSearchResult(p);
      box.appendChild(b);
    });
    box.hidden=false;
  };

  window.searchPlace=async function(){
    const q=val('place'); clearPlaceResults();
    if(!q){setInlineMessage('weatherMsg','Inserisci una località o il nome di una pista.');return}
    setInlineMessage('weatherMsg','Ricerca pista / località...');
    const tracks=trackMatches(q);
    if(tracks.length===1){await selectSearchResult(asPlace(tracks[0]));return}
    try{
      const r=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=4&language=it&format=json`),j=await r.json();
      const geo=(j.results||[]).slice(0,4).map(p=>({...p,kind:'place'}));
      const combined=[...tracks.map(asPlace),...geo].filter((p,i,a)=>{
        if(p.kind==='track')return a.findIndex(x=>x.kind==='track'&&x.track?.id===p.track?.id)===i;
        return a.findIndex(x=>x.kind!=='track'&&x.name===p.name&&Math.abs((x.latitude||0)-(p.latitude||0))<.002&&Math.abs((x.longitude||0)-(p.longitude||0))<.002)===i;
      }).slice(0,4);
      if(!combined.length)throw Error('Pista o località non trovata');
      if(combined.length===1)await selectSearchResult(combined[0]);
      else{renderPlaceResults(combined);setInlineMessage('weatherMsg','Seleziona la pista o la località corretta tra i risultati.')}
    }catch(e){
      if(tracks.length){renderPlaceResults(tracks.map(asPlace));setInlineMessage('weatherMsg','Seleziona la pista corretta tra i risultati.');return}
      clearPlaceResults();setInlineMessage('weatherMsg','Errore: '+e.message,true);
    }
  };

  /* GPS: use coordinates for weather, but resolve a human-readable locality for the UI. */
  window.geoWeather=function(){
    clearPlaceResults();
    if(!navigator.geolocation){setInlineMessage('weatherMsg','GPS non disponibile.',true);return}
    setInlineMessage('weatherMsg','Lettura posizione GPS…');
    navigator.geolocation.getCurrentPosition(async p=>{
      const lat=p.coords.latitude,lon=p.coords.longitude;
      setInlineMessage('weatherMsg','Posizione rilevata. Identifico la località…');
      const label=await reverseGpsLabel(lat,lon);
      if($('place'))$('place').value=label;
      await loadWeather(lat,lon,label);
    },()=>setInlineMessage('weatherMsg','GPS non disponibile/consentito.',true),{enableHighAccuracy:true,timeout:12000,maximumAge:60000});
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
