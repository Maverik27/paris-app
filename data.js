/*==============================================
  PARIS APP - DATA
  Itinerary, phrases, icons, type mappings
==============================================*/

/* --- Type mappings --- */
var TC = {
  "Bar/Cantina":"pub","Cibo":"cibo","Attrazione":"attr","Mercato":"mkt",
  "Trasporto":"trans","Passeggiata":"attr","Hotel":"hotel",
  "Panorama":"attr","Foto":"foto","Shopping":"shop"
};
var TI = {
  "Bar/Cantina":"\ud83c\udf77","Cibo":"\ud83c\udf7d","Attrazione":"\ud83c\udfdb","Mercato":"\ud83d\uded2",
  "Trasporto":"\ud83d\ude87","Passeggiata":"\ud83c\udfdb","Hotel":"\ud83c\udfe8",
  "Panorama":"\ud83c\udfdb","Foto":"\ud83d\udcf8","Shopping":"\ud83d\uded2"
};
var TN = {
  "Bar/Cantina":"Bar","Cibo":"Cibo","Attrazione":"Attrazione","Mercato":"Mercato",
  "Trasporto":"Trasporto","Passeggiata":"Attrazione","Hotel":"Hotel",
  "Panorama":"Attrazione","Foto":"Foto","Shopping":"Shopping"
};

/* --- SVG Icons (22x22, uniform style) --- */
var ICN = {
  // Navigation & Maps
  citymapper: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect width="22" height="22" rx="5" fill="#3faa3c"/><path d="M5 14l3-8 3 5 3-5 3 8" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',

  gmaps: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect width="22" height="22" rx="5" fill="#ea4335"/><path d="M11 4C8.2 4 6 6.2 6 9c0 4 5 9 5 9s5-5 5-9c0-2.8-2.2-5-5-5z" fill="#fff"/><circle cx="11" cy="9" r="2" fill="#ea4335"/></svg>',

  // Facilities
  wc: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect width="22" height="22" rx="5" fill="#38bdf8"/><circle cx="8" cy="7" r="1.5" fill="#fff"/><path d="M6 10h4l-1 7H7l-1-7z" fill="#fff"/><circle cx="14" cy="7" r="1.5" fill="#fff"/><path d="M12.5 10h3l-.5 3h-2l-.5-3zM13.5 13l-.5 4M14.5 13l.5 4" stroke="#fff" stroke-width="1" stroke-linecap="round"/></svg>',

  water: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect width="22" height="22" rx="5" fill="#0ea5e9"/><path d="M11 5s-4 4.5-4 7a4 4 0 008 0c0-2.5-4-7-4-7z" fill="#fff"/></svg>',

  // Actions
  skip_stop: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect width="22" height="22" rx="5" fill="#6b7280"/><path d="M6 6l10 5-10 5V6z" fill="#fff"/><path d="M16 6v10" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>',

  delete_stop: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect width="22" height="22" rx="5" fill="#ef4444"/><path d="M7 8h8l-.7 8a1 1 0 01-1 .9H8.7a1 1 0 01-1-.9L7 8z" fill="#fff"/><path d="M6 8h10M9 5.5h4" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>',

  add_here: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".4"/><path d="M10 6v8M6 10h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',

  // Features
  diary: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect width="22" height="22" rx="5" fill="#14b8a6"/><rect x="5" y="7" width="12" height="9" rx="1.5" fill="#fff"/><path d="M8 5.5h6l1.5 2h-9L8 5.5z" fill="#fff"/><circle cx="11" cy="11.5" r="2.5" fill="#14b8a6"/><circle cx="11" cy="11.5" r="1" fill="#fff"/></svg>',

  edit: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect width="22" height="22" rx="5" fill="#6b7280"/><path d="M13 5.5l3.5 3.5M6.5 12l-1 4.5 4.5-1L16.5 9l-3.5-3.5L6.5 12z" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',

  phrases: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect width="22" height="22" rx="5" fill="#7c3aed"/><path d="M4 8h5M6.5 6v2M5 10c1 2 3 3 5 3" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/><path d="M13 9l2 6 2-6M14 13h2" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',

  book: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect width="22" height="22" rx="5" fill="#3b82f6"/><rect x="6.5" y="5" width="9" height="12" rx="1.5" stroke="#fff" stroke-width="1.5" fill="none"/><path d="M9 8.5h4M9 11h4M9 13.5h2.5" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/></svg>'
};

