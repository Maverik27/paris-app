// === CONFIG ===
const DEBUG = false; // true = usa Notre-Dame, false = usa GPS reale

// === GEO ===
window.USER_POS = null;

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        function(p) {
            window.USER_POS = {
                lat: p.coords.latitude,
                lng: p.coords.longitude
            };
        },
        function() {
            window.USER_POS = null;
        }
    );
}

// === LINK OVERRIDE ===
document.addEventListener("click", function(e) {
    const link = e.target.closest('a[href*="citymapper.com/directions"]');
    if (!link) return;
    e.preventDefault();
    const url = new URL(link.href);

    if (DEBUG) {
        // TEST MODE: Notre-Dame
        url.searchParams.set("startcoord", "48.8530,2.3499");
        url.searchParams.set("startname", "Notre-Dame");
    } else {
        if (!window.USER_POS) return;
        url.searchParams.set("startcoord", window.USER_POS.lat + "," + window.USER_POS.lng);
    }
    window.open(url.toString(), "_blank");
});
