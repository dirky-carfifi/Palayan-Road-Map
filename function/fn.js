// Initialize map with image overlay
const map = L.map("map", {
  crs: L.CRS.Simple, // Use simple coordinate system for image maps
  minZoom: -2,
  maxZoom: 4,
}).setView([0, 0], 0);

// Define the image bounds and overlay - REPLACE WITH YOUR IMAGE PATH
const imageUrl = "img/1.jpeg";
const imageBounds = [
  [-100, -100],
  [3000, 4000],
];

// Create custom image overlay
const customImageLayer = L.imageOverlay(imageUrl, imageBounds);

// Add custom image layer
customImageLayer.addTo(map);
map.fitBounds(imageBounds);

// Check if image loaded successfully
const img = new Image();
img.onload = function () {
  console.log("Custom map image loaded successfully");
};
img.onerror = function () {
  console.error("Custom map image failed to load");
  alert("Custom map image failed to load. Please check the image path.");
};
img.src = imageUrl;

// Sample hazard data
const hazards = [
  {
    id: 1,
    name: "Section 1 (Fire Prone)",
    description:
      "Overloaded electrical circuits and crowded conditions create significant fire risk. No visible fire extinguishers in the area.",
    address: "Market Area, Palayan Road, Philippines",
    category: "fire",
    lat: 2,
    lng: 137.9,
    severity: "medium",
    tags: ["fire", "electrical", "crowded"],
    streetView: "img/2.jpg",
    streetName: "Market Area, Palayan Road",
    streetDescription:
      "Crowded market area with visible electrical wiring issues. Limited emergency access routes.",
  },
  {
    id: 2,
    name: "Section 2 (Flood Prone) ",
    description:
      "This area experiences frequent flooding during heavy rains, with water levels reaching up to 1 meter. Avoid during stormy weather.",
    address: "Main Road, Palayan Road, Philippines",
    category: "flood",
    lat: 0,
    lng: 132,
    severity: "high",
    tags: ["flood", "water", "accessibility"],
    streetView: "img/3.jpg",
    streetName: "Main Road, Palayan Road",
    streetDescription:
      "This street is prone to flooding during the rainy season. Drainage systems are inadequate for heavy rainfall.",
  },
  {
    id: 3,
    name: "Section 3 (Unstable Structure)",
    description:
      "Building shows significant structural cracks. Appears abandoned but still accessible to the public.",
    address: "123 Old Street, Palayan Road, Philippines",
    category: "structural",
    lat: 2,
    lng: 150,
    severity: "high",
    tags: ["structural", "collapse", "building"],
    streetView: "img/6.jpeg",
    streetName: "Old Street, Palayan Road",
    streetDescription:
      "Dilapidated building with visible structural damage. Potential collapse risk during seismic activity or heavy storms.",
  },
  {
    id: 4,
    name: "Section 4 (Slippery Road)",
    description:
      "Steep, unpaved road becomes extremely slippery when wet. Multiple accidents reported in this area.",
    address: "Mountain Path, Palayan Road, Phlippines",
    category: "road",
    lat: 6.672,
    lng: 131.047,
    severity: "medium",
    tags: ["road", "slippery", "accident"],
    streetView: "img/4.jpeg",
    streetName: "Mountain Path, Palayan Road",
    streetDescription:
      "Unpaved mountain road with steep inclines. Becomes dangerously slippery during rain. Limited guard rails.",
  },
  {
    id: 5,
    name: "Section 5 (Erosion Risk)",
    description:
      "Significant soil erosion along the riverbank. Risk of collapse during heavy rains.",
    address: "Riverside, Palayan Road, Philipines",
    category: "environmental",
    lat: 0,
    lng: 138.1,
    severity: "medium",
    tags: ["erosion", "river", "environmental"],
    streetView: "img/5.jpeg",
    streetName: "Riverside, Palayan Road",
    streetDescription:
      "Riverbank area showing significant erosion. Nearby structures may be at risk during flooding events.",
  },
];

// Create markers and add to map
const markers = [];
const markersGroup = L.layerGroup().addTo(map);