/* --- Nominatim type detection --- */
var NOM_TYPE_MAP = {
  pub:"Bar/Cantina",bar:"Bar/Cantina",biergarten:"Bar/Cantina",brewery:"Bar/Cantina",
  restaurant:"Cibo",fast_food:"Cibo",cafe:"Cibo",food_court:"Cibo",ice_cream:"Cibo",bakery:"Cibo",
  museum:"Attrazione",tourism:"Attrazione",attraction:"Attrazione",castle:"Attrazione",monument:"Attrazione",memorial:"Attrazione",artwork:"Attrazione",gallery:"Attrazione",theatre:"Attrazione",cinema:"Attrazione",church:"Attrazione",cathedral:"Attrazione",
  marketplace:"Mercato",market:"Mercato",
  station:"Trasporto",bus_station:"Trasporto",subway:"Trasporto",
  hotel:"Hotel",hostel:"Hotel",guest_house:"Hotel",
  viewpoint:"Attrazione",
  shop:"Shopping",supermarket:"Shopping",clothes:"Shopping",books:"Shopping"
};

/* --- Itinerary --- */
/* --- Helpers (compact stop builder) --- */
function S(t,n,tp,ds,du,la,ln,ad,di,ws,pla,pln){
  var o={t:t,n:n,tp:tp,ds:ds,la:la,ln:ln,ad:ad,di:di||"",ws:ws||[],bk:null,pla:pla===undefined?null:pla,pln:pln===undefined?null:pln};
  if(du)o.du=du;
  return o;
}
function W(x,y){return {x:x,y:y}}
var H_LA=48.8825,H_LN=2.3330;
var BVA_LA=49.4544,BVA_LN=2.1128;
var PMA_LA=48.8789,PMA_LN=2.2828;

