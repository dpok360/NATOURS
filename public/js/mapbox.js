export const displayMap = (locations) => {
  // Wait for the DOM content to be fully loaded
  document.addEventListener('DOMContentLoaded', function () {
    // Initialize the map and set its view to a specific location and zoom level
    var map = L.map('map').setView([51.505, -0.09], 13);

    // Add the tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Get the locations data from the dataset
    const locations = JSON.parse(
      document.getElementById('map').dataset.locations,
    );
    console.log(locations); // Log the locations to the console for debugging
    var customIcon = L.divIcon({
      className: 'marker', // Class name for your custom CSS
      html: '', // No need for additional HTML; the marker styling comes from CSS
      iconSize: [32, 40], // Size of the icon [width, height]
      iconAnchor: [16, 40], // Adjust if necessary to align marker correctly
      popupAnchor: [0, -40], // Adjust if necessary to position popup correctly
    });

    // Add markers for each location
    locations.forEach(function (loc) {
      L.marker([loc.coordinates[1], loc.coordinates[0]])
        .addTo(map)
        .bindPopup(`<p>${loc.day}: ${loc.description}</p>`)
        .openPopup();
    });
  });
};
