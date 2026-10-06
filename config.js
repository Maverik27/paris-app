/*==============================================
  PARIS APP - CONFIGURATION
  Edit these values without touching the code
==============================================*/

var CONFIG = {
  // App
  version: "1.0.0",
  appName: "Paris App",
  footer: "Paris App - Nov 2026 \ud83e\udd50",

  // Security (change before publishing)
  pin: "202611",

  // Travel dates
  startDate: "2026-11-20",
  endDate: "2026-11-23",

  // Hotel (Hotel Royal Mansart) - coordinates approximate, verify on Maps
  hotelLat: 48.8825,
  hotelLng: 2.3330,
  hotelAddr: "1 Rue Mansart, 75009 Paris",

  // Weather
  weatherLat: 48.8566,
  weatherLng: 2.3522,
  weatherTz: "Europe/Paris",

  // APIs
  nominatimUrl: "https://nominatim.openstreetmap.org/search",
  weatherUrl: "https://api.open-meteo.com/v1/forecast",
  translateUrl: "https://api.mymemory.translated.net/get",

  // Line status (PRIM - Ile-de-France Mobilites)
  // 1) register on https://prim.iledefrance-mobilites.fr and create an API key
  // 2) paste it in primKey below. If empty, the Transport tab shows a link to RATP traffic info.
  primKey: "",
  primUrl: "https://prim.iledefrance-mobilites.fr/marketplace/v2/navitia/line_reports/line_reports",
  trafficLink: "https://www.ratp.fr/infos-trafic",

  // Lines to monitor
  tflLines: ["M1","M2","M3","M4","M5","M6","M7","M8","M9","M10","M11","M12","M13","M14","RER A","RER B"],

  // Icon paths (relative)
  iconFavicon: "favicon.png",
  iconApple: "apple-touch-icon.png",
  iconPint: "drink-icon.png",

  // Stop types available for editing
  stopTypes: ["Bar/Cantina","Cibo","Attrazione","Mercato","Trasporto","Hotel","Foto","Shopping"]
};