/* --- Itinerary --- */
var DAYS = [
{id:0,pl:"Ven 20",t:"Arrivo a Parigi",wt:"5-9°C",rn:0,dr:"🧥 Giubbotto caldo e strati. Sera fredda (~5°C).",wn:"Arrivo a notte fonda: meglio il taxi dall'arrivo della navetta.",km:1,zones:[
{zone:"Volo e navetta",items:[
S("19:30","Cagliari Elmas","Trasporto","Partenza del volo per Parigi Beauvais.","",39.2515,9.0572,"Aeroporto di Cagliari Elmas","",[]),
S("21:50","Parigi Beauvais (BVA)","Trasporto","Atterraggio. Beauvais è fuori Parigi: serve la navetta per la città.","",BVA_LA,BVA_LN,"Aéroport de Beauvais-Tillé","Seguire le indicazioni per le navette.",[W("⚠ Aeroporto fuori città","a")]),
S("22:30","Navetta Beauvais - Porte Maillot","Trasporto","Navetta diretta per Parigi. Biglietto online e verifica dell'ultima corsa dopo l'arrivo del volo.","~1h 15min",PMA_LA,PMA_LN,"Porte Maillot, Paris 17","",[W("⚠ Verificare orario corsa","a"),W("📋 Biglietto online","b")],BVA_LA,BVA_LN)]},
{zone:"Check-in",items:[
S("23:50","Verso l'hotel","Trasporto","Taxi o Uber da Porte Maillot (~25 min). La metro potrebbe non essere più comoda a quest'ora.","~30 min",H_LA,H_LN,"Hotel Royal Mansart","",[],PMA_LA,PMA_LN),
S("00:30","Hotel Royal Mansart","Hotel","Check-in tardivo. Avvisare l'hotel dell'orario di arrivo prima di partire.","",H_LA,H_LN,"1 Rue Mansart, 75009 Paris","",[W("⚠ Arrivo dopo mezzanotte","a")])]}]},

{id:1,pl:"Sab 21",t:"Notre-Dame, Louvre e Palais Royal",wt:"4-10°C",rn:0,dr:"🧥 Giubbotto caldo, scarpe comode. Possibile pioggia.",wn:"",km:9,zones:[
{zone:"Mattina",items:[
S("09:30","Colazione","Cibo","Rue des Martyrs è a pochi minuti a piedi: croissant, pain au chocolat e caffè.","~45 min",48.8800,2.3388,"Rue des Martyrs, 75009","",[],H_LA,H_LN)]},
{zone:"Île de la Cité",items:[
S("10:15","Metro verso Cité","Trasporto","~30 min con un cambio. Usare Citymapper per il percorso aggiornato.","~35 min",48.8553,2.3469,"Cité","",[],48.8800,2.3388),
S("10:50","Notre-Dame","Attrazione","Cattedrale riaperta dopo il restauro, ingresso gratuito. Coda variabile.","~1h",48.8530,2.3499,"6 Parvis Notre-Dame, 75004","",[W("📋 Prenotare slot gratuito","b")],48.8553,2.3469),
S("12:00","Sainte-Chapelle","Attrazione","Vetrate gotiche del XIII secolo. Opzionale, saltare se c'è coda.","~45 min",48.8554,2.3450,"10 Bd du Palais, 75001","",[W("⭐ Opzionale","i"),W("📋 Prenotare","b")],48.8530,2.3499)]},
{zone:"Pranzo e Senna",items:[
S("12:55","Pranzo a Saint-Germain","Cibo","Rue de Buci e dintorni: bistrot, crêperie, plat du jour.","~1h 15min",48.8537,2.3392,"Rue de Buci, 75006","",[],48.8554,2.3450),
S("14:15","Pont des Arts","Foto","Attraversare la Senna a piedi, vista su Pont Neuf e Île de la Cité.","~15 min",48.8583,2.3375,"Pont des Arts, 75006","",[],48.8537,2.3392)]},
{zone:"Louvre",items:[
S("14:30","Museo del Louvre","Attrazione","Percorso highlights: Gioconda, Venere di Milo, Nike di Samotracia. Non serve vedere tutto.","~3h",48.8606,2.3376,"Rue de Rivoli, 75001","",[W("📋 Prenotare slot orario","b"),W("⚠ Verificare orario chiusura","a")],48.8583,2.3375)]},
{zone:"Palais Royal e cantina",items:[
S("17:30","Palais Royal","Attrazione","Giardini e colonne di Buren, a due passi dal Louvre.","~30 min",48.8637,2.3371,"Place du Palais Royal, 75001","",[],48.8606,2.3376),
S("18:00","Galerie Vivienne","Attrazione","Passage coperto ottocentesco con mosaici.","~20 min",48.8668,2.3405,"4 Rue des Petits Champs, 75002","",[],48.8637,2.3371),
S("18:25","Legrand Filles et Fils","Bar/Cantina","Cave e bar à vins storico nella Galerie Vivienne. Degustazione di vini, solo se avanza tempo.","~1h",48.8666,2.3408,"1 Rue de la Banque, 75002","",[W("⭐ Opzionale","i"),W("⚠ Verificare orari","a")],48.8668,2.3405)]},
{zone:"Cena e rientro",items:[
S("19:45","Bouillon Chartier","Cibo","Brasserie storica a prezzi contenuti, cucina francese classica. Di solito niente prenotazione: possibile coda.","~1h 30min",48.8719,2.3427,"7 Rue du Faubourg Montmartre, 75009","",[W("⚠ Possibile coda","a")],48.8666,2.3408),
S("21:30","Ultima bevuta","Bar/Cantina","Un bicchiere in zona Pigalle o Rue des Martyrs, verso l'hotel.","~1h",48.8825,2.3375,"Pigalle, 75009","",[],48.8719,2.3427),
S("22:45","Rientro hotel","Trasporto","A piedi o in metro, ~15 min.","",H_LA,H_LN,"Hotel Royal Mansart","",[],48.8825,2.3375)]}]},

{id:2,pl:"Dom 22",t:"Parc des Princes, Torre Eiffel, Senna e Montmartre",wt:"4-10°C",rn:0,dr:"🧥 Giubbotto caldo, cappello. Sul battello fa freddo.",wn:"",km:11,zones:[
{zone:"Mattina",items:[
S("09:00","Colazione","Cibo","Colazione vicino all'hotel.","~45 min",H_LA,H_LN,"Hotel Royal Mansart","",[])]},
{zone:"Parc des Princes",items:[
S("09:45","Metro verso Parc des Princes","Trasporto","~40 min con cambi. Scendere a Porte de Saint-Cloud (M9) o Porte d'Auteuil (M10). Usare Citymapper.","~40 min",48.8414,2.2530,"Parc des Princes","",[],H_LA,H_LN),
S("10:30","Parc des Princes","Attrazione","Stadio del PSG. Nessuna partita casalinga in programma (il PSG gioca a Nizza sabato 21). Tour dello stadio e boutique da verificare.","~1h",48.8414,2.2530,"24 Rue du Commandant Guilbaud, 75016","",[W("⭐ Opzionale","i"),W("📋 Verificare tour e orari","b")],48.8414,2.2530),
S("11:45","M9 verso Trocadéro","Trasporto","M9 diretta da Porte de Saint-Cloud a Trocadéro, ~20 min.","~25 min",48.8616,2.2893,"Trocadéro","",[],48.8414,2.2530)]},
{zone:"Torre Eiffel",items:[
S("12:15","Trocadéro","Foto","Vista classica sulla Torre Eiffel dai giardini.","~20 min",48.8616,2.2893,"Place du Trocadéro, 75016","",[]),
S("12:45","Torre Eiffel","Attrazione","Passeggiata sotto la torre. Salita opzionale: prenotare l'orario online.","~45 min",48.8584,2.2945,"5 Av. Anatole France, 75007","",[W("⭐ Salita opzionale","i"),W("📋 Prenotare online","b")],48.8616,2.2893),
S("13:45","Pranzo a Rue Cler","Mercato","Via pedonale con botteghe: formaggi, panini, crêpes. Pranzo informale.","~1h 15min",48.8562,2.3062,"Rue Cler, 75007","",[],48.8584,2.2945)]},
{zone:"Senna",items:[
S("15:15","Verso Pont de l'Alma","Passeggiata","A piedi lungo la Senna, ~20 min.","~20 min",48.8640,2.3010,"Pont de l'Alma, 75008","",[],48.8562,2.3062),
S("15:45","Giro in battello sulla Senna","Attrazione","Crociera di circa un'ora al tramonto, possibilmente con aperitivo. Verificare operatori, orari e formula.","~1h 15min",48.8640,2.3010,"Port de la Conférence, Pont de l'Alma","",[W("📋 Prenotare (aperitivo se disponibile)","b"),W("⚠ Verificare orari","a")])]},
{zone:"Arc de Triomphe e Champs-Élysées",items:[
S("17:15","Arc de Triomphe","Foto","A piedi lungo Avenue Marceau (~15 min). Arco illuminato al buio.","~30 min",48.8738,2.2950,"Place Charles de Gaulle, 75008","",[],48.8640,2.3010),
S("17:50","Champs-Élysées","Passeggiata","Passeggiata sul tratto alto del viale. Eventuali luminarie natalizie da verificare.","~30 min",48.8705,2.3040,"Av. des Champs-Élysées, 75008","",[],48.8738,2.2950)]},
{zone:"Montmartre",items:[
S("18:30","M2 verso Blanche","Trasporto","M2 diretta da Charles de Gaulle - Étoile a Blanche, ~20 min.","~25 min",48.8838,2.3323,"Blanche","",[],48.8705,2.3040),
S("19:00","Sacré-Cœur","Attrazione","Salita a piedi da Abbesses o con la funicolare. Vista su Parigi di sera.","~1h",48.8867,2.3431,"35 Rue du Chevalier de la Barre, 75018","",[],48.8838,2.3323),
S("20:15","Cena a Montmartre","Cibo","Bistrot nella zona di Abbesses.","~1h 30min",48.8841,2.3388,"Rue des Abbesses, 75018","",[],48.8867,2.3431),
S("22:00","Ultima bevuta","Bar/Cantina","Un ultimo bicchiere vicino all'hotel.","~45 min",48.8825,2.3375,"Pigalle, 75009","",[],48.8841,2.3388),
S("22:45","Rientro hotel","Trasporto","Pochi minuti a piedi.","",H_LA,H_LN,"Hotel Royal Mansart","",[],48.8825,2.3375)]}]},

{id:3,pl:"Lun 23",t:"Rientro a Cagliari",wt:"4-9°C",rn:0,dr:"🧥 Giubbotto caldo.",wn:"Sveglia presto: navetta per Beauvais da prenotare.",km:1,zones:[
{zone:"Mattina",items:[
S("07:30","Check-out","Hotel","Colazione veloce e check-out. Valigie pronte la sera prima.","",H_LA,H_LN,"1 Rue Mansart, 75009 Paris","",[]),
S("07:45","Verso Porte Maillot","Trasporto","Taxi o Uber (~25 min) oppure metro. Arrivare con margine.","~30 min",PMA_LA,PMA_LN,"Porte Maillot, Paris 17","",[],H_LA,H_LN)]},
{zone:"Beauvais",items:[
S("09:00","Navetta Porte Maillot - Beauvais","Trasporto","Biglietto online e verifica dell'orario. Il volo è alle 12:15.","~1h 15min",BVA_LA,BVA_LN,"Aéroport de Beauvais-Tillé","",[W("⚠ Verificare orario corsa","a"),W("📋 Biglietto online","b")],PMA_LA,PMA_LN),
S("10:15","Aeroporto di Beauvais","Trasporto","Check-in e controlli.","",BVA_LA,BVA_LN,"Aéroport de Beauvais-Tillé","",[]),
S("12:15","Volo per Cagliari","Trasporto","Atterraggio previsto alle 14:25.","",BVA_LA,BVA_LN,"Aéroport de Beauvais-Tillé","",[])]}]}
];

