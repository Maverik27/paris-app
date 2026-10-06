/*==============================================
  PARIS APP - APPLICATION LOGIC
  All functions organized by feature
==============================================*/

/* --- PIN Lock --- */
var PIN_HASH="";
var pinCode="";
var PIN_LEN=String(CONFIG.pin).replace(/\D/g,"").length||6;
function hashPin(p){var h=0;for(var i=0;i<p.length;i++){h=((h<<5)-h)+p.charCodeAt(i);h=h&h}return h.toString(36)}
PIN_HASH=hashPin(String(CONFIG.pin).replace(/\D/g,""));
function initLock(){
  if(sessionStorage.getItem("unlocked")==="1"){document.getElementById("lockScreen").classList.add("hide");return}
  document.querySelector(".shell").style.display="none";
  document.querySelector(".nav").style.display="none";
  renderDots();renderPad();
}
function renderDots(){
  var h="";for(var i=0;i<PIN_LEN;i++){h+='<div class="pin-dot '+(i<pinCode.length?"on":"")+'"></div>'}
  document.getElementById("pinDots").innerHTML=h;
}
function renderPad(){
  var nums=["1","2","3","4","5","6","7","8","9","","0","del"];
  var h="";nums.forEach(function(n){
    if(n==="")h+="<div></div>";
    else if(n==="del")h+='<div class="pin-btn del" onclick="pinDel()">\u232b</div>';
    else h+='<div class="pin-btn" onclick="pinAdd(\''+n+'\')">'+n+"</div>";
  });
  document.getElementById("pinPad").innerHTML=h;
}
function pinAdd(n){
  if(pinCode.length>=PIN_LEN)return;pinCode+=n;renderDots();
  if(pinCode.length===PIN_LEN)setTimeout(checkPin,200);
}
function pinDel(){pinCode=pinCode.slice(0,-1);renderDots();document.getElementById("pinMsg").textContent=""}
function checkPin(){
  if(hashPin(pinCode)===PIN_HASH){
    sessionStorage.setItem("unlocked","1");
    document.getElementById("lockScreen").classList.add("hide");
    document.querySelector(".shell").style.display="";
    document.querySelector(".nav").style.display="";
    setTimeout(function(){if(typeof gpsMap!=="undefined"&&gpsMap)gpsMap.invalidateSize()},300);
  }else{
    document.getElementById("pinMsg").textContent="PIN errato";
    document.querySelectorAll(".pin-dot").forEach(function(d){d.classList.add("err")});
    setTimeout(function(){pinCode="";renderDots();document.getElementById("pinMsg").textContent=""},800);
  }
}
initLock();


if(localStorage.getItem('th')!=='d')document.documentElement.classList.add('light');

var TC={'Bar/Cantina':'pub','Cibo':'cibo','Attrazione':'attr','Mercato':'mkt','Trasporto':'trans','Passeggiata':'attr','Hotel':'hotel','Panorama':'attr','Foto':'foto','Shopping':'shop'};
var TI={'Bar/Cantina':'\u{1F377}','Cibo':'\u{1F37D}','Attrazione':'\u{1F3DB}','Mercato':'\u{1F6CD}','Trasporto':'\u{1F687}','Passeggiata':'\u{1F3DB}','Hotel':'\u{1F3E8}','Panorama':'\u{1F3DB}','Foto':'\u{1F4F8}','Shopping':'\u{1F6D2}'};
var TN={'Bar/Cantina':'Bar','Cibo':'Cibo','Attrazione':'Attrazione','Mercato':'Mercato','Trasporto':'Trasporto','Passeggiata':'Attrazione','Hotel':'Hotel','Panorama':'Attrazione','Foto':'Foto','Shopping':'Shopping'};

var cD=0,tsX=0,sf=null,gpsMap=null,dayMarkers=[],gpsMarker=null;

// Contextual phrases by stop type + specific overrides

// Specific overrides for certain stops

function getPhrasesFor(stopName, stopType) {
  if (PHRASES_STOP[stopName]) return PHRASES_STOP[stopName];
  if (PHRASES_TYPE[stopType]) return PHRASES_TYPE[stopType];
  return PHRASES_TYPE["Attrazione"] || [];
}

function showPhrasesIdx(dayIdx, stopIdx) {
  var all = allItems(LIVE_DAYS[dayIdx]);
  if (stopIdx < all.length) {
    var s = all[stopIdx];
    showPhrases(s.n, s.tp);
  }
}

