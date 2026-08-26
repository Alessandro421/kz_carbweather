# KZ CarbWeather v1.4

Correzione tacche spillo secondo tabella ufficiale Dell'Orto serie K.

Il campo T della tabella Dell'Orto rappresenta il numero di tacche fisiche dello spillo:
- alcuni spilli hanno T=3
- alcuni T=4
- alcuni T=5

L'app ora:
- associa il numero corretto di tacche a ogni spillo K
- modifica automaticamente il massimo selezionabile quando cambi spillo
- mantiene gli incrementi di 0,5 per l'uso della mezza tacca
- impedisce ad esempio di selezionare tacca 4 o 5 su uno spillo T=3
- limita anche la carburazione suggerita al range fisicamente possibile
- mostra il numero di tacche T nella descrizione geometrica
- rimuove K90 dal selettore perché non compare nella tabella Dell'Orto corrente usata come riferimento

Esempi:
- K1: T=3 -> 1 / 1,5 / 2 / 2,5 / 3
- K13: T=4 -> fino a 4
- K28: T=5
- K98: T=5
- K99: T=5
- K100: T=5