function getHazardColor(category) {
  switch (category) {
    case "fire":
      return "#f30a06";
    case "flood":
      return "#4c00ff";
    case "structural":
      return "#ff9900";
    case "road":
      return "#555555";
    case "environmental":
      return "#00aa00";
    default:
      return "#333333";
  }
}

function addMarkers(filteredHazards) {
  markersGroup.clearLayers();
  markers.length = 0;
  filteredHazards.forEach((hazard) => {
    const color = getHazardColor(hazard.category);
    const size = hazard.severity === "high" ? 10 : 8;

    // For custom image, use custom coordinates
    const x = (hazard.lng - 121.0) * 100;
    const y = (14.7 - hazard.lat) * 100;

    const marker = L.circleMarker([y, x], {
      radius: size,
      fillColor: color,
      color: "#fff",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
    }).addTo(markersGroup);

    marker.bindTooltip(hazard.name, {
      permanent: false,
      direction: "top",
    });

    marker.on("click", () => {
      showInfoPanel(hazard);
    });

    markers.push({ marker, hazard });
  });
}

// Show info panel with hazard details
const infoPanel = document.getElementById("info-panel");
const placeNameEl = document.getElementById("place-name");
const placeAddressEl = document.getElementById("place-address");
const placeDescriptionEl = document.getElementById("place-description");
const hazardTagsEl = document.getElementById("hazard-tags");
const closeInfoBtn = document.getElementById("close-info");
const viewStreetBtn = document.getElementById("view-street-btn");

let currentHazard = null;

function showInfoPanel(hazard) {
  currentHazard = hazard;
  placeNameEl.textContent = hazard.name;
  placeAddressEl.textContent = hazard.address;
  placeDescriptionEl.textContent = hazard.description;

  // Create hazard tags
  hazardTagsEl.innerHTML = "";
  hazard.tags.forEach((tag) => {
    const span = document.createElement("span");
    span.classList.add("hazard-tag", `hazard-${tag}`);
    span.textContent = tag;
    hazardTagsEl.appendChild(span);
  });

  infoPanel.style.display = "block";

  // Center map on hazard
  const x = (hazard.lng - 121.0) * 100;
  const y = (14.7 - hazard.lat) * 100;
  map.setView([y, x], 1);
}

closeInfoBtn.addEventListener("click", () => {
  infoPanel.style.display = "none";
  currentHazard = null;
});

// Street view modal functionality
const streetModal = document.getElementById("street-modal");
const modalClose = document.getElementById("modal-close");
const streetNameEl = document.getElementById("street-name");
const streetImageEl = document.getElementById("street-image");
const streetDescriptionEl = document.getElementById("street-description");
const modalHazardsEl = document.getElementById("modal-hazards");

viewStreetBtn.addEventListener("click", () => {
  if (!currentHazard) return;

  streetNameEl.textContent = currentHazard.streetName;
  streetImageEl.src = currentHazard.streetView;
  streetDescriptionEl.textContent = currentHazard.streetDescription;

  // Create hazard tags for modal
  modalHazardsEl.innerHTML = "";
  currentHazard.tags.forEach((tag) => {
    const span = document.createElement("span");
    span.classList.add("hazard-tag", `hazard-${tag}`);
    span.textContent = tag;
    modalHazardsEl.appendChild(span);
  });

  streetModal.classList.add("active");
});

modalClose.addEventListener("click", () => {
  streetModal.classList.remove("active");
});

// Close modal when clicking outside
streetModal.addEventListener("click", (e) => {
  if (e.target === streetModal) {
    streetModal.classList.remove("active");
  }
});

// Populate hazards list in sidebar
const placesList = document.querySelector(".places-list");