function showPhrases(stopName, stopType) {
  var phrases = getPhrasesFor(stopName, stopType);
  var overlay = document.getElementById("phrase-overlay");
  var content = document.getElementById("phrase-content");
  
  var h = '<div class="ph-hdr"><div><div class="ph-title">' + stopName + '</div><div class="ph-sub">Frasi utili</div></div><button class="ph-close" onclick="closePhrases()">\u2715</button></div>';
  h += '<div class="ph-list">';
  phrases.forEach(function(p, i) {
    h += '<div class="ph-item"><div class="ph-it">' + p.it + '</div><div class="ph-en">' + p.fr + '</div>';
    h += '<div class="ph-btns"><button class="ph-btn" onclick="event.stopPropagation();speakEn(\'' + p.fr.replace(/'/g, "\\'") + '\')"><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 5h2l4-3v12l-4-3H3a1 1 0 01-1-1V6a1 1 0 011-1z" fill="currentColor"/><path d="M11 5.5c.8.8 1.2 1.9 1.2 3s-.4 2.2-1.2 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg> Ascolta</button>';
    h += '<button class="ph-btn" onclick="event.stopPropagation();copyText(\'' + p.fr.replace(/'/g, "\\'") + '\',this)"><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="8" height="10" rx="1.5" stroke="currentColor" stroke-width="1.3" fill="none"/><rect x="6" y="5" width="8" height="10" rx="1.5" stroke="currentColor" stroke-width="1.3" fill="none"/></svg> Copia</button></div></div>';
  });
  h += '</div>';
  
  h += '<div class="ph-free"><div class="ph-free-label">Scrivi una frase in italiano</div>';
  h += '<div class="ph-free-row"><input type="text" class="ph-input" id="phFreeIn" placeholder="Es: Dov\'e\' la fermata..." onkeydown="if(event.key===\'Enter\')translateFree()"><button class="ph-translate-btn" onclick="translateFree()"><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 4h5M4.5 2v2M3 6c1 2 3 3 5 3" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/><path d="M9 7l2 6 2-6M10 11h2" stroke="#fff" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>';
  h += '<div id="phFreeOut" class="ph-free-out"></div></div>';
  
  content.innerHTML = h;
  overlay.classList.add("open");
}

function closePhrases() {
  document.getElementById("phrase-overlay").classList.remove("open");
}

function speakEn(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  var u = new SpeechSynthesisUtterance(text);
  u.lang = "fr-FR";
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

function copyText(text, btn) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    var ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
  var orig = btn.innerHTML;
  btn.innerHTML = "\u2713 Copiato!";
  setTimeout(function() { btn.innerHTML = orig; }, 1500);
}

function translateFree() {
  var inp = document.getElementById("phFreeIn").value.trim();
  if (!inp) return;
  var out = document.getElementById("phFreeOut");
  out.innerHTML = '<div class="ph-loading">\u23f3 Traduco...</div>';
  
  var url = "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(inp) + "&langpair=it|fr";
  fetch(url)
    .then(function(r) { return r.json(); })
    .then(function(d) {
      if (d.responseData && d.responseData.translatedText) {
        var tr = d.responseData.translatedText;
        out.innerHTML = '<div class="ph-item"><div class="ph-it">' + inp + '</div><div class="ph-en">' + tr + '</div><div class="ph-btns"><button class="ph-btn" onclick="event.stopPropagation();speakEn(\'' + tr.replace(/'/g, "\\'") + '\')"><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 5h2l4-3v12l-4-3H3a1 1 0 01-1-1V6a1 1 0 011-1z" fill="currentColor"/><path d="M11 5.5c.8.8 1.2 1.9 1.2 3s-.4 2.2-1.2 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg> Ascolta</button><button class="ph-btn" onclick="event.stopPropagation();copyText(\'' + tr.replace(/'/g, "\\'") + '\',this)"><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="8" height="10" rx="1.5" stroke="currentColor" stroke-width="1.3" fill="none"/><rect x="6" y="5" width="8" height="10" rx="1.5" stroke="currentColor" stroke-width="1.3" fill="none"/></svg> Copia</button></div></div>';
      } else {
        out.innerHTML = '<div class="ph-err">\u274c Traduzione non disponibile</div>';
      }
    })
    .catch(function() {
      out.innerHTML = '<div class="ph-err">\u274c Errore di connessione</div>';
    });
}

// === EDIT ITINERARY FEATURE ===

// On first load, store DAYS in localStorage. After that, always read from storage.
function loadDays() {
  var stored = localStorage.getItem("pr-days");
  if (stored) {
    try { return JSON.parse(stored); } catch(e) {}
  }
  saveDays(DAYS);
  return JSON.parse(JSON.stringify(DAYS));
}
function saveDays(d) {
  localStorage.setItem("pr-days", JSON.stringify(d));
}
function confirmReset() {
  if (confirm("Ripristinare l'itinerario originale?")) resetDays();
}
function resetDays() {
  localStorage.removeItem("pr-days");
  LIVE_DAYS = JSON.parse(JSON.stringify(DAYS));
  saveDays(LIVE_DAYS);
  renderDay(cD);
}

var LIVE_DAYS = loadDays();

function checkVersion() {
  var stored = localStorage.getItem("pr-version");
  if (stored !== CONFIG.version) {
    localStorage.removeItem("pr-days");
    localStorage.setItem("pr-version", CONFIG.version);
    LIVE_DAYS = JSON.parse(JSON.stringify(DAYS));
    saveDays(LIVE_DAYS);
  }
}

// Types for dropdown

function showEditStop(dayIdx, stopIdx) {
  var all = allItemsLive(LIVE_DAYS[dayIdx]);
  var s = all.items[stopIdx];
  var isNew = !s;
  if (isNew) {
    s = {t:"12:00",n:"",tp:"Attrazione",ds:"",du:"",la:0,ln:0,ad:"",di:"",ws:[],bk:null,pla:null,pln:null};
  }

  var overlay = document.getElementById("edit-overlay");
  var content = document.getElementById("edit-content");

  var typeOpts = CONFIG.stopTypes.map(function(tp) {
    return '<option value="' + tp + '"' + (tp === s.tp ? ' selected' : '') + '>' + tp + '</option>';
  }).join("");

  var h = '<div class="ed-hdr"><div class="ed-title">' + (isNew ? "Nuova tappa" : "Modifica tappa") + '</div><button class="ph-close" onclick="closeEdit()">\u2715</button></div>';
  h += '<div class="ed-form">';
  h += '<label class="ed-label">Nome</label><input class="ed-input" id="ed-name" value="' + (s.n||"").replace(/"/g,"&quot;") + '" placeholder="Nome della tappa">';
  h += '<div class="ed-row"><div class="ed-half"><label class="ed-label">Orario</label><input class="ed-input" id="ed-time" type="time" value="' + (s.t||"12:00") + '"></div>';
  h += '<div class="ed-half"><label class="ed-label">Durata</label><input class="ed-input" id="ed-dur" value="' + (s.du||"") + '" placeholder="~30 min"></div></div>';
  h += '<label class="ed-label">Tipo</label><select class="ed-input" id="ed-type">' + typeOpts + '</select>';
  h += '<label class="ed-label">Descrizione</label><textarea class="ed-input ed-ta" id="ed-desc" placeholder="Descrizione...">' + (s.ds||"") + '</textarea>';
  h += '<label class="ed-label">Indirizzo</label><input class="ed-input" id="ed-addr" value="' + (s.ad||"").replace(/"/g,"&quot;") + '" placeholder="Indirizzo">';
  h += '<label class="ed-label">Come arrivarci</label><input class="ed-input" id="ed-dir" value="' + (s.di||"").replace(/"/g,"&quot;") + '" placeholder="Indicazioni">';
  h += '<div class="ed-row"><div class="ed-half"><label class="ed-label">Lat</label><input class="ed-input" id="ed-lat" type="number" step="any" value="' + (s.la||0) + '"></div>';
  h += '<div class="ed-half"><label class="ed-label">Lng</label><input class="ed-input" id="ed-lng" type="number" step="any" value="' + (s.ln||0) + '"></div></div>';
  h += '<label class="ed-label">Link prenotazione (opzionale)</label><input class="ed-input" id="ed-bk" value="' + (s.bk?s.bk.u:"") + '" placeholder="https://...">';
  
  h += '<div class="ed-actions">';
  h += '<button class="ed-save" onclick="saveEdit(' + dayIdx + ',' + stopIdx + ',' + (isNew?1:0) + ')">Salva</button>';
  if (!isNew) {
    h += '<button class="ed-del" onclick="deleteStop(' + dayIdx + ',' + stopIdx + ')">Elimina tappa</button>';
  }
  h += '</div>';
  
  if (!isNew) {
    h += '<div class="ed-move">';
    if (stopIdx > 0) h += '<button class="ed-move-btn" onclick="moveStop(' + dayIdx + ',' + stopIdx + ',-1)">\u2191 Sposta su</button>';
    if (stopIdx < all.items.length - 1) h += '<button class="ed-move-btn" onclick="moveStop(' + dayIdx + ',' + stopIdx + ',1)">\u2193 Sposta giu</button>';
    h += '</div>';
  }
  
  h += '</div>';
  
  content.innerHTML = h;
  overlay.classList.add("open");
}

function closeEdit() {
  document.getElementById("edit-overlay").classList.remove("open");
}

function saveEdit(dayIdx, stopIdx, isNew) {
  var s = {
    t: document.getElementById("ed-time").value || "12:00",
    n: document.getElementById("ed-name").value || "Nuova tappa",
    tp: document.getElementById("ed-type").value,
    ds: document.getElementById("ed-desc").value || "",
    du: document.getElementById("ed-dur").value || "",
    la: parseFloat(document.getElementById("ed-lat").value) || 0,
    ln: parseFloat(document.getElementById("ed-lng").value) || 0,
    ad: document.getElementById("ed-addr").value || "",
    di: document.getElementById("ed-dir").value || "",
    ws: [],
    bk: null,
    pla: null,
    pln: null
  };
  
  var bkUrl = document.getElementById("ed-bk").value;
  if (bkUrl) s.bk = {u: bkUrl, l: "Prenota"};
  
  // Find which zone and position this stop is in
  var info = findStopInZones(dayIdx, stopIdx);
  
  if (isNew) {
    // Add to last zone of the day
    var lastZone = LIVE_DAYS[dayIdx].zones[LIVE_DAYS[dayIdx].zones.length - 1];
    lastZone.items.push(s);
  } else {
    LIVE_DAYS[dayIdx].zones[info.zoneIdx].items[info.itemIdx] = s;
  }
  
  saveDays(LIVE_DAYS);
  closeEdit();
  renderDay(cD);
}

function deleteStop(dayIdx, stopIdx) {
  var info = findStopInZones(dayIdx, stopIdx);
  LIVE_DAYS[dayIdx].zones[info.zoneIdx].items.splice(info.itemIdx, 1);
  // Remove empty zones
  LIVE_DAYS[dayIdx].zones = LIVE_DAYS[dayIdx].zones.filter(function(z) { return z.items.length > 0; });
  saveDays(LIVE_DAYS);
  closeEdit();
  renderDay(cD);
}

function moveStop(dayIdx, stopIdx, direction) {
  var all = allItemsLive(LIVE_DAYS[dayIdx]).items;
  if (stopIdx + direction < 0 || stopIdx + direction >= all.length) return;
  
  var infoFrom = findStopInZones(dayIdx, stopIdx);
  var infoTo = findStopInZones(dayIdx, stopIdx + direction);
  
  // Swap in the flat list approach: remove from source, insert at target
  var item = LIVE_DAYS[dayIdx].zones[infoFrom.zoneIdx].items.splice(infoFrom.itemIdx, 1)[0];
  LIVE_DAYS[dayIdx].zones[infoTo.zoneIdx].items.splice(infoTo.itemIdx + (direction > 0 ? 1 : 0), 0, item);
  
  // Clean empty zones
  LIVE_DAYS[dayIdx].zones = LIVE_DAYS[dayIdx].zones.filter(function(z) { return z.items.length > 0; });
  
  saveDays(LIVE_DAYS);
  closeEdit();
  renderDay(cD);
}

// Helper: given a flat stopIdx, find zoneIdx and itemIdx within that zone
function findStopInZones(dayIdx, flatIdx) {
  var count = 0;
  for (var zi = 0; zi < LIVE_DAYS[dayIdx].zones.length; zi++) {
    var zone = LIVE_DAYS[dayIdx].zones[zi];
    for (var ii = 0; ii < zone.items.length; ii++) {
      if (count === flatIdx) return {zoneIdx: zi, itemIdx: ii};
      count++;
    }
  }
  return {zoneIdx: 0, itemIdx: 0};
}

// Helper: get all items from LIVE_DAYS
function allItemsLive(d) {
  var a = [];
  d.zones.forEach(function(z) { z.items.forEach(function(s) { a.push(s); }); });
  return {items: a};
}

// === NOMINATIM SEARCH + ADD TO ITINERARY ===
var NOM_CACHE = {};

function detectType(place){
  var t=(place.type||"").toLowerCase();
  var c=(place["class"]||"").toLowerCase();
  if(NOM_TYPE_MAP[t])return NOM_TYPE_MAP[t];
  if(NOM_TYPE_MAP[c])return NOM_TYPE_MAP[c];
  var dn=(place.display_name||"").toLowerCase();
  if(dn.indexOf("pub")>=0||dn.indexOf("bar ")>=0||dn.indexOf("cave")>=0||dn.indexOf("wine")>=0||dn.indexOf("brewery")>=0)return "Bar/Cantina";
  if(dn.indexOf("restaurant")>=0||dn.indexOf("cafe")>=0||dn.indexOf("pizz")>=0)return "Cibo";
  if(dn.indexOf("museum")>=0||dn.indexOf("gallery")>=0||dn.indexOf("palace")>=0||dn.indexOf("tower")>=0||dn.indexOf("bridge")>=0||dn.indexOf("church")>=0)return "Attrazione";
  if(dn.indexOf("market")>=0)return "Mercato";
  if(dn.indexOf("station")>=0)return "Trasporto";
  if(dn.indexOf("hotel")>=0||dn.indexOf("hostel")>=0)return "Hotel";
  return "Attrazione";
}

function searchNominatim(q){
  if(!q||q.length<3)return;
  var key=q.toLowerCase();
  if(NOM_CACHE[key]){renderNomResults(NOM_CACHE[key],q);return}
  fetch("https://nominatim.openstreetmap.org/search?format=json&q="+encodeURIComponent(q+" Paris France")+"&limit=5&addressdetails=1",{headers:{"Accept-Language":"it"}})
  .then(function(r){return r.json()})
  .then(function(d){NOM_CACHE[key]=d;renderNomResults(d,q)})
  .catch(function(){});
}

function renderNomResults(results,q){
  var c=document.getElementById("nom-results");
  if(!c)return;
  if(!results.length){c.innerHTML='<div class="sr-section"><div class="sr-section-hdr">AGGIUNGI ALL\'ITINERARIO</div><div class="sr-empty-small">Nessun risultato su OpenStreetMap</div></div>';return}
  
  var seen2={};var unique2=[];
  results.forEach(function(r){var nm=r.display_name.split(",")[0].trim().toLowerCase();if(!seen2[nm]){seen2[nm]=true;unique2.push(r)}});
  
  var h='<div class="sr-section"><div class="sr-section-hdr">AGGIUNGI ALL\'ITINERARIO</div>';
  unique2.forEach(function(r,i){
    var name=r.display_name.split(",")[0];
    var addr=r.display_name.split(",").slice(1,3).join(",").trim();
    var tp=detectType(r);
    var ti=TI[tp]||"\u{1F3DB}";
    var cl=TC[tp]||"attr";
    var safeName=name.replace(/'/g,"\u2019");
    var safeAddr=addr.replace(/'/g,"\u2019");
    var la=parseFloat(r.lat);
    var ln=parseFloat(r.lon);
    h+='<div class="sr-item" onclick="showAddFlow('+i+',\''+q.replace(/'/g,"\\'")+'\')">';
    h+='<div class="sr-item-ico" style="background:var(--'+cl+'s,var(--bg3))">'+ti+'</div>';
    h+='<div class="sr-item-info"><div class="sr-item-name">'+name+'</div><div class="sr-item-meta">'+tp+' \u2022 '+addr+'</div></div>';
    h+='<div class="sr-add-badge">+ Aggiungi</div>';
    h+='</div>';
  });
  h+='</div>';
  
  // Google Maps link
  h+='<div class="sr-gmaps" onclick="window.open(\'https://www.google.com/maps/search/'+encodeURIComponent(q+' Paris')+'\',\'_blank\')">';
  h+='<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2C6.4 2 3.5 4.9 3.5 8.5c0 5.2 6.5 11.5 6.5 11.5s6.5-6.3 6.5-11.5C16.5 4.9 13.6 2 10 2z" fill="#ea4335"/><circle cx="10" cy="8.5" r="2" fill="#fff"/></svg>';
  h+='<div class="sr-gmaps-text">Cerca "'+q+'" su Google Maps</div>';
  h+='<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 12L12 4M12 4H6M12 4v6" stroke="var(--tx3)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  h+='</div>';
  
  c.innerHTML=h;
}

function showAddFlow(resultIdx,q){
  var key=q.toLowerCase();
  var results=NOM_CACHE[key];
  if(!results||!results[resultIdx])return;
  var place=results[resultIdx];
  var name=place.display_name.split(",")[0];
  var addr=place.display_name.split(",").slice(0,3).join(",").trim();
  var la=parseFloat(place.lat);
  var ln=parseFloat(place.lon);
  var tp=detectType(place);
  
  var overlay=document.getElementById("edit-overlay");
  var content=document.getElementById("edit-content");
  var h='<div class="ed-hdr"><div class="ed-title">Aggiungi tappa</div><button class="ph-close" onclick="closeEdit()">\u2715</button></div>';
  h+='<div class="ed-form">';
  h+='<div style="padding:12px;background:var(--bg3);border-radius:10px;margin-bottom:14px"><div style="font-size:15px;font-weight:600">'+name+'</div><div style="font-size:12px;color:var(--tx2);margin-top:4px">'+addr+'</div><div style="font-size:11px;color:var(--tx3);margin-top:4px">Tipo rilevato: '+tp+'</div></div>';
  h+='<label class="ed-label">In quale giorno?</label><div class="day-pick">';
  LIVE_DAYS.forEach(function(d,i){
    h+='<button class="day-pick-btn" onclick="addPlaceToDay('+i+',\''+name.replace(/'/g,"\\'")+'\',\''+tp+'\',\''+addr.replace(/'/g,"\\'")+'\','+la+','+ln+')">';
    h+=d.pl+'<br><span style="font-size:10px;color:var(--tx3);font-weight:400">'+d.t.substring(0,28)+'</span></button>';
  });
  h+='</div></div>';
  content.innerHTML=h;
  overlay.classList.add("open");
}

function addPlaceToDay(dayIdx,name,tp,addr,la,ln){
  var all=allItems(LIVE_DAYS[dayIdx]);
  var lastTime="12:00";
  if(all.length>0){
    var lt=all[all.length-1].t;var parts=lt.split(":");
    var hh=parseInt(parts[0]);hh+=1;if(hh>23)hh=23;
    lastTime=(hh<10?"0":"")+hh+":"+parts[1];
  }
  var newStop={t:lastTime,n:name,tp:tp,ds:"",du:"~1h",la:la,ln:ln,ad:addr,di:"",ws:[],bk:null,pla:null,pln:null};
  var lastZone=LIVE_DAYS[dayIdx].zones[LIVE_DAYS[dayIdx].zones.length-1];
  lastZone.items.push(newStop);
  lastZone.items.sort(function(a,b){return a.t.localeCompare(b.t)});
  saveDays(LIVE_DAYS);
  closeEdit();
  selDay(dayIdx);
  var allNew=allItems(LIVE_DAYS[dayIdx]);
  var newIdx=-1;
  allNew.forEach(function(s,idx){if(s.n===name&&s.la===la)newIdx=idx});
  if(newIdx>=0)setTimeout(function(){showEditStop(dayIdx,newIdx)},300);
  showToast("\u2705 "+name+" aggiunto a "+LIVE_DAYS[dayIdx].pl);
}

function showSearchAdd(dayIdx, afterStopIdx) {
  var overlay = document.getElementById("edit-overlay");
  var content = document.getElementById("edit-content");
  var dayName = LIVE_DAYS[dayIdx].pl;
  var posLabel = typeof afterStopIdx === "number" ? " (dopo posizione " + (afterStopIdx+1) + ")" : "";
  
  var h = '<div class="ed-hdr"><div class="ed-title">Aggiungi tappa a ' + dayName + '</div><button class="ph-close" onclick="closeEdit()">\u2715</button></div>';
  h += '<div class="ed-form">';
  h += '<label class="ed-label">Cerca un luogo</label>';
  h += '<div class="ph-free-row"><input type="text" class="ed-input" id="addSearchIn" placeholder="Es: Angelina, Tour Eiffel..."><button class="ph-translate-btn" onclick="doAddSearch(' + dayIdx + ',' + (typeof afterStopIdx==="number"?afterStopIdx:"999") + ')"><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="#fff" stroke-width="2" fill="none"/><path d="M11 11l3 3" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg></button></div>';
  h += '<div id="addSearchResults" style="margin-top:10px"></div>';
  h += '</div>';
  
  content.innerHTML = h;
  overlay.classList.add("open");
  setTimeout(function() {
    var inp = document.getElementById("addSearchIn");
    if (inp) {
      inp.focus();
      inp.addEventListener("keydown", function(e) {
        if (e.key === "Enter") doAddSearch(dayIdx, typeof afterStopIdx==="number"?afterStopIdx:999);
      });
    }
  }, 300);
}

function doAddSearch(dayIdx, afterStopIdx) {
  var q = document.getElementById("addSearchIn").value.trim();
  if (!q || q.length < 2) return;
  var out = document.getElementById("addSearchResults");
  out.innerHTML = '<div class="emp">\u23f3 Cerco...</div>';
  
  fetch("https://nominatim.openstreetmap.org/search?format=json&q=" + encodeURIComponent(q + " Paris France") + "&limit=8&addressdetails=1", {headers:{"Accept-Language":"it"}})
  .then(function(r) { return r.json(); })
  .then(function(results) {
    if (!results.length) { out.innerHTML = '<div class="emp">Nessun risultato</div>'; return; }
    // Deduplicate by name
    var seen = {};
    var unique = [];
    results.forEach(function(r) {
      var name = r.display_name.split(",")[0].trim().toLowerCase();
      if (!seen[name]) {
        seen[name] = true;
        unique.push(r);
      }
    });
    
    var h = "";
    unique.forEach(function(r, i) {
      var name = r.display_name.split(",")[0];
      var addr = r.display_name.split(",").slice(1, 3).join(",").trim();
      var la = parseFloat(r.lat);
      var ln = parseFloat(r.lon);
      var tp = detectType(r);
      var ti = TI[tp] || "\ud83c\udfdb";
      var safeName = name.replace(/'/g, "\u2019");
      var safeAddr = addr.replace(/'/g, "\u2019");
      h += '<div class="sr nom-sr" onclick="confirmAddPlaceAt(' + dayIdx + ',' + afterStopIdx + ',\'' + safeName + '\',\'' + tp + '\',\'' + safeAddr + '\',' + la + ',' + ln + ')">';
      h += '<div style="display:flex;justify-content:space-between;align-items:center"><div>';
      h += '<div class="sr-d">' + ti + ' ' + tp + '</div>';
      h += '<div class="sr-n">' + name + '</div>';
      h += '<div class="sr-x">' + addr + '</div>';
      h += '</div><div class="nom-add">+ Aggiungi</div></div></div>';
    });
    out.innerHTML = h;
  })
  .catch(function() { out.innerHTML = '<div class="emp">Errore di connessione</div>'; });
}

function confirmAddPlaceAt(dayIdx, afterStopIdx, name, tp, addr, la, ln) {
  // Calculate time: if inserting between stops, average their times
  var all = allItems(LIVE_DAYS[dayIdx]);
  var newTime = "12:00";
  
  if (afterStopIdx < 999 && afterStopIdx >= 0 && afterStopIdx < all.length) {
    var prevTime = all[afterStopIdx].t;
    var pp = prevTime.split(":");
    var ph = parseInt(pp[0]), pm = parseInt(pp[1]);
    // Check if there's a next stop
    if (afterStopIdx + 1 < all.length) {
      var nextTime = all[afterStopIdx + 1].t;
      var np = nextTime.split(":");
      var nh = parseInt(np[0]), nm = parseInt(np[1]);
      // Average
      var avgMin = Math.round(((ph*60+pm) + (nh*60+nm)) / 2);
      var ah = Math.floor(avgMin/60);
      var am = avgMin % 60;
      newTime = (ah<10?"0":"") + ah + ":" + (am<10?"0":"") + am;
    } else {
      // After last stop: +1h
      ph += 1;
      if (ph > 23) ph = 23;
      newTime = (ph<10?"0":"") + ph + ":" + (pm<10?"0":"") + pm;
    }
  } else {
    // At the end: +1h from last
    if (all.length > 0) {
      var lt = all[all.length-1].t.split(":");
      var lh = parseInt(lt[0]) + 1;
      if (lh > 23) lh = 23;
      newTime = (lh<10?"0":"") + lh + ":" + lt[1];
    }
  }
  
  var newStop = {t:newTime,n:name,tp:tp,ds:"",du:"~1h",la:la,ln:ln,ad:addr,di:"",ws:[],bk:null,pla:null,pln:null};
  
  // Find the right zone and position to insert
  if (afterStopIdx < 999 && afterStopIdx >= 0) {
    var info = findStopInZones(dayIdx, afterStopIdx);
    LIVE_DAYS[dayIdx].zones[info.zoneIdx].items.splice(info.itemIdx + 1, 0, newStop);
  } else {
    var lastZone = LIVE_DAYS[dayIdx].zones[LIVE_DAYS[dayIdx].zones.length - 1];
    lastZone.items.push(newStop);
  }
  
  saveDays(LIVE_DAYS);
  closeEdit();
  selDay(dayIdx);
  showToast("\u2705 " + name + " aggiunto!");
}

function deleteStopPermanent(dayIdx, stopIdx) {
  var all = allItems(LIVE_DAYS[dayIdx]);
  var name = all[stopIdx] ? all[stopIdx].n : "tappa";
  if (!confirm("Eliminare definitivamente " + name + "?")) return;
  var info = findStopInZones(dayIdx, stopIdx);
  LIVE_DAYS[dayIdx].zones[info.zoneIdx].items.splice(info.itemIdx, 1);
  LIVE_DAYS[dayIdx].zones = LIVE_DAYS[dayIdx].zones.filter(function(z) { return z.items.length > 0; });
  saveDays(LIVE_DAYS);
  renderDay(cD);
  showToast("\ud83d\uddd1 " + name + " eliminato");
}

function showToast(msg) {
  var t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(function() { t.classList.remove("show"); }, 2500);
}

// === CHECKLIST PRE-PARTENZA ===

// === BEER COUNTER ===

// === DIARIO DI VIAGGIO ===
function loadDiary(){
  var s=localStorage.getItem("pr-diary");
  if(s){try{return JSON.parse(s)}catch(e){}}
  return {};
}
function saveDiary(d){localStorage.setItem("pr-diary",JSON.stringify(d))}

function addDiaryEntry(dayIdx, stopIdx, text, photoData){
  var diary=loadDiary();
  var key=dayIdx+"-"+stopIdx;
  if(!diary[key])diary[key]=[];
  var entry={text:text||"",photo:photoData||null,time:new Date().toLocaleString("it-IT")};
  diary[key].push(entry);
  saveDiary(diary);
}

function renderDiaryBtn(dayIdx, stopIdx){
  var diary=loadDiary();
  var key=dayIdx+"-"+stopIdx;
  var entries=diary[key]||[];
  var hasPhoto=entries.some(function(e){return e.photo});
  var badge=entries.length>0?'<span class="diary-badge">'+entries.length+'</span>':"";
  var photoTag=hasPhoto?' \u{1F4F7}':'';
  return {html:'<a class="btn-ico" style="position:relative" href="javascript:void(0)" onclick="event.stopPropagation();event.preventDefault();showDiary('+dayIdx+','+stopIdx+')" title="Diario">'+ICN.diary+badge+'</a>', hasEntries:entries.length>0, hasPhoto:hasPhoto};
}

function showDiary(dayIdx, stopIdx){
  var diary=loadDiary();
  var key=dayIdx+"-"+stopIdx;
  var entries=diary[key]||[];
  var all=allItems(LIVE_DAYS[dayIdx]);
  var stopName=all[stopIdx]?all[stopIdx].n:"Tappa";
  
  var overlay=document.getElementById("edit-overlay");
  var content=document.getElementById("edit-content");
  
  var h='<div class="ed-hdr" style="background:#14b8a6"><div class="ed-title">\ud83d\udcd6 '+stopName+'</div><button class="ph-close" onclick="closeEdit()">\u2715</button></div>';
  h+='<div class="ed-form">';
  
  if(entries.length>0){
    entries.forEach(function(e,i){
      h+='<div class="diary-entry" style="position:relative">';
      h+='<button class="diary-del" onclick="event.stopPropagation();deleteDiaryEntry('+dayIdx+','+stopIdx+','+i+')">&times;</button>';
      if(e.photo)h+='<img src="'+e.photo+'" class="diary-photo">';
      if(e.text)h+='<div class="diary-text">'+e.text+'</div>';
      h+='<div class="diary-time">'+e.time+'</div>';
      h+='</div>';
    });
  }else{
    h+='<div class="emp">Nessuna nota ancora. Aggiungi il tuo primo ricordo!</div>';
  }
  
  h+='<div style="margin-top:14px;border-top:1px solid var(--brd);padding-top:14px">';
  h+='<textarea class="ed-input ed-ta" id="diary-text" placeholder="Cosa hai visto? Come ti sei sentito?"></textarea>';
  h+='<div style="display:flex;gap:8px;margin-top:8px">';
  h+='<label class="diary-photo-btn" style="flex:1;justify-content:center"><input type="file" accept="image/*" capture="environment" id="diary-photo" style="display:none" onchange="previewDiaryPhoto()"><span>\ud83d\udcf7 Scatta foto</span></label>';
  h+='<label class="diary-photo-btn" style="flex:1;justify-content:center"><input type="file" accept="image/*" id="diary-gallery" style="display:none" onchange="previewDiaryGallery()"><span>\ud83d\uddbc Galleria</span></label>';
  h+='</div>';
  h+='<div style="margin-top:8px"><button class="ed-save" style="width:100%" onclick="saveDiaryEntry('+dayIdx+','+stopIdx+')">\ud83d\udcbe Salva ricordo</button></div>';
  h+='<div id="diary-preview" style="margin-top:8px"></div>';
  h+='</div></div>';
  
  content.innerHTML=h;
  overlay.classList.add("open");
}

function compressPhoto(file, callback){
  var reader=new FileReader();
  reader.onload=function(e){
    var img=new Image();
    img.onload=function(){
      var canvas=document.createElement("canvas");
      var maxW=800,maxH=600;
      var w=img.width,h=img.height;
      if(w>maxW){h=h*(maxW/w);w=maxW}
      if(h>maxH){w=w*(maxH/h);h=maxH}
      canvas.width=w;canvas.height=h;
      var ctx=canvas.getContext("2d");
      ctx.drawImage(img,0,0,w,h);
      var compressed=canvas.toDataURL("image/jpeg",0.5);
      callback(compressed);
    };
    img.src=e.target.result;
  };
  reader.readAsDataURL(file);
}

function previewDiaryGallery(){
  var f=document.getElementById("diary-gallery").files[0];
  if(!f)return;
  compressPhoto(f,function(data){
    document.getElementById("diary-preview").innerHTML='<img src="'+data+'" style="width:100%;border-radius:8px;max-height:200px;object-fit:cover">';
    document.getElementById("diary-preview").dataset.photo=data;
  });
}

function previewDiaryPhoto(){
  var f=document.getElementById("diary-photo").files[0];
  if(!f)return;
  compressPhoto(f,function(data){
    document.getElementById("diary-preview").innerHTML='<img src="'+data+'" style="width:100%;border-radius:8px;max-height:200px;object-fit:cover">';
    document.getElementById("diary-preview").dataset.photo=data;
  });
}

function saveDiaryEntry(dayIdx, stopIdx){
  var text=document.getElementById("diary-text").value.trim();
  var preview=document.getElementById("diary-preview");
  var photo=preview.dataset?preview.dataset.photo:null;
  if(!text&&!photo){showToast("\u270f Scrivi qualcosa o scatta una foto");return}
  addDiaryEntry(dayIdx, stopIdx, text, photo);
  closeEdit();
  showToast("\ud83d\udcd6 Ricordo salvato!");
  renderDay(cD);
}


function deleteDiaryEntry(dayIdx, stopIdx, entryIdx){
  var diary=loadDiary();
  var key=dayIdx+"-"+stopIdx;
  if(diary[key]&&diary[key][entryIdx]!==undefined){
    diary[key].splice(entryIdx,1);
    if(diary[key].length===0)delete diary[key];
    saveDiary(diary);
    renderDay(cD);
    showDiary(dayIdx,stopIdx);
    showToast("\u{1F5D1} Ricordo eliminato");
  }
}

function exportDiary(){
  var diary=loadDiary();
  var h='<html><head><meta charset="utf-8"><title>Diario Parigi 2026</title><style>body{font-family:system-ui;max-width:600px;margin:0 auto;padding:20px}h1{font-size:24px}h2{font-size:18px;margin-top:24px}.entry{margin:12px 0;padding:12px;border:1px solid #eee;border-radius:8px}img{max-width:100%;border-radius:8px}.time{font-size:11px;color:#999}</style></head><body>';
  h+='<h1>\ud83d\udcd6 Diario Parigi 2026</h1>';
  LIVE_DAYS.forEach(function(d,di){
    var hasEntries=false;
    allItems(d).forEach(function(s,si){
      var key=di+"-"+si;
      if(diary[key]&&diary[key].length>0)hasEntries=true;
    });
    if(!hasEntries)return;
    h+='<h2>'+d.pl+' - '+d.t+'</h2>';
    allItems(d).forEach(function(s,si){
      var key=di+"-"+si;
      var entries=diary[key];
      if(!entries||!entries.length)return;
      h+='<h3>'+s.n+'</h3>';
      entries.forEach(function(e){
        h+='<div class="entry">';
        if(e.photo)h+='<img src="'+e.photo+'">';
        if(e.text)h+='<p>'+e.text+'</p>';
        h+='<div class="time">'+e.time+'</div></div>';
      });
    });
  });
  h+='</body></html>';
  var blob=new Blob([h],{type:'text/html'});
  var url=URL.createObjectURL(blob);
  var a=document.createElement('a');
  a.href=url;a.download='diario-parigi-2026.html';a.click();
  showToast("\ud83d\udcbe Diario esportato!");
}

function renderBeerPage(){
  var log=loadDrinks();
  var c=drinkCounts(log);
  var total=log.length;
  var st=getDrinkStats(log,c);
  var h='<div class="bc-wrap">';
  h+='<div class="bc-hero" style="position:relative">';
  h+='<div class="wt-refresh" onclick="resetDrinks()" style="position:absolute;top:12px;right:12px"><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 2h12M4 5h8l-.7 8.5a1 1 0 01-1 .9H5.7a1 1 0 01-1-.9L4 5z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
  h+='<div class="bc-hero-num">'+total+'</div>';
  h+='<div class="bc-hero-label">Drink Counter</div>';
  h+='<div class="bc-hero-stats">';
  h+='<div class="bc-hs"><div class="bc-hs-n">'+st.today+'</div><div class="bc-hs-l">oggi</div></div>';
  h+='<div class="bc-hs"><div class="bc-hs-n">'+st.avg+'</div><div class="bc-hs-l">media/giorno</div></div>';
  if(st.top)h+='<div class="bc-hs"><div class="bc-hs-n">'+st.top.ico+'</div><div class="bc-hs-l">'+st.top.name+'</div></div>';
  h+='</div></div>';

  h+='<div class="bc-card" style="padding:12px"><div class="bc-card-hdr" style="border:none;padding:0 0 10px">AGGIUNGI</div>';
  h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">';
  DRINK_TYPES.forEach(function(d){
    h+='<div style="background:var(--bg3);border:1px solid var(--brd);border-radius:12px;padding:12px;text-align:center">';
    h+='<div style="font-size:26px;line-height:1">'+d.ico+'</div>';
    h+='<div style="font-size:12px;color:var(--tx2);margin:4px 0 8px">'+d.name+'</div>';
    h+='<div style="display:flex;align-items:center;justify-content:center;gap:12px">';
    h+='<button class="bp-btn" onclick="removeDrink(\''+d.k+'\')">-</button><span class="bp-cnt">'+c[d.k]+'</span><button class="bp-btn" onclick="addDrink(\''+d.k+'\')">+</button>';
    h+='</div></div>';
  });
  h+='</div></div>';

  h+=renderDrinkDaily(log);
  h+=renderDrinkAchs(log,c);
  if(total)h+=renderDrinkStats(st,total);
  h+='</div>';
  document.getElementById("beerw").innerHTML=h;
}

var DRINK_TYPES=[
  {k:"wine",ico:"\u{1F377}",name:"Vino"},
  {k:"beer",ico:"\u{1F37A}",name:"Birra"},
  {k:"cocktail",ico:"\u{1F378}",name:"Drink"},
  {k:"spirit",ico:"\u{1F943}",name:"Distillato"}
];
function loadDrinks(){
  var s=localStorage.getItem("pr-drinks");
  if(s){try{var a=JSON.parse(s);if(Array.isArray(a))return a}catch(e){}}
  return [];
}
function saveDrinks(a){localStorage.setItem("pr-drinks",JSON.stringify(a))}
function todayKey(){
  var d=new Date();
  return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2);
}
function dayKeyFor(i){
  var p=CONFIG.startDate.split("-");
  return new Date(Date.UTC(+p[0],+p[1]-1,+p[2]+i)).toISOString().slice(0,10);
}
function drinkCounts(a){
  var c={wine:0,beer:0,cocktail:0,spirit:0};
  a.forEach(function(x){if(c[x.k]!==undefined)c[x.k]++});
  return c;
}
function addDrink(k){
  var a=loadDrinks();
  a.push({k:k,d:todayKey(),t:Date.now()});
  saveDrinks(a);
  var dt=DRINK_TYPES.filter(function(x){return x.k===k})[0];
  showToast(dt.ico+" "+dt.name+" - totale "+a.length);
  renderBeerPage();
}
function removeDrink(k){
  var a=loadDrinks();
  for(var i=a.length-1;i>=0;i--){if(a[i].k===k){a.splice(i,1);break}}
  saveDrinks(a);
  renderBeerPage();
}
function resetDrinks(){
  if(!confirm("Azzerare tutti i drink e ricominciare da zero?"))return;
  localStorage.removeItem("pr-drinks");
  renderBeerPage();
  showToast("\u{1F504} Drink Counter azzerato!");
}
function getDrinkStats(log,c){
  var perDay={};
  log.forEach(function(x){perDay[x.d]=(perDay[x.d]||0)+1});
  var nd=Object.keys(perDay).length;
  var top=null,tc=0;
  DRINK_TYPES.forEach(function(d){if(c[d.k]>tc){tc=c[d.k];top=d}});
  var topDay="",tdc=0;
  LIVE_DAYS.forEach(function(d,i){var n=perDay[dayKeyFor(i)]||0;if(n>tdc){tdc=n;topDay=d.pl}});
  return {today:perDay[todayKey()]||0,avg:nd?(log.length/nd).toFixed(1):"0",top:top,topCount:tc,topDay:topDay,topDayCount:tdc,days:nd};
}
function renderDrinkDaily(log){
  var counts=LIVE_DAYS.map(function(d,i){
    var k=dayKeyFor(i);
    return {label:d.pl.split(" ")[0],count:log.filter(function(x){return x.d===k}).length};
  });
  var mx=0;counts.forEach(function(x){if(x.count>mx)mx=x.count});
  if(!mx)return '';
  var h='<div class="bc-card" style="padding:14px"><div class="bc-card-hdr" style="border:none;padding:0 0 10px">DRINK PER GIORNO</div><div class="bc-daily">';
  counts.forEach(function(d){
    var pct=Math.round(d.count/mx*100);
    h+='<div class="bc-daily-bar"><div class="bc-daily-n">'+d.count+'</div><div class="bc-daily-fill" style="height:'+Math.max(pct,2)+'%'+(d.count===mx?'':';opacity:0.7')+'"></div><div class="bc-daily-lbl">'+d.label+'</div></div>';
  });
  return h+'</div></div>';
}
function getDrinkAchs(log,c){
  var n=log.length,types=0;
  DRINK_TYPES.forEach(function(d){if(c[d.k]>0)types++});
  return [
    {icon:"\u{1F942}",name:"Premier Verre",desc:"1 drink",unlocked:n>=1},
    {icon:"\u{1F37B}",name:"Ap\u00e9ro Time",desc:"5 drink",unlocked:n>=5},
    {icon:"\u{1F3C5}",name:"Bon Vivant",desc:"10 drink",unlocked:n>=10},
    {icon:"\u{1F451}",name:"Parisien",desc:"20 drink",unlocked:n>=20},
    {icon:"\u{1F377}",name:"Sommelier",desc:"3 vini",unlocked:c.wine>=3},
    {icon:"\u{1F37A}",name:"Bi\u00e8re Fan",desc:"3 birre",unlocked:c.beer>=3},
    {icon:"\u{1F378}",name:"Mixologue",desc:"3 drink",unlocked:c.cocktail>=3},
    {icon:"\u{1F943}",name:"Digestif",desc:"3 distillati",unlocked:c.spirit>=3},
    {icon:"\u{1F3A9}",name:"Tour de Table",desc:"Tutti i 4 tipi",unlocked:types>=4}
  ];
}
function renderDrinkAchs(log,c){
  var h='<div class="bc-card"><div class="bc-card-hdr">ACHIEVEMENTS</div><div class="bc-achs">';
  getDrinkAchs(log,c).forEach(function(a){
    h+='<div class="bc-ach'+(a.unlocked?'':' bc-ach-locked')+'"><span class="bc-ach-ico">'+(a.unlocked?a.icon:'\u{1F512}')+'</span><div><div class="bc-ach-name">'+a.name+'</div><div class="bc-ach-desc">'+a.desc+'</div></div></div>';
  });
  return h+'</div></div>';
}
function renderDrinkStats(st,total){
  var rows=[["Drink totali",total],["Oggi",st.today],["Media al giorno",st.avg]];
  if(st.top)rows.push(["Preferito",st.top.name+" ("+st.topCount+")"]);
  if(st.topDayCount)rows.push(["Giorno top",st.topDay+" ("+st.topDayCount+")"]);
  var h='<div class="bc-card"><div class="bc-card-hdr">STATISTICHE</div>';
  rows.forEach(function(r,i){
    h+='<div class="bc-st-row'+(i<rows.length-1?' bc-st-brd':'')+'"><span class="bc-st-label">'+r[0]+'</span><span class="bc-st-val">'+r[1]+'</span></div>';
  });
  return h+'</div>';
}

var TAB_HEADERS = {
  p1: {name:"Itinerario", icon:CONFIG.iconFavicon},
  p2: {name:"Cerca", icon:"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2230%22%20height%3D%2230%22%20viewBox%3D%220%200%2030%2030%22%3E%3Crect%20width%3D%2230%22%20height%3D%2230%22%20rx%3D%227%22%20fill%3D%22%233b82f6%22/%3E%3Ccircle%20cx%3D%2213%22%20cy%3D%2213%22%20r%3D%226%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%222%22/%3E%3Cpath%20d%3D%22M18%2018l5%205%22%20stroke%3D%22%23fff%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22/%3E%3C/svg%3E"},
  p3: {name:"Trasporti", icon:"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2230%22%20height%3D%2230%22%20viewBox%3D%220%200%2030%2030%22%3E%3Crect%20width%3D%2230%22%20height%3D%2230%22%20rx%3D%227%22%20fill%3D%22%23ef4444%22/%3E%3Ccircle%20cx%3D%2215%22%20cy%3D%2215%22%20r%3D%229%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%222%22/%3E%3Crect%20x%3D%226%22%20y%3D%2212.5%22%20width%3D%2218%22%20height%3D%225%22%20rx%3D%22.5%22%20fill%3D%22%23fff%22/%3E%3C/svg%3E"},
  p4: {name:"Meteo", icon:"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2230%22%20height%3D%2230%22%20viewBox%3D%220%200%2030%2030%22%3E%3Crect%20width%3D%2230%22%20height%3D%2230%22%20rx%3D%227%22%20fill%3D%22%230ea5e9%22/%3E%3Ccircle%20cx%3D%2214%22%20cy%3D%2213%22%20r%3D%225%22%20fill%3D%22%23fbbf24%22/%3E%3Cpath%20d%3D%22M14%205v2M14%2021v2M6%2013H4M24%2013h-2M7.5%207.5l1.5%201.5M19%2019l1.5%201.5M7.5%2018.5l1.5-1.5M19%207l1.5-1.5%22%20stroke%3D%22%23fbbf24%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22/%3E%3C/svg%3E"},
  p6: {name:"Drink Counter", icon:CONFIG.iconPint},
  p5: {name:"Info", icon:"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2230%22%20height%3D%2230%22%20viewBox%3D%220%200%2030%2030%22%3E%3Crect%20width%3D%2230%22%20height%3D%2230%22%20rx%3D%227%22%20fill%3D%22%236b7280%22/%3E%3Ccircle%20cx%3D%2215%22%20cy%3D%2210%22%20r%3D%222%22%20fill%3D%22%23fff%22/%3E%3Crect%20x%3D%2213%22%20y%3D%2214%22%20width%3D%224%22%20height%3D%229%22%20rx%3D%221%22%20fill%3D%22%23fff%22/%3E%3C/svg%3E"}
};
TAB_HEADERS.p2={name:"Home",icon:"data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"><rect width="30" height="30" rx="7" fill="#a855f7"/><text x="15" y="21" font-size="16" text-anchor="middle">\u{1F5FC}</text></svg>')};
TAB_HEADERS.p7={name:"Cibo",icon:"data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"><rect width="30" height="30" rx="7" fill="#06b6d4"/><text x="15" y="21" font-size="16" text-anchor="middle">\u{1F37D}</text></svg>')};
var NAV_LBL={p2:"Home",p1:"Itinerario",p7:"Cibo",p6:"Drink",more:"Altro"};
var MORE_TABS=["p3","p4","p5"];
function toggleMore(){
  var ov=document.getElementById("more-ov"),sh=document.getElementById("more-sheet");
  if(!ov)return;
  if(ov.classList.contains("on")){ov.classList.remove("on");return}
  var names={p3:"Trasporti",p4:"Meteo",p5:"Info"};
  sh.innerHTML=MORE_TABS.map(function(t){var b=document.querySelector('.nav button[data-p="'+t+'"] .ni');return '<div class="more-it" style="--nc:'+getComputedStyle(document.querySelector('.nav button[data-p="'+t+'"]')).getPropertyValue("--nc")+'" onclick="document.getElementById(\'more-ov\').classList.remove(\'on\');switchToTab(\''+t+'\')"><span class="ni">'+(b?b.innerHTML:"")+'</span><span>'+names[t]+'</span></div>'}).join("");
  ov.classList.add("on");
}
function navDecorate(){
  document.querySelectorAll(".nav button").forEach(function(b){
    if(b.querySelector(".nl")||!NAV_LBL[b.dataset.p])return;
    var s=document.createElement("span");s.className="nl";s.textContent=NAV_LBL[b.dataset.p];b.appendChild(s);
  });
}
function updateHeader(tabId){
  var mb=document.querySelector('.nav button[data-p="more"]');
  if(mb)mb.classList.toggle("on",MORE_TABS.indexOf(tabId)>=0);
  if(tabId==="p7"&&typeof foodOnOpen==="function")foodOnOpen();
  var cfg=TAB_HEADERS[tabId]||TAB_HEADERS.p1;
  document.getElementById("hdr-name").textContent=cfg.name;
  document.getElementById("hdr-ico").src=cfg.icon;
}


/* --- Live weather cache --- */
var WEATHER_CACHE = null;
var TFL_STATUS = {};

/* --- Weather state --- */
var wtDays=null;
var wtSelected=0;
var wtOpen=-1;

function wtToggle(i){
  if(wtOpen===i){wtOpen=-1}else{wtOpen=i}
  wtSelected=i;
  renderMt();
}

function windIcon(kmh){
  if(kmh<10)return '<svg width="20" height="16" viewBox="0 0 20 16"><path d="M2 8c2-2 4 2 6 0" stroke="var(--tx3)" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>';
  if(kmh<20)return '<svg width="20" height="16" viewBox="0 0 20 16"><path d="M2 5c2-2 4 2 6 0" stroke="var(--tx2)" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M2 10c2-2 4 2 6 0" stroke="var(--tx2)" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>';
  return '<svg width="20" height="16" viewBox="0 0 20 16"><path d="M2 3c2-2 4 2 6 0" stroke="var(--tx)" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M2 8c2-2 4 2 6 0" stroke="var(--tx)" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M2 13c2-2 4 2 6 0" stroke="var(--tx)" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>';
}


function fetchWeatherAuto(){fetchW()}


function renderQuickView(){
  if(!LIVE_DAYS||!LIVE_DAYS.length)return "";
  var now=new Date();
  var dayIdx=-1;
  // Find which day we're on (26-31 Mar 2026)
  var dates=["2026-11-20","2026-11-21","2026-11-22","2026-11-23"];
  var today=now.toISOString().split("T")[0];
  for(var i=0;i<dates.length;i++){if(dates[i]===today){dayIdx=i;break}}
  
  if(dayIdx<0||dayIdx>=LIVE_DAYS.length)return "";
  
  var h=now.getHours(),m=now.getMinutes();
  var nowMin=h*60+m;
  var all=allItems(LIVE_DAYS[dayIdx]);
  var current=null,next=null;
  
  for(var j=0;j<all.length;j++){
    var parts=all[j].t.split(":");
    var stopMin=parseInt(parts[0])*60+parseInt(parts[1]);
    if(stopMin<=nowMin)current=all[j];
    if(stopMin>nowMin&&!next)next=all[j];
  }
  
  if(!current&&!next)return "";
  
  var qh='<div class="qv">';
  if(current){
    var cl=TC[current.tp]||"hotel";
    qh+='<div class="qv-now"><span class="qv-label">Adesso</span><span class="qv-name">'+current.n+'</span></div>';
  }
  if(next){
    var parts=next.t.split(":");
    var nextMin=parseInt(parts[0])*60+parseInt(parts[1]);
    var diff=nextMin-nowMin;
    if(diff>0&&diff<=120){
      qh+='<div class="qv-next"><span class="qv-label">Tra '+diff+' min</span><span class="qv-name">'+next.n+'</span></div>';
    }
  }
  qh+='</div>';
  return qh;
}


/* --- Menu & Guide --- */

function toggleTheme(){
  document.documentElement.classList.toggle("light");
  var isLight=document.documentElement.classList.contains("light");
  localStorage.setItem("th",isLight?"l":"d");
  var ico=document.getElementById("theme-ico");
  var lbl=document.getElementById("theme-label");
  if(ico)ico.innerHTML=isLight?"\u2600\ufe0f":"\u{1F319}";
  if(lbl)lbl.textContent=isLight?"Tema scuro":"Tema chiaro";
}
function updateThemeMenu(){
  var isLight=document.documentElement.classList.contains("light");
  var ico=document.getElementById("theme-ico");
  var lbl=document.getElementById("theme-label");
  if(ico)ico.innerHTML=isLight?"\u2600\ufe0f":"\u{1F319}";
  if(lbl)lbl.textContent=isLight?"Tema scuro":"Tema chiaro";
}

function toggleMenu(){
  var m=document.getElementById("app-menu");
  if(m)m.classList.toggle("open");
  updateThemeMenu();
}
function closeMenu(){
  var m=document.getElementById("app-menu");
  if(m)m.classList.remove("open");
}
function showGuide(){
  closeMenu();
  var overlay=document.getElementById("edit-overlay");
  var content=document.getElementById("edit-content");
  var h='<div class="ed-hdr" style="background:#6b7280"><div class="ed-title">Guida funzionalit\u00e0</div><button class="ph-close" onclick="closeEdit()">\u2715</button></div>';
  h+='<div class="ed-form">';
  
  var sections=[
    {t:"\u{1F4C5} Timeline",d:"Scorri i giorni con le pillole in alto. Ogni giorno ha zone colorate con le tappe. Swipe laterale per cambiare giorno."},
    {t:"\u{1F4CD} Mappa",d:"La mappa mostra le tappe del giorno. Premi 'Tu sei qui' per la tua posizione GPS (funziona solo da sito HTTPS)."},
    {t:"\u270f\ufe0f Modifica tappa",d:"L'icona matita accanto al nome di ogni tappa apre il form di modifica. Puoi cambiare orario, descrizione, tipo e posizione."},
    {t:"\u2795 Aggiungi tappa",d:"Il + tra due tappe o in fondo al giorno apre la ricerca. Cerca un luogo, selezionalo e viene aggiunto con coordinate e tipo automatici."},
    {t:"\u23ed\ufe0f Salta tappa",d:"L'icona grigia a destra di ogni tappa la nasconde temporaneamente (diventa trasparente). Puoi ripristinarla in qualsiasi momento."},
    {t:"\u{1F5D1} Elimina tappa",d:"L'icona rossa cestino a destra elimina la tappa definitivamente dall'itinerario. Chiede conferma prima di eliminare."},
    {t:"\u{1F4F7} Diario",d:"L'icona turchese fotocamera su ogni tappa apre il diario. Puoi scattare foto, caricare dalla galleria e aggiungere note. Le foto vengono compresse automaticamente. \u{1F4F7} appare accanto al nome se ci sono foto."},
    {t:"\u{1F4AC} Frasi utili",d:"L'icona viola su ogni tappa mostra frasi in francese utili per quel contesto. Puoi ascoltare la pronuncia, copiare il testo o tradurre liberamente dall'italiano."},
    {t:"\u{1F9ED} Navigazione",d:"L'icona Citymapper apre le indicazioni partendo dalla tua posizione GPS attuale. L'icona Google Maps mostra la destinazione su Maps."},
    {t:"\u{1F50D} Cerca",d:"La tab Cerca trova tappe nell'itinerario. Se non trovi nulla, cerca su OpenStreetMap e aggiungi nuovi luoghi."},
    {t:"\u{1F687} Trasporti",d:"Stato in tempo reale di metro e RER A/B. Serve la chiave PRIM in config.js (primKey), altrimenti c'\u00e8 il link all'info traffico RATP. Premi 'Aggiorna' per i dati pi\u00f9 recenti."},
    {t:"\u2600\ufe0f Meteo",d:"Previsioni con temperatura, pioggia e vento. Si aggiorna automaticamente. Alba e tramonto visibili nella card giornata."},
    {t:"\u{1F377} Drink Counter",d:"Conta vino, birra, drink e distillati con +/-. Sblocca achievement e vedi le statistiche per giorno."},
    {t:"\u{1F37D} Dove mangiare",d:"Nella tab Mangiare cerchi un locale o un piatto vicino a te (GPS) o all'hotel, filtri la selezione e apri Maps, indicazioni e orari su Google."},
    {t:"\u{1F512} PIN",d:"L'app \u00e8 protetta da PIN a 6 cifre. Modificabile in config.js."},
    {t:"\u{1F504} Ripristina",d:"Nel menu (\u2699), 'Ripristina itinerario' riporta tutto alla versione originale."}
  ];
  
  sections.forEach(function(s){
    h+='<div style="margin-bottom:14px"><div style="font-size:14px;font-weight:600;margin-bottom:3px">'+s.t+'</div><div style="font-size:13px;color:var(--tx2);line-height:1.6">'+s.d+'</div></div>';
  });
  
  h+='</div>';
  content.innerHTML=h;
  overlay.classList.add("open");
}



/* --- Swipe: days on Piano, tabs everywhere --- */
var TAB_ORDER=["p2","p1","p3","p4","p7","p6","p5"];
var swStartX=0,swStartY=0;

function getActiveTab(){
  var el=document.querySelector(".pg.on");
  return el?el.id:"p1";
}

function switchToTab(tabId){
  document.querySelectorAll(".pg").forEach(function(p){p.classList.remove("on")});
  document.querySelectorAll(".nav button").forEach(function(b){b.classList.remove("on")});
  var pg=document.getElementById(tabId);
  if(pg)pg.classList.add("on");
  document.querySelectorAll(".nav button").forEach(function(b){
    if(b.dataset.p===tabId)b.classList.add("on");
  });
  updateHeader(tabId);
  if(tabId==="p2")homeReset();
  if(tabId==="p1"&&gpsMap)setTimeout(function(){gpsMap.invalidateSize();renderDayMarkers()},100);
}

function initSwipe(){
  document.addEventListener("touchstart",function(e){
    swStartX=e.touches[0].clientX;
    swStartY=e.touches[0].clientY;
  },{passive:true});
  
  document.addEventListener("touchend",function(e){
    var dx=e.changedTouches[0].clientX-swStartX;
    var dy=e.changedTouches[0].clientY-swStartY;
    if(Math.abs(dx)<60||Math.abs(dy)>Math.abs(dx)*0.6)return;
    
    var tab=getActiveTab();
    var tabIdx=TAB_ORDER.indexOf(tab);
    
    if(tab==="p1"){
      // On Piano: swipe changes day first, then overflows to tabs
      if(dx<0){
        // Swipe left: next day or next tab
        if(cD<LIVE_DAYS.length-1){
          selDay(cD+1);
        }else{
          // Last day: go to next tab
          if(tabIdx<TAB_ORDER.length-1)switchToTab(TAB_ORDER[tabIdx+1]);
        }
      }else{
        // Swipe right: prev day
        if(cD>0)selDay(cD-1);
        else if(tabIdx>0)switchToTab(TAB_ORDER[tabIdx-1]);
      }
    }else{
      // Other tabs: swipe switches tabs
      if(dx<0&&tabIdx<TAB_ORDER.length-1){
        switchToTab(TAB_ORDER[tabIdx+1]);
      }else if(dx>0&&tabIdx>0){
        switchToTab(TAB_ORDER[tabIdx-1]);
      }
    }
  },{passive:true});
}


/* --- Metro status check for timeline --- */
function getMetroWarning(stop){
  if(stop.tp!=="Trasporto"||!stop.ds)return null;
  if(!TFL_STATUS||Object.keys(TFL_STATUS).length===0)return null;
  var warnings=[],seen={},re=/\b(M\d{1,2}|RER [AB])\b/g,m;
  while((m=re.exec(stop.ds))){
    var id=m[1];
    if(seen[id])continue;
    seen[id]=1;
    var st=TFL_STATUS[id];
    if(st&&st.sev!==10&&st.sev!==1)warnings.push({line:id,status:st.desc,sev:st.sev});
  }
  return warnings.length>0?warnings:null;
}


var homeCat="";
function homeReset(){
  homeCat="";
  var si=document.getElementById("si");if(si)si.value="";
  var r=document.getElementById("srs"),nc=document.getElementById("nom-results");
  if(r)r.innerHTML="";if(nc)nc.innerHTML="";
  homeVis(true);
}
function filterCat(cat){
  if(homeCat===cat){homeReset();return}
  homeCat=cat;
  homeVis(false);
  // Clear search input and filter by category
  var q=document.getElementById("si").value.trim().toLowerCase();
  var r=document.getElementById("srs");
  var nc=document.getElementById("nom-results");
  if(nc)nc.innerHTML="";
  
  var found=[];
  LIVE_DAYS.forEach(function(d,di){
    allItems(d).forEach(function(s,si){
      if(s.tp===cat){
        found.push({stop:s,dayIdx:di,stopIdx:si,day:d.pl});
      }
    });
  });
  
  var h='';
  if(found.length>0){
    var tn=TN[cat]||cat;
    h+='<div class="sr-section"><div class="sr-section-hdr">'+tn.toUpperCase()+' NELL\'ITINERARIO</div>';
    found.forEach(function(f){
      var cl=TC[f.stop.tp]||"attr";
      var ti=TI[f.stop.tp]||"\u{1F3DB}";
      h+='<div class="sr-item" onclick="goTo('+f.dayIdx+',\''+f.stop.t+'\')">';
      h+='<div class="sr-item-ico" style="background:var(--'+cl+'s,var(--bg3))">'+ti+'</div>';
      h+='<div class="sr-item-info"><div class="sr-item-name">'+f.stop.n+'</div><div class="sr-item-meta">'+f.day+(f.stop.ad?' \u2022 '+f.stop.ad:'')+'</div></div>';
      h+='<svg class="sr-item-arr" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="var(--tx3)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      h+='</div>';
    });
    h+='</div>';
  }else{
    h+='<div class="sr-section"><div class="sr-section-hdr">'+cat+'</div><div class="sr-empty-small">Nessun risultato</div></div>';
  }
  r.innerHTML=h;
}




function doLocate(){
  var btn=document.querySelector(".gps-btn");
  if(!gpsMap){if(btn)btn.textContent="\u274c Mappa non pronta";return;}
  if(btn)btn.textContent="\u23f3 Cerco...";
  
  // Try 1: native geolocation (no isSecureContext check!)
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      function(p){
        var la=p.coords.latitude,ln=p.coords.longitude;
        if(gpsMarker)gpsMap.removeLayer(gpsMarker);
        gpsMarker=L.circleMarker([la,ln],{radius:10,fillColor:"#3b82f6",fillOpacity:1,color:"#fff",weight:3}).addTo(gpsMap);
        gpsMarker.bindPopup("\u{1F4CD} Tu sei qui!").openPopup();
        gpsMap.setView([la,ln],15);
        if(btn)btn.textContent="\u{1F4CD} Tu sei qui";
      },
      function(err){
        if(btn)btn.textContent="\u274c "+err.message;
        setTimeout(function(){if(btn)btn.textContent="\u{1F4CD} Tu sei qui"},4000);
      },
      {enableHighAccuracy:true,timeout:15000,maximumAge:0}
    );
  }else{
    if(btn){btn.textContent="\u274c GPS non disponibile";setTimeout(function(){btn.textContent="\u{1F4CD} Tu sei qui"},3000);}
  }
}

function init(){
  renderNav();navDecorate();renderPills();LIVE_DAYS=loadDays();
checkVersion();
renderDay(0);renderSearch();renderTr();renderMt();renderIf();renderFood();renderBeerPage();
  var _t=homeToday();homeDay=_t>=0?_t:0;renderHome();updateHeader("p2");
  document.getElementById("si").addEventListener("input",doSearch);
  document.getElementById("si").placeholder="Cerca tappa, luogo, metro...";
  var el=document.getElementById("dc");
  // day swipe handled by initSwipe()
  setTimeout(initMap,300);
  initSwipe();

  setTimeout(fetchWeatherAuto,500);
  setTimeout(fetchTfl,1000);
  setInterval(updateTimers,60000);
}

function initMap(){
  try{
    gpsMap=L.map("gmap",{zoomControl:false,attributionControl:false}).setView([CONFIG.hotelLat,CONFIG.hotelLng],13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18}).addTo(gpsMap);
    renderDayMarkers();
    doLocate();
  }catch(e){console.error("Map init error:",e)}
}

function renderDayMarkers(){
  if(!gpsMap)return;
  dayMarkers.forEach(function(m){gpsMap.removeLayer(m)});
  dayMarkers=[];
  var all=allItems(LIVE_DAYS[cD]).filter(function(s){return s.la&&s.la<52});
  if(!all.length)return;
  var bounds=[];
  all.forEach(function(s,i){
    var m=L.circleMarker([s.la,s.ln],{radius:6,fillColor:"#ef4444",fillOpacity:.9,color:"#fff",weight:2}).addTo(gpsMap);
    m.bindPopup("<b>"+(i+1)+". "+s.n+"</b>");
    dayMarkers.push(m);
    bounds.push([s.la,s.ln]);
  });
  if(bounds.length>1)gpsMap.fitBounds(bounds,{padding:[20,20]});
  else gpsMap.setView(bounds[0],14);
}

function renderNav(){document.querySelectorAll(".nav button").forEach(function(b){b.onclick=function(){if(b.dataset.p==="more"){toggleMore();return}document.querySelectorAll(".nav button").forEach(function(x){x.classList.remove("on")});document.querySelectorAll(".pg").forEach(function(x){x.classList.remove("on")});b.classList.add("on");document.getElementById(b.dataset.p).classList.add("on");updateHeader(b.dataset.p);if(b.dataset.p==="p2")homeReset();if(b.dataset.p==="p1"&&gpsMap)setTimeout(function(){gpsMap.invalidateSize();renderDayMarkers()},100)}})}
function renderPills(){var c=document.getElementById("pls");c.innerHTML=DAYS.map(function(d,i){return '<div class="pl'+(i===0?" on":"")+'" data-i="'+i+'">'+d.pl+'</div>'}).join("");c.querySelectorAll(".pl").forEach(function(p){p.onclick=function(){selDay(+p.dataset.i)}})}
function selDay(i){cD=i;document.querySelectorAll(".pl").forEach(function(x){x.classList.remove("on")});document.querySelector('.pl[data-i="'+i+'"]').classList.add("on");renderDay(i);renderDayMarkers();document.querySelector('.pl[data-i="'+i+'"]').scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})}
function allItems(d){var a=[];d.zones.forEach(function(z){z.items.forEach(function(s,si){a.push(s)})});return a}

function getZoneColor(z){
  var types={};z.items.forEach(function(s,si){var c=TC[s.tp]||"hotel";types[c]=(types[c]||0)+1});
  var max="hotel",maxC=0;for(var k in types)if(types[k]>maxC){max=k;maxC=types[k]}
  return max;
}

function updateTimers(){
  var now=new Date();
  var nowH=now.getHours(),nowM=now.getMinutes();
  var dates=["2026-11-20","2026-11-21","2026-11-22","2026-11-23"];
  var today=now.toISOString().split("T")[0];
  var dayDate=dates[cD]||"";
  
  allItems(LIVE_DAYS[cD]).forEach(function(s,i){
    var el=document.getElementById("tmr-"+cD+"-"+i);
    if(!el)return;
    var parts=s.t.split(":");
    var sh=parseInt(parts[0]),sm=parseInt(parts[1]);
    
    // Build target datetime
    var target=new Date(dayDate+"T"+(sh<10?"0":"")+sh+":"+(sm<10?"0":"")+sm+":00");
    var diffMs=target.getTime()-now.getTime();
    
    if(isNaN(diffMs)){el.textContent="";return}
    
    if(diffMs<0){
      // Past
      if(diffMs>-3600000)el.textContent="\u{1F4CD} In corso";
      else el.textContent="";
    }else{
      var diffMin=Math.floor(diffMs/60000);
      var diffH=Math.floor(diffMin/60);
      var diffD=Math.floor(diffH/24);
      var remH=diffH%24;
      var remM=diffMin%60;
      
      var txt="\u23f1 ";
      if(diffD>0){
        txt+=diffD+"g "+remH+"h";
      }else if(diffH>0){
        txt+=diffH+"h "+remM+"min";
      }else if(diffMin>0){
        txt+=diffMin+" min";
      }else{
        txt="\u{1F4CD} Ora!";
      }
      el.textContent=txt;
    }
  });
}

function stopEmoji(s){
  var n=s.n;
  if(/colazione/i.test(n))return "\u{1F950}";
  if(/navetta/i.test(n))return "\u{1F68C}";
  if(/volo|elmas|aeroporto|beauvais/i.test(n))return "\u2708\uFE0F";
  return {"Cibo":"\u{1F37D}","Mercato":"\u{1F9FA}","Bar/Cantina":"\u{1F377}","Hotel":"\u{1F3E8}","Trasporto":"\u{1F687}","Passeggiata":"\u{1F6B6}","Foto":"\u{1F4F8}","Attrazione":"\u{1F3DB}"}[s.tp]||"\u{1F3DB}";
}
function renderDay(i){
  var d=LIVE_DAYS[i],all=allItems(d);
  var pb=0,fb=0;all.forEach(function(s){if(s.tp==="Bar/Cantina")pb++;if(s.tp==="Cibo")fb++});
  var skipped=all.filter(function(_,si){return localStorage.getItem("pr-sk-"+i+"-"+si)==="1"}).length;
  document.getElementById("pbar").style.width=(all.length?Math.round(skipped/all.length*100):0)+"%";

  var h=renderQuickView()+'<div class="dhc"><div class="dhc-t">'+d.t+'</div><div class="dhc-chips"><span class="chip chip-w">'+d.wt+'</span><span class="chip '+(d.rn?"chip-r":"chip-s")+'">'+(d.rn?"\u{1F327} Pioggia":"\u2600\ufe0f Sole")+'</span>'+(d.sunrise&&d.sunrise.indexOf("T")>0?'<span class="chip chip-w">\u{1F305} '+d.sunrise.split("T")[1].substring(0,5)+'</span>':'')+(d.sunset&&d.sunset.indexOf("T")>0?'<span class="chip chip-w">\u{1F307} '+d.sunset.split("T")[1].substring(0,5)+'</span>':'')+'<span class="chip chip-s">~'+d.km+' km</span><span class="chip chip-s">'+all.length+' tappe</span></div>'+(d.dr?'<div class="dhc-dress">'+d.dr+'</div>':'')+(d.wn?'<div class="dhc-wrn">'+d.wn+'</div>':'')+'</div>';

  h+='<div class="tl">';
  var gi=0;
  d.zones.forEach(function(z,zi){
    var mainTp=getZoneColor(z);
    var nextZ=d.zones[zi+1];
    var nextTp=nextZ?getZoneColor(nextZ):mainTp;
    var firstTime=z.items[0]?z.items[0].t:"";

    h+='<div class="tl-zone tl-lc-'+nextTp+'"><div class="tl-zone-time">'+firstTime+'</div><div class="tl-zone-dotcol"><div class="tl-zone-dot '+mainTp+'"></div></div><div><div class="zb">';
    if(z.zone)h+='<div class="zb-hdr c-'+mainTp+'">'+z.zone+'</div>';

    z.items.forEach(function(s,si){
      var cl=TC[s.tp]||"hotel";
      var ti=TI[s.tp]||"";
      var tn=TN[s.tp]||s.tp;
      var tgs=s.ws.map(function(w){return '<span class="tg tg-'+(w.y==="a"?"a":w.y==="b"?"b":"i")+'">'+w.x+'</span>'}).join("");
      var nt=localStorage.getItem("pr-nt-"+i+"-"+gi)||"";
      var isSkip=localStorage.getItem("pr-sk-"+i+"-"+gi)==="1";
      
      var cmHref=s.la?"https://citymapper.com/directions?startcoord="+CONFIG.hotelLat+","+CONFIG.hotelLng+"&endcoord="+s.la+","+s.ln+"&endname="+encodeURIComponent(s.n)+(s.ad?"&endaddress="+encodeURIComponent(s.ad):""):"";

      h+='<div class="zk zk-t-'+cl+(isSkip?" skip":"")+'" id="zk-'+i+'-'+gi+'" data-e="'+stopEmoji(s)+'" onclick="tgl('+i+','+gi+')">';
      h+='<div class="zk-wrap"><div class="zk-content"><div class="zk-top"><span class="zk-dot '+cl+'"></span><span class="zk-time">'+s.t+'</span><span class="zk-lb '+cl+'">'+ti+" "+tn+'</span></div>';
      var diaryInfo=renderDiaryBtn(i,gi);
      var metroWarn=getMetroWarning(s);
      h+='<div class="zk-nm">'+s.n+(diaryInfo.hasPhoto?' <span style="font-size:12px">\u{1F4F7}</span>':'')+(diaryInfo.hasEntries&&!diaryInfo.hasPhoto?' <span style="font-size:12px">\u{1F4DD}</span>':'')+' <a class="ed-pen" href="javascript:void(0)" onclick="event.stopPropagation();event.preventDefault();showEditStop('+i+','+gi+')" title="Modifica">'+ICN.edit+'</a></div>';
      h+='<div class="zk-ds">'+s.ds+'</div>';
      if(metroWarn){metroWarn.forEach(function(w){h+='<div class="zk-metro-warn"><span class="zk-mw-dot'+(w.sev<5?' zk-mw-bad':' zk-mw-warn')+'"></span>'+w.line+': '+w.status+'</div>'})}
      if(tgs)h+='<div class="zk-tags">'+tgs+'</div>';
      if(s.du)h+='<div class="zk-du">'+s.du+'</div>';
      h+='<div class="zk-timer" id="tmr-'+i+'-'+gi+'"></div>';
      h+='</div>';
      h+='<div class="zk-actions">';
      h+='<a class="zk-act-btn zk-skip-btn'+(isSkip?" on":"")+'" href="javascript:void(0)" onclick="event.stopPropagation();event.preventDefault();toggleSkip('+i+','+gi+')" title="'+(isSkip?'Ripristina':'Salta')+'">'+ICN.skip_stop+'</a>';
      h+='<a class="zk-act-btn zk-del-btn" href="javascript:void(0)" onclick="event.stopPropagation();event.preventDefault();deleteStopPermanent('+i+','+gi+')" title="Elimina">'+ICN.delete_stop+'</a>';
      h+='</div></div></div>';

      h+='<div class="sd" id="sd-'+i+'-'+gi+'">';
      if(s.di)h+='<div class="sdb"><div class="sdl">\u{1F5FA} Come arrivarci</div><div class="sdtx">'+s.di+'</div></div>';
      if(s.ad)h+='<div class="sdb"><div class="sdl">\u{1F4CD} '+s.ad+'</div></div>';
      h+='<div class="sdlk">';
      if(cmHref)h+='<a class="btn-ico" href="'+cmHref+'" title="Citymapper">'+ICN.citymapper+'</a>';
      if(s.la)h+='<a class="btn-ico" href="https://www.google.com/maps/dir/?api=1&destination='+s.la+','+s.ln+'&travelmode=walking" target="_blank" title="Google Maps">'+ICN.gmaps+'</a>';
      h+='<a class="btn-ico" href="javascript:void(0)" onclick="event.stopPropagation();event.preventDefault();showPhrasesIdx('+i+','+gi+')" title="Frasi utili">'+ICN.phrases+'</a>';
      h+=diaryInfo.html;
      if(s.bk)h+='<a class="btn-book" href="'+s.bk.u+'" target="_blank">'+ICN.book+' '+s.bk.l+'</a>';
      if(s.la){h+='<a class="btn-ico" href="https://www.google.com/maps/search/toilet+near+'+s.la+','+s.ln+'" target="_blank" title="Bagno">'+ICN.wc+'</a>';
      h+='<a class="btn-ico" href="https://www.google.com/maps/search/drinking+fountain+near+'+s.la+','+s.ln+'" target="_blank" title="Fontanella">'+ICN.water+'</a>'}
      
      h+='</div>';

      h+='<div class="sdb" style="margin-top:8px"><div class="sdl">\u{1F4DD} Note</div><textarea class="sdnt" placeholder="Aggiungi nota..." id="nt-'+i+'-'+gi+'" onclick="event.stopPropagation()" onblur="saveNt('+i+','+gi+')">'+nt+'</textarea></div>';
      h+='</div>';
      if(si < z.items.length - 1) {
        h+='<div class="add-between"><a class="add-circle" href="javascript:void(0)" onclick="event.stopPropagation();event.preventDefault();showSearchAdd('+i+','+gi+')">'+ICN.add_here+'</a></div>';
      }
      gi++;
    });
    h+='</div></div></div>';
    if(zi < d.zones.length - 1) {
      h+='<div class="tl-zone" style="grid-template-columns:42px 22px 1fr"><div class="tl-zone-time"></div><div class="tl-zone-dotcol" style="padding:4px 0"><div style="width:2px;background:var(--brd);flex:1"></div></div><div class="add-between" style="padding:4px 0"><a class="add-circle" href="javascript:void(0)" onclick="event.stopPropagation();event.preventDefault();showSearchAdd('+i+','+(gi-1)+')">'+ICN.add_here+'</a></div></div>';
    }
  });
  h+='</div>';
  h+='<div style="display:grid;grid-template-columns:42px 14px 1fr;padding:4px 0"><div></div><div></div><div class="add-between"><a class="add-circle" href="javascript:void(0)" onclick="event.stopPropagation();event.preventDefault();showSearchAdd('+i+',allItems(LIVE_DAYS['+i+']).length-1)">'+ICN.add_here+'</a></div></div>';
  document.getElementById("dc").innerHTML=h;
  updateTimers();
}

function tgl(d,s){document.getElementById("sd-"+d+"-"+s).classList.toggle("open")}
function saveNt(d,s){localStorage.setItem("pr-nt-"+d+"-"+s,document.getElementById("pr-nt-"+d+"-"+s).value)}
function toggleSkip(d,s){var k="pr-sk-"+d+"-"+s;localStorage.setItem(k,localStorage.getItem(k)==="1"?"0":"1");renderDay(d)}

function renderSearch(){
  var h='<div class="sr-cats" id="scp">';
  var cats=["Bar/Cantina","Cibo","Attrazione","Mercato","Trasporto"];
  cats.forEach(function(c){
    h+='<span class="sr-chip" onclick="filterCat(\''+c+'\')">'+TI[c]+' '+(TN[c]||c)+'</span>';
  });
  h+='</div>';
  document.getElementById("scp").innerHTML=h;
}
function doSearch(){
  homeCat="";
  var q=document.getElementById("si").value.trim().toLowerCase();
  var r=document.getElementById("srs");
  var nc=document.getElementById("nom-results");
  
  homeVis(!q);
  if(!q){
    r.innerHTML="";
    if(nc)nc.innerHTML="";
    return;
  }
  
  // Local results
  var found=[];
  LIVE_DAYS.forEach(function(d,di){
    allItems(d).forEach(function(s,si){
      if(s.n.toLowerCase().indexOf(q)>=0||s.ds.toLowerCase().indexOf(q)>=0||(s.ad&&s.ad.toLowerCase().indexOf(q)>=0)){
        found.push({stop:s,dayIdx:di,stopIdx:si,day:d.pl});
      }
    });
  });
  
  var h='';
  if(found.length>0){
    h+='<div class="sr-section"><div class="sr-section-hdr">NELL\'ITINERARIO</div>';
    found.forEach(function(f){
      var cl=TC[f.stop.tp]||"attr";
      var ti=TI[f.stop.tp]||"\u{1F3DB}";
      var tn=TN[f.stop.tp]||f.stop.tp;
      h+='<div class="sr-item" onclick="goTo('+f.dayIdx+',\''+f.stop.t+'\')">';
      h+='<div class="sr-item-ico" style="background:var(--'+cl+'s,var(--bg3))">'+ti+'</div>';
      h+='<div class="sr-item-info"><div class="sr-item-name">'+f.stop.n+'</div><div class="sr-item-meta">'+f.day+' \u2022 '+tn+(f.stop.ad?' \u2022 '+f.stop.ad:'')+'</div></div>';
      h+='<svg class="sr-item-arr" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="var(--tx3)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      h+='</div>';
    });
    h+='</div>';
  }else{
    h+='<div class="sr-section"><div class="sr-section-hdr">NELL\'ITINERARIO</div><div class="sr-empty-small">Nessun risultato</div></div>';
  }
  r.innerHTML=h;
  
  // Nominatim search
  if(q&&q.length>=3){
    if(nc)nc.innerHTML='<div class="sr-section"><div class="sr-section-hdr">AGGIUNGI ALL\'ITINERARIO</div><div class="sr-empty-small">\u23f3 Cerco...</div></div>';
    searchNominatim(q);
  }else{
    if(nc)nc.innerHTML="";
  }
}
function goTo(di,t){
  switchToTab("p1");
  selDay(di);
  setTimeout(function(){
    var all=allItems(LIVE_DAYS[di]);var si=all.findIndex(function(s){return s.t===t});
    if(si>=0){var el=document.getElementById("zk-"+di+"-"+si);if(el){el.scrollIntoView({behavior:"smooth",block:"center"});document.getElementById("sd-"+di+"-"+si).classList.add("open")}}
  },150);
}

var LINE_COLORS={"M1":"#FFCD00","M2":"#003CA6","M3":"#837902","M4":"#CF009E","M5":"#FF7E2E","M6":"#6ECA97","M7":"#FA9ABA","M8":"#E19BDF","M9":"#B6BD00","M10":"#C9910D","M11":"#704B1C","M12":"#007852","M13":"#6EC4E8","M14":"#62259D","RER A":"#E2231A","RER B":"#5091CB"};

function lineCodeOf(ln){
  var mode=((ln.commercial_mode&&ln.commercial_mode.name)||"").toLowerCase();
  var code=(ln.code||"").toString().toUpperCase();
  if(!code)return null;
  if(mode.indexOf("rer")>=0)return "RER "+code;
  if(mode.indexOf("tro")>=0)return "M"+code;
  return null;
}

function stripTags(s){return (s||"").replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim()}

function fetchTfl(){
  var list=document.getElementById("tr-list");
  var stats=document.getElementById("tr-stats");
  var foot=document.getElementById("tr-footer");
  var clEl=document.getElementById("tr-closures");
  if(!list)return;
  if(!CONFIG.primKey){
    if(stats)stats.innerHTML="";
    list.innerHTML='<div style="padding:20px;text-align:center;color:var(--tx2);line-height:1.7">Stato linee non attivo.<br>Inserisci la chiave PRIM in config.js (primKey).<br><a href="'+CONFIG.trafficLink+'" target="_blank">Apri info traffico RATP</a></div>';
    return;
  }
  list.innerHTML='<div style="padding:20px;text-align:center;color:var(--tx3)">Caricamento...</div>';
  fetch(CONFIG.primUrl+"?count=200",{headers:{"apikey":CONFIG.primKey}})
  .then(function(r){if(!r.ok)throw new Error("HTTP "+r.status);return r.json()})
  .then(function(data){
    var disr={};
    (data.disruptions||[]).forEach(function(d){disr[d.id||d.disruption_id]=d});
    var info={};
    (data.line_reports||[]).forEach(function(lr){
      var ln=lr.line||{};
      var code=lineCodeOf(ln);
      if(!code)return;
      var links=(ln.links||[]).concat(lr.links||[]);
      links.forEach(function(lk){
        if(lk.type!=="disruption")return;
        var d=disr[lk.id];
        if(!d||d.status!=="active")return;
        var eff=(d.severity&&d.severity.effect)||"";
        var sev=eff==="NO_SERVICE"?2:6;
        var msg=stripTags(d.messages&&d.messages[0]?d.messages[0].text:"")||(d.severity&&d.severity.name)||"";
        if(!info[code]||sev<info[code].sev)info[code]={sev:sev,desc:eff==="NO_SERVICE"?"Interrotta":"Perturbata",reason:msg};
      });
    });
    var ok=0,warn=0,bad=0,h="",closures="";
    TFL_STATUS={};
    CONFIG.tflLines.forEach(function(code){
      var s=info[code]||{sev:10,desc:"Regolare",reason:""};
      TFL_STATUS[code]=s;
      var cls,badgeBg;
      if(s.sev===10){cls="ok";badgeBg="var(--oks)";ok++}
      else if(s.sev>=5){cls="warn";badgeBg="var(--wrns)";warn++}
      else{cls="bad";badgeBg="var(--errs)";bad++}
      var color=LINE_COLORS[code]||"#888";
      var hasDetail=s.reason&&cls!=="ok";
      h+='<div class="tr-row'+(hasDetail?' tr-expandable':'')+'" onclick="'+(hasDetail?'this.classList.toggle(\'open\')':'')+'">';
      h+='<div class="tr-row-main"><div class="tr-line-ico" style="background:'+color+';color:#fff;font-weight:700;font-size:11px;display:flex;align-items:center;justify-content:center">'+code.replace("RER ","")+'</div>';
      h+='<div class="tr-line-name">'+(code.indexOf("RER")===0?code:"Metro "+code.slice(1))+'</div>';
      h+='<div class="tr-badge tr-'+cls+'" style="background:'+badgeBg+'">'+(cls==="ok"?"Regolare":s.desc)+'</div></div>';
      if(hasDetail)h+='<div class="tr-detail">'+s.reason.replace(/'/g,"&#39;")+'</div>';
      h+='</div>';
      if(hasDetail)closures+='<div class="tr-closure"><div class="tr-closure-line" style="border-left:3px solid '+color+';padding-left:10px"><div class="tr-closure-name">'+code+'</div><div class="tr-closure-reason">'+s.reason.replace(/'/g,"&#39;")+'</div></div></div>';
    });
    list.innerHTML=h;
    if(stats)stats.innerHTML='<div class="tr-stat"><div class="tr-stat-n" style="color:var(--ok)">'+ok+'</div><div class="tr-stat-l">attive</div></div><div class="tr-stat"><div class="tr-stat-n" style="color:var(--wrn)">'+warn+'</div><div class="tr-stat-l">perturbate</div></div><div class="tr-stat"><div class="tr-stat-n" style="color:var(--err)">'+bad+'</div><div class="tr-stat-l">interrotte</div></div>';
    if(clEl)clEl.innerHTML=closures?'<div class="tr-closures-card"><div class="tr-closures-hdr">AVVISI</div>'+closures+'</div>':'';
    renderDay(cD);
    if(foot)foot.textContent="PRIM IDFM \u2022 "+new Date().toLocaleString("it-IT");
  })
  .catch(function(e){
    list.innerHTML='<div style="padding:20px;text-align:center;color:var(--err);line-height:1.6">\u274c '+e.message+'<br><a href="'+CONFIG.trafficLink+'" target="_blank">Apri info traffico RATP</a></div>';
  });
}

function renderTr(){
  var h='<div class="tr-wrap">';
  h+='<div class="tr-hero" id="tr-hero">';
  h+='<div class="wt-refresh" onclick="fetchTfl()"><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13.5 2.5v4h-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 8a6 6 0 0111.5-2.5L13.5 6.5M2.5 13.5v-4h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 8a6 6 0 01-11.5 2.5L2.5 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
  h+='<div class="tr-hero-title">Metro Parigi</div>';
  h+='<div class="tr-hero-stats" id="tr-stats"><div class="tr-stat"><div class="tr-stat-n" style="color:var(--ok)">--</div><div class="tr-stat-l">attive</div></div><div class="tr-stat"><div class="tr-stat-n" style="color:var(--wrn)">--</div><div class="tr-stat-l">rallentate</div></div><div class="tr-stat"><div class="tr-stat-n" style="color:var(--err)">--</div><div class="tr-stat-l">sospese</div></div></div>';
  h+='</div>';
  h+='<div class="tr-closures" id="tr-closures"></div>';
  h+='<div class="tr-list" id="tr-list"><div style="padding:20px;text-align:center;color:var(--tx3)">Caricamento...</div></div>';
  h+='<div class="tr-footer" id="tr-footer"></div>';
  h+='</div>';
  document.getElementById("trw").innerHTML=h;
}

function renderMt(){
  var h='<div class="wt-wrap">';
  
  // Hero card - show selected day or today
  var heroIdx=typeof wtSelected==="number"?wtSelected:0;
  var wd=wtDays&&wtDays.length?wtDays[heroIdx]:null;
  
  h+='<div class="wt-hero" id="wt-hero">';
  h+='<div class="wt-refresh" onclick="fetchW()"><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13.5 2.5v4h-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 8a6 6 0 0111.5-2.5L13.5 6.5M2.5 13.5v-4h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 8a6 6 0 01-11.5 2.5L2.5 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
  if(wd){
    var wIco=wd.rain>30?"\u{1F327}\ufe0f":"\u2600\ufe0f";
    h+='<div class="wt-hero-city">Parigi</div>';
    h+='<div class="wt-hero-ico">'+wIco+'</div>';
    h+='<div class="wt-hero-temp"><span class="wt-hero-max">'+wd.max+'\u00b0</span><span class="wt-hero-min"> / '+wd.min+'\u00b0</span></div>';
    h+='<div class="wt-hero-date">'+wd.label+'</div>';
    h+='<div class="wt-hero-details">';
    h+='<div class="wt-hd"><div>\u{1F4A7}</div><div>'+wd.rain+'%</div></div>';
    h+='<div class="wt-hd"><div>\u{1F4A8}</div><div>'+wd.wind+' km/h</div></div>';
    h+='<div class="wt-hd"><div>\u{1F305}</div><div>'+wd.sunrise+'</div></div>';
    h+='<div class="wt-hd"><div>\u{1F307}</div><div>'+wd.sunset+'</div></div>';
    h+='</div>';
    if(wd.dress)h+='<div class="wt-hero-dress">\u{1F9E5} '+wd.dress+'</div>';
  }else{
    h+='<div class="wt-hero-city">Parigi</div>';
    h+='<div class="wt-hero-ico">--</div>';
    h+='<div class="wt-hero-temp"><span class="wt-hero-max">--\u00b0</span></div>';
    h+='<div class="wt-hero-date">Premi aggiorna</div>';
  }
  h+='</div>';
  
  // Day list
  h+='<div class="wt-list">';
  h+='<div class="wt-list-hdr"><span></span><span></span><span></span><span>Min</span><span>Max</span><span>\u{1F4A7}</span><span>\u{1F4A8}</span></div>';
  
  if(wtDays&&wtDays.length){
    wtDays.forEach(function(wd,i){
      var isTrip=wd.isTrip;
      var isOpen=wtOpen===i;
      var rainHigh=wd.rain>30;
      var windSvg=windIcon(wd.wind);
      
      h+='<div class="wt-row'+(isTrip?' wt-trip':'')+(isOpen?' wt-open':'')+'" onclick="wtToggle('+i+')">';
      h+='<div class="wt-row-main">';
      h+='<span class="wt-row-arr">'+(isOpen?'\u25BE':'\u25B8')+'</span>';
      h+='<span class="wt-row-day">'+wd.short+'</span>';
      h+='<span class="wt-row-ico">'+(rainHigh?"\u{1F327}\ufe0f":"\u2600\ufe0f")+'</span>';
      h+='<span class="wt-row-min">'+wd.min+'\u00b0</span>';
      h+='<span class="wt-row-max">'+wd.max+'\u00b0</span>';
      h+='<span class="wt-row-rain'+(rainHigh?' hi':'')+'">'+wd.rain+'%</span>';
      h+='<span class="wt-row-wind">'+windSvg+'</span>';
      h+='</div>';
      
      if(isOpen){
        h+='<div class="wt-row-detail">';
        h+='<span>\u{1F305} '+wd.sunrise+'</span>';
        h+='<span>\u{1F307} '+wd.sunset+'</span>';
        if(wd.dress)h+='<span class="wt-row-dress">\u{1F9E5} '+wd.dress+'</span>';
        h+='</div>';
      }
      h+='</div>';
    });
  }else{
    h+='<div style="padding:20px;text-align:center;color:var(--tx3)">Premi aggiorna per caricare le previsioni</div>';
  }
  h+='</div>';
  
  h+='<div class="wt-footer" id="wt-footer"></div>';
  h+='</div>';
  document.getElementById("mtw").innerHTML=h;
}
function fetchW(){
  var el=document.getElementById("wt-footer");
  if(el)el.textContent="\u23f3 Aggiornamento...";
  fetch(CONFIG.weatherUrl+"?latitude="+CONFIG.weatherLat+"&longitude="+CONFIG.weatherLng+"&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max,sunrise,sunset&timezone="+CONFIG.weatherTz+"&forecast_days=14")
  .then(function(r){return r.json()})
  .then(function(d){
    if(!d.daily)return;
    WEATHER_CACHE=d.daily;
    wtDays=[];
    var tripDates={};
    var tripStart=new Date(CONFIG.startDate);
    for(var dd=0;dd<6;dd++){
      var dt=new Date(tripStart);dt.setDate(dt.getDate()+dd);
      tripDates[dt.toISOString().split("T")[0]]=dd;
    }
    var dayNames=["Dom","Lun","Mar","Mer","Gio","Ven","Sab"];
    var monthNames=["gen","feb","mar","apr","mag","giu","lug","ago","set","ott","nov","dic"];
    
    d.daily.time.forEach(function(t,i){
      var dt=new Date(t+"T00:00:00");
      var dayN=dayNames[dt.getDay()];
      var dayNum=dt.getDate();
      var mon=monthNames[dt.getMonth()];
      var mn=Math.round(d.daily.temperature_2m_min[i]);
      var mx=Math.round(d.daily.temperature_2m_max[i]);
      var pp=d.daily.precipitation_probability_max[i]||0;
      var ws=d.daily.windspeed_10m_max?Math.round(d.daily.windspeed_10m_max[i]):0;
      var sr=d.daily.sunrise&&d.daily.sunrise[i]?d.daily.sunrise[i].split("T")[1].substring(0,5):"--";
      var ss=d.daily.sunset&&d.daily.sunset[i]?d.daily.sunset[i].split("T")[1].substring(0,5):"--";
      var isTrip=tripDates[t]!==undefined;
      var tripIdx=tripDates[t];
      
      var dress="";
      if(isTrip&&tripIdx!==undefined&&LIVE_DAYS[tripIdx])dress=LIVE_DAYS[tripIdx].dr||"";
      else if(pp>30)dress="Impermeabile consigliato";
      else if(mx<8)dress="Vestiti pesanti";
      else if(mx<15)dress="Giubbotto, strati";
      
      wtDays.push({date:t,short:dayN+" "+dayNum,label:dayN+" "+dayNum+" "+mon,min:mn,max:mx,rain:pp,wind:ws,sunrise:sr,sunset:ss,isTrip:isTrip,tripIdx:tripIdx,dress:dress});
      
      // Sync to LIVE_DAYS
      if(isTrip&&tripIdx!==undefined&&LIVE_DAYS[tripIdx]){
        LIVE_DAYS[tripIdx].wt=mn+"\u00b0/"+mx+"\u00b0C";
        LIVE_DAYS[tripIdx].rn=pp>30?1:0;
        LIVE_DAYS[tripIdx].wind=ws;
        LIVE_DAYS[tripIdx].sunrise=d.daily.sunrise?d.daily.sunrise[i]:null;
        LIVE_DAYS[tripIdx].sunset=d.daily.sunset?d.daily.sunset[i]:null;
      }
    });
    
    wtSelected=0;
    renderMt();
    renderDay(cD);
    var ft=document.getElementById("wt-footer");
    if(ft)ft.textContent="Open-Meteo \u2022 "+new Date().toLocaleString("it-IT");
  })
  .catch(function(e){
    var ft=document.getElementById("wt-footer");
    if(ft)ft.textContent="\u274c "+e.message;
  });
}

function refreshInfo(){renderIf()}
function renderIf(){
  var h='<div class="if-wrap">';
  
  // Numeri utili
  h+='<div class="if-card"><div class="if-card-hdr">NUMERI UTILI</div>';
  var nums=[
    {ico:"\u{1F198}",bg:"var(--errs)",n:"112",d:"Emergenze (numero unico europeo)"},
    {ico:"\u{1F691}",bg:"var(--errs)",n:"15",d:"SAMU, emergenza medica"},
    {ico:"\u{1F46E}",bg:"var(--accs)",n:"17",d:"Polizia"},
    {ico:"\u{1F692}",bg:"var(--wrns)",n:"18",d:"Vigili del fuoco"},
    {ico:"\u{1F1EE}\u{1F1F9}",bg:"var(--oks)",n:"+33 1 49 54 03 00",d:"Ambasciata d'Italia (verificare)"},
    {ico:"\u{1F3E8}",bg:"var(--wrns)",n:"1 Rue Mansart, 75009",d:"Hotel Royal Mansart (aggiungere telefono)"}
  ];
  nums.forEach(function(n,i){
    h+='<div class="if-row'+(i<nums.length-1?' if-brd':'')+'">';
    h+='<div class="if-ico" style="background:'+n.bg+'">'+n.ico+'</div>';
    h+='<div class="if-info"><div class="if-info-n">'+n.n+'</div><div class="if-info-d">'+n.d+'</div></div>';
    h+='</div>';
  });
  h+='</div>';
  
  // Consigli
  h+='<div class="if-card"><div class="if-card-hdr">CONSIGLI</div>';
  var tips=[
    {ico:"\u{1F6A6}",n:"Si guida a destra",d:"Attenzione ai monopattini e agli scooter sulle strisce"},
    {ico:"\u{1F4B0}",n:"Mancia non obbligatoria",d:"Il servizio \u00e8 incluso, si arrotonda se si vuole"},
    {ico:"\u{1F50C}",n:"Prese europee",d:"Stesse prese dell'Italia, adattatore non necessario"},
    {ico:"\u{1F4A7}",n:"Carafe d'eau",d:"Si chiede acqua del rubinetto gratis al ristorante"},
    {ico:"\u{1F37D}",n:"Orari cena",d:"Cucine spesso chiuse tra le 14:30 e le 19:00"},
    {ico:"\u{1F4B3}",n:"Contactless diffuso",d:"Meglio avere qualche contante per i piccoli banchi"},
    {ico:"\u{1F45C}",n:"Borseggiatori",d:"Attenzione su metro, Louvre, Montmartre e Sacr\u00e9-C\u0153ur"},
    {ico:"\u{1F687}",n:"Metro",d:"Ticket singolo valido anche sul bus. Citymapper per i percorsi"}
  ];
  tips.forEach(function(t,i){
    h+='<div class="if-tip'+(i<tips.length-1?' if-brd':'')+'">';
    h+='<span class="if-tip-ico">'+t.ico+'</span>';
    h+='<div><div class="if-tip-n">'+t.n+'</div><div class="if-tip-d">'+t.d+'</div></div>';
    h+='</div>';
  });
  h+='</div>';
  
  // Legenda
  h+='<div class="if-card"><div class="if-card-hdr">LEGENDA TIMELINE</div>';
  h+='<div class="if-leg">';
  var legs=[["var(--pub)","Bar"],["var(--food)","Cibo"],["var(--attr)","Attrazione"],["var(--mkt)","Mercato"],["var(--trn)","Trasporto"],["var(--fot)","Foto"]];
  legs.forEach(function(l){h+='<div class="if-leg-i"><div class="if-leg-d" style="background:'+l[0]+'"></div>'+l[1]+'</div>'});
  h+='</div></div>';
  
  h+='<div class="if-footer">Paris App v'+CONFIG.version+' \u{1F950}</div>';
  h+='</div>';
  document.getElementById("ifw").innerHTML=h;
}

/* --- Dove mangiare (tab p7) --- */
var FOOD_CATS=[["all","Tutti"],["Street food e veloce","Street food"],["Boulangerie e dolci","Dolci"],["Bistrot e brasserie","Bistrot"],["Vicino all'hotel","Vicino hotel"]];
var FOOD_QUICK=[["\u{1F950}","Colazione","colazione"],["\u{1F370}","Dolci","pasticceria dolci"],["\u{1F96A}","Street food","street food"],["\u{1F355}","Pizza","pizza"],["\u{1F35D}","Italiano","ristorante italiano"],["\u{1F956}","Baguette","boulangerie baguette"],["\u{1F377}","Cucina francese","cucina francese bistrot"],["\u{1F95E}","Crêpes","crêpes"],["\u{1F366}","Gelato","gelato"],["\u{1F377}","Vino e aperitivo","bar a vin aperitivo"],["\u{2615}","Caffè","caffè"],["\u{1F37D}","Ristoranti","ristoranti"]];
var FOOD_KW={
  "L'As du Fallafel":"falafel pranzo vegetariano",
  "Marché des Enfants Rouges":"pranzo mercato street food",
  "Breizh Café":"crepes galette pranzo",
  "Rue Cler":"pranzo panini formaggi",
  "Stohrer":"colazione dolci pasticceria",
  "Du Pain et des Idées":"colazione pane dolci",
  "Berthillon":"gelato dessert dolci",
  "Bouillon Chartier":"cena pranzo francese tradizionale",
  "Bouillon Pigalle":"cena pranzo francese tradizionale",
  "Rue des Martyrs":"colazione brunch"
};
var foodMode="me",foodCat="all",foodQ="",foodOpen=false,foodPos=null,foodStatus="idle";

function normTxt(s){return (s||"").toString().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"")}
function fEnc(s){return encodeURIComponent(s)}
function foodHay(f){return normTxt([f.n,f.z,f.d,f.c,f.a,FOOD_KW[f.n]||""].join(" "))}

function foodFiltered(){
  var toks=normTxt(foodQ).split(/\s+/).filter(Boolean);
  return FOOD.filter(function(f){
    if(foodCat!=="all"&&f.c!==foodCat)return false;
    var hay=foodHay(f);
    return toks.every(function(t){return hay.indexOf(t)>=0||(t.length>3&&hay.indexOf(t.slice(0,-1))>=0)});
  });
}

function foodCenter(){
  if(foodMode==="hotel")return {lat:CONFIG.hotelLat,lng:CONFIG.hotelLng};
  return foodPos||window.USER_POS||null;
}

function foodLocate(){
  if(!navigator.geolocation){foodStatus="error";updateFoodUi();return}
  foodStatus="loading";updateFoodUi();
  navigator.geolocation.getCurrentPosition(function(p){
    foodPos={lat:p.coords.latitude,lng:p.coords.longitude};
    window.USER_POS=foodPos;
    foodStatus="ok";updateFoodUi();
  },function(e){
    foodStatus=e&&e.code===1?"denied":"error";updateFoodUi();
  },{enableHighAccuracy:true,timeout:10000,maximumAge:60000});
}

function foodOnOpen(){
  if(foodMode==="me"&&foodStatus==="idle")foodLocate();
}

function foodNoteHtml(){
  var upd=' <a href="#" id="fd-upd">Aggiorna posizione</a>';
  if(foodMode==="hotel")return "Cerco intorno a Hotel Royal Mansart.";
  if(foodStatus==="loading")return "Rilevo la tua posizione...";
  if(foodStatus==="ok")return "Posizione rilevata, cerco intorno a te."+upd;
  if(foodStatus==="denied")return "Permesso di posizione negato. Abilitalo nelle impostazioni del browser per questo sito, poi tocca Aggiorna posizione. Intanto Maps userà la posizione del telefono."+upd;
  if(foodStatus==="error")return "Posizione non disponibile. Maps userà comunque la posizione del telefono."+upd;
  return "Per cercare intorno a te serve la posizione."+upd;
}

function updateFoodLinks(){
  var m=document.getElementById("fd-maps"),g=document.getElementById("fd-goog");
  if(!m||!g)return;
  var q=(foodQ.trim()||"ristoranti")+(foodOpen?" aperto ora":""),c=foodCenter();
  var qa=document.querySelectorAll(".fd-qa");
  for(var i=0;i<qa.length;i++)qa[i].href="https://www.google.com/maps/search/"+fEnc(qa[i].getAttribute("data-q")+(foodOpen?" aperto ora":""))+(c?"/@"+c.lat.toFixed(5)+","+c.lng.toFixed(5)+",16z":"");
  m.href="https://www.google.com/maps/search/"+fEnc(q)+(c?"/@"+c.lat.toFixed(5)+","+c.lng.toFixed(5)+",16z":"");
  g.href="https://www.google.com/search?q="+fEnc((foodQ.trim()||"dove mangiare")+(foodOpen?" aperto ora":"")+" "+(foodMode==="hotel"?"vicino "+CONFIG.hotelAddr+" Parigi":"vicino a me"));
}

function renderFoodList(){
  var list=document.getElementById("fd-list"),cnt=document.getElementById("fd-count"),cats=document.getElementById("fd-cats");
  if(!list)return;
  cats.innerHTML=FOOD_CATS.map(function(c){return '<span class="fd-chip'+(foodCat===c[0]?' on':'')+'" data-c="'+c[0].replace(/"/g,"&quot;")+'">'+c[1]+'</span>'}).join("");
  var res=foodFiltered();
  cnt.textContent=res.length?(res.length===FOOD.length?"Selezione":res.length+(res.length===1?" risultato":" risultati")+" nella selezione"):"";
  if(!res.length){
    list.innerHTML='<div class="fd-item fd-empty">Nessun locale nella selezione'+(foodQ.trim()?' per «'+foodQ.trim().replace(/</g,"&lt;")+'»':'')+'.<br>Usa Su Maps o Su Google qui sopra per cercarlo intorno a te.</div>';
    return;
  }
  list.innerHTML=res.map(function(f){
    var place=f.n+" "+f.a;
    return '<div class="fd-item"><div class="fd-top"><div><div class="fd-nm">'+f.n+'</div><div class="fd-ds">'+f.d+'</div></div><span class="fd-tag">'+f.z+'</span></div>'
      +'<div class="fd-acts">'
      +'<a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query='+fEnc(place)+'">\u{1F4CD} Maps</a>'
      +'<a target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination='+fEnc(place)+'">\u{1F9ED} Indicazioni</a>'
      +'<a target="_blank" rel="noopener" href="https://www.google.com/search?q='+fEnc(place+" orari di apertura")+'">\u{1F552} Orari</a>'
      +'</div></div>';
  }).join("");
}

function updateFoodUi(){
  var n=document.getElementById("fd-note");
  if(n)n.innerHTML=foodNoteHtml();
  updateFoodLinks();
}

function renderFood(){
  var w=document.getElementById("foodw");
  if(!w)return;
  var h='<div class="fd-wrap"><div class="fd-box">';
  h+='<div class="fd-row"><input class="fd-in" id="fd-q" type="search" placeholder="Cerca altro: sushi, kebab, brunch..." autocomplete="off">';
  h+='<a id="fd-maps" class="fd-ic" title="Cerca su Google Maps" aria-label="Cerca su Google Maps" target="_blank" rel="noopener">\u{1F4CD}</a>';
  h+='<a id="fd-goog" class="fd-ic" title="Cerca su Google" aria-label="Cerca su Google" target="_blank" rel="noopener">\u{1F50D}</a></div>';
  h+='<div class="fd-chips" id="fd-quick"><span class="fd-chip" id="fd-open">\u{1F7E2} Aperto ora</span>'+FOOD_QUICK.map(function(x){return '<a class="fd-chip fd-qa" target="_blank" rel="noopener" data-q="'+x[2]+'">'+x[0]+" "+x[1]+'</a>'}).join("")+'</div></div>';
  h+='<div class="fd-box"><div class="fd-seg" style="margin-top:0"><button id="fd-s1" class="on">\u{1F4CD} Vicino a me</button><button id="fd-s2">\u{1F3E8} Vicino all\'hotel</button></div>';
  h+='<div class="fd-note" id="fd-note"></div></div></div>';
  w.innerHTML=h;
  var q=document.getElementById("fd-q");
  q.oninput=function(){foodQ=q.value;updateFoodLinks()};
  document.getElementById("fd-open").onclick=function(e){
    e.stopPropagation();foodOpen=!foodOpen;this.classList.toggle("on",foodOpen);updateFoodLinks();
  };
  function setMode(m){
    foodMode=m;
    document.getElementById("fd-s1").classList.toggle("on",m==="me");
    document.getElementById("fd-s2").classList.toggle("on",m==="hotel");
    if(m==="me"&&foodStatus!=="ok"&&foodStatus!=="loading")foodLocate();
    else updateFoodUi();
  }
  document.getElementById("fd-s1").onclick=function(){setMode("me")};
  document.getElementById("fd-s2").onclick=function(){setMode("hotel")};
  document.getElementById("fd-note").onclick=function(e){
    if(e.target&&e.target.id==="fd-upd"){e.preventDefault();foodLocate()}
  };
  updateFoodUi();
}

/* --- Home: La mia giornata (tab p2) --- */
var HOME_BOOK=[[0,"Navetta Beauvais - Porte Maillot (biglietto online)"],[0,"Avvisare l'hotel dell'arrivo tardivo"],[1,"Notre-Dame (prenotazione gratuita, opzionale)"],[1,"Louvre (biglietto con fascia oraria)"],[2,"Torre Eiffel (se sali, orario online)"],[2,"Battello sulla Senna"],[2,"Tour Parc des Princes (opzionale)"],[3,"Navetta Porte Maillot - Beauvais (biglietto online)"]];
var homeDay=0;
function homeVis(show){var h=document.getElementById("home");if(h)h.style.display=show?"":"none"}
function homeToday(){
  var n=new Date(),p=function(x){return (x<10?"0":"")+x};
  var t=n.getFullYear()+"-"+p(n.getMonth()+1)+"-"+p(n.getDate());
  var ds=["2026-11-20","2026-11-21","2026-11-22","2026-11-23"];
  return ds.indexOf(t);
}
function homeBk(di,i){return "pr-bk-"+di+"-"+i}
function homeTick(di,i){
  var k=homeBk(di,i);
  try{localStorage.setItem(k,localStorage.getItem(k)==="1"?"0":"1")}catch(e){}
  renderHome();
}
function homeSel(i){homeDay=i;renderHome()}
function renderHome(){
  var w=document.getElementById("home");
  if(!w||!LIVE_DAYS||!LIVE_DAYS.length)return;
  var di=Math.min(homeDay,LIVE_DAYS.length-1),d=LIVE_DAYS[di],all=allItems(d),today=homeToday();
  var h='<div class="hm-pills">'+LIVE_DAYS.map(function(x,i){return '<div class="hm-pl'+(i===di?" on":"")+(i===today?" td":"")+'" onclick="homeSel('+i+')">'+x.pl+'</div>'}).join("")+'</div>';
  h+='<div class="hm-card"><div class="hm-t">'+d.t+'</div><div class="hm-chips"><span>\u{1F321} '+d.wt+'</span><span>\u{1F6B6} ~'+d.km+' km</span><span>'+all.length+' tappe</span></div>'+(d.dr?'<div class="hm-dr">'+d.dr+'</div>':'')+(d.wn?'<div class="hm-wn">'+d.wn+'</div>':'')+'</div>';
  function rows(list){return list.map(function(s){return '<div class="hm-row" onclick="goTo('+di+',\''+s.t+'\')"><span class="hm-ic">'+(TI[s.tp]||"")+'</span><span class="hm-n">'+s.n+'</span><span class="hm-h">'+s.t+'</span></div>'}).join("")}
  var must=all.filter(function(s){return s.tp==="Attrazione"&&!/opzionale, saltare|solo se avanza/i.test(s.ds)});
  must=must.concat(all.filter(function(s){return s.tp==="Foto"})).slice(0,4);
  if(must.length)h+='<div class="hm-sec"><div class="hm-sh">DA NON PERDERE</div>'+rows(must)+'</div>';
  else{var tr=all.filter(function(s){return s.tp==="Trasporto"||s.tp==="Hotel"}).slice(0,5);if(tr.length)h+='<div class="hm-sec"><div class="hm-sh">SPOSTAMENTI CHIAVE</div>'+rows(tr)+'</div>'}
  var eat=all.filter(function(s){return s.tp==="Cibo"||s.tp==="Mercato"}).slice(0,3);
  if(eat.length)h+='<div class="hm-sec"><div class="hm-sh">MANGIARE</div>'+rows(eat)+'</div>';
  var bk=HOME_BOOK.map(function(b,i){return {d:b[0],t:b[1],i:i}}).filter(function(b){return b.d===di});
  if(bk.length)h+='<div class="hm-sec"><div class="hm-sh">DA PRENOTARE</div>'+bk.map(function(b){var on=false;try{on=localStorage.getItem(homeBk(di,b.i))==="1"}catch(e){}return '<div class="hm-row" onclick="homeTick('+di+','+b.i+')"><span class="hm-ic">'+(on?"☑":"☐")+'</span><span class="hm-n'+(on?" dn":"")+'">'+b.t+'</span></div>'}).join("")+'</div>';
  h+='<button class="hm-go" onclick="goTo('+di+',\''+(all[0]?all[0].t:"")+'\')">Apri nel Piano ›</button>';
  w.innerHTML=h;
}

init();
