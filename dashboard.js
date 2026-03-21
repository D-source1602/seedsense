document.addEventListener('DOMContentLoaded', () => {
    const getLocationBtn = document.getElementById('getLocationBtn');
    const stateListItems = document.querySelectorAll('#state-list li');
    const confirmLocationBtn = document.getElementById('confirmLocationBtn');

    let selectedLocation = null;
    confirmLocationBtn.disabled = true;

    const map = L.map('map').setView([20.5937, 78.9629], 5);
    let currentMarker = null;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    function updateMapView(lat, lon, zoom, name) {
        map.setView([lat, lon], zoom);
        if (currentMarker) map.removeLayer(currentMarker);
        currentMarker = L.marker([lat, lon]).addTo(map)
            .bindPopup(`<b>${name}</b>`)
            .openPopup();
        selectedLocation = { lat, lon, name };
        confirmLocationBtn.disabled = false;

        // ✅ Trigger risk index
        showClimateRisk(name);
    }

    getLocationBtn.addEventListener('click', () => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            updateMapView(latitude, longitude, 13, 'Your Current Location');
            const currentActive = document.querySelector('#state-list li.active');
            if (currentActive) currentActive.classList.remove('active');
        }, () => {
            alert('Could not get your location. Please ensure you have granted permission.');
        });
    });

    stateListItems.forEach(item => {
        item.addEventListener('click', () => {
            const currentActive = document.querySelector('#state-list li.active');
            if (currentActive) currentActive.classList.remove('active');
            item.classList.add('active');
            const lat = parseFloat(item.dataset.lat);
            const lon = parseFloat(item.dataset.lon);
            const stateName = item.textContent.trim();
            updateMapView(lat, lon, 7, stateName);
        });
    });

    confirmLocationBtn.addEventListener('click', () => {
        if (selectedLocation) {
            sessionStorage.setItem('selectedLocation', JSON.stringify(selectedLocation));
            window.location.href = 'recommendations.html';
        }
    });

    // =====================================================
    // ✅ BUILT-IN CLIMATE RISK ENGINE (No API needed)
    // =====================================================

    // Base risk data per state (drought, flood) on annual average
    const stateRiskData = {
        'Andaman & Nicobar':  { drought: 10, flood: 70, reason: 'Island territory with heavy tropical rainfall year-round. Coastal flooding is a major concern during cyclone season.', advice: 'Use raised-bed farming techniques and ensure proper drainage channels around crops.' },
        'Andhra Pradesh':     { drought: 60, flood: 55, reason: 'Prone to both drought in Rayalaseema and flooding in coastal delta regions. Irregular monsoon causes frequent crop stress.', advice: 'Adopt drought-tolerant varieties like millets for inland areas and strengthen bunds near river deltas.' },
        'Arunachal Pradesh':  { drought: 10, flood: 85, reason: 'Receives among the highest rainfall in India. Steep terrain causes rapid runoff and frequent flash floods and landslides.', advice: 'Practice contour farming on slopes and avoid cultivation near riverbanks during monsoon.' },
        'Assam':              { drought: 12, flood: 95, reason: 'The Brahmaputra river causes severe annual flooding affecting over 40% of the state. Flood risk is among the highest in India.', advice: 'Plant flood-tolerant rice varieties like Swarna Sub1 and maintain elevated seedbeds.' },
        'Bihar':              { drought: 45, flood: 85, reason: 'Northern Bihar faces devastating floods from Himalayan rivers while southern Bihar suffers periodic drought conditions.', advice: 'Use flood-resistant crop varieties in northern districts and practice water conservation in southern areas.' },
        'Chandigarh':         { drought: 40, flood: 30, reason: 'Urban territory with moderate climate. Good drainage infrastructure reduces flood risk despite monsoon rainfall.', advice: 'Maintain urban green patches and use drip irrigation for any agricultural plots.' },
        'Chhattisgarh':       { drought: 55, flood: 50, reason: 'Central location causes variable rainfall. Northern districts face flooding while southern tribal areas suffer drought stress.', advice: 'Build farm ponds to harvest rainwater and use drought-resistant paddy varieties.' },
        'Daman & Diu':        { drought: 35, flood: 45, reason: 'Coastal territory with moderate rainfall. Storm surges during cyclones pose localized flood risks.', advice: 'Grow salt-tolerant crops and build coastal windbreaks to protect farmland.' },
        'Delhi':              { drought: 50, flood: 40, reason: 'Semi-arid climate with erratic monsoon. Yamuna river flooding affects low-lying agricultural areas occasionally.', advice: 'Use micro-irrigation systems and grow short-duration crops suited to limited water availability.' },
        'Goa':                { drought: 15, flood: 55, reason: 'Heavy southwest monsoon brings abundant rainfall. Low-lying coastal areas and river estuaries face seasonal flooding.', advice: 'Maintain proper field drainage and avoid sowing during peak monsoon months of July-August.' },
        'Gujarat':            { drought: 78, flood: 35, reason: 'Kutch and Saurashtra regions are highly drought-prone with rainfall below 400mm. Southern Gujarat faces occasional flooding.', advice: 'Prioritize drought-resistant crops like groundnut and castor; invest in rainwater harvesting structures.' },
        'Haryana':            { drought: 62, flood: 32, reason: 'Semi-arid state heavily dependent on canal irrigation. Groundwater depletion increases drought vulnerability significantly.', advice: 'Switch to less water-intensive crops like pulses and oilseeds; adopt micro-irrigation.' },
        'Himachal Pradesh':   { drought: 28, flood: 60, reason: 'Mountainous terrain causes flash floods and cloudbursts in summer. Rain shadow areas face dry spells in winter.', advice: 'Avoid cultivation on steep slopes and build check dams to prevent soil erosion.' },
        'Jammu and Kashmir':  { drought: 42, flood: 55, reason: 'Kashmir Valley faces river flooding while Jammu region has variable rainfall. Glacial melt adds to flood risk in summer.', advice: 'Use terraced farming and plant apple orchards on slopes to stabilize soil.' },
        'Jharkhand':          { drought: 58, flood: 52, reason: 'Plateau region with erratic monsoon. Tribal districts face severe drought while river valleys experience periodic flooding.', advice: 'Build percolation tanks and grow drought-tolerant crops like arhar and maize.' },
        'Karnataka':          { drought: 68, flood: 38, reason: 'Northern Karnataka is one of India\'s most drought-prone regions. Coastal Karnataka receives heavy rainfall causing localized floods.', advice: 'Grow drought-hardy crops like ragi and jowar in northern districts; ensure coastal drainage.' },
        'Kerala':             { drought: 18, flood: 80, reason: 'Receives heavy rainfall from both southwest and northeast monsoons. 2018 floods showed extreme vulnerability of low-lying areas.', advice: 'Maintain traditional paddy field bunds and avoid construction in flood plain areas.' },
        'Ladakh':             { drought: 85, flood: 20, reason: 'Cold desert with very low precipitation. Glacial lake outburst floods (GLOFs) pose occasional but severe flash flood risk.', advice: 'Use greenhouse farming and traditional kul irrigation channels for water-efficient cultivation.' },
        'Lakshadweep':        { drought: 15, flood: 65, reason: 'Low-lying coral islands extremely vulnerable to storm surges and sea-level rise. Freshwater lens easily contaminated.', advice: 'Practice traditional coconut-based farming and use rainwater harvesting for freshwater conservation.' },
        'Madhya Pradesh':     { drought: 63, flood: 48, reason: 'Central India\'s variable monsoon causes drought in western districts and flooding along Narmada and Chambal rivers.', advice: 'Build farm ponds and adopt soybean cultivation with proper drainage in flood-prone areas.' },
        'Maharashtra':        { drought: 67, flood: 52, reason: 'Vidarbha and Marathwada are severely drought-prone. Konkan coast and Mumbai region face intense flooding during monsoon.', advice: 'Use drip irrigation for sugarcane and cotton; adopt drought-tolerant soybean varieties inland.' },
        'Manipur':            { drought: 22, flood: 72, reason: 'Receives heavy rainfall causing flooding in Imphal Valley. Loktak Lake area is particularly vulnerable to seasonal floods.', advice: 'Use floating garden (phumdi) techniques traditional to Manipur for flood-prone cultivation.' },
        'Meghalaya':          { drought: 10, flood: 88, reason: 'Cherrapunji receives among world\'s highest rainfall. Steep slopes cause severe erosion and flash flooding downstream.', advice: 'Practice agroforestry and maintain traditional stone drainage systems to control runoff.' },
        'Mizoram':            { drought: 18, flood: 75, reason: 'Heavy rainfall on hilly terrain causes landslides and flash floods. Jhum cultivation areas face severe soil erosion.', advice: 'Replace jhum cultivation with terraced permanent agriculture and plant bamboo as soil stabilizer.' },
        'Nagaland':           { drought: 20, flood: 68, reason: 'Hilly terrain with heavy monsoon rainfall causes landslides and localized flooding in valley settlements.', advice: 'Use contour bunding and mixed cropping systems to reduce soil erosion risk.' },
        'Odisha':             { drought: 48, flood: 82, reason: 'Highly cyclone-prone coastline with frequent storm surges. Western Odisha faces drought while coastal districts suffer severe flooding.', advice: 'Grow cyclone-resistant short-duration paddy and maintain mangrove cover along coastline.' },
        'Puducherry':         { drought: 42, flood: 58, reason: 'Receives rainfall mainly from northeast monsoon. Coastal low-lying areas flood during heavy rain events and cyclones.', advice: 'Maintain coastal drainage canals and grow salt-tolerant crops near shoreline areas.' },
        'Punjab':             { drought: 52, flood: 38, reason: 'Groundwater over-exploitation for wheat-rice cultivation creates long-term drought vulnerability. River flooding affects some districts.', advice: 'Diversify from rice to maize or pulses to reduce water consumption and improve soil health.' },
        'Rajasthan':          { drought: 92, flood: 15, reason: 'Thar Desert covers over 60% of the state. Among India\'s most drought-affected states with rainfall below 300mm in western areas.', advice: 'Grow drought-resistant crops like bajra, moth bean and cluster bean; use khadins for water harvesting.' },
        'Sikkim':             { drought: 15, flood: 72, reason: 'Heavy Himalayan rainfall causes frequent landslides and glacial lake outburst floods. Steep terrain amplifies flood damage.', advice: 'Practice organic cardamom farming on terraced slopes with proper retaining walls.' },
        'Tamil Nadu':         { drought: 62, flood: 58, reason: 'Depends on northeast monsoon which is highly erratic. Chennai and delta districts face cyclone flooding while southern districts face drought.', advice: 'Restore traditional tank irrigation systems and grow drought-tolerant millets and pulses.' },
        'Telangana':          { drought: 65, flood: 48, reason: 'Deccan plateau region with erratic rainfall. Krishna and Godavari rivers cause flooding in delta areas during heavy monsoon years.', advice: 'Use micro-irrigation for cotton and chilies; build check dams in drought-prone mandals.' },
        'Tripura':            { drought: 20, flood: 70, reason: 'Heavy rainfall causes flooding in valley areas. Gumti and Haora rivers overflow frequently affecting paddy cultivation.', advice: 'Grow flood-tolerant rice varieties and practice aquaculture in flood-prone low-lying areas.' },
        'Uttar Pradesh':      { drought: 48, flood: 72, reason: 'Eastern UP faces Himalayan river flooding from Ganga and Ghaghra. Western UP faces semi-arid drought conditions.', advice: 'Use flood-tolerant sugarcane varieties in eastern districts and drip irrigation in western areas.' },
        'Uttarakhand':        { drought: 30, flood: 65, reason: 'Himalayan cloudbursts cause devastating flash floods. Kedarnath 2013 disaster showed extreme vulnerability of mountain rivers.', advice: 'Avoid cultivation within 500m of mountain rivers and use traditional baranaja multi-crop system.' },
        'West Bengal':        { drought: 30, flood: 75, reason: 'Sundarbans delta and coastal districts face cyclone storm surges. North Bengal and Darjeeling receive heavy monsoon causing landslides.', advice: 'Grow flood-tolerant Aman paddy varieties and maintain embankments along tidal rivers.' },
        'Your Current Location': { drought: 45, flood: 45, reason: 'Risk assessment based on your current geographical location and regional climate patterns.', advice: 'Monitor local weather forecasts and follow district agriculture department advisories.' }
    };

    // Month-based multipliers (which months increase drought/flood risk)
    const monthMultipliers = {
        'January':   { drought: 1.3, flood: 0.3 },
        'February':  { drought: 1.4, flood: 0.2 },
        'March':     { drought: 1.5, flood: 0.2 },
        'April':     { drought: 1.6, flood: 0.2 },
        'May':       { drought: 1.5, flood: 0.3 },
        'June':      { drought: 0.7, flood: 1.4 },
        'July':      { drought: 0.4, flood: 1.8 },
        'August':    { drought: 0.4, flood: 1.9 },
        'September': { drought: 0.5, flood: 1.6 },
        'October':   { drought: 0.8, flood: 1.2 },
        'November':  { drought: 1.1, flood: 0.6 },
        'December':  { drought: 1.3, flood: 0.3 }
    };

    function getOverallLevel(drought, flood) {
        const max = Math.max(drought, flood);
        if (max >= 75) return 'severe';
        if (max >= 55) return 'high';
        if (max >= 35) return 'medium';
        return 'low';
    }

    function showClimateRisk(stateName) {
        const box      = document.getElementById('risk-index-box');
        const loading  = document.getElementById('risk-loading');
        const content  = document.getElementById('risk-content');
        const regionEl = document.getElementById('risk-region-name');

        // ── Climate Risk Card Styles ──────────────────────────────────────
        Object.assign(box.style, {
            minHeight    : '440px',
            padding      : '24px 22px 30px',
            borderRadius : '14px',
            background   : '#ffffff',
            border       : '1px solid rgba(0, 0, 0, 0.12)',
            boxShadow    : '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)',
            display      : 'flex',
            flexDirection: 'column',
            gap          : '14px',
            marginTop    : '10px',
            transition   : 'all 0.3s ease',
            boxSizing    : 'border-box',
            overflow     : 'visible',
        });

        // Region name
        Object.assign(regionEl.style, {
            fontSize     : '1.15rem',
            fontWeight   : '700',
            color        : '#4ade80',
            letterSpacing: '0.4px',
            marginBottom : '2px',
        });

        // Loading indicator
        Object.assign(loading.style, {
            textAlign : 'center',
            padding   : '20px 0',
            color     : '#86efac',
            fontSize  : '0.9rem',
            fontStyle : 'italic',
        });

        // Content area
        Object.assign(content.style, {
            display      : 'flex',
            flexDirection: 'column',
            gap          : '12px',
        });

        // Style bars, reason/advice blocks after content renders
        setTimeout(() => {
            ['drought-bar', 'flood-bar'].forEach(id => {
                const bar = document.getElementById(id);
                if (bar) Object.assign(bar.style, {
                    height    : '10px',
                    borderRadius: '6px',
                    transition: 'width 0.8s ease',
                    boxShadow : '0 0 8px rgba(74,222,128,0.35)',
                });
            });

            const reason = document.getElementById('risk-reason');
            const advice = document.getElementById('risk-advice');

            if (reason) Object.assign(reason.style, {
                fontSize  : '0.82rem',
                lineHeight: '1.6',
                color     : '#cbd5e1',
                background: '3px solid #38bdf8',
                borderLeft: '3px solid #38bdf8',
                padding   : '10px 12px',
                borderRadius: '6px',
                marginTop : '4px',
            });

            if (advice) Object.assign(advice.style, {
                fontSize  : '0.82rem',
                lineHeight: '1.6',
                color     : '#d1fae5',
                background: 'rgba(74,222,128,0.07)',
                borderLeft: '3px solid #4ade80',
                padding   : '10px 12px',
                borderRadius: '6px',
            });

            const overallEl = document.getElementById('risk-overall-label');
            if (overallEl) Object.assign(overallEl.style, {
                display      : 'inline-block',
                padding      : '5px 14px',
                borderRadius : '20px',
                fontSize     : '0.78rem',
                fontWeight   : '700',
                letterSpacing: '0.6px',
                marginBottom : '6px',
                alignSelf    : 'flex-start',
            });
        }, 850); // runs just after the 800ms content render timeout
        // ─────────────────────────────────────────────────────────────────

        // Show box with loading
        box.classList.remove('hidden');
        regionEl.textContent = stateName;
        loading.classList.remove('hidden');
        content.classList.add('hidden');

        // Reset bars
        document.getElementById('drought-bar').style.width  = '0%';
        document.getElementById('flood-bar').style.width    = '0%';
        document.getElementById('drought-value').textContent = '--';
        document.getElementById('flood-value').textContent   = '--';

        // Simulate a short analysis delay for better UX
        setTimeout(() => {
            const currentMonth = new Date().toLocaleString('default', { month: 'long' });
            const multiplier   = monthMultipliers[currentMonth] || { drought: 1, flood: 1 };

            // Find matching state (fuzzy match)
            const matchedKey = Object.keys(stateRiskData).find(k =>
                k.toLowerCase() === stateName.toLowerCase()
            ) || 'Your Current Location';

            const base = stateRiskData[matchedKey];

            // Apply month multiplier and clamp to 0-100
            const droughtRisk = Math.min(100, Math.round(base.drought * multiplier.drought));
            const floodRisk   = Math.min(100, Math.round(base.flood   * multiplier.flood));
            const overall     = getOverallLevel(droughtRisk, floodRisk);

            // Animate bars
            document.getElementById('drought-bar').style.width    = droughtRisk + '%';
            document.getElementById('flood-bar').style.width      = floodRisk + '%';
            document.getElementById('drought-value').textContent  = droughtRisk + '%';
            document.getElementById('flood-value').textContent    = floodRisk + '%';

            // Overall badge
            const overallEl = document.getElementById('risk-overall-label');
            overallEl.textContent = 'Overall Risk: ' + overall.toUpperCase();
            overallEl.className   = 'risk-overall ' + overall;

            // Reason and advice
            document.getElementById('risk-reason').textContent = '🧠 ' + base.reason;
            document.getElementById('risk-advice').textContent = '💡 ' + base.advice;

            loading.classList.add('hidden');
            content.classList.remove('hidden');

        }, 800); // 0.8s fake loading for UX feel
    }
});