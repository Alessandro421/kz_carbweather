/* Presentation-only brand layer. No carburation, density or EGT calculations are changed. */
(function(){
  const brand=document.querySelector('.brand');
  if(brand){
    brand.classList.add('brandV2');
    brand.innerHTML=`
      <svg class="kzBrandLogo" viewBox="0 0 760 104" role="img" aria-label="KZ CarbWeather — Meteo, densità, carburazione">
        <defs>
          <linearGradient id="kzYellow" x1="0" x2="1"><stop offset="0" stop-color="#ffd21c"/><stop offset="1" stop-color="#ffb800"/></linearGradient>
        </defs>
        <g transform="translate(5 13) skewX(-10)">
          <path d="M8 7h72L65 27H30L18 52h37l-12 22H0z" fill="#f7f7f4"/>
          <path d="M54 27h25l-10 22 30-42h29L78 76H49l12-27H42z" fill="url(#kzYellow)"/>
        </g>
        <line x1="142" y1="19" x2="142" y2="84" stroke="#7d8793" stroke-width="2"/>
        <g transform="translate(164 19)" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 43c0-12 9-21 21-21 9 0 16 5 19 13 2-1 5-2 8-2 9 0 16 7 16 16H11c-7 0-11-4-11-10s5-11 11-11" stroke="#f7f7f4" stroke-width="5"/>
          <path d="M30 14c3-8 10-13 19-13 11 0 20 8 21 19" stroke="#ffd21c" stroke-width="5"/>
          <path d="M47-5v-8M67 1l6-7M78 18h9" stroke="#ffd21c" stroke-width="5"/>
          <path d="M47 60h34M57 70h23M68 80h12" stroke="#99a6b5" stroke-width="5"/>
        </g>
        <text x="280" y="54" font-family="Bahnschrift,Arial Narrow,Arial,sans-serif" font-size="42" font-weight="900" letter-spacing="5" fill="#ffd21c">KZ</text>
        <text x="355" y="54" font-family="Bahnschrift,Arial Narrow,Arial,sans-serif" font-size="42" font-weight="800" letter-spacing="4" fill="#f7f7f4">CARBWEATHER</text>
        <text x="282" y="82" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="500" letter-spacing="7" fill="#8d96a2">METEO · DENSITÀ · CARBURAZIONE</text>
      </svg>`;
  }

  /* Density altitude remains calculated in weather.da and updated through #wDA, but is not a visible KPI. */
  const da=$('wDA');
  const daMetric=da?.closest('.metric');
  if(daMetric){
    daMetric.hidden=true;
    const metrics=daMetric.closest('.metrics');
    if(metrics)metrics.classList.add('weatherMetrics4');
  }

  /* Copy correction only: keep the existing calculation branch untouched. */
  const densityText=$('densityText');
  const correctCopy=()=>{
    if(densityText?.textContent.trim()==='Tende a ingrassire')densityText.textContent='Tende ad ingrassare';
  };
  correctCopy();
  if(densityText)new MutationObserver(correctCopy).observe(densityText,{childList:true,characterData:true,subtree:true});
})();

/* Human-readable session report export.
   Presentation/export only: carburation, density, telemetry and cloud calculations are untouched. */
