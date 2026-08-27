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

/* KZ CarbWeather UI translations — presentation only. No carburation, density, EGT or telemetry calculations are changed. */
(function(){
  const SUPPORTED = ['it','en','es','de'];
  const STORAGE_KEY = 'cw_lang';

  const TEXT = {
    'Dati locali · Cloud se connesso': {en:'Local data · Cloud when connected',es:'Datos locales · Nube al conectar',de:'Lokale Daten · Cloud bei Verbindung'},
    'Esporta tutto': {en:'Export all',es:'Exportar todo',de:'Alles exportieren'},
    'Importa': {en:'Import',es:'Importar',de:'Importieren'},
    'TRACK MODE': {en:'TRACK MODE',es:'MODO PISTA',de:'STRECKENMODUS'},
    'Pista non selezionata': {en:'No track selected',es:'Circuito no seleccionado',de:'Keine Strecke ausgewählt'},
    'Carica il meteo per iniziare': {en:'Load weather to start',es:'Carga el tiempo para empezar',de:'Wetter laden, um zu starten'},
    'GETTO MAX': {en:'MAIN JET',es:'CHICLÉ PRINCIPAL',de:'HAUPTDÜSE'},
    'POLVERIZZATORE': {en:'ATOMIZER',es:'ATOMIZADOR',de:'ZERSTÄUBER'},
    'SPILLO / TACCA': {en:'NEEDLE / CLIP',es:'AGUJA / POSICIÓN',de:'NADEL / CLIP'},
    'ULTIMA EGT MIN REALE': {en:'LAST REAL EGT MIN',es:'ÚLTIMA EGT MÍN REAL',de:'LETZTE REALE EGT MIN'},
    'ULTIMA EGT MAX': {en:'LAST EGT MAX',es:'ÚLTIMA EGT MÁX',de:'LETZTE EGT MAX'},
    'METEO': {en:'WEATHER',es:'TIEMPO',de:'WETTER'},
    '01 · Meteo live': {en:'01 · Live weather',es:'01 · Tiempo en vivo',de:'01 · Live-Wetter'},
    'Condizioni attuali': {en:'Current conditions',es:'Condiciones actuales',de:'Aktuelle Bedingungen'},
    'Località / pista': {en:'Location / track',es:'Ubicación / circuito',de:'Ort / Strecke'},
    'Es. Lonato, Castelletto di Branduzzo, Siena...': {en:'E.g. Lonato, Castelletto di Branduzzo, Siena...',es:'Ej. Lonato, Castelletto di Branduzzo, Siena...',de:'Z. B. Lonato, Castelletto di Branduzzo, Siena...'},
    'Cerca meteo': {en:'Search weather',es:'Buscar tiempo',de:'Wetter suchen'},
    'Inserisci una località oppure usa il GPS.': {en:'Enter a location or use GPS.',es:'Introduce una ubicación o usa el GPS.',de:'Ort eingeben oder GPS verwenden.'},
    'Temperatura': {en:'Temperature',es:'Temperatura',de:'Temperatur'},
    'Umidità': {en:'Humidity',es:'Humedad',de:'Luftfeuchtigkeit'},
    'Pressione al suolo': {en:'Surface pressure',es:'Presión en superficie',de:'Bodendruck'},
    'Densità aria': {en:'Air density',es:'Densidad del aire',de:'Luftdichte'},
    'Density altitude': {en:'Density altitude',es:'Altitud de densidad',de:'Dichtehöhe'},
    'm circa': {en:'approx. m',es:'m aprox.',de:'ca. m'},
    '02 · Baseline': {en:'02 · Baseline',es:'02 · Referencia',de:'02 · Referenz'},
    'Setup di riferimento': {en:'Reference setup',es:'Configuración de referencia',de:'Referenz-Setup'},
    'Temperatura °C': {en:'Temperature °C',es:'Temperatura °C',de:'Temperatur °C'},
    'Pressione hPa': {en:'Pressure hPa',es:'Presión hPa',de:'Druck hPa'},
    'Umidità %': {en:'Humidity %',es:'Humedad %',de:'Luftfeuchtigkeit %'},
    'Carburatore baseline': {en:'Baseline carburetor',es:'Carburador de referencia',de:'Referenz-Vergaser'},
    'Getto max': {en:'Main jet',es:'Chiclé principal',de:'Hauptdüse'},
    'Spillo': {en:'Needle',es:'Aguja',de:'Nadel'},
    'Tacca · step 0,5': {en:'Clip · step 0.5',es:'Posición · paso 0,5',de:'Clip · Schritt 0,5'},
    'Polverizzatore': {en:'Atomizer',es:'Atomizador',de:'Zerstäuber'},
    'Getto minimo 12995': {en:'Idle jet 12995',es:'Chiclé de baja 12995',de:'Leerlaufdüse 12995'},
    'Emulsionatore minimo B 13086': {en:'Idle emulsifier B 13086',es:'Emulsionador de baja B 13086',de:'Leerlauf-Emulsionsrohr B 13086'},
    'Vite aria (giri)': {en:'Air screw (turns)',es:'Tornillo de aire (vueltas)',de:'Luftschraube (Umdr.)'},
    'Valvola gas': {en:'Throttle slide',es:'Corredera',de:'Gasschieber'},
    'Geometria spillo selezionato': {en:'Selected needle geometry',es:'Geometría de la aguja seleccionada',de:'Geometrie der gewählten Nadel'},
    'Ø tratto cilindrico A (mm)': {en:'Ø straight section A (mm)',es:'Ø tramo cilíndrico A (mm)',de:'Ø zylindrischer Bereich A (mm)'},
    'Ø punta B (mm)': {en:'Ø tip B (mm)',es:'Ø punta B (mm)',de:'Ø Spitze B (mm)'},
    'Lunghezza cono C (mm)': {en:'Taper length C (mm)',es:'Longitud del cono C (mm)',de:'Konuslänge C (mm)'},
    'Le quote A/B/C vengono caricate automaticamente dal database tecnico. Le varianti senza quote verificate restano selezionabili ma vengono marcate “geometria n/d”.': {en:'A/B/C dimensions are loaded automatically from the technical database. Variants without verified dimensions remain selectable and are marked “geometry n/a”.',es:'Las cotas A/B/C se cargan automáticamente desde la base de datos técnica. Las variantes sin cotas verificadas siguen disponibles y se marcan como “geometría n/d”.',de:'Die Maße A/B/C werden automatisch aus der technischen Datenbank geladen. Varianten ohne verifizierte Maße bleiben auswählbar und werden als „Geometrie n. v.“ markiert.'},
    'Salva baseline': {en:'Save baseline',es:'Guardar referencia',de:'Referenz speichern'},
    'Usa meteo attuale come baseline': {en:'Use current weather as baseline',es:'Usar el tiempo actual como referencia',de:'Aktuelles Wetter als Referenz verwenden'},
    '03 · Correzione meteo': {en:'03 · Weather correction',es:'03 · Corrección meteorológica',de:'03 · Wetterkorrektur'},
    'Quanto cambia l’aria rispetto alla baseline?': {en:'How much has the air changed vs baseline?',es:'¿Cuánto cambia el aire respecto a la referencia?',de:'Wie stark ändert sich die Luft gegenüber der Referenz?'},
    'Variazione densità aria': {en:'Air-density change',es:'Variación de densidad del aire',de:'Änderung der Luftdichte'},
    'Carica il meteo per calcolare': {en:'Load weather to calculate',es:'Carga el tiempo para calcular',de:'Wetter zum Berechnen laden'},
    'Getto max baseline': {en:'Baseline main jet',es:'Chiclé principal de referencia',de:'Referenz-Hauptdüse'},
    'Getto max equivalente stimato': {en:'Estimated equivalent main jet',es:'Chiclé principal equivalente estimado',de:'Geschätzte äquivalente Hauptdüse'},
    'La correzione sarà mostrata dopo aver caricato il meteo.': {en:'The correction will be shown after loading the weather.',es:'La corrección se mostrará después de cargar el tiempo.',de:'Die Korrektur wird nach dem Laden des Wetters angezeigt.'},
    'Il getto equivalente è una stima fisica basata sulla variazione di densità aria. Non sostituisce lettura candela/EGT, comportamento motore e verifica in pista.': {en:'The equivalent jet is a physics-based estimate from the change in air density. It does not replace spark-plug/EGT readings, engine behavior and on-track verification.',es:'El chiclé equivalente es una estimación física basada en la variación de densidad del aire. No sustituye la lectura de bujía/EGT, el comportamiento del motor ni la verificación en pista.',de:'Die äquivalente Düse ist eine physikalische Schätzung auf Basis der Luftdichteänderung. Sie ersetzt weder Kerzen-/EGT-Auswertung noch Motorverhalten und Prüfung auf der Strecke.'},
    '04 · Setup comparator': {en:'04 · Setup comparison',es:'04 · Comparador de setup',de:'04 · Setup-Vergleich'},
    'Confronta una modifica di carburazione': {en:'Compare a carburetion change',es:'Compara un cambio de carburación',de:'Vergaseränderung vergleichen'},
    'Getto max test': {en:'Test main jet',es:'Chiclé principal de prueba',de:'Test-Hauptdüse'},
    'Spillo test': {en:'Test needle',es:'Aguja de prueba',de:'Test-Nadel'},
    'Tacca test · step 0,5': {en:'Test clip · step 0.5',es:'Posición de prueba · paso 0,5',de:'Test-Clip · Schritt 0,5'},
    'Polverizzatore test': {en:'Test atomizer',es:'Atomizador de prueba',de:'Test-Zerstäuber'},
    'Getto minimo 12995 test': {en:'Test idle jet 12995',es:'Chiclé de baja 12995 de prueba',de:'Test-Leerlaufdüse 12995'},
    'Emulsionatore minimo B test': {en:'Test idle emulsifier B',es:'Emulsionador de baja B de prueba',de:'Test-Leerlauf-Emulsionsrohr B'},
    'Vite aria test': {en:'Test air screw',es:'Tornillo de aire de prueba',de:'Test-Luftschraube'},
    'Valvola gas test': {en:'Test throttle slide',es:'Corredera de prueba',de:'Test-Gasschieber'},
    'Geometria spillo test': {en:'Test needle geometry',es:'Geometría de la aguja de prueba',de:'Geometrie der Test-Nadel'},
    'Confronta setup': {en:'Compare setup',es:'Comparar setup',de:'Setup vergleichen'},
    'Copia baseline': {en:'Copy baseline',es:'Copiar referencia',de:'Referenz kopieren'},
    'Confronto polverizzatore: —': {en:'Atomizer comparison: —',es:'Comparación del atomizador: —',de:'Zerstäuber-Vergleich: —'},
    'Effetto stimato per apertura gas': {en:'Estimated effect by throttle opening',es:'Efecto estimado por apertura de gas',de:'Geschätzter Effekt nach Gasöffnung'},
    'Giallo = più ricco rispetto alla baseline · blu = più magro. Le tacche disponibili dipendono dallo spillo Dell’Orto (T = 3, 4 o 5); la mezza tacca resta selezionabile tramite la clip/spessore.': {en:'Yellow = richer than baseline · blue = leaner. Available clip positions depend on the Dell’Orto needle (T = 3, 4 or 5); half-steps remain selectable using the clip/spacer.',es:'Amarillo = más rico que la referencia · azul = más pobre. Las posiciones disponibles dependen de la aguja Dell’Orto (T = 3, 4 o 5); los medios pasos siguen disponibles mediante clip/espaciador.',de:'Gelb = fetter als Referenz · Blau = magerer. Die verfügbaren Clip-Positionen hängen von der Dell’Orto-Nadel ab (T = 3, 4 oder 5); halbe Schritte bleiben über Clip/Distanzring wählbar.'},
    '05 · Cosa influenza cosa': {en:'05 · What affects what',es:'05 · Qué influye en qué',de:'05 · Was beeinflusst was'},
    'Mappa rapida carburatore': {en:'Quick carburetor map',es:'Mapa rápido del carburador',de:'Schnellübersicht Vergaser'},
    'Apertura': {en:'Opening',es:'Apertura',de:'Öffnung'},
    'Componenti dominanti': {en:'Dominant components',es:'Componentes dominantes',de:'Dominierende Komponenten'},
    'minimo': {en:'idle jet',es:'baja',de:'Leerlaufdüse'},
    'vite aria': {en:'air screw',es:'tornillo de aire',de:'Luftschraube'},
    'valvola': {en:'slide',es:'corredera',de:'Gasschieber'},
    'Ø cilindrico spillo': {en:'needle straight diameter',es:'Ø cilíndrico de aguja',de:'zyl. Nadeldurchmesser'},
    'polverizzatore': {en:'atomizer',es:'atomizador',de:'Zerstäuber'},
    'spillo': {en:'needle',es:'aguja',de:'Nadel'},
    'tacca': {en:'clip',es:'posición',de:'Clip'},
    'cono spillo': {en:'needle taper',es:'cono de aguja',de:'Nadelkonus'},
    'getto max': {en:'main jet',es:'chiclé principal',de:'Hauptdüse'},
    'punta spillo': {en:'needle tip',es:'punta de aguja',de:'Nadelspitze'},
    'Regola pratica:': {en:'Rule of thumb:',es:'Regla práctica:',de:'Faustregel:'},
    'il meteo cambia il fabbisogno di benzina in tutto il range, ma il getto max è il primo riferimento per la zona di pieno carico. Lo spillo si usa poi per rifinire la progressione.': {en:'weather changes fuel demand across the whole range, but the main jet is the first reference at full load. The needle is then used to fine-tune progression.',es:'el tiempo cambia la demanda de combustible en todo el rango, pero el chiclé principal es la primera referencia a plena carga. Después se usa la aguja para afinar la progresión.',de:'das Wetter verändert den Kraftstoffbedarf über den gesamten Bereich, aber die Hauptdüse ist die erste Referenz bei Volllast. Danach wird die Nadel zur Feinabstimmung des Übergangs verwendet.'},
    '06 · Carburazione suggerita': {en:'06 · Suggested carburation',es:'06 · Carburación sugerida',de:'06 · Vergaserempfehlung'},
    'Setup VHSH 30 consigliato per il meteo attuale': {en:'Recommended VHSH 30 setup for current weather',es:'Setup VHSH 30 recomendado para el tiempo actual',de:'Empfohlenes VHSH-30-Setup für das aktuelle Wetter'},
    'Profilo: KZ Race': {en:'Profile: KZ Race',es:'Perfil: KZ Race',de:'Profil: KZ Race'},
    'Carica il meteo della pista per generare la carburazione suggerita partendo dalla tua baseline.': {en:'Load track weather to generate the suggested carburation from your baseline.',es:'Carga el tiempo del circuito para generar la carburación sugerida a partir de tu referencia.',de:'Streckenwetter laden, um die Vergaserempfehlung aus deiner Referenz zu erzeugen.'},
    'Getto MAX': {en:'Main jet',es:'Chiclé principal',de:'Hauptdüse'},
    'serie K': {en:'K series',es:'serie K',de:'K-Serie'},
    'Tacca': {en:'Clip',es:'Posición',de:'Clip'},
    'step 0,5': {en:'step 0.5',es:'paso 0,5',de:'Schritt 0,5'},
    'Getto minimo': {en:'Idle jet',es:'Chiclé de baja',de:'Leerlaufdüse'},
    'Emulsionatore minimo': {en:'Idle emulsifier',es:'Emulsionador de baja',de:'Leerlauf-Emulsionsrohr'},
    'serie B': {en:'B series',es:'serie B',de:'B-Serie'},
    'Vite aria': {en:'Air screw',es:'Tornillo de aire',de:'Luftschraube'},
    'giri': {en:'turns',es:'vueltas',de:'Umdr.'},
    'La raccomandazione viene calcolata rispetto alla carburazione baseline salvata.': {en:'The recommendation is calculated against the saved baseline carburation.',es:'La recomendación se calcula respecto a la carburación de referencia guardada.',de:'Die Empfehlung wird gegenüber der gespeicherten Referenz-Vergaserabstimmung berechnet.'},
    'Copia nel setup test': {en:'Copy to test setup',es:'Copiar al setup de prueba',de:'In Test-Setup kopieren'},
    'Strategia KZ Race: il getto massimo viene corretto in modo lineare con la variazione di densità aria. Il polverizzatore reagisce già da circa ±2% di scostamento; tacca e circuito del minimo restano più conservativi. La verifica finale resta EGT + comportamento motore.': {en:'KZ Race strategy: the main jet is corrected linearly with the change in air density. The atomizer starts reacting from about ±2% deviation; clip position and idle circuit remain more conservative. Final verification remains EGT + engine behavior.',es:'Estrategia KZ Race: el chiclé principal se corrige linealmente con la variación de densidad del aire. El atomizador empieza a reaccionar desde aproximadamente ±2% de desviación; la posición de aguja y el circuito de baja siguen siendo más conservadores. La verificación final sigue siendo EGT + comportamiento del motor.',de:'KZ-Race-Strategie: Die Hauptdüse wird linear mit der Änderung der Luftdichte korrigiert. Der Zerstäuber reagiert bereits ab etwa ±2 % Abweichung; Clip-Position und Leerlaufkreis bleiben konservativer. Die abschließende Prüfung bleibt EGT + Motorverhalten.'},
    '07 · Telemetria scarico': {en:'07 · Exhaust telemetry',es:'07 · Telemetría de escape',de:'07 · Abgas-Telemetrie'},
    'Importa sessione e analizza EGT': {en:'Import session and analyze EGT',es:'Importar sesión y analizar EGT',de:'Session importieren und EGT analysieren'},
    'Sessione ALFANO 7 ZIP oppure CSV/TXT': {en:'ALFANO 7 session ZIP or CSV/TXT',es:'Sesión ALFANO 7 ZIP o CSV/TXT',de:'ALFANO-7-Session ZIP oder CSV/TXT'},
    'Target minimo EGT °C': {en:'Minimum EGT target °C',es:'Objetivo mínimo EGT °C',de:'Unteres EGT-Ziel °C'},
    'Target massimo EGT °C': {en:'Maximum EGT target °C',es:'Objetivo máximo EGT °C',de:'Oberes EGT-Ziel °C'},
    'Soglia EGT MIN reale °C': {en:'Real EGT MIN threshold °C',es:'Umbral EGT MÍN real °C',de:'Schwelle reale EGT MIN °C'},
    'Analizza sessione': {en:'Analyze session',es:'Analizar sesión',de:'Session analysieren'},
    'Puoi caricare direttamente lo ZIP originale ALFANO 7. Per il formato ALFANO KZ: T1 viene letto come acqua e T2 come EGT/scarico.': {en:'You can upload the original ALFANO 7 ZIP directly. For the ALFANO KZ format: T1 is read as water temperature and T2 as EGT/exhaust.',es:'Puedes cargar directamente el ZIP original de ALFANO 7. Para el formato ALFANO KZ: T1 se interpreta como temperatura de agua y T2 como EGT/escape.',de:'Du kannst die originale ALFANO-7-ZIP-Datei direkt laden. Beim ALFANO-KZ-Format wird T1 als Wassertemperatur und T2 als EGT/Abgas gelesen.'},
    'EGT MIN grezza': {en:'Raw EGT MIN',es:'EGT MÍN bruta',de:'EGT MIN roh'},
    'EGT MIN reale': {en:'Real EGT MIN',es:'EGT MÍN real',de:'Reale EGT MIN'},
    '≥ soglia': {en:'≥ threshold',es:'≥ umbral',de:'≥ Schwelle'},
    'Campioni nel target': {en:'Samples in target',es:'Muestras en objetivo',de:'Messwerte im Zielbereich'},
    'Picco RPM associato': {en:'RPM at EGT peak',es:'RPM en el pico EGT',de:'Drehzahl am EGT-Peak'},
    'Sotto target': {en:'Below target',es:'Por debajo del objetivo',de:'Unter Zielbereich'},
    'campioni sotto': {en:'samples below',es:'muestras por debajo de',de:'Messwerte unter'},
    'Sopra target': {en:'Above target',es:'Por encima del objetivo',de:'Über Zielbereich'},
    'campioni sopra': {en:'samples above',es:'muestras por encima de',de:'Messwerte über'},
    'Importa una sessione per valutare la finestra 400–630 °C.': {en:'Import a session to evaluate the 400–630 °C window.',es:'Importa una sesión para evaluar la ventana de 400–630 °C.',de:'Session importieren, um das Fenster 400–630 °C zu bewerten.'},
    'Analisi giro per giro': {en:'Lap-by-lap analysis',es:'Análisis vuelta a vuelta',de:'Rundenanalyse'},
    'Giro': {en:'Lap',es:'Vuelta',de:'Runde'},
    'Tempo': {en:'Time',es:'Tiempo',de:'Zeit'},
    'Vel. max': {en:'Max speed',es:'Vel. máx',de:'V max'},
    'Dettaglio canali rilevati': {en:'Detected channel details',es:'Detalle de canales detectados',de:'Details erkannter Kanäle'},
    "Il range 400–630 °C viene usato come riferimento operativo dell'app. La EGT MIN reale ignora i campioni sotto la soglia configurata (default 350 °C). La lettura va interpretata insieme a regime motore, posizione gas, durata del pieno carico e posizione della sonda EGT.": {en:'The 400–630 °C range is used as the app’s operating reference. Real EGT MIN ignores samples below the configured threshold (default 350 °C). The reading must be interpreted together with engine speed, throttle position, duration at full load and EGT probe position.',es:'El rango 400–630 °C se usa como referencia operativa de la app. La EGT MÍN real ignora las muestras por debajo del umbral configurado (por defecto 350 °C). La lectura debe interpretarse junto con el régimen del motor, la posición del acelerador, la duración a plena carga y la posición de la sonda EGT.',de:'Der Bereich 400–630 °C dient als Betriebsreferenz der App. Die reale EGT MIN ignoriert Messwerte unterhalb der eingestellten Schwelle (Standard 350 °C). Die Messung ist zusammen mit Drehzahl, Gasstellung, Volllastdauer und Position der EGT-Sonde zu interpretieren.'},
    '08 · Track log': {en:'08 · Track log',es:'08 · Registro de pista',de:'08 · Streckenlog'},
    'Salva prove e sensazioni': {en:'Save runs and feedback',es:'Guardar pruebas y sensaciones',de:'Tests und Eindrücke speichern'},
    'Data': {en:'Date',es:'Fecha',de:'Datum'},
    'Pista / località': {en:'Track / location',es:'Circuito / ubicación',de:'Strecke / Ort'},
    'Acqua max °C': {en:'Max water °C',es:'Agua máx °C',de:'Wasser max °C'},
    'Valutazione 1–5': {en:'Rating 1–5',es:'Valoración 1–5',de:'Bewertung 1–5'},
    'Note (ripresa, borbotta, vuoto, allungo, colore candela...)': {en:'Notes (pickup, burble, hesitation, top-end, spark-plug color...)',es:'Notas (respuesta, rateo, vacío, estirada, color de bujía...)',de:'Notizen (Ansprechverhalten, Stottern, Loch, Ausdrehen, Kerzenbild...)'},
    'Salva prova': {en:'Save run',es:'Guardar prueba',de:'Test speichern'},
    'Esporta CSV': {en:'Export CSV',es:'Exportar CSV',de:'CSV exportieren'},
    'Cancella log': {en:'Clear log',es:'Borrar registro',de:'Log löschen'},
    'Luogo': {en:'Location',es:'Lugar',de:'Ort'},
    'Meteo': {en:'Weather',es:'Tiempo',de:'Wetter'},
    'Score': {en:'Score',es:'Puntuación',de:'Bewertung'},
    'KZ CarbWeather v1.6 · Strumento di supporto alla messa a punto VHSH 30 KZ. Carburazione suggerita da meteo + ALFANO 7 · EGT MIN reale filtrata (default ≥350 °C) · target max 630 °C.': {en:'KZ CarbWeather v1.6 · VHSH 30 KZ tuning support tool. Suggested carburation from weather + ALFANO 7 · filtered real EGT MIN (default ≥350 °C) · max target 630 °C.',es:'KZ CarbWeather v1.6 · Herramienta de apoyo para la puesta a punto VHSH 30 KZ. Carburación sugerida por tiempo + ALFANO 7 · EGT MÍN real filtrada (por defecto ≥350 °C) · objetivo máx. 630 °C.',de:'KZ CarbWeather v1.6 · Abstimmungshilfe für VHSH 30 KZ. Vergaserempfehlung aus Wetter + ALFANO 7 · gefilterte reale EGT MIN (Standard ≥350 °C) · oberes Ziel 630 °C.'},
    'ATTENZIONE': {en:'WARNING',es:'ATENCIÓN',de:'ACHTUNG'},
    'Conferma': {en:'Confirm',es:'Confirmar',de:'Bestätigen'},
    'Conferma eliminazione': {en:'Confirm deletion',es:'Confirmar eliminación',de:'Löschen bestätigen'},
    'Annulla': {en:'Cancel',es:'Cancelar',de:'Abbrechen'},
    'Backup JSON esportato.': {en:'JSON backup exported.',es:'Copia JSON exportada.',de:'JSON-Backup exportiert.'},
    'Backup non riconosciuto o incompleto.': {en:'Backup not recognized or incomplete.',es:'Copia no reconocida o incompleta.',de:'Backup nicht erkannt oder unvollständig.'},
    'Backup ripristinato nel browser.': {en:'Backup restored in the browser.',es:'Copia restaurada en el navegador.',de:'Backup im Browser wiederhergestellt.'},
    'Inserisci una località.': {en:'Enter a location.',es:'Introduce una ubicación.',de:'Ort eingeben.'},
    'Ricerca località...': {en:'Searching location...',es:'Buscando ubicación...',de:'Ort wird gesucht...'},
    'Località non trovata': {en:'Location not found',es:'Ubicación no encontrada',de:'Ort nicht gefunden'},
    'Seleziona la località corretta tra i risultati.': {en:'Select the correct location from the results.',es:'Selecciona la ubicación correcta entre los resultados.',de:'Den richtigen Ort aus den Ergebnissen auswählen.'},
    'GPS non disponibile.': {en:'GPS unavailable.',es:'GPS no disponible.',de:'GPS nicht verfügbar.'},
    'Lettura posizione...': {en:'Reading position...',es:'Leyendo posición...',de:'Position wird ermittelt...'},
    'Posizione GPS': {en:'GPS position',es:'Posición GPS',de:'GPS-Position'},
    'GPS non disponibile/consentito.': {en:'GPS unavailable/not allowed.',es:'GPS no disponible/no autorizado.',de:'GPS nicht verfügbar/nicht freigegeben.'},
    'Caricamento meteo...': {en:'Loading weather...',es:'Cargando tiempo...',de:'Wetter wird geladen...'},
    'Dati non disponibili': {en:'Data unavailable',es:'Datos no disponibles',de:'Daten nicht verfügbar'},
    'Carica prima il meteo.': {en:'Load the weather first.',es:'Carga primero el tiempo.',de:'Zuerst das Wetter laden.'},
    'ARIA PIÙ DENSA': {en:'DENSER AIR',es:'AIRE MÁS DENSO',de:'DICHTERE LUFT'},
    'Tende a smagrire': {en:'Tends leaner',es:'Tiende a empobrecer',de:'Tendenz magerer'},
    'ARIA MENO DENSA': {en:'LESS DENSE AIR',es:'AIRE MENOS DENSO',de:'WENIGER DICHTE LUFT'},
    'Tende a ingrassire': {en:'Tends richer',es:'Tiende a enriquecer',de:'Tendenz fetter'},
    'Tende ad ingrassare': {en:'Tends richer',es:'Tiende a enriquecer',de:'Tendenz fetter'},
    'QUASI UGUALE': {en:'ALMOST SAME',es:'CASI IGUAL',de:'FAST GLEICH'},
    'Correzione minima': {en:'Minimal correction',es:'Corrección mínima',de:'Minimale Korrektur'},
    'Condizioni vicine alla baseline: mantieni il setup.': {en:'Conditions close to baseline: keep the setup.',es:'Condiciones cercanas a la referencia: mantén el setup.',de:'Bedingungen nahe der Referenz: Setup beibehalten.'},
    'Confronto polverizzatore: nessuna variazione.': {en:'Atomizer comparison: no change.',es:'Comparación del atomizador: sin cambios.',de:'Zerstäuber-Vergleich: keine Änderung.'},
    '≈ uguale': {en:'≈ same',es:'≈ igual',de:'≈ gleich'},
    'Seleziona una sessione.': {en:'Select a session.',es:'Selecciona una sesión.',de:'Session auswählen.'},
    'Modulo ZIP non disponibile.': {en:'ZIP module unavailable.',es:'Módulo ZIP no disponible.',de:'ZIP-Modul nicht verfügbar.'},
    'Nessun file LAP_x trovato.': {en:'No LAP_x file found.',es:'No se encontró ningún archivo LAP_x.',de:'Keine LAP_x-Datei gefunden.'},
    'Nessun giro con T2 valido.': {en:'No lap with valid T2.',es:'Ninguna vuelta con T2 válido.',de:'Keine Runde mit gültigem T2.'},
    'Tempi giro non disponibili.': {en:'Lap times unavailable.',es:'Tiempos de vuelta no disponibles.',de:'Rundenzeiten nicht verfügbar.'},
    'Import telemetria non riuscito.': {en:'Telemetry import failed.',es:'Error al importar la telemetría.',de:'Telemetrie-Import fehlgeschlagen.'},
    'Nessun log da esportare.': {en:'No log to export.',es:'No hay registros para exportar.',de:'Kein Log zum Exportieren.'},
    'Cancellare tutti i log salvati? Questa operazione rimuove i dati locali del track log. Se il cloud è connesso, i dati cloud non vengono cancellati automaticamente.': {en:'Delete all saved logs? This removes local track-log data. If cloud is connected, cloud data is not deleted automatically.',es:'¿Borrar todos los registros guardados? Esta operación elimina los datos locales del registro de pista. Si la nube está conectada, los datos en la nube no se borran automáticamente.',de:'Alle gespeicherten Logs löschen? Dadurch werden die lokalen Streckenlog-Daten entfernt. Bei verbundener Cloud werden Cloud-Daten nicht automatisch gelöscht.'},
    'Cancella track log': {en:'Clear track log',es:'Borrar registro de pista',de:'Streckenlog löschen'},
    'Track log locale cancellato.': {en:'Local track log cleared.',es:'Registro de pista local borrado.',de:'Lokaler Streckenlog gelöscht.'},
    'ACCESSO': {en:'SIGN IN',es:'ACCESO',de:'ANMELDUNG'},
    'Password': {en:'Password',es:'Contraseña',de:'Passwort'},
    'Crea account': {en:'Create account',es:'Crear cuenta',de:'Konto erstellen'},
    'CONNESSO COME': {en:'SIGNED IN AS',es:'CONECTADO COMO',de:'ANGEMELDET ALS'},
    'ARCHIVIO CLOUD': {en:'CLOUD ARCHIVE',es:'ARCHIVO EN LA NUBE',de:'CLOUD-ARCHIV'},
    'GIRI': {en:'LAPS',es:'VUELTAS',de:'RUNDEN'},
    'Caricamento archivio…': {en:'Loading archive…',es:'Cargando archivo…',de:'Archiv wird geladen…'},
    'Sync ora': {en:'Sync now',es:'Sincronizar ahora',de:'Jetzt synchronisieren'},
    'Login per sincronizzare PC e smartphone.': {en:'Sign in to sync PC and smartphone.',es:'Inicia sesión para sincronizar PC y smartphone.',de:'Anmelden, um PC und Smartphone zu synchronisieren.'},
    'Cloud connesso. I dati sono sincronizzati con il tuo account.': {en:'Cloud connected. Data is synced with your account.',es:'Nube conectada. Los datos están sincronizados con tu cuenta.',de:'Cloud verbunden. Die Daten werden mit deinem Konto synchronisiert.'},
    'Nessuna sessione ALFANO salvata.': {en:'No saved ALFANO sessions.',es:'No hay sesiones ALFANO guardadas.',de:'Keine gespeicherten ALFANO-Sessions.'},
    'Archivio non disponibile.': {en:'Archive unavailable.',es:'Archivo no disponible.',de:'Archiv nicht verfügbar.'},
    'Errore lettura archivio cloud.': {en:'Error reading cloud archive.',es:'Error al leer el archivo en la nube.',de:'Fehler beim Lesen des Cloud-Archivs.'},
    'Inserisci email e password.': {en:'Enter email and password.',es:'Introduce email y contraseña.',de:'E-Mail und Passwort eingeben.'},
    'Connesso. Sincronizzazione in corso…': {en:'Connected. Sync in progress…',es:'Conectado. Sincronización en curso…',de:'Verbunden. Synchronisierung läuft…'},
    'Email valida e password di almeno 6 caratteri.': {en:'Enter a valid email and a password of at least 6 characters.',es:'Introduce un email válido y una contraseña de al menos 6 caracteres.',de:'Gültige E-Mail und ein Passwort mit mindestens 6 Zeichen eingeben.'},
    'Creazione account...': {en:'Creating account...',es:'Creando cuenta...',de:'Konto wird erstellt...'},
    'Account creato e connesso.': {en:'Account created and connected.',es:'Cuenta creada y conectada.',de:'Konto erstellt und verbunden.'},
    'Account creato. Controlla la mail di conferma, poi torna qui per il login.': {en:'Account created. Check the confirmation email, then return here to sign in.',es:'Cuenta creada. Revisa el correo de confirmación y vuelve aquí para iniciar sesión.',de:'Konto erstellt. Bestätigungs-E-Mail prüfen und anschließend hier anmelden.'},
    'Email confermata. KZ Cloud è pronto.': {en:'Email confirmed. KZ Cloud is ready.',es:'Email confirmado. KZ Cloud está listo.',de:'E-Mail bestätigt. KZ Cloud ist bereit.'},
    'Fai login prima.': {en:'Sign in first.',es:'Inicia sesión primero.',de:'Zuerst anmelden.'},
    'Sincronizzazione completata.': {en:'Synchronization complete.',es:'Sincronización completada.',de:'Synchronisierung abgeschlossen.'},
    'Errore sync': {en:'Sync error',es:'Error de sincronización',de:'Synchronisierungsfehler'},
    'PISTA ACI': {en:'ACI TRACK',es:'CIRCUITO ACI',de:'ACI-STRECKE'},
    'Inserisci una località o il nome di una pista.': {en:'Enter a location or track name.',es:'Introduce una ubicación o el nombre de un circuito.',de:'Ort oder Streckenname eingeben.'},
    'Ricerca pista / località...': {en:'Searching track / location...',es:'Buscando circuito / ubicación...',de:'Strecke / Ort wird gesucht...'},
    'Pista o località non trovata': {en:'Track or location not found',es:'Circuito o ubicación no encontrados',de:'Strecke oder Ort nicht gefunden'},
    'Seleziona la pista o la località corretta tra i risultati.': {en:'Select the correct track or location from the results.',es:'Selecciona el circuito o la ubicación correctos entre los resultados.',de:'Die richtige Strecke oder den richtigen Ort aus den Ergebnissen auswählen.'},
    'Seleziona la pista corretta tra i risultati.': {en:'Select the correct track from the results.',es:'Selecciona el circuito correcto entre los resultados.',de:'Die richtige Strecke aus den Ergebnissen auswählen.'},
    'Lettura posizione GPS…': {en:'Reading GPS position…',es:'Leyendo posición GPS…',de:'GPS-Position wird ermittelt…'},
    'Posizione rilevata. Identifico la località…': {en:'Position detected. Identifying location…',es:'Posición detectada. Identificando ubicación…',de:'Position erkannt. Ort wird ermittelt…'}
  };

  const nodeSource = new WeakMap();
  const attrSource = new WeakMap();
  let lang = 'it';
  let applying = false;

  function preserveSpace(source, translated){
    const lead = source.match(/^\s*/)?.[0] || '';
    const tail = source.match(/\s*$/)?.[0] || '';
    return lead + translated + tail;
  }

  function exact(source, targetLang){
    const trimmed = source.trim().replace(/\s+/g,' ');
    const entry = TEXT[trimmed];
    if (!entry || !entry[targetLang]) return null;
    return preserveSpace(source, entry[targetLang]);
  }

  function dynamic(source, targetLang){
    const raw = source.trim().replace(/\s+/g,' ');
    if (!raw) return source;
    let m;
    if ((m = raw.match(/^Tacca · (\d+) tacche fisiche · step 0,5$/))) {
      const out = targetLang==='en' ? `Clip · ${m[1]} physical positions · step 0.5` : targetLang==='es' ? `Posición · ${m[1]} posiciones físicas · paso 0,5` : `Clip · ${m[1]} physische Positionen · Schritt 0,5`;
      return preserveSpace(source,out);
    }
    if ((m = raw.match(/^Tacca test · (\d+) tacche fisiche · step 0,5$/))) {
      const out = targetLang==='en' ? `Test clip · ${m[1]} physical positions · step 0.5` : targetLang==='es' ? `Posición de prueba · ${m[1]} posiciones físicas · paso 0,5` : `Test-Clip · ${m[1]} physische Positionen · Schritt 0,5`;
      return preserveSpace(source,out);
    }
    if ((m = raw.match(/^(.+): T (\d+) tacche · geometria n\/d\.$/))) {
      const out = targetLang==='en' ? `${m[1]}: T ${m[2]} positions · geometry n/a.` : targetLang==='es' ? `${m[1]}: T ${m[2]} posiciones · geometría n/d.` : `${m[1]}: T ${m[2]} Positionen · Geometrie n. v.`;
      return preserveSpace(source,out);
    }
    if ((m = raw.match(/^Import non riuscito: (.+)$/))) {
      const prefix = targetLang==='en'?'Import failed':targetLang==='es'?'Error de importación':'Import fehlgeschlagen';
      return preserveSpace(source,`${prefix}: ${translateCore(m[1],targetLang)}`);
    }
    if ((m = raw.match(/^Errore meteo: (.+)$/))) {
      const prefix = targetLang==='en'?'Weather error':targetLang==='es'?'Error meteorológico':'Wetterfehler';
      return preserveSpace(source,`${prefix}: ${translateCore(m[1],targetLang)}`);
    }
    if ((m = raw.match(/^Errore import: (.+)$/))) {
      const prefix = targetLang==='en'?'Import error':targetLang==='es'?'Error de importación':'Importfehler';
      return preserveSpace(source,`${prefix}: ${translateCore(m[1],targetLang)}`);
    }
    if ((m = raw.match(/^Errore: (.+)$/))) {
      const prefix = targetLang==='en'?'Error':targetLang==='es'?'Error':'Fehler';
      return preserveSpace(source,`${prefix}: ${translateCore(m[1],targetLang)}`);
    }
    if ((m = raw.match(/^Equivalente teorico circa (\d+)\. Il profilo KZ Race sotto usa una correzione più aggressiva\.$/))) {
      const out = targetLang==='en' ? `Theoretical equivalent about ${m[1]}. The KZ Race profile below uses a more aggressive correction.` : targetLang==='es' ? `Equivalente teórico aproximado ${m[1]}. El perfil KZ Race de abajo usa una corrección más agresiva.` : `Theoretisches Äquivalent etwa ${m[1]}. Das KZ-Race-Profil unten verwendet eine aggressivere Korrektur.`;
      return preserveSpace(source,out);
    }
    if ((m = raw.match(/^Correzioni suggerite: (.+)\.$/))) {
      let changes=m[1];
      if(targetLang==='en') changes=changes.replace(/\bminimo\b/g,'idle').replace(/\btacca\b/g,'clip');
      if(targetLang==='es') changes=changes.replace(/\bminimo\b/g,'baja').replace(/\btacca\b/g,'posición');
      if(targetLang==='de') changes=changes.replace(/\bminimo\b/g,'Leerlauf').replace(/\btacca\b/g,'Clip');
      const prefix=targetLang==='en'?'Suggested corrections':targetLang==='es'?'Correcciones sugeridas':'Empfohlene Korrekturen';
      return preserveSpace(source,`${prefix}: ${changes}.`);
    }
    if ((m = raw.match(/^([+-]?\d+(?:[.,]\d+)?) vs baseline(?: · max (\d+))?$/))) {
      const base=targetLang==='en'?'vs baseline':targetLang==='es'?'vs referencia':'ggü. Referenz';
      const max=m[2]?(targetLang==='en'?` · max ${m[2]}`:targetLang==='es'?` · máx ${m[2]}`:` · max. ${m[2]}`):'';
      return preserveSpace(source,`${m[1]} ${base}${max}`);
    }
    if ((m = raw.match(/^Confronto polverizzatore: (.+)$/))) {
      const prefix=targetLang==='en'?'Atomizer comparison':targetLang==='es'?'Comparación del atomizador':'Zerstäuber-Vergleich';
      return preserveSpace(source,`${prefix}: ${translateCore(m[1],targetLang)}`);
    }
    if ((m = raw.match(/^più ricco (.+)$/))) {
      const p=targetLang==='en'?'richer':targetLang==='es'?'más rico':'fetter';
      return preserveSpace(source,`${p} ${m[1]}`);
    }
    if ((m = raw.match(/^più magro (.+)$/))) {
      const p=targetLang==='en'?'leaner':targetLang==='es'?'más pobre':'magerer';
      return preserveSpace(source,`${p} ${m[1]}`);
    }
    if ((m = raw.match(/^Risolvo (.+)\.\.\.$/))) {
      const p=targetLang==='en'?'Resolving':targetLang==='es'?'Resolviendo':'Wird aufgelöst';
      return preserveSpace(source,`${p} ${m[1]}...`);
    }
    if ((m = raw.match(/^Località ACI non risolta: (.+)$/))) {
      const p=targetLang==='en'?'ACI location not resolved':targetLang==='es'?'Ubicación ACI no resuelta':'ACI-Ort nicht aufgelöst';
      return preserveSpace(source,`${p}: ${m[1]}`);
    }
    if ((m = raw.match(/^ALFANO 7 · (\d+) giri classificati · (\d+) campioni T2$/))) {
      const out=targetLang==='en'?`ALFANO 7 · ${m[1]} classified laps · ${m[2]} T2 samples` :targetLang==='es'?`ALFANO 7 · ${m[1]} vueltas clasificadas · ${m[2]} muestras T2` :`ALFANO 7 · ${m[1]} gewertete Runden · ${m[2]} T2-Messwerte`;
      return preserveSpace(source,out);
    }
    if ((m = raw.match(/^(.+) · (\d+) campioni EGT$/))) {
      const word=targetLang==='en'?'EGT samples':targetLang==='es'?'muestras EGT':'EGT-Messwerte';
      return preserveSpace(source,`${m[1]} · ${m[2]} ${word}`);
    }
    if ((m = raw.match(/^Best lap: giro (\d+) · (.+)$/))) {
      const p=targetLang==='en'?'Best lap':targetLang==='es'?'Mejor vuelta':'Beste Runde';
      return preserveSpace(source,`${p}: ${targetLang==='de'?'Runde ':targetLang==='es'?'vuelta ': 'lap '}${m[1]} · ${m[2]}`);
    }
    if ((m = raw.match(/^Best lap (\d+): (.+)$/))) {
      const p=targetLang==='en'?'Best lap':targetLang==='es'?'Mejor vuelta':'Beste Runde';
      return preserveSpace(source,`${p} ${m[1]}: ${replacePhrases(m[2],targetLang)}`);
    }
    if ((m = raw.match(/^Sessione EGT (.+)$/))) {
      const p=targetLang==='en'?'EGT session':targetLang==='es'?'Sesión EGT':'EGT-Session';
      return preserveSpace(source,`${p} ${replacePhrases(m[1],targetLang)}`);
    }
    return null;
  }

  function replacePhrases(source,targetLang){
    let out=source;
    const replacements = targetLang==='en' ? [
      ['aria meno densa','less dense air'],['aria più densa','denser air'],['EGT MIN reale','Real EGT MIN'],['Acqua','Water'],['tendenza più magra','leaner tendency'],['variazione combinata numero/famiglia','combined size/family change'],['Caricamento archivio','Loading archive'],['campioni T2','T2 samples'],['giri classificati','classified laps']
    ] : targetLang==='es' ? [
      ['aria meno densa','aire menos denso'],['aria più densa','aire más denso'],['EGT MIN reale','EGT MÍN real'],['Acqua','Agua'],['tendenza più magra','tendencia más pobre'],['variazione combinata numero/famiglia','cambio combinado de tamaño/familia'],['Caricamento archivio','Cargando archivo'],['campioni T2','muestras T2'],['giri classificati','vueltas clasificadas']
    ] : [
      ['aria meno densa','weniger dichte Luft'],['aria più densa','dichtere Luft'],['EGT MIN reale','Reale EGT MIN'],['Acqua','Wasser'],['tendenza più magra','magerere Tendenz'],['variazione combinata numero/famiglia','kombinierte Größen-/Familienänderung'],['Caricamento archivio','Archiv wird geladen'],['campioni T2','T2-Messwerte'],['giri classificati','gewertete Runden']
    ];
    replacements.forEach(([a,b])=>{out=out.split(a).join(b)});
    return out;
  }

  function translateCore(source,targetLang){
    if(targetLang==='it') return source;
    const ex=exact(source,targetLang); if(ex!==null)return ex;
    const dy=dynamic(source,targetLang); if(dy!==null)return dy;
    return replacePhrases(source,targetLang);
  }

  function skipNode(node){
    const p=node.parentElement;
    if(!p)return false;
    return !!p.closest('svg,.kzBrandLogo,script,style,option');
  }

  function applyTextNode(node, external=false){
    if(!node || node.nodeType!==Node.TEXT_NODE || skipNode(node))return;
    if(external && nodeSource.has(node)){
      const previous=nodeSource.get(node);
      if(node.nodeValue===translateCore(previous,lang))return;
    }
    if(external || !nodeSource.has(node)) nodeSource.set(node,node.nodeValue);
    const source=nodeSource.get(node);
    const translated=translateCore(source,lang);
    if(node.nodeValue!==translated)node.nodeValue=translated;
  }

  function sourceAttrs(el){
    let map=attrSource.get(el);
    if(!map){map={};attrSource.set(el,map)}
    return map;
  }

  function applyAttr(el,name,external=false){
    if(!el?.hasAttribute?.(name) || el.closest?.('svg,.kzBrandLogo'))return;
    const map=sourceAttrs(el);
    if(external && name in map && el.getAttribute(name)===translateCore(map[name],lang))return;
    if(external || !(name in map))map[name]=el.getAttribute(name);
    const translated=translateCore(map[name],lang);
    if(el.getAttribute(name)!==translated)el.setAttribute(name,translated);
  }

  function walk(root, external=false){
    if(!root)return;
    if(root.nodeType===Node.TEXT_NODE){applyTextNode(root,external);return}
    if(root.nodeType!==Node.ELEMENT_NODE && root.nodeType!==Node.DOCUMENT_FRAGMENT_NODE && root.nodeType!==Node.DOCUMENT_NODE)return;
    if(root.nodeType===Node.ELEMENT_NODE){
      if(root.matches('svg,.kzBrandLogo,script,style'))return;
      ['placeholder','title','aria-label'].forEach(a=>applyAttr(root,a,external));
    }
    root.childNodes.forEach(n=>walk(n,external));
  }

  function setLanguage(next){
    if(!SUPPORTED.includes(next))next='it';
    lang=next;
    try{localStorage.setItem(STORAGE_KEY,lang)}catch{}
    document.documentElement.lang=lang;
    applying=true;
    try{walk(document,false)}finally{applying=false}
    const select=document.getElementById('languageSelect');
    if(select && select.value!==lang)select.value=lang;
  }

  function installSelector(){
    if(document.getElementById('languageSelect'))return;
    const mount=document.querySelector('.headerDataTools');
    if(!mount)return;
    const select=document.createElement('select');
    select.id='languageSelect';
    select.className='langSelect';
    select.setAttribute('aria-label','Lingua');
    select.setAttribute('title','Lingua');
    [['it','IT'],['en','EN'],['es','ES'],['de','DE']].forEach(([value,label])=>{
      const option=document.createElement('option');option.value=value;option.textContent=label;select.appendChild(option);
    });
    select.value=lang;
    select.addEventListener('change',()=>setLanguage(select.value));
    mount.appendChild(select);
  }

  function init(){
    try{
      const saved=localStorage.getItem(STORAGE_KEY);
      if(SUPPORTED.includes(saved))lang=saved;
    }catch{}
    installSelector();
    applying=true;
    try{walk(document,false)}finally{applying=false}
    document.documentElement.lang=lang;
    const observer=new MutationObserver(records=>{
      if(applying)return;
      applying=true;
      try{
        records.forEach(record=>{
          if(record.type==='characterData')applyTextNode(record.target,true);
          else if(record.type==='attributes')applyAttr(record.target,record.attributeName,true);
          else record.addedNodes.forEach(n=>walk(n,true));
        });
      }finally{applying=false}
    });
    observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','title','aria-label']});
  }

  window.KZI18N={setLanguage,getLanguage:()=>lang,translate:(text,target=lang)=>translateCore(String(text),target),supported:[...SUPPORTED]};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
