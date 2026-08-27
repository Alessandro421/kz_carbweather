/* KZ CarbWeather multilingual presentation layer.
   UI copy only: no carburation, density, EGT, telemetry or data logic is changed. */
(function(){
  const SUPPORTED=['it','en','es','de'];
  const STORAGE_KEY='cw_lang';

  /* Italian source -> [English, Spanish, German].
     Technical Dell'Orto codes, numeric values, track names and the SVG logo are intentionally untouched. */
  const D={
    'Lingua':['Language','Idioma','Sprache'],
    'Dati locali · Cloud se connesso':['Local data · Cloud when connected','Datos locales · Nube al conectar','Lokale Daten · Cloud bei Verbindung'],
    'Esporta tutto':['Export all','Exportar todo','Alles exportieren'],
    'Importa':['Import','Importar','Importieren'],
    'TRACK MODE':['TRACK MODE','MODO PISTA','STRECKENMODUS'],
    'Pista non selezionata':['No track selected','Circuito no seleccionado','Keine Strecke ausgewählt'],
    'Carica il meteo per iniziare':['Load weather to start','Carga el tiempo para empezar','Wetter laden, um zu starten'],
    'GETTO MAX':['MAIN JET','CHICLÉ PRINCIPAL','HAUPTDÜSE'],
    'POLVERIZZATORE':['ATOMIZER','ATOMIZADOR','ZERSTÄUBER'],
    'SPILLO / TACCA':['NEEDLE / CLIP','AGUJA / CLIP','NADEL / CLIP'],
    'ULTIMA EGT MIN REALE':['LAST REAL EGT MIN','ÚLTIMA EGT MÍN REAL','LETZTE REALE EGT MIN'],
    'ULTIMA EGT MAX':['LAST EGT MAX','ÚLTIMA EGT MÁX','LETZTE EGT MAX'],
    'METEO':['WEATHER','TIEMPO','WETTER'],
    'Su iPhone/Android puoi aggiungere questa pagina alla schermata Home per usarla come una quasi-app.':['On iPhone/Android you can add this page to the Home screen and use it like an app.','En iPhone/Android puedes añadir esta página a la pantalla de inicio y usarla como una app.','Auf iPhone/Android kannst du diese Seite zum Home-Bildschirm hinzufügen und wie eine App verwenden.'],

    '01 · Meteo live':['01 · Live weather','01 · Tiempo en vivo','01 · Live-Wetter'],
    'Condizioni attuali':['Current conditions','Condiciones actuales','Aktuelle Bedingungen'],
    'Località / pista':['Location / track','Ubicación / circuito','Ort / Strecke'],
    'Es. Lonato, Castelletto di Branduzzo, Siena...':['E.g. Lonato, Castelletto di Branduzzo, Siena...','Ej. Lonato, Castelletto di Branduzzo, Siena...','Z. B. Lonato, Castelletto di Branduzzo, Siena...'],
    'Cerca meteo':['Search weather','Buscar tiempo','Wetter suchen'],
    'Inserisci una località oppure usa il GPS.':['Enter a location or use GPS.','Introduce una ubicación o usa el GPS.','Ort eingeben oder GPS verwenden.'],
    'Temperatura':['Temperature','Temperatura','Temperatur'],
    'Umidità':['Humidity','Humedad','Luftfeuchtigkeit'],
    'Pressione al suolo':['Surface pressure','Presión en superficie','Bodendruck'],
    'Densità aria':['Air density','Densidad del aire','Luftdichte'],
    'Density altitude':['Density altitude','Altitud de densidad','Dichtehöhe'],
    'm circa':['approx. m','m aprox.','ca. m'],

    '02 · Baseline':['02 · Baseline','02 · Referencia','02 · Referenz'],
    'Setup di riferimento':['Reference setup','Configuración de referencia','Referenz-Setup'],
    'Temperatura °C':['Temperature °C','Temperatura °C','Temperatur °C'],
    'Pressione hPa':['Pressure hPa','Presión hPa','Druck hPa'],
    'Umidità %':['Humidity %','Humedad %','Luftfeuchtigkeit %'],
    'Carburatore baseline':['Baseline carburetor','Carburador de referencia','Referenz-Vergaser'],
    'Getto max':['Main jet','Chiclé principal','Hauptdüse'],
    'Spillo':['Needle','Aguja','Nadel'],
    'Tacca · step 0,5':['Clip · step 0.5','Clip · paso 0,5','Clip · Schritt 0,5'],
    'Polverizzatore':['Atomizer','Atomizador','Zerstäuber'],
    'Getto minimo 12995':['Idle jet 12995','Chiclé de baja 12995','Leerlaufdüse 12995'],
    'Emulsionatore minimo B 13086':['Idle emulsifier B 13086','Emulsionador de baja B 13086','Leerlauf-Emulsionsrohr B 13086'],
    'Vite aria (giri)':['Air screw (turns)','Tornillo de aire (vueltas)','Luftschraube (Umdr.)'],
    'Valvola gas':['Throttle slide','Corredera','Gasschieber'],
    'Geometria spillo selezionato':['Selected needle geometry','Geometría de la aguja seleccionada','Geometrie der gewählten Nadel'],
    'Ø tratto cilindrico A (mm)':['Ø straight section A (mm)','Ø tramo cilíndrico A (mm)','Ø zylindrischer Bereich A (mm)'],
    'Ø punta B (mm)':['Ø tip B (mm)','Ø punta B (mm)','Ø Spitze B (mm)'],
    'Lunghezza cono C (mm)':['Taper length C (mm)','Longitud del cono C (mm)','Konuslänge C (mm)'],
    'Le quote A/B/C vengono caricate automaticamente dal database tecnico. Le varianti senza quote verificate restano selezionabili ma vengono marcate “geometria n/d”.':['A/B/C dimensions are loaded automatically from the technical database. Variants without verified dimensions remain selectable and are marked “geometry n/a”.','Las cotas A/B/C se cargan automáticamente desde la base de datos técnica. Las variantes sin cotas verificadas siguen disponibles y se marcan como “geometría n/d”.','Die Maße A/B/C werden automatisch aus der technischen Datenbank geladen. Varianten ohne verifizierte Maße bleiben auswählbar und werden als „Geometrie n. v.“ markiert.'],
    'Salva baseline':['Save baseline','Guardar referencia','Referenz speichern'],
    'Usa meteo attuale come baseline':['Use current weather as baseline','Usar el tiempo actual como referencia','Aktuelles Wetter als Referenz verwenden'],

    '03 · Correzione meteo':['03 · Weather correction','03 · Corrección meteorológica','03 · Wetterkorrektur'],
    'Quanto cambia l’aria rispetto alla baseline?':['How much has the air changed vs baseline?','¿Cuánto cambia el aire respecto a la referencia?','Wie stark ändert sich die Luft gegenüber der Referenz?'],
    'Variazione densità aria':['Air-density change','Variación de densidad del aire','Änderung der Luftdichte'],
    'Carica il meteo per calcolare':['Load weather to calculate','Carga el tiempo para calcular','Wetter zum Berechnen laden'],
    'Getto max baseline':['Baseline main jet','Chiclé principal de referencia','Referenz-Hauptdüse'],
    'Getto max equivalente stimato':['Estimated equivalent main jet','Chiclé principal equivalente estimado','Geschätzte äquivalente Hauptdüse'],
    'La correzione sarà mostrata dopo aver caricato il meteo.':['The correction will be shown after loading the weather.','La corrección se mostrará después de cargar el tiempo.','Die Korrektur wird nach dem Laden des Wetters angezeigt.'],
    'Il getto equivalente è una stima fisica basata sulla variazione di densità aria. Non sostituisce lettura candela/EGT, comportamento motore e verifica in pista.':['The equivalent jet is a physics-based estimate from the change in air density. It does not replace spark-plug/EGT readings, engine behavior or on-track verification.','El chiclé equivalente es una estimación física basada en la variación de densidad del aire. No sustituye la lectura de bujía/EGT, el comportamiento del motor ni la verificación en pista.','Die äquivalente Düse ist eine physikalische Schätzung auf Basis der Luftdichteänderung. Sie ersetzt weder Kerzen-/EGT-Auswertung noch Motorverhalten und Prüfung auf der Strecke.'],

    '04 · Setup comparator':['04 · Setup comparison','04 · Comparador de setup','04 · Setup-Vergleich'],
    'Confronta una modifica di carburazione':['Compare a jetting change','Compara un cambio de carburación','Vergaserabstimmung vergleichen'],
    'Getto max test':['Test main jet','Chiclé principal de prueba','Test-Hauptdüse'],
    'Spillo test':['Test needle','Aguja de prueba','Test-Nadel'],
    'Tacca test · step 0,5':['Test clip · step 0.5','Clip de prueba · paso 0,5','Test-Clip · Schritt 0,5'],
    'Polverizzatore test':['Test atomizer','Atomizador de prueba','Test-Zerstäuber'],
    'Getto minimo 12995 test':['Test idle jet 12995','Chiclé de baja 12995 de prueba','Test-Leerlaufdüse 12995'],
    'Emulsionatore minimo B test':['Test idle emulsifier B','Emulsionador de baja B de prueba','Test-Leerlauf-Emulsionsrohr B'],
    'Vite aria test':['Test air screw','Tornillo de aire de prueba','Test-Luftschraube'],
    'Valvola gas test':['Test throttle slide','Corredera de prueba','Test-Gasschieber'],
    'Geometria spillo test':['Test needle geometry','Geometría de la aguja de prueba','Geometrie der Test-Nadel'],
    'Confronta setup':['Compare setup','Comparar setup','Setup vergleichen'],
    'Copia baseline':['Copy baseline','Copiar referencia','Referenz kopieren'],
    'Confronto polverizzatore: —':['Atomizer comparison: —','Comparación del atomizador: —','Zerstäuber-Vergleich: —'],
    'Effetto stimato per apertura gas':['Estimated effect by throttle opening','Efecto estimado por apertura de gas','Geschätzter Effekt nach Gasöffnung'],
    'Giallo = più ricco rispetto alla baseline · blu = più magro. Le tacche disponibili dipendono dallo spillo Dell’Orto (T = 3, 4 o 5); la mezza tacca resta selezionabile tramite la clip/spessore.':['Yellow = richer than baseline · blue = leaner. Available clip positions depend on the Dell’Orto needle (T = 3, 4 or 5); half-steps remain selectable using the clip/spacer.','Amarillo = más rico que la referencia · azul = más pobre. Las posiciones disponibles dependen de la aguja Dell’Orto (T = 3, 4 o 5); los medios pasos siguen disponibles mediante clip/espaciador.','Gelb = fetter als Referenz · Blau = magerer. Die verfügbaren Clip-Positionen hängen von der Dell’Orto-Nadel ab (T = 3, 4 oder 5); halbe Schritte bleiben über Clip/Distanzring wählbar.'],

    '05 · Cosa influenza cosa':['05 · What affects what','05 · Qué influye en qué','05 · Was beeinflusst was'],
    'Mappa rapida carburatore':['Quick carburetor map','Mapa rápido del carburador','Schnellübersicht Vergaser'],
    'Apertura':['Opening','Apertura','Öffnung'],
    'Componenti dominanti':['Dominant components','Componentes dominantes','Dominierende Komponenten'],
    'minimo':['idle jet','baja','Leerlaufdüse'],
    'vite aria':['air screw','tornillo de aire','Luftschraube'],
    'valvola':['slide','corredera','Gasschieber'],
    'Ø cilindrico spillo':['needle straight diameter','Ø cilíndrico de aguja','zyl. Nadeldurchmesser'],
    'polverizzatore':['atomizer','atomizador','Zerstäuber'],
    'spillo':['needle','aguja','Nadel'],
    'tacca':['clip','clip','Clip'],
    'cono spillo':['needle taper','cono de aguja','Nadelkonus'],
    'getto max':['main jet','chiclé principal','Hauptdüse'],
    'punta spillo':['needle tip','punta de aguja','Nadelspitze'],
    'Regola pratica:':['Rule of thumb:','Regla práctica:','Faustregel:'],
    'il meteo cambia il fabbisogno di benzina in tutto il range, ma il getto max è il primo riferimento per la zona di pieno carico. Lo spillo si usa poi per rifinire la progressione.':['weather changes fuel demand across the whole range, but the main jet is the first reference at full load. The needle is then used to fine-tune progression.','el tiempo cambia la demanda de combustible en todo el rango, pero el chiclé principal es la primera referencia a plena carga. Después se usa la aguja para afinar la progresión.','das Wetter verändert den Kraftstoffbedarf über den gesamten Bereich, aber die Hauptdüse ist die erste Referenz bei Volllast. Danach wird die Nadel zur Feinabstimmung des Übergangs verwendet.'],

    '06 · Carburazione suggerita':['06 · Suggested jetting','06 · Carburación sugerida','06 · Empfohlene Vergaserabstimmung'],
    'Setup VHSH 30 consigliato per il meteo attuale':['Recommended VHSH 30 setup for current weather','Setup VHSH 30 recomendado para el tiempo actual','Empfohlenes VHSH-30-Setup für das aktuelle Wetter'],
    'Profilo: KZ Race':['Profile: KZ Race','Perfil: KZ Race','Profil: KZ Race'],
    'Carica il meteo della pista per generare la carburazione suggerita partendo dalla tua baseline.':['Load track weather to generate the suggested jetting from your baseline.','Carga el tiempo del circuito para generar la carburación sugerida a partir de tu referencia.','Streckenwetter laden, um die Vergaserempfehlung aus deiner Referenz zu erzeugen.'],
    'Getto MAX':['Main jet','Chiclé principal','Hauptdüse'],
    'serie K':['K series','serie K','K-Serie'],
    'Tacca':['Clip','Clip','Clip'],
    'step 0,5':['step 0.5','paso 0,5','Schritt 0,5'],
    'Getto minimo':['Idle jet','Chiclé de baja','Leerlaufdüse'],
    'Emulsionatore minimo':['Idle emulsifier','Emulsionador de baja','Leerlauf-Emulsionsrohr'],
    'serie B':['B series','serie B','B-Serie'],
    'Vite aria':['Air screw','Tornillo de aire','Luftschraube'],
    'giri':['turns','vueltas','Umdr.'],
    'La raccomandazione viene calcolata rispetto alla carburazione baseline salvata.':['The recommendation is calculated against the saved baseline jetting.','La recomendación se calcula respecto a la carburación de referencia guardada.','Die Empfehlung wird gegenüber der gespeicherten Referenz-Vergaserabstimmung berechnet.'],
    'Copia nel setup test':['Copy to test setup','Copiar al setup de prueba','In Test-Setup kopieren'],
    'Strategia KZ Race: il getto massimo viene corretto in modo lineare con la variazione di densità aria. Il polverizzatore reagisce già da circa ±2% di scostamento; tacca e circuito del minimo restano più conservativi. La verifica finale resta EGT + comportamento motore.':['KZ Race strategy: the main jet is corrected linearly with the change in air density. The atomizer starts reacting from about ±2% deviation; clip position and idle circuit remain more conservative. Final verification remains EGT + engine behavior.','Estrategia KZ Race: el chiclé principal se corrige linealmente con la variación de densidad del aire. El atomizador empieza a reaccionar desde aproximadamente ±2% de desviación; el clip y el circuito de baja siguen siendo más conservadores. La verificación final sigue siendo EGT + comportamiento del motor.','KZ-Race-Strategie: Die Hauptdüse wird linear mit der Änderung der Luftdichte korrigiert. Der Zerstäuber reagiert bereits ab etwa ±2 % Abweichung; Clip-Position und Leerlaufkreis bleiben konservativer. Die abschließende Prüfung bleibt EGT + Motorverhalten.'],

    '07 · Telemetria scarico':['07 · Exhaust telemetry','07 · Telemetría de escape','07 · Abgas-Telemetrie'],
    'Importa sessione e analizza EGT':['Import session and analyze EGT','Importar sesión y analizar EGT','Session importieren und EGT analysieren'],
    'Sessione ALFANO 7 ZIP oppure CSV/TXT':['ALFANO 7 session ZIP or CSV/TXT','Sesión ALFANO 7 ZIP o CSV/TXT','ALFANO-7-Session ZIP oder CSV/TXT'],
    'Target minimo EGT °C':['Minimum EGT target °C','Objetivo mínimo EGT °C','Unteres EGT-Ziel °C'],
    'Target massimo EGT °C':['Maximum EGT target °C','Objetivo máximo EGT °C','Oberes EGT-Ziel °C'],
    'Soglia EGT MIN reale °C':['Real EGT MIN threshold °C','Umbral EGT MÍN real °C','Schwelle reale EGT MIN °C'],
    'Analizza sessione':['Analyze session','Analizar sesión','Session analysieren'],
    'Reset':['Reset','Restablecer','Zurücksetzen'],
    'Puoi caricare direttamente lo ZIP originale ALFANO 7. Per il formato ALFANO KZ: T1 viene letto come acqua e T2 come EGT/scarico.':['You can upload the original ALFANO 7 ZIP directly. For the ALFANO KZ format: T1 is read as water temperature and T2 as EGT/exhaust.','Puedes cargar directamente el ZIP original de ALFANO 7. Para el formato ALFANO KZ: T1 se interpreta como temperatura de agua y T2 como EGT/escape.','Du kannst die originale ALFANO-7-ZIP-Datei direkt laden. Beim ALFANO-KZ-Format wird T1 als Wassertemperatur und T2 als EGT/Abgas gelesen.'],
    'EGT MIN grezza':['Raw EGT MIN','EGT MÍN bruta','EGT MIN roh'],
    'EGT MIN reale':['Real EGT MIN','EGT MÍN real','Reale EGT MIN'],
    'EGT MIN REALE':['REAL EGT MIN','EGT MÍN REAL','REALE EGT MIN'],
    '≥ soglia':['≥ threshold','≥ umbral','≥ Schwelle'],
    'Campioni nel target':['Samples in target','Muestras en objetivo','Messwerte im Zielbereich'],
    'Picco RPM associato':['RPM at EGT peak','RPM en el pico EGT','Drehzahl am EGT-Peak'],
    'Sotto target':['Below target','Por debajo del objetivo','Unter Zielbereich'],
    'campioni sotto':['samples below','muestras por debajo de','Messwerte unter'],
    'Sopra target':['Above target','Por encima del objetivo','Über Zielbereich'],
    'campioni sopra':['samples above','muestras por encima de','Messwerte über'],
    'Importa una sessione per valutare la finestra 400–630 °C.':['Import a session to evaluate the 400–630 °C window.','Importa una sesión para evaluar la ventana de 400–630 °C.','Session importieren, um das Fenster 400–630 °C zu bewerten.'],
    'Analisi giro per giro':['Lap-by-lap analysis','Análisis vuelta a vuelta','Rundenanalyse'],
    'Giro':['Lap','Vuelta','Runde'],
    'Tempo':['Time','Tiempo','Zeit'],
    'ACQUA':['WATER','AGUA','WASSER'],
    'Vel. max':['Max speed','Vel. máx','V max'],
    'Dettaglio canali rilevati':['Detected channel details','Detalle de canales detectados','Details erkannter Kanäle'],
    'ALFANO 7: T1 = acqua · T2 = EGT/scarico · RPM · Speed GPS':['ALFANO 7: T1 = water · T2 = EGT/exhaust · RPM · GPS speed','ALFANO 7: T1 = agua · T2 = EGT/escape · RPM · velocidad GPS','ALFANO 7: T1 = Wasser · T2 = EGT/Abgas · RPM · GPS-Geschwindigkeit'],
    "Il range 400–630 °C viene usato come riferimento operativo dell'app. La EGT MIN reale ignora i campioni sotto la soglia configurata (default 350 °C). La lettura va interpretata insieme a regime motore, posizione gas, durata del pieno carico e posizione della sonda EGT.":['The 400–630 °C range is used as the app’s operating reference. Real EGT MIN ignores samples below the configured threshold (default 350 °C). The reading must be interpreted together with engine speed, throttle position, duration at full load and EGT probe position.','El rango 400–630 °C se usa como referencia operativa de la app. La EGT MÍN real ignora las muestras por debajo del umbral configurado (por defecto 350 °C). La lectura debe interpretarse junto con el régimen del motor, la posición del acelerador, la duración a plena carga y la posición de la sonda EGT.','Der Bereich 400–630 °C dient als Betriebsreferenz der App. Die reale EGT MIN ignoriert Messwerte unterhalb der eingestellten Schwelle (Standard 350 °C). Die Messung ist zusammen mit Drehzahl, Gasstellung, Volllastdauer und Position der EGT-Sonde zu interpretieren.'],

    '08 · Track log':['08 · Track log','08 · Registro de pista','08 · Streckenlog'],
    'Salva prove e sensazioni':['Save runs and feedback','Guardar pruebas y sensaciones','Tests und Eindrücke speichern'],
    'Data':['Date','Fecha','Datum'],
    'Pista / località':['Track / location','Circuito / ubicación','Strecke / Ort'],
    'Acqua max °C':['Max water °C','Agua máx °C','Wasser max °C'],
    'Valutazione 1–5':['Rating 1–5','Valoración 1–5','Bewertung 1–5'],
    'Note (ripresa, borbotta, vuoto, allungo, colore candela...)':['Notes (pickup, burble, hesitation, top-end, spark-plug color...)','Notas (respuesta, rateo, vacío, estirada, color de bujía...)','Notizen (Ansprechverhalten, Stottern, Loch, Ausdrehen, Kerzenbild...)'],
    'Salva prova':['Save run','Guardar prueba','Test speichern'],
    'Esporta CSV':['Export CSV','Exportar CSV','CSV exportieren'],
    'Cancella log':['Clear log','Borrar registro','Log löschen'],
    'Luogo':['Location','Lugar','Ort'],
    'Meteo':['Weather','Tiempo','Wetter'],
    'Score':['Score','Puntuación','Bewertung'],
    'Note':['Notes','Notas','Notizen'],
    'KZ CarbWeather v1.6 · Strumento di supporto alla messa a punto VHSH 30 KZ. Carburazione suggerita da meteo + ALFANO 7 · EGT MIN reale filtrata (default ≥350 °C) · target max 630 °C.':['KZ CarbWeather v1.6 · VHSH 30 KZ tuning support tool. Suggested jetting from weather + ALFANO 7 · filtered real EGT MIN (default ≥350 °C) · max target 630 °C.','KZ CarbWeather v1.6 · Herramienta de apoyo para la puesta a punto VHSH 30 KZ. Carburación sugerida por tiempo + ALFANO 7 · EGT MÍN real filtrada (por defecto ≥350 °C) · objetivo máx. 630 °C.','KZ CarbWeather v1.6 · Abstimmungshilfe für VHSH 30 KZ. Vergaserempfehlung aus Wetter + ALFANO 7 · gefilterte reale EGT MIN (Standard ≥350 °C) · oberes Ziel 630 °C.'],

    /* Dialogs / local backup */
    'ATTENZIONE':['WARNING','ATENCIÓN','ACHTUNG'],
    'Conferma':['Confirm','Confirmar','Bestätigen'],
    'Conferma eliminazione':['Confirm deletion','Confirmar eliminación','Löschen bestätigen'],
    'Annulla':['Cancel','Cancelar','Abbrechen'],
    'Backup JSON esportato.':['JSON backup exported.','Copia JSON exportada.','JSON-Backup exportiert.'],
    'Backup non riconosciuto o incompleto.':['Backup not recognized or incomplete.','Copia no reconocida o incompleta.','Backup nicht erkannt oder unvollständig.'],
    'Backup ripristinato nel browser.':['Backup restored in the browser.','Copia restaurada en el navegador.','Backup im Browser wiederhergestellt.'],

    /* Weather / search runtime */
    'Inserisci una località.':['Enter a location.','Introduce una ubicación.','Ort eingeben.'],
    'Ricerca località...':['Searching location...','Buscando ubicación...','Ort wird gesucht...'],
    'Località non trovata':['Location not found','Ubicación no encontrada','Ort nicht gefunden'],
    'Seleziona la località corretta tra i risultati.':['Select the correct location from the results.','Selecciona la ubicación correcta entre los resultados.','Den richtigen Ort aus den Ergebnissen auswählen.'],
    'GPS non disponibile.':['GPS unavailable.','GPS no disponible.','GPS nicht verfügbar.'],
    'Lettura posizione...':['Reading position...','Leyendo posición...','Position wird ermittelt...'],
    'Posizione GPS':['GPS position','Posición GPS','GPS-Position'],
    'GPS non disponibile/consentito.':['GPS unavailable/not allowed.','GPS no disponible/no autorizado.','GPS nicht verfügbar/nicht freigegeben.'],
    'Caricamento meteo...':['Loading weather...','Cargando tiempo...','Wetter wird geladen...'],
    'Dati non disponibili':['Data unavailable','Datos no disponibles','Daten nicht verfügbar'],
    'Carica prima il meteo.':['Load the weather first.','Carga primero el tiempo.','Zuerst das Wetter laden.'],
    'ARIA PIÙ DENSA':['DENSER AIR','AIRE MÁS DENSO','DICHTERE LUFT'],
    'Tende a smagrire':['Tends leaner','Tiende a empobrecer','Tendenz magerer'],
    'ARIA MENO DENSA':['LESS DENSE AIR','AIRE MENOS DENSO','WENIGER DICHTE LUFT'],
    'Tende a ingrassire':['Tends richer','Tiende a enriquecer','Tendenz fetter'],
    'Tende ad ingrassare':['Tends richer','Tiende a enriquecer','Tendenz fetter'],
    'QUASI UGUALE':['ALMOST SAME','CASI IGUAL','FAST GLEICH'],
    'Correzione minima':['Minimal correction','Corrección mínima','Minimale Korrektur'],
    'Condizioni vicine alla baseline: mantieni il setup.':['Conditions close to baseline: keep the setup.','Condiciones cercanas a la referencia: mantén el setup.','Bedingungen nahe der Referenz: Setup beibehalten.'],
    'Confronto polverizzatore: nessuna variazione.':['Atomizer comparison: no change.','Comparación del atomizador: sin cambios.','Zerstäuber-Vergleich: keine Änderung.'],
    '≈ uguale':['≈ same','≈ igual','≈ gleich'],
    'Reverse geocoding non disponibile':['Reverse geocoding unavailable','Geocodificación inversa no disponible','Reverse-Geocoding nicht verfügbar'],
    'Inserisci una località o il nome di una pista.':['Enter a location or track name.','Introduce una ubicación o el nombre de un circuito.','Ort oder Streckenname eingeben.'],
    'Ricerca pista / località...':['Searching track / location...','Buscando circuito / ubicación...','Strecke / Ort wird gesucht...'],
    'Pista o località non trovata':['Track or location not found','Circuito o ubicación no encontrados','Strecke oder Ort nicht gefunden'],
    'Seleziona la pista o la località corretta tra i risultati.':['Select the correct track or location from the results.','Selecciona el circuito o la ubicación correctos entre los resultados.','Die richtige Strecke oder den richtigen Ort aus den Ergebnissen auswählen.'],
    'Seleziona la pista corretta tra i risultati.':['Select the correct track from the results.','Selecciona el circuito correcto entre los resultados.','Die richtige Strecke aus den Ergebnissen auswählen.'],
    'Lettura posizione GPS…':['Reading GPS position…','Leyendo posición GPS…','GPS-Position wird ermittelt…'],
    'Posizione rilevata. Identifico la località…':['Position detected. Identifying location…','Posición detectada. Identificando ubicación…','Position erkannt. Ort wird ermittelt…'],

    /* Telemetry runtime */
    'Seleziona una sessione.':['Select a session.','Selecciona una sesión.','Session auswählen.'],
    'Analisi sessione in corso...':['Analyzing session...','Analizando sesión...','Session wird analysiert...'],
    'Modulo ZIP non disponibile.':['ZIP module unavailable.','Módulo ZIP no disponible.','ZIP-Modul nicht verfügbar.'],
    'Nessun file LAP_x trovato.':['No LAP_x file found.','No se encontró ningún archivo LAP_x.','Keine LAP_x-Datei gefunden.'],
    'Nessun giro con T2 valido.':['No lap with valid T2.','Ninguna vuelta con T2 válido.','Keine Runde mit gültigem T2.'],
    'Tempi giro non disponibili.':['Lap times unavailable.','Tiempos de vuelta no disponibles.','Rundenzeiten nicht verfügbar.'],
    'File troppo corto.':['File is too short.','El archivo es demasiado corto.','Datei ist zu kurz.'],
    'Colonna EGT non trovata.':['EGT column not found.','No se encontró la columna EGT.','EGT-Spalte nicht gefunden.'],
    'Import telemetria non riuscito.':['Telemetry import failed.','Error al importar la telemetría.','Telemetrie-Import fehlgeschlagen.'],

    /* Track log runtime */
    'Nessun log da esportare.':['No log to export.','No hay registros para exportar.','Kein Log zum Exportieren.'],
    'Cancellare tutti i log salvati? Questa operazione rimuove i dati locali del track log. Se il cloud è connesso, i dati cloud non vengono cancellati automaticamente.':['Delete all saved logs? This removes local track-log data. If cloud is connected, cloud data is not deleted automatically.','¿Borrar todos los registros guardados? Esta operación elimina los datos locales del registro de pista. Si la nube está conectada, los datos en la nube no se borran automáticamente.','Alle gespeicherten Logs löschen? Dadurch werden die lokalen Streckenlog-Daten entfernt. Bei verbundener Cloud werden Cloud-Daten nicht automatisch gelöscht.'],
    'Cancella track log':['Clear track log','Borrar registro de pista','Streckenlog löschen'],
    'Track log locale cancellato.':['Local track log cleared.','Registro de pista local borrado.','Lokaler Streckenlog gelöscht.'],

    /* Cloud */
    'ACCESSO':['SIGN IN','ACCESO','ANMELDUNG'],
    'Login':['Login','Iniciar sesión','Anmelden'],
    'LOGIN':['LOGIN','ACCESO','ANMELDEN'],
    'Login…':['Signing in…','Iniciando sesión…','Anmeldung…'],
    'Password':['Password','Contraseña','Passwort'],
    'Crea account':['Create account','Crear cuenta','Konto erstellen'],
    'Logout':['Logout','Cerrar sesión','Abmelden'],
    'ONLINE':['ONLINE','EN LÍNEA','ONLINE'],
    'NON DISPONIBILE':['UNAVAILABLE','NO DISPONIBLE','NICHT VERFÜGBAR'],
    'SYNC…':['SYNC…','SINCRONIZANDO…','SYNC…'],
    'ERRORE':['ERROR','ERROR','FEHLER'],
    'CONNESSO COME':['SIGNED IN AS','CONECTADO COMO','ANGEMELDET ALS'],
    'ARCHIVIO CLOUD':['CLOUD ARCHIVE','ARCHIVO EN LA NUBE','CLOUD-ARCHIV'],
    'BASELINE':['BASELINE','REFERENCIA','REFERENZ'],
    'TRACK LOG':['TRACK LOG','REGISTRO DE PISTA','STRECKENLOG'],
    'GIRI':['LAPS','VUELTAS','RUNDEN'],
    'Caricamento archivio…':['Loading archive…','Cargando archivo…','Archiv wird geladen…'],
    'Sync ora':['Sync now','Sincronizar ahora','Jetzt synchronisieren'],
    'Login per sincronizzare PC e smartphone.':['Sign in to sync PC and smartphone.','Inicia sesión para sincronizar PC y smartphone.','Anmelden, um PC und Smartphone zu synchronisieren.'],
    'Cloud connesso. I dati sono sincronizzati con il tuo account.':['Cloud connected. Data is synced with your account.','Nube conectada. Los datos están sincronizados con tu cuenta.','Cloud verbunden. Die Daten werden mit deinem Konto synchronisiert.'],
    'Supabase · EU Central · dati privati del tuo account':['Supabase · EU Central · private data for your account','Supabase · EU Central · datos privados de tu cuenta','Supabase · EU Central · private Daten deines Kontos'],
    'Nessuna sessione ALFANO salvata.':['No saved ALFANO sessions.','No hay sesiones ALFANO guardadas.','Keine gespeicherten ALFANO-Sessions.'],
    'Sessione ALFANO':['ALFANO session','Sesión ALFANO','ALFANO-Session'],
    'Riepilogo sessione salvato':['Saved session summary','Resumen de sesión guardado','Gespeicherte Session-Zusammenfassung'],
    'Archivio non disponibile.':['Archive unavailable.','Archivo no disponible.','Archiv nicht verfügbar.'],
    'Errore lettura archivio cloud.':['Error reading cloud archive.','Error al leer el archivo en la nube.','Fehler beim Lesen des Cloud-Archivs.'],
    'Utente':['User','Usuario','Benutzer'],
    'Inserisci email e password.':['Enter email and password.','Introduce email y contraseña.','E-Mail und Passwort eingeben.'],
    'Connesso. Sincronizzazione in corso…':['Connected. Sync in progress…','Conectado. Sincronización en curso…','Verbunden. Synchronisierung läuft…'],
    'Email valida e password di almeno 6 caratteri.':['Enter a valid email and a password of at least 6 characters.','Introduce un email válido y una contraseña de al menos 6 caracteres.','Gültige E-Mail und ein Passwort mit mindestens 6 Zeichen eingeben.'],
    'Creazione account...':['Creating account...','Creando cuenta...','Konto wird erstellt...'],
    'Creazione account…':['Creating account…','Creando cuenta…','Konto wird erstellt…'],
    'Account creato e connesso.':['Account created and connected.','Cuenta creada y conectada.','Konto erstellt und verbunden.'],
    'Account creato. Controlla la mail di conferma, poi fai login.':['Account created. Check the confirmation email, then sign in.','Cuenta creada. Revisa el correo de confirmación y luego inicia sesión.','Konto erstellt. Bestätigungs-E-Mail prüfen und anschließend anmelden.'],
    'Account creato. Controlla la mail di conferma, poi torna qui per il login.':['Account created. Check the confirmation email, then return here to sign in.','Cuenta creada. Revisa el correo de confirmación y vuelve aquí para iniciar sesión.','Konto erstellt. Bestätigungs-E-Mail prüfen und anschließend hier anmelden.'],
    'Email confermata. KZ Cloud è pronto.':['Email confirmed. KZ Cloud is ready.','Email confirmado. KZ Cloud está listo.','E-Mail bestätigt. KZ Cloud ist bereit.'],
    'Fai login prima.':['Sign in first.','Inicia sesión primero.','Zuerst anmelden.'],
    'Sincronizzazione completata.':['Synchronization complete.','Sincronización completada.','Synchronisierung abgeschlossen.'],
    'Errore sync':['Sync error','Error de sincronización','Synchronisierungsfehler']
  };

  const nodeSource=new WeakMap();
  const attrSource=new WeakMap();
  let lang='it';
  let applying=false;

  const langIndex=l=>l==='en'?0:l==='es'?1:2;
  const normalized=s=>String(s).trim().replace(/\s+/g,' ');
  const preserveSpace=(source,translated)=>(source.match(/^\s*/)?.[0]||'')+translated+(source.match(/\s*$/)?.[0]||'');

  function exact(source,target){
    const row=D[normalized(source)];
    if(!row||target==='it')return null;
    return preserveSpace(source,row[langIndex(target)]);
  }

  function phrases(source,target){
    if(target==='it')return source;
    let out=source;
    const rows=target==='en' ? [
      ['PISTA ACI','ACI TRACK'],['aria meno densa','less dense air'],['aria più densa','denser air'],['EGT MIN reale','Real EGT MIN'],['EGT MIN REALE','REAL EGT MIN'],['acqua','water'],['Acqua','Water'],['tendenza più magra','leaner tendency'],['variazione combinata numero/famiglia','combined size/family change'],['campioni T2','T2 samples'],['giri classificati','classified laps'],[' · aria ',' · air '],['Italia','Italy']
    ] : target==='es' ? [
      ['PISTA ACI','CIRCUITO ACI'],['aria meno densa','aire menos denso'],['aria più densa','aire más denso'],['EGT MIN reale','EGT MÍN real'],['EGT MIN REALE','EGT MÍN REAL'],['acqua','agua'],['Acqua','Agua'],['tendenza più magra','tendencia más pobre'],['variazione combinata numero/famiglia','cambio combinado de tamaño/familia'],['campioni T2','muestras T2'],['giri classificati','vueltas clasificadas'],[' · aria ',' · aire ']
    ] : [
      ['PISTA ACI','ACI-STRECKE'],['aria meno densa','weniger dichte Luft'],['aria più densa','dichtere Luft'],['EGT MIN reale','Reale EGT MIN'],['EGT MIN REALE','REALE EGT MIN'],['acqua','Wasser'],['Acqua','Wasser'],['tendenza più magra','magerere Tendenz'],['variazione combinata numero/famiglia','kombinierte Größen-/Familienänderung'],['campioni T2','T2-Messwerte'],['giri classificati','gewertete Runden'],[' · aria ',' · Luft '],['Italia','Italien']
    ];
    rows.forEach(([a,b])=>{out=out.split(a).join(b)});
    return out;
  }

  function dynamic(source,target){
    if(target==='it')return source;
    const raw=normalized(source);
    if(!raw)return source;
    let m,out;

    if((m=raw.match(/^Tacca · (\d+) tacche fisiche · step 0,5$/))){
      out=target==='en'?`Clip · ${m[1]} physical positions · step 0.5`:target==='es'?`Clip · ${m[1]} posiciones físicas · paso 0,5`:`Clip · ${m[1]} physische Positionen · Schritt 0,5`;
      return preserveSpace(source,out);
    }
    if((m=raw.match(/^Tacca test · (\d+) tacche fisiche · step 0,5$/))){
      out=target==='en'?`Test clip · ${m[1]} physical positions · step 0.5`:target==='es'?`Clip de prueba · ${m[1]} posiciones físicas · paso 0,5`:`Test-Clip · ${m[1]} physische Positionen · Schritt 0,5`;
      return preserveSpace(source,out);
    }
    if((m=raw.match(/^(.+): T (\d+) tacche · geometria n\/d\.$/))){
      out=target==='en'?`${m[1]}: T ${m[2]} positions · geometry n/a.`:target==='es'?`${m[1]}: T ${m[2]} posiciones · geometría n/d.`:`${m[1]}: T ${m[2]} Positionen · Geometrie n. v.`;
      return preserveSpace(source,out);
    }
    if((m=raw.match(/^Import non riuscito: (.+)$/))){
      const p=target==='en'?'Import failed':target==='es'?'Error de importación':'Import fehlgeschlagen';
      return preserveSpace(source,`${p}: ${translateCore(m[1],target)}`);
    }
    if((m=raw.match(/^Errore meteo: (.+)$/))){
      const p=target==='en'?'Weather error':target==='es'?'Error meteorológico':'Wetterfehler';
      return preserveSpace(source,`${p}: ${translateCore(m[1],target)}`);
    }
    if((m=raw.match(/^Errore import: (.+)$/))){
      const p=target==='en'?'Import error':target==='es'?'Error de importación':'Importfehler';
      return preserveSpace(source,`${p}: ${translateCore(m[1],target)}`);
    }
    if((m=raw.match(/^Errore inizializzazione app: (.+)\. Ricarica la pagina\.$/))){
      out=target==='en'?`App initialization error: ${m[1]}. Reload the page.`:target==='es'?`Error de inicialización de la app: ${m[1]}. Recarga la página.`:`Fehler bei der App-Initialisierung: ${m[1]}. Seite neu laden.`;
      return preserveSpace(source,out);
    }
    if((m=raw.match(/^Errore: (.+)$/))){
      const p=target==='en'?'Error':target==='es'?'Error':'Fehler';
      return preserveSpace(source,`${p}: ${translateCore(m[1],target)}`);
    }
    if((m=raw.match(/^Equivalente teorico circa (\d+)\. Il profilo KZ Race sotto usa una correzione più aggressiva\.$/))){
      out=target==='en'?`Theoretical equivalent about ${m[1]}. The KZ Race profile below uses a more aggressive correction.`:target==='es'?`Equivalente teórico aproximado ${m[1]}. El perfil KZ Race de abajo usa una corrección más agresiva.`:`Theoretisches Äquivalent etwa ${m[1]}. Das KZ-Race-Profil unten verwendet eine aggressivere Korrektur.`;
      return preserveSpace(source,out);
    }
    if((m=raw.match(/^Correzioni suggerite: (.+)\.$/))){
      let changes=m[1];
      if(target==='en')changes=changes.replace(/\bminimo\b/g,'idle').replace(/\btacca\b/g,'clip');
      if(target==='es')changes=changes.replace(/\bminimo\b/g,'baja').replace(/\btacca\b/g,'clip');
      if(target==='de')changes=changes.replace(/\bminimo\b/g,'Leerlauf').replace(/\btacca\b/g,'Clip');
      const p=target==='en'?'Suggested corrections':target==='es'?'Correcciones sugeridas':'Empfohlene Korrekturen';
      return preserveSpace(source,`${p}: ${changes}.`);
    }
    if((m=raw.match(/^([+-]?\d+(?:[.,]\d+)?) vs baseline(?: · max (\d+))?$/))){
      const base=target==='en'?'vs baseline':target==='es'?'vs referencia':'ggü. Referenz';
      const mx=m[2]?(target==='en'?` · max ${m[2]}`:target==='es'?` · máx ${m[2]}`:` · max. ${m[2]}`):'';
      return preserveSpace(source,`${m[1]} ${base}${mx}`);
    }
    if((m=raw.match(/^Confronto polverizzatore: (.+)$/))){
      const p=target==='en'?'Atomizer comparison':target==='es'?'Comparación del atomizador':'Zerstäuber-Vergleich';
      return preserveSpace(source,`${p}: ${phrases(m[1],target)}`);
    }
    if((m=raw.match(/^più ricco (.+)$/))){
      const p=target==='en'?'richer':target==='es'?'más rico':'fetter';
      return preserveSpace(source,`${p} ${m[1]}`);
    }
    if((m=raw.match(/^più magro (.+)$/))){
      const p=target==='en'?'leaner':target==='es'?'más pobre':'magerer';
      return preserveSpace(source,`${p} ${m[1]}`);
    }
    if((m=raw.match(/^Risolvo (.+)\.\.\.$/))){
      const p=target==='en'?'Resolving':target==='es'?'Resolviendo':'Wird aufgelöst';
      return preserveSpace(source,`${p} ${m[1]}...`);
    }
    if((m=raw.match(/^Località ACI non risolta: (.+)$/))){
      const p=target==='en'?'ACI location not resolved':target==='es'?'Ubicación ACI no resuelta':'ACI-Ort nicht aufgelöst';
      return preserveSpace(source,`${p}: ${m[1]}`);
    }
    if((m=raw.match(/^ALFANO 7 · (\d+) giri classificati · (\d+) campioni T2$/))){
      out=target==='en'?`ALFANO 7 · ${m[1]} classified laps · ${m[2]} T2 samples`:target==='es'?`ALFANO 7 · ${m[1]} vueltas clasificadas · ${m[2]} muestras T2`:`ALFANO 7 · ${m[1]} gewertete Runden · ${m[2]} T2-Messwerte`;
      return preserveSpace(source,out);
    }
    if((m=raw.match(/^(.+) · (\d+) campioni EGT$/))){
      const word=target==='en'?'EGT samples':target==='es'?'muestras EGT':'EGT-Messwerte';
      return preserveSpace(source,`${m[1]} · ${m[2]} ${word}`);
    }
    if((m=raw.match(/^Best lap: giro (\d+) · (.+)$/))){
      const p=target==='en'?'Best lap':target==='es'?'Mejor vuelta':'Beste Runde';
      const lap=target==='en'?`lap ${m[1]}`:target==='es'?`vuelta ${m[1]}`:`Runde ${m[1]}`;
      return preserveSpace(source,`${p}: ${lap} · ${phrases(m[2],target)}`);
    }
    if((m=raw.match(/^Best lap (\d+): (.+)$/))){
      const p=target==='en'?'Best lap':target==='es'?'Mejor vuelta':'Beste Runde';
      return preserveSpace(source,`${p} ${m[1]}: ${phrases(m[2],target)}`);
    }
    if((m=raw.match(/^Sessione EGT (.+)$/))){
      const p=target==='en'?'EGT session':target==='es'?'Sesión EGT':'EGT-Session';
      return preserveSpace(source,`${p} ${phrases(m[1],target)}`);
    }
    if((m=raw.match(/^Giro (\d+)( ★)?$/))){
      const p=target==='en'?'Lap':target==='es'?'Vuelta':'Runde';
      return preserveSpace(source,`${p} ${m[1]}${m[2]||''}`);
    }
    return null;
  }

  function translateCore(source,target){
    if(target==='it')return source;
    const e=exact(source,target);if(e!==null)return e;
    const d=dynamic(source,target);if(d!==null)return d;
    return phrases(source,target);
  }

  function skipText(node){
    const p=node.parentElement;
    return !p||!!p.closest('svg,.kzBrandLogo,script,style,option');
  }

  function applyText(node,external=false){
    if(!node||node.nodeType!==Node.TEXT_NODE||skipText(node))return;
    if(external&&nodeSource.has(node)){
      const previous=nodeSource.get(node);
      if(node.nodeValue===translateCore(previous,lang))return;
    }
    if(external||!nodeSource.has(node))nodeSource.set(node,node.nodeValue);
    const source=nodeSource.get(node);
    const next=translateCore(source,lang);
    if(node.nodeValue!==next)node.nodeValue=next;
  }

  function applyAttr(el,name,external=false){
    if(!el?.hasAttribute?.(name)||el.closest?.('svg,.kzBrandLogo'))return;
    let map=attrSource.get(el);
    if(!map){map={};attrSource.set(el,map)}
    if(external&&name in map&&el.getAttribute(name)===translateCore(map[name],lang))return;
    if(external||!(name in map))map[name]=el.getAttribute(name);
    const next=translateCore(map[name],lang);
    if(el.getAttribute(name)!==next)el.setAttribute(name,next);
  }

  function walk(root,external=false){
    if(!root)return;
    if(root.nodeType===Node.TEXT_NODE){applyText(root,external);return}
    if(![Node.ELEMENT_NODE,Node.DOCUMENT_FRAGMENT_NODE,Node.DOCUMENT_NODE].includes(root.nodeType))return;
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
    if(select&&select.value!==lang)select.value=lang;
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
      const o=document.createElement('option');o.value=value;o.textContent=label;select.appendChild(o);
    });
    select.value=lang;
    select.addEventListener('change',()=>setLanguage(select.value));
    mount.appendChild(select);
  }

  function init(){
    try{const saved=localStorage.getItem(STORAGE_KEY);if(SUPPORTED.includes(saved))lang=saved}catch{}
    installSelector();
    applying=true;
    try{walk(document,false)}finally{applying=false}
    document.documentElement.lang=lang;

    const observer=new MutationObserver(records=>{
      if(applying)return;
      applying=true;
      try{
        records.forEach(r=>{
          if(r.type==='characterData')applyText(r.target,true);
          else if(r.type==='attributes')applyAttr(r.target,r.attributeName,true);
          else r.addedNodes.forEach(n=>walk(n,true));
        });
      }finally{applying=false}
    });
    observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','title','aria-label']});
  }

  window.KZI18N={
    setLanguage,
    getLanguage:()=>lang,
    translate:(text,target=lang)=>translateCore(String(text),SUPPORTED.includes(target)?target:'it'),
    supported:[...SUPPORTED]
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
