/* Explicit online/offline presentation state for weather and cloud features.
   Presentation only: no fetch, Supabase, carburation, density, EGT or telemetry behavior is changed. */
(function(){
  const COPY={
    it:{offlineWeather:'Offline: meteo live non disponibile. I dati già caricati restano visibili.',onlineWeather:'Connessione ripristinata. Aggiorna il meteo quando vuoi.',offlineCloud:'Offline: sincronizzazione cloud non disponibile. I dati locali restano utilizzabili.',onlineCloud:'Connessione ripristinata.',offlineToast:'Sei offline. Meteo live e cloud non sono disponibili.',onlineToast:'Connessione ripristinata.'},
    en:{offlineWeather:'Offline: live weather is unavailable. Previously loaded data remains visible.',onlineWeather:'Connection restored. Refresh the weather when needed.',offlineCloud:'Offline: cloud sync is unavailable. Local data remains usable.',onlineCloud:'Connection restored.',offlineToast:'You are offline. Live weather and cloud are unavailable.',onlineToast:'Connection restored.'},
    es:{offlineWeather:'Sin conexión: el tiempo en vivo no está disponible. Los datos ya cargados siguen visibles.',onlineWeather:'Conexión restablecida. Actualiza el tiempo cuando quieras.',offlineCloud:'Sin conexión: la sincronización en la nube no está disponible. Los datos locales siguen utilizables.',onlineCloud:'Conexión restablecida.',offlineToast:'Estás sin conexión. El tiempo en vivo y la nube no están disponibles.',onlineToast:'Conexión restablecida.'},
    de:{offlineWeather:'Offline: Live-Wetter ist nicht verfügbar. Bereits geladene Daten bleiben sichtbar.',onlineWeather:'Verbindung wiederhergestellt. Wetter bei Bedarf aktualisieren.',offlineCloud:'Offline: Cloud-Synchronisierung ist nicht verfügbar. Lokale Daten bleiben nutzbar.',onlineCloud:'Verbindung wiederhergestellt.',offlineToast:'Du bist offline. Live-Wetter und Cloud sind nicht verfügbar.',onlineToast:'Verbindung wiederhergestellt.'}
  };

  let initialized=false;
  let wasOnline=true;
  const lang=()=>{
    const current=window.KZI18N?.getLanguage?.()||document.documentElement.lang||'it';
    return COPY[current]?current:'it';
  };
  const text=key=>COPY[lang()][key];

  function updateNetworkState({announce=false}={}){
    const online=navigator.onLine!==false;
    if(!online){
      if(typeof setInlineMessage==='function')setInlineMessage('weatherMsg',text('offlineWeather'),true);
      if(typeof cloudStatus==='function')cloudStatus('OFFLINE','bad');
      if(typeof cloudMsg==='function')cloudMsg(text('offlineCloud'));
      if(announce&&typeof showToast==='function')showToast(text('offlineToast'),'warning',4200);
    }else if(initialized&&!wasOnline){
      const weatherMsg=document.getElementById('weatherMsg');
      if(weatherMsg&&/Offline:|Sin conexión:|Offline:|offline/i.test(weatherMsg.textContent||'')){
        if(typeof setInlineMessage==='function')setInlineMessage('weatherMsg',text('onlineWeather'),false);
      }
      if(typeof updateCloudUI==='function')updateCloudUI();
      else if(typeof cloudMsg==='function')cloudMsg(text('onlineCloud'));
      if(announce&&typeof showToast==='function')showToast(text('onlineToast'),'success',3200);
    }
    wasOnline=online;
    initialized=true;
    document.documentElement.dataset.network=online?'online':'offline';
    return online;
  }

  window.KZNetworkStatus={isOnline:()=>navigator.onLine!==false,refresh:()=>updateNetworkState()};
  window.addEventListener('offline',()=>updateNetworkState({announce:true}));
  window.addEventListener('online',()=>updateNetworkState({announce:true}));

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>updateNetworkState(),{once:true});
  else updateNetworkState();
})();
