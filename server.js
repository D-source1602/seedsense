// 1. Import all necessary libraries
const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies
const PORT = 3000;

// --- 2. Expanded Mock Database with Harvest Time ---
const cropDatabase = {
    "Alluvial Soil": [
        { name: "Rice", image: "https://images.pexels.com/photos/724490/pexels-photo-724490.jpeg", area: "1 Acre", steps: ["Plow the field and flood it with 2 inches of water.", "Transplant 2-3 seedlings per hill.", "Maintain water level and apply nitrogen-based fertilizer.", "Drain the field 2 weeks before harvesting."], ideal_temp: 24, harvestTime: "120-150 Days" },
        { name: "Wheat", image: "https://images.pexels.com/photos/176934/pexels-photo-176934.jpeg", area: "1 Acre", steps: ["Prepare a fine seedbed by plowing 2-3 times.", "Sow seeds in rows at a depth of 5cm.", "Provide irrigation at critical stages like crown root initiation.", "Harvest when the grains are hard and the straw is dry."], ideal_temp: 15, harvestTime: "100-120 Days" },
        { name: "Sugarcane", image: "https://images.pexels.com/photos/8099233/pexels-photo-8099233.jpeg", area: "2 Acres", steps: ["Dig furrows 30cm deep and 90cm apart.", "Plant seed cuttings (setts) in the furrows.", "Apply regular irrigation and earthing up to support the stalks.", "Harvest after 10-18 months when the canes are mature."], ideal_temp: 27, harvestTime: "10-18 Months" },
        { name: "Maize", image: "https://images.pexels.com/photos/5903268/pexels-photo-5903268.jpeg", area: "0.5 Acres", steps: ["Prepare a well-drained seedbed.", "Sow seeds 5cm deep, with 60cm between rows.", "Ensure adequate nitrogen supply and weed control.", "Harvest when the silks have turned brown and kernels are milky."], ideal_temp: 21, harvestTime: "90-100 Days" }
    ],
    "Black Soil": [
        { name: "Cotton", image: "https://images.pexels.com/photos/4198150/pexels-photo-4198150.jpeg", area: "3 Acres", steps: ["Prepare the field by deep plowing.", "Sow delinted seeds at a spacing of 90x60 cm.", "Manage pests, especially the pink bollworm.", "Pick the cotton bolls as they mature and burst open."], ideal_temp: 25, harvestTime: "150-180 Days" },
        { name: "Soybean", image: "https://images.pexels.com/photos/1351911/pexels-photo-1351911.jpeg", area: "1 Acre", steps: ["Ensure a well-pulverized but compact seedbed.", "Sow seeds in rows, maintaining a plant-to-plant distance of 5-7 cm.", "Apply pre-emergence herbicides for weed control.", "Harvest when leaves turn yellow and drop."], ideal_temp: 20, harvestTime: "90-110 Days" },
        { name: "Sorghum", image: "https://images.pexels.com/photos/8133379/pexels-photo-8133379.jpeg", area: "1 Acre", steps: ["Prepare a clean seedbed.", "Sow seeds at a depth of 3-4 cm.", "Thin the seedlings to maintain optimal plant population.", "Harvest the crop when the grains are fully mature."], ideal_temp: 28, harvestTime: "100-120 Days" }
    ],
    "Red Soil": [
        { name: "Groundnut", image: "https://images.pexels.com/photos/302476/pexels-photo-302476.jpeg", area: "1.5 Acres", steps: ["Prepare a well-pulverized seedbed.", "Sow seeds at a depth of 5-6 cm.", "Apply gypsum at the pegging stage.", "Harvest when the leaves turn yellow and start shedding."], ideal_temp: 28, harvestTime: "95-120 Days" },
        { name: "Ragi (Millet)", image: "https://images.pexels.com/photos/7633190/pexels-photo-7633190.jpeg", area: "1 Acre", steps: ["Prepare the main field by plowing.", "Transplant 21-day old seedlings.", "Maintain weed-free conditions for the first 40 days.", "Harvest when the earheads turn brownish."], ideal_temp: 26, harvestTime: "100-135 Days" },
        { name: "Pulses (Toor Dal)", image: "https://images.pexels.com/photos/10787797/pexels-photo-10787797.jpeg", area: "1 Acre", steps: ["Prepare a clean and clod-free seedbed.", "Sow seeds in rows with proper spacing.", "Manage pod borers at the flowering stage.", "Harvest when 80% of the pods are mature."], ideal_temp: 25, harvestTime: "120-180 Days" }
    ],
    "Arid Soil": [
        { name: "Bajra (Pearl Millet)", image: "https://images.pexels.com/photos/6765721/pexels-photo-6765721.jpeg", area: "1 Acre", steps: ["Prepare the field with minimal tillage.", "Sow seeds just before the monsoon.", "Thin the seedlings to maintain plant population.", "Harvest when the grains are hard and contain 20% moisture."], ideal_temp: 30, harvestTime: "75-95 Days" },
        { name: "Mustard", image: "https://images.pexels.com/photos/1329294/pexels-photo-1329294.jpeg", area: "1.5 Acres", steps: ["Prepare a fine seedbed for good germination.", "Sow seeds in rows at a depth of 4-5 cm.", "Provide one irrigation at the flowering stage.", "Harvest when 75% of the siliquae (pods) turn yellowish-brown."], ideal_temp: 18, harvestTime: "110-140 Days" },
        { name: "Barley", image: "https://images.pexels.com/photos/163347/barley-arable-agriculture-cereal-163347.jpeg", area: "2 Acres", steps: ["Plow the field 2-3 times.", "Sow seeds using a seed drill for uniform depth.", "The crop is drought-tolerant, requiring minimal irrigation.", "Harvest in the morning to avoid shattering losses."], ideal_temp: 15, harvestTime: "120-130 Days" }
    ],
    "Laterite Soil": [
        { name: "Cashew", image: "https://images.pexels.com/photos/8133596/pexels-photo-8133596.jpeg", area: "2 Acres", steps: ["Plant grafts in prepared pits.", "Ensure proper drainage as the crop is sensitive to waterlogging.", "Prune regularly to maintain a good canopy.", "Harvest nuts when the attached apple is ripe and falls."], ideal_temp: 27, harvestTime: "3-4 Years (first harvest)" },
        { name: "Tea", image: "https://images.pexels.com/photos/227908/pexels-photo-227908.jpeg", area: "3 Acres", steps: ["Plant in acidic soil with good drainage.", "Requires regular rainfall and high humidity.", "Pluck the top two leaves and a bud regularly.", "Pruning is essential for bush maintenance and yield."], ideal_temp: 22, harvestTime: "Continuous Plucking" },
        { name: "Rubber", image: "https://images.pexels.com/photos/2676597/pexels-photo-2676597.jpeg", area: "4 Acres", steps: ["Plant budded stumps or seedlings.", "Requires a well-distributed rainfall of at least 2000 mm.", "Tapping for latex begins after 7 years of planting.", "Follow a systematic tapping schedule to maximize yield."], ideal_temp: 28, harvestTime: "7 Years (first tapping)" }
    ],
     "Mountain Soil": [
        { name: "Apple", image: "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg", area: "2 Acres", steps: ["Requires a chilling period during winter.", "Plant on terraced slopes to prevent erosion.", "Prune during dormancy to shape the tree and improve fruit quality.", "Harvest when the fruit is firm and well-colored."], ideal_temp: 18, harvestTime: "4-5 Years (first harvest)" },
        { name: "Saffron", image: "https://images.pexels.com/photos/7127745/pexels-photo-7127745.jpeg", area: "0.5 Acres", steps: ["Plant corms in well-drained calcareous soil.", "Flowers are harvested in the autumn.", "The red stigmas are carefully hand-picked and dried.", "Requires a specific climate with cold winters and warm, dry summers."], ideal_temp: 17, harvestTime: "6-8 Weeks (flowering)" },
        { name: "Cherry", image: "https://images.pexels.com/photos/109275/pexels-photo-109275.jpeg", area: "1 Acre", steps: ["Requires deep, well-drained loamy soil and a chilling period.", "Protect the blossoms from spring frosts.", "Netting may be required to protect fruit from birds.", "Harvest when the fruit is fully ripe and has developed its characteristic color."], ideal_temp: 20, harvestTime: "3-4 Years (first harvest)" }
    ]
};

