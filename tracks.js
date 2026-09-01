/* Italian kart track registry inspired by the ACI Sport homologated-track list supplied by the user.
   Exact track coordinates are kept only where already verified; other entries are resolved by ACI locality at search time. */
const TRACK_DATABASE = [
  // LOMBARDIA
  {id:'cremona-circuit',name:'Cremona Circuit',city:'Cremona',province:'CR',region:'Lombardia',country:'Italia',latitude:45.086389,longitude:10.314444,aliases:['kart cremona','cremona karting']},
  {id:'south-garda-karting',name:'South Garda Karting',city:'Lonato',province:'BS',region:'Lombardia',country:'Italia',latitude:45.425096,longitude:10.490904,aliases:['south garda','lonato','lonato del garda','kartodromo lonato']},
  {id:'franciacorta-karting-track',name:'Franciacorta Karting Track',city:'Castrezzato',province:'BS',region:'Lombardia',country:'Italia',latitude:45.514170,longitude:10.000616,aliases:['franciacorta','franciacorta karting','castrezzato']},
  {id:'7-laghi',name:'7 Laghi',city:'Castelletto di Branduzzo',province:'PV',region:'Lombardia',country:'Italia',latitude:45.068199,longitude:9.105280,aliases:['sette laghi','7 laghi kart','castelletto','castelletto di branduzzo']},

  // PIEMONTE
  {id:'le-sirene',name:'Le Sirene',city:'Viverone',province:'BI',region:'Piemonte',country:'Italia',latitude:45.40969,longitude:8.07655,aliases:['kart le sirene','viverone kart']},
  {id:'pista-azzurra-borgoticino',name:'Pista Azzurra',city:'Borgoticino',province:'NO',region:'Piemonte',country:'Italia',latitude:45.70113,longitude:8.59393,aliases:['pista azzurra borgo ticino','borgo ticino','borgoticino']},
  {id:'winner-nizza-monferrato',name:'Winner',city:'Nizza Monferrato',province:'AT',region:'Piemonte',country:'Italia',latitude:44.78456,longitude:8.37518,aliases:['winner kart','nizza monferrato']},
  {id:'kart-planet',name:'Kart Planet',city:'Busca',province:'CN',region:'Piemonte',country:'Italia',latitude:null,longitude:null,aliases:['kartplanet','busca kart']},

  // LIGURIA
  {id:'kart-pg-corse',name:'Kart PG Corse',city:'Genova',province:'GE',region:'Liguria',country:'Italia',latitude:null,longitude:null,aliases:['pg corse','genova kart']},

  // VENETO
  {id:'pista-azzurra-jesolo',name:'Pista Azzurra',city:'Jesolo',province:'VE',region:'Veneto',country:'Italia',latitude:null,longitude:null,aliases:['pista azzurra jesolo','jesolo kart']},

  // FRIULI VENEZIA GIULIA
  {id:'alberone',name:'Alberone',city:'S. Pietro al Natisone',province:'UD',region:'Friuli Venezia Giulia',country:'Italia',latitude:null,longitude:null,aliases:['alberone kart','san pietro al natisone','s pietro al natisone']},

  // TRENTINO ALTO ADIGE
  {id:'pista-ala',name:'Pista Ala',city:'Ala di Trento',province:'TN',region:'Trentino-Alto Adige',country:'Italia',latitude:45.78593,longitude:11.01237,aliases:['ala','ala kart','ala karting circuit','kartodromo ala','kartodromo di ala']},

  // EMILIA-ROMAGNA
  {id:'pomposa',name:'Pomposa',city:'S. Giuseppe di Comacchio',province:'FE',region:'Emilia-Romagna',country:'Italia',latitude:null,longitude:null,aliases:['pomposa kart','comacchio','san giuseppe di comacchio']},
  {id:'rioveggio',name:'Rioveggio',city:'Rioveggio',province:'BO',region:'Emilia-Romagna',country:'Italia',latitude:44.287109,longitude:11.208015,aliases:['pista rioveggio','kartodromo rioveggio','karting rioveggio']},
  {id:'happy-valley',name:'Happy Valley',city:'Cervia',province:'RA',region:'Emilia-Romagna',country:'Italia',latitude:null,longitude:null,aliases:['happy valley kart','cervia kart']},

  // TOSCANA
  {id:'pista-del-mare',name:'Pista del Mare',city:'Cecina',province:'LI',region:'Toscana',country:'Italia',latitude:43.284492,longitude:10.522563,aliases:['pista del mare','cecina','kartodromo cecina','paduletto','pista del mare cecina']},
  {id:'val-di-biena',name:'Val di Biena',city:'Castelnuovo Berardenga',province:'SI',region:'Toscana',country:'Italia',latitude:null,longitude:null,aliases:['val di biena kart','castelnuovo berardenga']},
  {id:'circuito-arezzo',name:'Circ. Arezzo',city:'Arezzo',province:'AR',region:'Toscana',country:'Italia',latitude:null,longitude:null,aliases:['circuito arezzo','kart arezzo','arezzo kart']},

  // MARCHE
  {id:'cogiskart',name:'Cogiskart',city:'Corridonia',province:'MC',region:'Marche',country:'Italia',latitude:null,longitude:null,aliases:['cogis kart','corridonia kart']},

  // ABRUZZO
  {id:'adriatico',name:'Adriatico',city:'Cappelle sul Tavo',province:'PE',region:'Abruzzo',country:'Italia',latitude:null,longitude:null,aliases:['adriatico kart','cappelle sul tavo']},
  {id:'internazionale-d-abruzzo',name:"Internazionale d'Abruzzo",city:'Ortona',province:'CH',region:'Abruzzo',country:'Italia',latitude:null,longitude:null,aliases:['internazionale abruzzo','kartodromo ortona','ortona kart']},
  {id:'val-vibrata',name:'Val Vibrata',city:'S. Egidio alla Vibrata',province:'TE',region:'Abruzzo',country:'Italia',latitude:42.810000,longitude:13.686667,aliases:['kartodromo val vibrata','sant egidio alla vibrata','santegidio alla vibrata','faraone']},

  // UMBRIA
  {id:'kartodromo-arcobaleno',name:'Kartodromo Arcobaleno',city:'Trevi',province:'PG',region:'Umbria',country:'Italia',latitude:null,longitude:null,aliases:['arcobaleno kart','trevi kart']},

  // LAZIO
  {id:'valle-del-liri',name:'Valle del Liri',city:'Arce',province:'FR',region:'Lazio',country:'Italia',latitude:null,longitude:null,aliases:['valle liri kart','arce kart']},
  {id:'race-kart-aprilia',name:'Race Kart',city:'Aprilia',province:'LT',region:'Lazio',country:'Italia',latitude:null,longitude:null,aliases:['race kart aprilia','aprilia kart']},
  {id:'la-mola',name:'La Mola',city:'Rieti',province:'RI',region:'Lazio',country:'Italia',latitude:null,longitude:null,aliases:['la mola kart','rieti kart']},
  {id:'circuito-internazionale-viterbo',name:'Circuito Int. Viterbo',city:'Viterbo',province:'VT',region:'Lazio',country:'Italia',latitude:null,longitude:null,aliases:['circuito internazionale viterbo','viterbo kart']},
  {id:'valle-del-pantano',name:'Pista Valle del Pantano',city:'Artena',province:'RM',region:'Lazio',country:'Italia',latitude:null,longitude:null,aliases:['valle del pantano','artena kart']},

  // MOLISE
  {id:'kartodromo-paradiso',name:'Kartodromo Paradiso',city:'Isernia',province:'IS',region:'Molise',country:'Italia',latitude:null,longitude:null,aliases:['paradiso kart','isernia kart']},

  // CAMPANIA
  {id:'motor-park-ottaviano',name:'Motor Park',city:'Ottaviano',province:'NA',region:'Campania',country:'Italia',latitude:null,longitude:null,aliases:['motor park ottaviano','ottaviano kart']},
  {id:'casaluce',name:'Casaluce',city:'Casaluce',province:'CE',region:'Campania',country:'Italia',latitude:null,longitude:null,aliases:['casaluce kart']},
  {id:'sele',name:'Sele',city:'Battipaglia',province:'SA',region:'Campania',country:'Italia',latitude:null,longitude:null,aliases:['sele kart','battipaglia kart']},
  {id:'internazionale-di-napoli',name:'Internazionale di Napoli',city:'Sarno',province:'SA',region:'Campania',country:'Italia',latitude:null,longitude:null,aliases:['sarno','sarno kart','circuito internazionale napoli','kartodromo sarno']},
  {id:'pista-di-iscaro',name:'Pista di Iscaro',city:'Chianche',province:'AV',region:'Campania',country:'Italia',latitude:null,longitude:null,aliases:['iscaro kart','chianche kart']},
  {id:'pista-di-morcone',name:'Pista di Morcone',city:'Benevento',province:'BN',region:'Campania',country:'Italia',latitude:null,longitude:null,aliases:['morcone kart','benevento kart']},
  {id:'pista-italia',name:'Pista Italia',city:'Castelvolturno',province:'CE',region:'Campania',country:'Italia',latitude:null,longitude:null,aliases:['pista italia castelvolturno','castel volturno kart','castelvolturno kart']},
  {id:'la-spigolatrice',name:'La Spigolatrice',city:'Torraca',province:'SA',region:'Campania',country:'Italia',latitude:null,longitude:null,aliases:['spigolatrice kart','torraca kart']},

  // BASILICATA
  {id:'kartodromo-orsoleo',name:'Kartodromo Orsoleo',city:'Orsoleo',province:'PZ',region:'Basilicata',country:'Italia',latitude:null,longitude:null,aliases:['orsoleo kart']},

  // CALABRIA
  {id:'due-mari',name:'Due Mari',city:'Amato',province:'CZ',region:'Calabria',country:'Italia',latitude:null,longitude:null,aliases:['due mari kart','amato kart']},
  {id:'sunday-club-talao',name:'Sunday Club Talao',city:'Santa Domenica Talao',province:'CS',region:'Calabria',country:'Italia',latitude:null,longitude:null,aliases:['sunday club','talao kart','santa domenica talao']},
  {id:'pista-di-laureana',name:'Pista di Laureana',city:'Laureana',province:'RC',region:'Calabria',country:'Italia',latitude:null,longitude:null,aliases:['laureana kart']},
  {id:'full-speed-karting',name:'Full Speed Karting',city:'Falconara Albanese',province:'CS',region:'Calabria',country:'Italia',latitude:null,longitude:null,aliases:['full speed','falconara albanese kart']},

  // PUGLIA
  {id:'salentina',name:'Salentina',city:'Ugento',province:'LE',region:'Puglia',country:'Italia',latitude:null,longitude:null,aliases:['salentina kart','ugento kart']},
  {id:'eurokart-torre-lapillo',name:'Eurokart Torre Lapillo',city:'Porto Cesareo',province:'LE',region:'Puglia',country:'Italia',latitude:null,longitude:null,aliases:['eurokart','torre lapillo','porto cesareo kart']},
  {id:'la-conca',name:'La Conca',city:'Muro Leccese',province:'LE',region:'Puglia',country:'Italia',latitude:null,longitude:null,aliases:['la conca kart','muro leccese','kartodromo la conca']},
  {id:'touch-and-go',name:'Kartodromo Touch and Go',city:'Martina Franca',province:'TA',region:'Puglia',country:'Italia',latitude:null,longitude:null,aliases:['touch and go','touch & go','martina franca kart']},
  {id:'pista-fanelli',name:'Pista Fanelli',city:'Torricella',province:'TA',region:'Puglia',country:'Italia',latitude:null,longitude:null,aliases:['fanelli kart','torricella kart']},
  {id:'kartodromo-della-murgia',name:'Kartodromo della Murgia',city:'Bari',province:'BA',region:'Puglia',country:'Italia',latitude:null,longitude:null,aliases:['murgia kart','bari kart']},

  // SICILIA
  {id:'minoa',name:'Minoa',city:'Cattolica Eraclea',province:'AG',region:'Sicilia',country:'Italia',latitude:null,longitude:null,aliases:['minoa kart','cattolica eraclea kart']},
  {id:'concordia-favara',name:'Concordia',city:'Favara',province:'AG',region:'Sicilia',country:'Italia',latitude:null,longitude:null,aliases:['concordia kart','favara kart']},
  {id:'sole-luna',name:'Sole Luna',city:'Vittoria',province:'RG',region:'Sicilia',country:'Italia',latitude:null,longitude:null,aliases:['sole luna kart','vittoria kart']},
  {id:'pista-del-sole',name:'Pista del Sole',city:'Melilli',province:'SR',region:'Sicilia',country:'Italia',latitude:null,longitude:null,aliases:['pista del sole melilli','melilli kart']},
  {id:'circuito-internazionale-triscina',name:'Circ. Int. Triscina',city:'Triscina',province:'TP',region:'Sicilia',country:'Italia',latitude:null,longitude:null,aliases:['circuito internazionale triscina','triscina kart']},
  {id:'villarosa',name:'Villarosa',city:'Enna',province:'EN',region:'Sicilia',country:'Italia',latitude:null,longitude:null,aliases:['villarosa kart','enna kart']},
  {id:'vincenza',name:'Vincenza',city:'Ispica',province:'RG',region:'Sicilia',country:'Italia',latitude:null,longitude:null,aliases:['vincenza kart','ispica kart']},

  // SARDEGNA
  {id:'sardinia-circuit',name:'Sardinia Circuit',city:'Tramatza',province:'CA',region:'Sardegna',country:'Italia',latitude:null,longitude:null,aliases:['sardinia kart','tramatza kart']},
  {id:'riviera-del-corallo',name:'Riviera del Corallo',city:'Alghero',province:'SS',region:'Sardegna',country:'Italia',latitude:null,longitude:null,aliases:['riviera corallo kart','alghero kart']},
  {id:'sestugo',name:'SestuGo',city:'Sestu',province:'CA',region:'Sardegna',country:'Italia',latitude:null,longitude:null,aliases:['sestu go','sestu kart']}
];