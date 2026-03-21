// Mock data for crops with detailed information
const CROP_DATABASE = {
    "Rice": {
        name: "Rice",
        image: "https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg?auto=compress&cs=tinysrgb&w=400",
        harvestTime: "120-150 days",
        steps: [
            "Prepare the field by plowing and leveling",
            "Soak seeds for 24 hours before sowing",
            "Transplant seedlings after 25-30 days",
            "Maintain water level at 2-3 inches",
            "Apply fertilizers at regular intervals",
            "Control weeds and pests regularly",
            "Harvest when grains turn golden yellow"
        ],
        soilTypes: ["Clay", "Loamy", "Alluvial"],
        climate: "Tropical, Subtropical"
    },
    "Wheat": {
        name: "Wheat",
        image: "https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg?auto=compress&cs=tinysrgb&w=400",
        harvestTime: "110-130 days",
        steps: [
            "Prepare field with deep plowing",
            "Apply organic manure before sowing",
            "Sow seeds at proper depth (3-4 cm)",
            "Ensure adequate irrigation",
            "Apply nitrogen fertilizer in splits",
            "Monitor for diseases and pests",
            "Harvest when moisture content is 12-14%"
        ],
        soilTypes: ["Loamy", "Clay Loam", "Sandy Loam"],
        climate: "Temperate, Semi-arid"
    },
    "Sugarcane": {
        name: "Sugarcane",
        image: "https://images.pexels.com/photos/8969226/pexels-photo-8969226.jpeg?auto=compress&cs=tinysrgb&w=400",
        harvestTime: "10-12 months",
        steps: [
            "Select healthy seed canes",
            "Prepare furrows 4-5 feet apart",
            "Plant cane sets in furrows",
            "Provide regular irrigation",
            "Apply fertilizers as per soil test",
            "Earthing up after 45-60 days",
            "Harvest when sugar content is maximum"
        ],
        soilTypes: ["Loamy", "Clay Loam", "Red Soil"],
        climate: "Tropical, Subtropical"
    },
    "Cotton": {
        name: "Cotton",
        image: "https://images.pexels.com/photos/6069112/pexels-photo-6069112.jpeg?auto=compress&cs=tinysrgb&w=400",
        harvestTime: "160-200 days",
        steps: [
            "Prepare field with deep plowing",
            "Apply pre-plant fertilizers",
            "Sow seeds at recommended spacing",
            "Provide irrigation at critical stages",
            "Monitor for bollworm and other pests",
            "Apply growth regulators if needed",
            "Hand pick cotton when bolls open"
        ],
        soilTypes: ["Black Cotton", "Alluvial", "Red Soil"],
        climate: "Semi-arid, Subtropical"
    },
    "Maize": {
        name: "Maize",
        image: "https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg?auto=compress&cs=tinysrgb&w=400",
        harvestTime: "90-120 days",
        steps: [
            "Prepare field with proper tillage",
            "Apply basal fertilizers",
            "Sow seeds at 2-3 cm depth",
            "Maintain proper plant population",
            "Provide irrigation at critical stages",
            "Control weeds mechanically or chemically",
            "Harvest when kernels reach physiological maturity"
        ],
        soilTypes: ["Loamy", "Sandy Loam", "Clay Loam"],
        climate: "Temperate, Subtropical"
    },
    "Tomato": {
        name: "Tomato",
        image: "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400",
        harvestTime: "70-90 days",
        steps: [
            "Prepare nursery beds for seedlings",
            "Transplant 4-5 week old seedlings",
            "Provide support with stakes or cages",
            "Water regularly but avoid waterlogging",
            "Apply fertilizers at regular intervals",
            "Prune suckers and lower leaves",
            "Harvest fruits when they turn red"
        ],
        soilTypes: ["Loamy", "Sandy Loam", "Well-drained"],
        climate: "Temperate, Subtropical"
    },
    "Onion": {
        name: "Onion",
        image: "https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?auto=compress&cs=tinysrgb&w=400",
        harvestTime: "120-150 days",
        steps: [
            "Prepare raised beds for good drainage",
            "Transplant seedlings at proper spacing",
            "Provide light but frequent irrigation",
            "Apply fertilizers in split doses",
            "Keep field weed-free",
            "Stop irrigation 2 weeks before harvest",
            "Harvest when tops fall over and dry"
        ],
        soilTypes: ["Sandy Loam", "Loamy", "Well-drained"],
        climate: "Temperate, Semi-arid"
    },
    "Potato": {
        name: "Potato",
        image: "https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=400",
        harvestTime: "90-120 days",
        steps: [
            "Prepare field with deep plowing",
            "Cut seed tubers with 2-3 eyes",
            "Plant tubers in furrows",
            "Earth up plants 2-3 times",
            "Provide irrigation as needed",
            "Apply fertilizers in splits",
            "Harvest when plants start yellowing"
        ],
        soilTypes: ["Sandy Loam", "Loamy", "Well-drained"],
        climate: "Temperate, Cool"
    }
};

