document.addEventListener("DOMContentLoaded", async () => {
    const map = L.map("map").setView([53.5461, -113.4938], 12);
  
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);
  
    // Load JSON
    const res = await fetch("data/locations.json");
    const spots = await res.json();
  
    spots.forEach(({ name, lat, lng, lore, type }) => {
      const icon = customIcons[type] ?? customIcons.default;
      L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(`<h3>${name}</h3><p>${lore}</p>`)
        .on("click", () => addToSidebar({ name, lore }));
    });
  });
  
  // --- simple sidebar updater ---
  function addToSidebar({ name, lore }) {
    const side = document.getElementById("sidebar");
    side.innerHTML = `<h2>${name}</h2><p>${lore}</p>`;
  }
  
  const makeIcon = (fname) =>
    L.icon({
      iconUrl: `assets/icons/${fname}`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -28],
    });
  
  const customIcons = {
    crow:    makeIcon("crow.png"),
    nature:  makeIcon("nature.png"),
    default: makeIcon("default.png"),
  };
  const layers = { crow: L.layerGroup(), nature: L.layerGroup() };
  // in spots.forEach -> add marker to layers[type].addLayer(marker)
  L.control.layers(null, { "Crow Lore": layers.crow, "Green Mysteries": layers.nature }).addTo(map);
  Object.values(layers).forEach(g => g.addTo(map)); // default visible
    