/* --- Contextual Phrases (it = italiano, fr = francese) --- */
function P(it,fr){return {it:it,fr:fr}}
var PHRASES_TYPE = {
  "Trasporto":[P("Scusi, come arrivo a...?","Excusez-moi, comment aller à... ?"),P("Devo cambiare linea?","Dois-je changer de ligne ?"),P("Qual è la prossima fermata?","Quel est le prochain arrêt ?"),P("Due biglietti, per favore","Deux tickets, s'il vous plaît"),P("Dove posso comprare il biglietto?","Où puis-je acheter un ticket ?")],
  "Hotel":[P("Ho una prenotazione a nome...","J'ai une réservation au nom de..."),P("A che ora bisogna liberare la camera?","À quelle heure faut-il libérer la chambre ?"),P("Possiamo lasciare i bagagli?","Pouvons-nous laisser nos bagages ?"),P("Arriveremo tardi, dopo mezzanotte","Nous arriverons tard, après minuit")],
  "Bar/Cantina":[P("Un bicchiere di vino rosso, per favore","Un verre de vin rouge, s'il vous plaît"),P("Un bicchiere di vino bianco, per favore","Un verre de vin blanc, s'il vous plaît"),P("Una birra alla spina, per favore","Un demi, s'il vous plaît"),P("Cosa ci consiglia?","Que nous conseillez-vous ?"),P("Possiamo assaggiare prima?","Pouvons-nous goûter avant ?"),P("Il conto, per favore","L'addition, s'il vous plaît")],
  "Cibo":[P("Un tavolo per quattro, per favore","Une table pour quatre, s'il vous plaît"),P("Possiamo vedere il menu?","Pouvons-nous voir la carte ?"),P("Qual è il piatto del giorno?","Quel est le plat du jour ?"),P("Abbiamo prenotato a nome...","Nous avons réservé au nom de..."),P("Il conto, per favore","L'addition, s'il vous plaît")],
  "Mercato":[P("Quanto costa?","Combien ça coûte ?"),P("Posso assaggiare?","Je peux goûter ?"),P("Accettate la carta?","Acceptez-vous la carte ?"),P("Ne prendo due, per favore","J'en prends deux, s'il vous plaît")],
  "Attrazione":[P("Quattro biglietti, per favore","Quatre billets, s'il vous plaît"),P("Ho già prenotato online","J'ai déjà réservé en ligne"),P("Si possono fare foto?","A-t-on le droit de prendre des photos ?"),P("Dov'è il guardaroba?","Où est le vestiaire ?")],
  "Passeggiata":[P("Scusi, sa dove si trova...?","Excusez-moi, savez-vous où se trouve... ?"),P("È lontano a piedi?","C'est loin à pied ?"),P("Può indicarmi la direzione per...?","Pouvez-vous m'indiquer la direction de... ?")],
  "Panorama":[P("Si possono fare foto?","A-t-on le droit de prendre des photos ?"),P("Dov'è l'ascensore?","Où est l'ascenseur ?")],
  "Foto":[P("Può farci una foto, per favore?","Pouvez-vous nous prendre en photo, s'il vous plaît ?"),P("Scusi, sa cos'è questo monumento?","Excusez-moi, savez-vous ce qu'est ce monument ?")],
  "Shopping":[P("Quanto costa?","Combien ça coûte ?"),P("Posso pagare con la carta?","Puis-je payer par carte ?"),P("Avete una taglia più grande/piccola?","Avez-vous une taille plus grande/plus petite ?")]
};