// State-wise crop recommendations based on climate and soil
const STATE_CROP_MAPPING = {
    "Punjab": ["Wheat", "Rice", "Maize", "Cotton", "Sugarcane"],
    "Haryana": ["Wheat", "Rice", "Maize", "Cotton", "Sugarcane"],
    "Uttar Pradesh": ["Wheat", "Rice", "Sugarcane", "Potato", "Maize"],
    "Bihar": ["Rice", "Wheat", "Maize", "Sugarcane", "Potato"],
    "West Bengal": ["Rice", "Potato", "Maize", "Sugarcane", "Wheat"],
    "Maharashtra": ["Cotton", "Sugarcane", "Rice", "Wheat", "Onion"],
    "Gujarat": ["Cotton", "Wheat", "Rice", "Sugarcane", "Potato"],
    "Rajasthan": ["Wheat", "Maize", "Cotton", "Rice", "Potato"],
    "Madhya Pradesh": ["Wheat", "Rice", "Cotton", "Maize", "Sugarcane"],
    "Karnataka": ["Rice", "Cotton", "Sugarcane", "Maize", "Tomato"],
    "Andhra Pradesh": ["Rice", "Cotton", "Sugarcane", "Maize", "Tomato"],
    "Tamil Nadu": ["Rice", "Sugarcane", "Cotton", "Maize", "Tomato"],
    "Kerala": ["Rice", "Sugarcane", "Tomato", "Maize", "Potato"],
    "Odisha": ["Rice", "Maize", "Sugarcane", "Cotton", "Potato"],
    "Telangana": ["Rice", "Cotton", "Maize", "Sugarcane", "Tomato"],
    "Assam": ["Rice", "Maize", "Sugarcane", "Potato", "Tomato"],
    "Jharkhand": ["Rice", "Maize", "Wheat", "Potato", "Sugarcane"],
    "Chhattisgarh": ["Rice", "Maize", "Wheat", "Sugarcane", "Cotton"],
    "Himachal Pradesh": ["Wheat", "Maize", "Rice", "Potato", "Tomato"],
    "Uttarakhand": ["Wheat", "Rice", "Maize", "Potato", "Sugarcane"],
    "Goa": ["Rice", "Sugarcane", "Tomato", "Maize", "Potato"],
    "Manipur": ["Rice", "Maize", "Potato", "Tomato", "Sugarcane"],
    "Meghalaya": ["Rice", "Maize", "Potato", "Tomato", "Wheat"],
    "Mizoram": ["Rice", "Maize", "Potato", "Tomato", "Sugarcane"],
    "Nagaland": ["Rice", "Maize", "Potato", "Tomato", "Wheat"],
    "Sikkim": ["Rice", "Maize", "Wheat", "Potato", "Tomato"],
    "Tripura": ["Rice", "Maize", "Potato", "Sugarcane", "Tomato"],
    "Arunachal Pradesh": ["Rice", "Maize", "Potato", "Wheat", "Tomato"],
    "Delhi": ["Wheat", "Rice", "Maize", "Potato", "Tomato"],
    "Chandigarh": ["Wheat", "Rice", "Maize", "Potato", "Tomato"],
    "Puducherry": ["Rice", "Sugarcane", "Cotton", "Maize", "Tomato"],
    "Jammu and Kashmir": ["Wheat", "Rice", "Maize", "Potato", "Tomato"],
    "Ladakh": ["Wheat", "Potato", "Tomato", "Maize", "Rice"],
    "Andaman & Nicobar": ["Rice", "Sugarcane", "Tomato", "Maize", "Potato"],
    "Lakshadweep": ["Rice", "Tomato", "Potato", "Maize", "Sugarcane"],
    "Daman & Diu": ["Rice", "Cotton", "Sugarcane", "Tomato", "Maize"]
};

