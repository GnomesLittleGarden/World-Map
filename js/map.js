document.addEventListener("DOMContentLoaded", async () => {
  /* 1.  create the map  */
  const map = L.map("map").setView([53.5461, -113.4938], 12);

  /* 2.  base tiles  */
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
  }).addTo(map);

  /* 3.  icon helpers  */
  const makeIcon = (fname) =>
    L.icon({
      iconUrl: `icons/${fname}`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -28],
    });

  const customIcons = {
    crow:    makeIcon("crow.png"),
    nature:  makeIcon("nature.png"),
    default: makeIcon("default.png"),
  };

  /* 4.  layer groups  */
  const layers = { crow: L.layerGroup(), nature: L.layerGroup() };
  Object.values(layers).forEach((g) => g.addTo(map));

  /* 5.  load locations  */
  const res   = await fetch("data/locations.json");
  const spots = await res.json();

  spots.forEach(({ name, lat, lng, lore, type }) => {
    const icon   = customIcons[type] ?? customIcons.default;
    const marker = L.marker([lat, lng], { icon })
      .addTo(layers[type] ?? map)
      .bindPopup(`<h3>${name}</h3><p>${lore}</p>`)
      .on("click", () => addToSidebar({ name, lore }));
  });

  /* 6.  layer toggle  —‑‑ this **MUST** be inside the same block  */
  L.control.layers(null, {
    "Crow Lore":       layers.crow,
    "Green Mysteries": layers.nature,
  }).addTo(map);

  /* 7.  sidebar helper  */
  function addToSidebar({ name, lore }) {
    document.getElementById("sidebar").innerHTML =
      `<h2>${name}</h2><p>${lore}</p>`;
  }
});           
