navigator.geolocation.getCurrentPosition(
  position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    const locationDiv = document.getElementById("location");
    locationDiv.innerHTML = `
      <p><strong>Latitude:</strong> ${lat.toFixed(5)}</p>
      <p><strong>Longitude:</strong> ${lon.toFixed(5)}</p>
      <p><strong>Accuracy:</strong> ${accuracy} meters</p>
    `;

    const map = L.map('map').setView([lat, lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup(`<b>You are here!</b><br>Lat: ${lat.toFixed(5)}<br>Lon: ${lon.toFixed(5)}`).openPopup();

    // ✅ OpenCage Reverse Geocoding with comma (correct format)
    const apiKey = 'd7f38d4757074474b1747dd486b6cbfe'; // Paste your real API key between these quotes
    const apiURL = `https://api.opencagedata.com/geocode/v1/json?q=${lat},${lon}&key=${apiKey}`;

    fetch(apiURL)
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          const locationName = data.results[0].formatted;
          locationDiv.innerHTML += `<p><strong>Location:</strong> ${locationName}</p>`;
        } else {
          locationDiv.innerHTML += `<p><strong>Location:</strong> Unknown</p>`;
        }
      })
      .catch(error => {
        console.error('Error fetching location name:', error);
        locationDiv.innerHTML += `<p style="color:red;">⚠️ Unable to fetch location name</p>`;
      });
  },
  error => {
    console.error('Geolocation error:', error);
    document.getElementById("location").innerHTML =
      `<p style="color:red;">⚠️ Location access denied or unavailable.</p>`;
  }
);