// Soil types for different states
const STATE_SOIL_MAPPING = {
    "Punjab": "Alluvial Soil",
    "Haryana": "Alluvial Soil",
    "Uttar Pradesh": "Alluvial Soil",
    "Bihar": "Alluvial Soil",
    "West Bengal": "Alluvial Soil",
    "Maharashtra": "Black Cotton Soil",
    "Gujarat": "Black Cotton Soil",
    "Rajasthan": "Arid Soil",
    "Madhya Pradesh": "Black Cotton Soil",
    "Karnataka": "Red Soil",
    "Andhra Pradesh": "Red Soil",
    "Tamil Nadu": "Red Soil",
    "Kerala": "Laterite Soil",
    "Odisha": "Red & Laterite Soil",
    "Telangana": "Red Soil",
    "Assam": "Alluvial Soil",
    "Jharkhand": "Red Soil",
    "Chhattisgarh": "Red Soil",
    "Himachal Pradesh": "Mountain Soil",
    "Uttarakhand": "Mountain Soil",
    "Goa": "Laterite Soil",
    "Manipur": "Hill Soil",
    "Meghalaya": "Hill Soil",
    "Mizoram": "Hill Soil",
    "Nagaland": "Hill Soil",
    "Sikkim": "Mountain Soil",
    "Tripura": "Hill Soil",
    "Arunachal Pradesh": "Mountain Soil",
    "Delhi": "Alluvial Soil",
    "Chandigarh": "Alluvial Soil",
    "Puducherry": "Alluvial Soil",
    "Jammu and Kashmir": "Mountain Soil",
    "Ladakh": "Cold Desert Soil",
    "Andaman & Nicobar": "Tropical Soil",
    "Lakshadweep": "Coral Soil",
    "Daman & Diu": "Coastal Soil"
};

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
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Generate mock weather data
        const mockWeather = generateMockWeather(locationData.lat, locationData.lon);
        weatherInfoEl.innerHTML = `
            <div class="weather-stat"><span>Temperature</span><strong>${mockWeather.temperature}°C</strong></div>
            <div class="weather-stat"><span>Humidity</span><strong>${mockWeather.humidity}%</strong></div>
            <div class="weather-stat"><span>Rainfall</span><strong>${mockWeather.rainfall} mm</strong></div>
        `;

        // Get soil type for the state
        const soilType = STATE_SOIL_MAPPING[locationData.name] || "Mixed Soil";
        soilInfoEl.innerHTML = `
            <p><strong>Primary Soil Type:</strong> ${soilType}</p>
            <p><strong>pH Level:</strong> ${generateMockPH()}</p>
            <p><strong>Fertility:</strong> ${generateMockFertility()}</p>
        `;

        // Get recommended crops for the state
        const recommendedCrops = STATE_CROP_MAPPING[locationData.name] || ["Rice", "Wheat", "Maize", "Potato", "Tomato"];
        
        // Populate crop data
        recommendedCrops.forEach(cropName => {
            if (CROP_DATABASE[cropName]) {
                allCropsData[cropName] = CROP_DATABASE[cropName];
            }
        });

        // Build the crop list in sidebar
        populateCropListSidebar(recommendedCrops);
        
        // Show the first crop's details by default
        if (recommendedCrops.length > 0) {
            updateMainContent(recommendedCrops[0]);
            document.querySelector('.reco-crop-card').classList.add('active');
        }

    } catch (error) {
        console.error("Error on page load:", error);
        document.getElementById('crop-details-placeholder').innerHTML = `
            <h2>Error Loading Data</h2>
            <p>Could not load crop recommendations for this location. Please try refreshing the page.</p>
        `;
    }
});