(function(){
  const previousJsonExport = typeof window.exportAllData === 'function' ? window.exportAllData : null;
  if (previousJsonExport) window.exportBackupJSON = previousJsonExport;

  const COPY={
    it:{report:'REPORT',subtitle:'REPORT PISTA · METEO + CARBURAZIONE',atmosphere:'CONDIZIONI ATMOSFERICHE',setup:'CARBURAZIONE SUGGERITA',baseline:'BASELINE DI RIFERIMENTO',telemetry:'ULTIMA TELEMETRIA ALFANO',temperature:'Temperatura',humidity:'Umidità',pressure:'Pressione',density:'Densità aria',densityDelta:'Variazione densità',main:'Getto MAX',needle:'Spillo',clip:'Tacca',atom:'Polverizzatore',idle:'Getto minimo',idleB:'Emulsionatore B',air:'Vite aria',slide:'Valvola gas',turns:'giri',baselineWeather:'Meteo baseline',baselineSetup:'Setup baseline',egtMin:'EGT MIN reale',egtMax:'EGT MAX',water:'Acqua',bestLap:'Best lap',generated:'Generato',disclaimer:'Setup suggerito dalla baseline salvata e dalle condizioni atmosferiche del momento. Verifica finale: EGT + comportamento motore in pista.',loadWeather:'Carica il meteo della pista prima di esportare il report.',done:'Report JPEG esportato.'},
    en:{report:'REPORT',subtitle:'TRACK REPORT · WEATHER + JETTING',atmosphere:'ATMOSPHERIC CONDITIONS',setup:'SUGGESTED JETTING',baseline:'REFERENCE BASELINE',telemetry:'LATEST ALFANO TELEMETRY',temperature:'Temperature',humidity:'Humidity',pressure:'Pressure',density:'Air density',densityDelta:'Density change',main:'Main jet',needle:'Needle',clip:'Clip',atom:'Atomizer',idle:'Idle jet',idleB:'Idle emulsifier B',air:'Air screw',slide:'Throttle slide',turns:'turns',baselineWeather:'Baseline weather',baselineSetup:'Baseline setup',egtMin:'Real EGT MIN',egtMax:'EGT MAX',water:'Water',bestLap:'Best lap',generated:'Generated',disclaimer:'Suggested setup is calculated from the saved baseline and current atmospheric conditions. Final verification: EGT + engine behavior on track.',loadWeather:'Load the track weather before exporting the report.',done:'JPEG report exported.'},
    es:{report:'REPORT',subtitle:'INFORME DE PISTA · TIEMPO + CARBURACIÓN',atmosphere:'CONDICIONES ATMOSFÉRICAS',setup:'CARBURACIÓN SUGERIDA',baseline:'REFERENCIA BASE',telemetry:'ÚLTIMA TELEMETRÍA ALFANO',temperature:'Temperatura',humidity:'Humedad',pressure:'Presión',density:'Densidad del aire',densityDelta:'Variación de densidad',main:'Chiclé principal',needle:'Aguja',clip:'Clip',atom:'Atomizador',idle:'Chiclé de baja',idleB:'Emulsionador B',air:'Tornillo de aire',slide:'Corredera',turns:'vueltas',baselineWeather:'Tiempo de referencia',baselineSetup:'Setup de referencia',egtMin:'EGT MÍN real',egtMax:'EGT MÁX',water:'Agua',bestLap:'Mejor vuelta',generated:'Generado',disclaimer:'El setup sugerido se calcula desde la referencia guardada y las condiciones atmosféricas actuales. Verificación final: EGT + comportamiento del motor en pista.',loadWeather:'Carga el tiempo del circuito antes de exportar el informe.',done:'Informe JPEG exportado.'},
    de:{report:'REPORT',subtitle:'STRECKENREPORT · WETTER + VERGASERABSTIMMUNG',atmosphere:'ATMOSPHÄRISCHE BEDINGUNGEN',setup:'EMPFOHLENE VERGASERABSTIMMUNG',baseline:'REFERENZ-BASELINE',telemetry:'LETZTE ALFANO-TELEMETRIE',temperature:'Temperatur',humidity:'Luftfeuchtigkeit',pressure:'Druck',density:'Luftdichte',densityDelta:'Dichteänderung',main:'Hauptdüse',needle:'Nadel',clip:'Clip',atom:'Zerstäuber',idle:'Leerlaufdüse',idleB:'Leerlauf-Emulsionsrohr B',air:'Luftschraube',slide:'Gasschieber',turns:'Umdr.',baselineWeather:'Referenzwetter',baselineSetup:'Referenz-Setup',egtMin:'Reale EGT MIN',egtMax:'EGT MAX',water:'Wasser',bestLap:'Beste Runde',generated:'Erstellt',disclaimer:'Das empfohlene Setup wird aus der gespeicherten Referenz und den aktuellen atmosphärischen Bedingungen berechnet. Endkontrolle: EGT + Motorverhalten auf der Strecke.',loadWeather:'Vor dem Export das Streckenwetter laden.',done:'JPEG-Report exportiert.'}
  };

  const lang=()=>{
    const l=window.KZI18N?.getLanguage?.() || document.documentElement.lang || 'it';
    return COPY[l]?l:'it';
  };
  const t=k=>COPY[lang()][k]||COPY.it[k]||k;
  const locale=()=>({it:'it-IT',en:'en-US',es:'es-ES',de:'de-DE'})[lang()]||'it-IT';
  const nfmt=(n,d=1)=>Number.isFinite(Number(n))?Number(n).toLocaleString(locale(),{minimumFractionDigits:d,maximumFractionDigits:d}):'—';
  const clean=s=>String(s||'').replace(/[<>:"/\\|?*]+/g,'-').replace(/\s+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'').slice(0,55)||'track';

  function wrap(ctx,text,x,y,maxWidth,lineHeight,maxLines=3){
    const words=String(text||'').split(/\s+/);let line='',lines=[];
    for(const word of words){
      const test=line?line+' '+word:word;
      if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=word}else line=test;
    }
    if(line)lines.push(line);
    lines.slice(0,maxLines).forEach((l,i)=>ctx.fillText(l,x,y+i*lineHeight));
  }

  function metric(ctx,x,y,w,h,label,value,{accent=false,big=false}={}){
    ctx.fillStyle='#0b0e12';ctx.strokeStyle=accent?'#ffd21c':'#273142';ctx.lineWidth=2;
    ctx.beginPath();ctx.roundRect(x,y,w,h,10);ctx.fill();ctx.stroke();
    ctx.fillStyle='#8ea2ba';ctx.font='700 24px Arial';ctx.fillText(label.toUpperCase(),x+24,y+38);
    ctx.fillStyle=accent?'#ffd21c':'#f7f7f4';ctx.font=`900 ${big?62:46}px Arial`;
    ctx.fillText(String(value),x+24,y+h-28);
  }

  function sectionTitle(ctx,text,y){
    ctx.fillStyle='#ffd21c';ctx.fillRect(70,y-17,46,5);
    ctx.fillStyle='#f7f7f4';ctx.font='900 28px Arial';ctx.fillText(text,128,y);
  }

  function baselineText(){
    return `${t('main')} ${val('bMain')} · ${t('needle')} ${val('bNeedle')} T${val('bClip')} · ${t('atom')} ${val('bAtom')} · ${t('idle')} ${val('bIdle')} · B${val('bIdleB')} · ${t('air')} ${val('bAir')} · ${t('slide')} ${val('bSlide')}`;
  }

  function drawReport(){
    const currentWeather=typeof weather!=='undefined'?weather:null;
    if(!currentWeather){showToast(t('loadWeather'),'warning',4200);return}
    if(typeof calculateSuggestedSetup==='function')calculateSuggestedSetup();
    const s=typeof suggestedSetup!=='undefined'?suggestedSetup:null;
    if(!s){showToast(t('loadWeather'),'warning',4200);return}

    const W=1800,H=1220,canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
    const ctx=canvas.getContext('2d');
    ctx.fillStyle='#050607';ctx.fillRect(0,0,W,H);
    const grad=ctx.createLinearGradient(0,0,W,0);grad.addColorStop(0,'#ffd21c');grad.addColorStop(.55,'#2563eb');grad.addColorStop(1,'#ff2da6');ctx.fillStyle=grad;ctx.fillRect(0,0,W,10);

    ctx.fillStyle='#ffd21c';ctx.font='1000 64px Arial';ctx.fillText('KZ',70,92);
    ctx.fillStyle='#f7f7f4';ctx.font='900 58px Arial';ctx.fillText('CARBWEATHER',165,92);
    ctx.fillStyle='#8e9bad';ctx.font='700 22px Arial';ctx.fillText(t('subtitle'),72,132);

    const now=new Date();
    ctx.fillStyle='#f7f7f4';ctx.font='900 38px Arial';wrap(ctx,currentWeather.label||val('logPlace')||'—',72,194,1080,44,2);
    ctx.fillStyle='#8e9bad';ctx.font='600 21px Arial';ctx.fillText(`${t('generated')}: ${now.toLocaleString(locale())}`,72,246);
    ctx.fillStyle='#8e9bad';ctx.font='600 21px Arial';ctx.textAlign='right';ctx.fillText('KZ Race · VHSH 30 CS',W-72,92);ctx.textAlign='left';

    sectionTitle(ctx,t('atmosphere'),310);
    const gap=18,cardW=(W-140-gap*4)/5,cardH=132,y1=338;
    const pct=Number(s.pct);
    metric(ctx,70,y1,cardW,cardH,t('temperature'),`${nfmt(currentWeather.temp,1)} °C`);
    metric(ctx,70+(cardW+gap),y1,cardW,cardH,t('humidity'),`${nfmt(currentWeather.rh,0)} %`);
    metric(ctx,70+(cardW+gap)*2,y1,cardW,cardH,t('pressure'),`${nfmt(currentWeather.press,0)} hPa`);
    metric(ctx,70+(cardW+gap)*3,y1,cardW,cardH,t('density'),`${nfmt(currentWeather.rho,3)} kg/m³`);
    metric(ctx,70+(cardW+gap)*4,y1,cardW,cardH,t('densityDelta'),`${pct>=0?'+':''}${nfmt(pct,1)} %`,{accent:true});

    sectionTitle(ctx,t('setup'),540);
    const topY=570,mainW=410,otherW=(W-140-mainW-gap*3)/3;
    metric(ctx,70,topY,mainW,180,t('main'),s.main,{accent:true,big:true});
    metric(ctx,70+mainW+gap,topY,otherW,180,t('needle'),s.needle,{big:true});
    metric(ctx,70+mainW+gap+(otherW+gap),topY,otherW,180,t('clip'),`T${s.clip}`,{big:true});
    metric(ctx,70+mainW+gap+(otherW+gap)*2,topY,otherW,180,t('atom'),s.atom,{accent:true,big:true});

    const row2Y=768,row2W=(W-140-gap*3)/4;
    metric(ctx,70,row2Y,row2W,145,t('idle'),s.idle);
    metric(ctx,70+(row2W+gap),row2Y,row2W,145,t('idleB'),`B${s.idleB}`);
    metric(ctx,70+(row2W+gap)*2,row2Y,row2W,145,t('air'),`${nfmt(s.air,2)} ${t('turns')}`);
    metric(ctx,70+(row2W+gap)*3,row2Y,row2W,145,t('slide'),s.slide);

    sectionTitle(ctx,t('baseline'),980);
    ctx.fillStyle='#8ea2ba';ctx.font='700 20px Arial';ctx.fillText(t('baselineWeather').toUpperCase(),72,1018);
    ctx.fillStyle='#f7f7f4';ctx.font='700 24px Arial';ctx.fillText(`${nfmt(num('bTemp'),1)} °C · ${nfmt(num('bPress'),0)} hPa · ${nfmt(num('bRh'),0)} % RH`,72,1050);
    ctx.fillStyle='#8ea2ba';ctx.font='700 20px Arial';ctx.fillText(t('baselineSetup').toUpperCase(),600,1018);
    ctx.fillStyle='#f7f7f4';ctx.font='700 22px Arial';wrap(ctx,baselineText(),600,1050,1125,30,2);

    const best=window.telemetryData?.best;
    if(best){
      const y=1114;ctx.strokeStyle='#273142';ctx.beginPath();ctx.moveTo(70,y-24);ctx.lineTo(W-70,y-24);ctx.stroke();
      ctx.fillStyle='#8ea2ba';ctx.font='700 18px Arial';ctx.fillText(t('telemetry').toUpperCase(),72,y);
      ctx.fillStyle='#f7f7f4';ctx.font='700 20px Arial';
      const time=Number.isFinite(best.time)&&typeof msToLap==='function'?msToLap(best.time):'—';
      const water=Number.isFinite(best.waterMin)&&Number.isFinite(best.waterMax)?`${nfmt(best.waterMin,1)}–${nfmt(best.waterMax,1)} °C`:'—';
      ctx.fillText(`${t('egtMin')} ${nfmt(best.validMin,1)} °C · ${t('egtMax')} ${nfmt(best.max,1)} °C · ${t('water')} ${water} · ${t('bestLap')} ${best.lap}${time!=='—'?' · '+time:''}`,72,y+34);
    }

    ctx.fillStyle='#778596';ctx.font='600 17px Arial';wrap(ctx,t('disclaimer'),72,H-34,W-144,22,2);

    const stamp=now.toISOString().slice(0,16).replace(/[:T]/g,'-');
    const filename=`KZ-CarbWeather-${clean(currentWeather.label||val('logPlace'))}-${stamp}.jpg`;
    canvas.toBlob(blob=>{
      if(!blob){showToast('JPEG export error','error');return}
      const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1200);showToast(t('done'),'success');
    },'image/jpeg',0.94);
  }

  function relabelButton(){
    const b=document.querySelector('button[onclick="exportAllData()"]');
    if(b){b.textContent=t('report');b.title=t('subtitle')}
  }

  window.exportSetupReport=drawReport;
  window.exportAllData=drawReport;

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',relabelButton,{once:true});
  else relabelButton();
  new MutationObserver(()=>relabelButton()).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
