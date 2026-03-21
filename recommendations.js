// Global variable to hold all fetched crop data for quick access
let allCropsData = {};

document.addEventListener('DOMContentLoaded', async () => {
    const locationData = JSON.parse(sessionStorage.getItem('selectedLocation'));
    if (!locationData) {
        window.location.href = 'dashboard.html';
        return;
    }

    // Get sidebar elements
    const locationNameEl = document.getElementById('location-name');
    const weatherInfoEl = document.getElementById('weather-info');
    const soilInfoEl = document.getElementById('soil-info');
    const cropListEl = document.getElementById('crop-list');
    
    locationNameEl.textContent = locationData.name;

    try {
        // --- 1. FETCH WEATHER & CROP NAMES ---
        const weatherResponse = await fetch(`/get-weather?lat=${locationData.lat}&lon=${locationData.lon}`);
        const weatherData = await weatherResponse.json();
        const currentTemp = weatherData.current_weather.temperature;
        
        weatherInfoEl.innerHTML = `
            <div class="weather-stat"><span>Temp</span><strong>${currentTemp}°C</strong></div>
            <div class="weather-stat"><span>Rain</span><strong>${weatherData.daily.precipitation_sum[0]} mm</strong></div>`;

        const recommendResponse = await fetch(`/recommend-crops?state=${locationData.name}&avgTemp=${currentTemp}`);
        const recommendData = await recommendResponse.json();
        soilInfoEl.innerHTML = `<p>Detected Soil: <strong>${recommendData.soilType}</strong></p>`;

        // --- 2. FETCH DETAILS FOR ALL RECOMMENDED CROPS ---
        if (!recommendData.recommendations || recommendData.recommendations.length === 0) {
            throw new Error("No recommendations found.");
        }

        const detailPromises = recommendData.recommendations.map(cropName =>
            fetch(`/get-crop-details?name=${encodeURIComponent(cropName)}`).then(res => res.json())
        );
        const cropDetailsArray = await Promise.all(detailPromises);

        cropDetailsArray.forEach(crop => {
            allCropsData[crop.name] = crop; // Store data in our global object
        });

        // --- 3. POPULATE THE UI ---
        populateCropListSidebar(cropDetailsArray); // Build the right sidebar
        
        if (cropDetailsArray.length > 0) {
            updateMainContent(cropDetailsArray[0].name); // Show the first crop's details by default
            document.querySelector('.reco-crop-card').classList.add('active'); // Highlight the first crop in the list
        }

    } catch (error) {
        console.error("Error on page load:", error);
        document.getElementById('crop-details-placeholder').innerHTML = `<h2>Error</h2><p>Could not load crop recommendations for this location. Please try another area.</p>`;
    }
});

function populateCropListSidebar(crops) {
    const cropListEl = document.getElementById('crop-list');
    cropListEl.innerHTML = ''; // Clear spinner

    crops.forEach(crop => {
        const card = document.createElement('div');
        card.className = 'reco-crop-card';
        card.onclick = () => handleCropSelection(crop.name, card);

        card.innerHTML = `
            <img src="${crop.image}" alt="${crop.name}" class="reco-card-img">
            <span class="reco-card-name">${crop.name}</span>
        `;
        cropListEl.appendChild(card);
    });
}

function handleCropSelection(cropName, clickedCard) {
    // Update the main content with the new crop's details
    updateMainContent(cropName);

    // Update the active state in the sidebar
    document.querySelectorAll('.reco-crop-card.active').forEach(c => c.classList.remove('active'));
    clickedCard.classList.add('active');
}

function updateMainContent(cropName) {
    const cropData = allCropsData[cropName];
    if (!cropData) return;

    // --- GET MAIN CONTENT ELEMENTS ---
    const placeholderEl = document.getElementById('crop-details-placeholder');
    const contentEl = document.getElementById('crop-details-content');
    const detailImageEl = document.getElementById('detail-image');
    const detailNameEl = document.getElementById('detail-name');
    const detailHarvestEl = document.getElementById('detail-harvest');
    const detailPriceEl = document.getElementById('detail-price');
    const detailStepsEl = document.getElementById('detail-steps');

    // --- POPULATE ELEMENTS WITH DATA ---
    detailImageEl.src = cropData.image;
    detailNameEl.textContent = cropData.name;
    detailHarvestEl.textContent = cropData.harvestTime || "N/A";

    // Simulate real-time Mandi price
    const basePrice = (cropData.name.length * 300) % 1000 + 1800;
    const randomFluctuation = (Math.random() - 0.5) * 150;
    detailPriceEl.textContent = `₹ ${(basePrice + randomFluctuation).toFixed(2)} / Quintal`;

    // Populate steps
    detailStepsEl.innerHTML = '';
    cropData.steps.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        detailStepsEl.appendChild(li);
    });

    // --- SHOW THE CONTENT ---
    placeholderEl.style.display = 'none';
    contentEl.style.display = 'block';
    contentEl.style.animation = 'fadeIn 0.5s ease-in-out';
}