var PHRASES_STOP = {
  "Parigi Beauvais (BVA)":[P("Dov'è la navetta per Parigi?","Où est la navette pour Paris ?"),P("A che ora parte la prossima navetta?","À quelle heure part la prochaine navette ?"),P("Un biglietto per Porte Maillot, per favore","Un billet pour Porte Maillot, s'il vous plaît")],
  "Hotel Royal Mansart":[P("Ho una prenotazione a nome...","J'ai une réservation au nom de..."),P("Possiamo lasciare i bagagli dopo il check-out?","Pouvons-nous laisser nos bagages après le départ ?"),P("Può chiamarci un taxi per le 7:45?","Pouvez-vous nous appeler un taxi pour 7h45 ?")],
  "Notre-Dame":[P("Dov'è l'ingresso per la visita?","Où est l'entrée pour la visite ?"),P("L'ingresso è gratuito?","L'entrée est-elle gratuite ?"),P("Quanto bisogna aspettare?","Combien de temps faut-il attendre ?")],
  "Museo del Louvre":[P("Abbiamo prenotato per le...","Nous avons réservé pour... heures"),P("Dov'è la Gioconda?","Où est la Joconde ?"),P("Dov'è il guardaroba?","Où est le vestiaire ?"),P("Dov'è l'uscita?","Où est la sortie ?")],
  "Legrand Filles et Fils":[P("Cosa ci consiglia in rosso?","Que nous conseillez-vous en rouge ?"),P("Cosa ci consiglia in bianco?","Que nous conseillez-vous en blanc ?"),P("Avete un tagliere di formaggi?","Avez-vous une planche de fromages ?")],
  "Bouillon Chartier":[P("Un tavolo per quattro, per favore","Une table pour quatre, s'il vous plaît"),P("Quanto bisogna aspettare?","Combien de temps faut-il attendre ?"),P("Qual è il piatto del giorno?","Quel est le plat du jour ?")],
  "Parc des Princes":[P("C'è un tour dello stadio oggi?","Y a-t-il une visite du stade aujourd'hui ?"),P("Dov'è il negozio ufficiale?","Où est la boutique officielle ?")],
  "Torre Eiffel":[P("Quattro biglietti per la salita, per favore","Quatre billets pour la montée, s'il vous plaît"),P("Dove si prende l'ascensore?","Où prendre l'ascenseur ?")],
  "Giro in battello sulla Senna":[P("Abbiamo prenotato a nome...","Nous avons réservé au nom de..."),P("C'è la formula con aperitivo?","Y a-t-il une formule avec apéritif ?"),P("A che ora parte il prossimo battello?","À quelle heure part le prochain bateau ?")],
  "Sacré-Cœur":[P("Si può entrare in basilica?","Peut-on entrer dans la basilique ?"),P("Dov'è la funicolare?","Où est le funiculaire ?")]
};