function generateMockWeather(lat, lon) {
    // Generate realistic weather based on location
    const baseTemp = Math.round(15 + (30 - Math.abs(lat)) * 0.8 + Math.random() * 10);
    const humidity = Math.round(40 + Math.random() * 40);
    const rainfall = Math.round(Math.random() * 50);
    
    return {
        temperature: baseTemp,
        humidity: humidity,
        rainfall: rainfall
    };
}

function generateMockPH() {
    return (6.0 + Math.random() * 2.5).toFixed(1);
}

function generateMockFertility() {
    const levels = ["Low", "Medium", "High", "Very High"];
    return levels[Math.floor(Math.random() * levels.length)];
}

function populateCropListSidebar(cropNames) {
    const cropListEl = document.getElementById('crop-list');
    cropListEl.innerHTML = ''; // Clear spinner

    cropNames.forEach(cropName => {
        const cropData = CROP_DATABASE[cropName];
        if (!cropData) return;

        const card = document.createElement('div');
        card.className = 'reco-crop-card';
        card.onclick = () => handleCropSelection(cropName, card);

        card.innerHTML = `
            <img src="${cropData.image}" alt="${cropData.name}" class="reco-card-img">
            <span class="reco-card-name">${cropData.name}</span>
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

    // Get main content elements
    const placeholderEl = document.getElementById('crop-details-placeholder');
    const contentEl = document.getElementById('crop-details-content');
    const detailImageEl = document.getElementById('detail-image');
    const detailNameEl = document.getElementById('detail-name');
    const detailHarvestEl = document.getElementById('detail-harvest');
    const detailPriceEl = document.getElementById('detail-price');
    const detailStepsEl = document.getElementById('detail-steps');

    // Populate elements with data
    detailImageEl.src = cropData.image;
    detailImageEl.alt = `${cropData.name} cultivation`;
    detailNameEl.textContent = cropData.name;
    detailHarvestEl.textContent = cropData.harvestTime;

    // Generate realistic market price
    const basePrice = generateMarketPrice(cropName);
    detailPriceEl.textContent = `₹ ${basePrice} / Quintal`;

    // Populate cultivation steps
    detailStepsEl.innerHTML = '';
    cropData.steps.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        detailStepsEl.appendChild(li);
    });

    // Show the content with animation
    placeholderEl.style.display = 'none';
    contentEl.style.display = 'block';
    contentEl.style.animation = 'fadeIn 0.5s ease-in-out';
}

function generateMarketPrice(cropName) {
    // Generate realistic market prices based on crop type
    const priceRanges = {
        "Rice": [1800, 2200],
        "Wheat": [2000, 2400],
        "Sugarcane": [280, 320],
        "Cotton": [5500, 6500],
        "Maize": [1600, 2000],
        "Tomato": [800, 1500],
        "Onion": [1200, 2000],
        "Potato": [800, 1200]
    };
    
    const range = priceRanges[cropName] || [1000, 2000];
    const basePrice = range[0] + Math.random() * (range[1] - range[0]);
    const fluctuation = (Math.random() - 0.5) * 200; // ±100 fluctuation
    
    return Math.round(basePrice + fluctuation);
}