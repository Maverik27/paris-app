# Paris App

PWA personale per il viaggio a Parigi (20-23 novembre 2026). Basata sulla London App.

## Da fare prima del viaggio
- `config.js`: cambiare `pin`, inserire `primKey` (chiave gratuita su prim.iledefrance-mobilites.fr) per lo stato linee.
- Verificare coordinate hotel, orari navetta Beauvais, prenotazioni (Notre-Dame, Louvre, battello, Torre Eiffel) e tour Parc des Princes.
- Numero di telefono hotel e ambasciata da controllare in `app.js` (tab Info).

## Struttura
- `config.js` configurazione, `data.js` itinerario/frasi/dove mangiare, `app.js` logica, `geo-override.js` Citymapper dalla posizione GPS.
- I dati salvati nel browser usano il prefisso `pr-` (separati dalla London App sullo stesso dominio).

## Prenotazioni condivise
Lo stato "prenotato" si legge da `bookings.json`. Per segnare una prenotazione: su GitHub apri `bookings.json`, modifica `"done": false` in `"done": true` (e scrivi una nota, es. nome e orario), poi Commit. Dopo 1-2 minuti l'app lo mostra a tutti.