/* --- Dove mangiare (link = ricerca su Google Maps, orari da verificare) --- */
var FOOD = [
  {c:"Street food e veloce",n:"L'As du Fallafel",z:"Marais",d:"Falafel storico del Marais, sempre coda.",a:"34 Rue des Rosiers, 75004 Paris"},
  {c:"Street food e veloce",n:"Marché des Enfants Rouges",z:"Marais",d:"Mercato coperto con banchi di cibo da strada.",a:"39 Rue de Bretagne, 75003 Paris"},
  {c:"Street food e veloce",n:"Breizh Café",z:"Marais",d:"Crêpes e galettes bretoni.",a:"109 Rue Vieille du Temple, 75003 Paris"},
  {c:"Street food e veloce",n:"Rue Cler",z:"Torre Eiffel",d:"Via pedonale con botteghe, panini e formaggi.",a:"Rue Cler, 75007 Paris"},
  {c:"Boulangerie e dolci",n:"Stohrer",z:"Montorgueil",d:"Pasticceria storica, lungo Rue Montorgueil.",a:"51 Rue Montorgueil, 75002 Paris"},
  {c:"Boulangerie e dolci",n:"Du Pain et des Idées",z:"Canal Saint-Martin",d:"Boulangerie famosa per l'escargot al pistacchio.",a:"34 Rue Yves Toudic, 75010 Paris"},
  {c:"Boulangerie e dolci",n:"Berthillon",z:"Île Saint-Louis",d:"Gelato artigianale, verificare giorni di apertura.",a:"29-31 Rue Saint-Louis en l'Île, 75004 Paris"},
  {c:"Bistrot e brasserie",n:"Bouillon Chartier",z:"Grands Boulevards",d:"Classico francese a prezzi bassi, possibile coda.",a:"7 Rue du Faubourg Montmartre, 75009 Paris"},
  {c:"Bistrot e brasserie",n:"Bouillon Pigalle",z:"Pigalle (vicino hotel)",d:"Cucina francese tradizionale a prezzi contenuti.",a:"22 Boulevard de Clichy, 75018 Paris"},
  {c:"Vicino all'hotel",n:"Rue des Martyrs",z:"9° arr.",d:"Via di botteghe, boulangerie, formaggi e caffè.",a:"Rue des Martyrs, 75009 Paris"}
];