const stateSoilMap = { "Odisha": "Alluvial Soil", "Maharashtra": "Black Soil", "Tamil Nadu": "Red Soil", "Rajasthan": "Arid Soil", "Kerala": "Laterite Soil", "Jammu and Kashmir": "Mountain Soil", "Delhi": "Alluvial Soil", "West Bengal": "Alluvial Soil" };

// 3. Serve static files from the 'public' folder
app.use(express.static('public'));

// --- 4. Define API Endpoints ---

// API endpoint to get weather data
app.get('/get-weather', async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: 'Latitude and longitude are required' });
    
    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,precipitation_sum&current_weather=true&timezone=auto`;
    
    try {
        const weatherResponse = await fetch(weatherURL);
        const weatherData = await weatherResponse.json();
        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Endpoint for crop recommendation
app.get('/recommend-crops', (req, res) => {
    const { state, avgTemp } = req.query;
    const soilType = stateSoilMap[state] || Object.keys(cropDatabase)[0];
    
    if (!soilType || !cropDatabase[soilType]) {
        return res.json({ recommendations: [] });
    }

    const recommendations = cropDatabase[soilType]
        .sort((a, b) => Math.abs(a.ideal_temp - avgTemp) - Math.abs(b.ideal_temp - avgTemp))
        .slice(0, 5) // Get the top 5 best matches
        .map(crop => crop.name);

    res.json({ soilType, recommendations });
});

// Endpoint to get details for a single crop
app.get('/get-crop-details', (req, res) => {
    const { name } = req.query;
    let foundCrop = null;

    // Search for the crop in our database
    for (const soil in cropDatabase) {
        const crop = cropDatabase[soil].find(c => c.name.toLowerCase() === name.toLowerCase());
        if (crop) {
            foundCrop = crop;
            break;
        }
    }

    if (foundCrop) {
        res.json(foundCrop);
    } else {
        res.status(404).json({ error: 'Crop not found' });
    }
});

// NEW (Recommended) Endpoint to get details for multiple crops at once
app.post('/get-multiple-crop-details', (req, res) => {
    const { names } = req.body; // Expects an array like { "names": ["Rice", "Wheat"] }

    if (!names || !Array.isArray(names)) {
        return res.status(400).json({ error: 'An array of crop names is required in the request body.' });
    }

    const allCrops = Object.values(cropDatabase).flat();
    const foundCrops = names.map(name => {
        return allCrops.find(c => c.name.toLowerCase() === name.toLowerCase());
    }).filter(Boolean); // Filter out any undefined results for names not found

    res.json(foundCrops);
});


// 5. Start the Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});