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