function populatePlacesList(filteredHazards) {
  placesList.innerHTML = "";
  if (filteredHazards.length === 0) {
    placesList.innerHTML = "<p>No hazards found.</p>";
    return;
  }
  filteredHazards.forEach((hazard) => {
    const placeItem = document.createElement("div");
    placeItem.classList.add("place-item");
    placeItem.dataset.id = hazard.id;

    placeItem.innerHTML = `
                    <div class="place-info">
                        <h3>${hazard.name}</h3>
                        <p>${hazard.description.substring(0, 60)}...</p>
                    </div>
                `;

    placeItem.addEventListener("click", () => {
      showInfoPanel(hazard);
      // Highlight marker
      const markerObj = markers.find((m) => m.hazard.id === hazard.id);
      if (markerObj) {
        const x = (hazard.lng - 121.0) * 100;
        const y = (14.7 - hazard.lat) * 100;
        map.setView([y, x], 1);
        markerObj.marker.openTooltip();
      }
    });

    placesList.appendChild(placeItem);
  });
}

// Category filtering
const categoryElements = document.querySelectorAll(".category");

categoryElements.forEach((catEl) => {
  catEl.addEventListener("click", () => {
    categoryElements.forEach((el) => el.classList.remove("active"));
    catEl.classList.add("active");
    const category = catEl.dataset.category;
    filterHazards(category);
  });
});

function filterHazards(category) {
  let filtered;
  if (category === "all") {
    filtered = hazards;
  } else {
    filtered = hazards.filter((h) => h.category === category);
  }
  addMarkers(filtered);
  populatePlacesList(filtered);
  infoPanel.style.display = "none";
}

// Search functionality
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    // If empty, reset to current category filter
    const activeCategory =
      document.querySelector(".category.active").dataset.category;
    filterHazards(activeCategory);
    return;
  }
  const filtered = hazards.filter(
    (h) =>
      h.name.toLowerCase().includes(query) ||
      h.description.toLowerCase().includes(query) ||
      h.address.toLowerCase().includes(query) ||
      h.tags.some((tag) => tag.toLowerCase().includes(query))
  );
  addMarkers(filtered);
  populatePlacesList(filtered);
  infoPanel.style.display = "none";
});

// Map controls
document.getElementById("zoom-in").addEventListener("click", () => {
  map.zoomIn();
});

document.getElementById("zoom-out").addEventListener("click", () => {
  map.zoomOut();
});

document.getElementById("locate-me").addEventListener("click", () => {
  alert("Location feature would use coordinates relative to your custom map");
});

document.getElementById("report-btn").addEventListener("click", () => {
  alert("Hazard reporting feature would open here");
});

// Sidebar toggle
const sidebar = document.getElementById("sidebar");
const toggleSidebarBtn = document.getElementById("toggle-sidebar");
toggleSidebarBtn.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
  toggleSidebarBtn.classList.toggle("sidebar-hidden");
  // Change icon direction
  const icon = toggleSidebarBtn.querySelector("i");
  if (sidebar.classList.contains("hidden")) {
    icon.classList.remove("fa-chevron-left");
    icon.classList.add("fa-chevron-right");
  } else {
    icon.classList.remove("fa-chevron-right");
    icon.classList.add("fa-chevron-left");
  }
});

// Full screen toggle
const fullscreenToggle = document.getElementById("fullscreen-toggle");
let isFullscreen = false;

fullscreenToggle.addEventListener("click", () => {
  if (isFullscreen) {
    // Exit full screen
    sidebar.classList.remove("hidden");
    toggleSidebarBtn.classList.remove("sidebar-hidden");
    toggleSidebarBtn.style.display = "flex";
    fullscreenToggle.innerHTML = '<i class="fas fa-expand"></i> Full Screen';
  } else {
    // Enter full screen
    sidebar.classList.add("hidden");
    toggleSidebarBtn.classList.add("sidebar-hidden");
    toggleSidebarBtn.style.display = "none";
    fullscreenToggle.innerHTML =
      '<i class="fas fa-compress"></i> Exit Full Screen';
  }
  isFullscreen = !isFullscreen;

  // Trigger map resize to ensure proper rendering
  setTimeout(() => {
    map.invalidateSize();
  }, 300);
});

// Initialize with all hazards
addMarkers(hazards);
populatePlacesList(hazards);
