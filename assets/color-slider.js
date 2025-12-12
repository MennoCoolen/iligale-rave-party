// Color Slider Control System
const createColorSlider = () => {
    // Create container
    const container = document.createElement('div');
    container.className = 'color-slider-container';
    container.innerHTML = `
        <button class="toggle-btn" title="Toggle Slider">⚙️</button>
        
        <div class="color-slider-title">Color Control</div>
        
        <div class="slider-group">
            <label class="slider-label">Hue 1</label>
            <div class="slider-wrapper">
                <input type="range" id="hue1-slider" min="0" max="360" value="230" class="hue-slider">
                <span class="slider-value" id="hue1-value">230°</span>
            </div>
        </div>
        
        <div class="slider-group">
            <label class="slider-label">Hue 2</label>
            <div class="slider-wrapper">
                <input type="range" id="hue2-slider" min="0" max="360" value="280" class="hue-slider">
                <span class="slider-value" id="hue2-value">280°</span>
            </div>
        </div>
        
        <div class="slider-group">
            <label class="slider-label">Saturation</label>
            <div class="slider-wrapper">
                <input type="range" id="saturation-slider" min="30" max="100" value="70" class="hue-slider">
                <span class="slider-value" id="saturation-value">70%</span>
            </div>
        </div>
        
        <div class="slider-group">
            <label class="slider-label">Lightness</label>
            <div class="slider-wrapper">
                <input type="range" id="lightness-slider" min="30" max="60" value="45" class="hue-slider">
                <span class="slider-value" id="lightness-value">45%</span>
            </div>
        </div>
        
        <div class="preset-buttons">
            <button class="preset-btn" data-preset="default">Default</button>
            <button class="preset-btn" data-preset="ocean">Ocean</button>
            <button class="preset-btn" data-preset="sunset">Sunset</button>
            <button class="preset-btn" data-preset="forest">Forest</button>
            <button class="preset-btn" data-preset="midnight">Midnight</button>
            <button class="preset-btn" data-preset="rose">Rose</button>
        </div>
        
        <button class="reset-btn">Reset to Default</button>
    `;
    
    document.body.appendChild(container);
    
    // Color Presets
    const presets = {
        default: { hue1: 230, hue2: 280, saturation: 70, lightness: 45 },
        ocean: { hue1: 200, hue2: 240, saturation: 80, lightness: 50 },
        sunset: { hue1: 20, hue2: 50, saturation: 90, lightness: 48 },
        forest: { hue1: 120, hue2: 160, saturation: 75, lightness: 42 },
        midnight: { hue1: 240, hue2: 270, saturation: 85, lightness: 35 },
        rose: { hue1: 330, hue2: 20, saturation: 80, lightness: 50 }
    };
    
    // Update background function
    const updateBackground = (hue1, hue2, saturation, lightness) => {
        const gradient = `linear-gradient(135deg, hsl(${hue1}, ${saturation}%, ${lightness}%) 0%, hsl(${hue2}, ${saturation}%, ${lightness + 15}%) 100%)`;
        document.body.style.background = gradient;
        
        // Save to localStorage
        localStorage.setItem('colorSettings', JSON.stringify({
            hue1, hue2, saturation, lightness, timestamp: Date.now()
        }));
    };
    
    // Get sliders and values
    const hue1Slider = document.getElementById('hue1-slider');
    const hue2Slider = document.getElementById('hue2-slider');
    const saturationSlider = document.getElementById('saturation-slider');
    const lightnessSlider = document.getElementById('lightness-slider');
    
    const hue1Value = document.getElementById('hue1-value');
    const hue2Value = document.getElementById('hue2-value');
    const saturationValue = document.getElementById('saturation-value');
    const lightnessValue = document.getElementById('lightness-value');
    
    const resetBtn = document.querySelector('.reset-btn');
    const toggleBtn = document.querySelector('.toggle-btn');
    const presetBtns = document.querySelectorAll('.preset-btn');
    
    // Load saved settings
    const loadSettings = () => {
        const saved = localStorage.getItem('colorSettings');
        if (saved) {
            const { hue1, hue2, saturation, lightness } = JSON.parse(saved);
            hue1Slider.value = hue1;
            hue2Slider.value = hue2;
            saturationSlider.value = saturation;
            lightnessSlider.value = lightness;
            updateValues();
            updateBackground(hue1, hue2, saturation, lightness);
        }
    };
    
    // Update display values
    const updateValues = () => {
        hue1Value.textContent = hue1Slider.value + '°';
        hue2Value.textContent = hue2Slider.value + '°';
        saturationValue.textContent = saturationSlider.value + '%';
        lightnessValue.textContent = lightnessSlider.value + '%';
    };
    
    // Add event listeners
    [hue1Slider, hue2Slider, saturationSlider, lightnessSlider].forEach(slider => {
        slider.addEventListener('input', () => {
            updateValues();
            updateBackground(
                parseInt(hue1Slider.value),
                parseInt(hue2Slider.value),
                parseInt(saturationSlider.value),
                parseInt(lightnessSlider.value)
            );
        });
    });
    
    // Reset button
    resetBtn.addEventListener('click', () => {
        const defaultPreset = presets.default;
        hue1Slider.value = defaultPreset.hue1;
        hue2Slider.value = defaultPreset.hue2;
        saturationSlider.value = defaultPreset.saturation;
        lightnessSlider.value = defaultPreset.lightness;
        updateValues();
        updateBackground(defaultPreset.hue1, defaultPreset.hue2, defaultPreset.saturation, defaultPreset.lightness);
    });
    
    // Preset buttons
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = btn.dataset.preset;
            if (presets[preset]) {
                const p = presets[preset];
                hue1Slider.value = p.hue1;
                hue2Slider.value = p.hue2;
                saturationSlider.value = p.saturation;
                lightnessSlider.value = p.lightness;
                updateValues();
                updateBackground(p.hue1, p.hue2, p.saturation, p.lightness);
            }
        });
    });
    
    // Toggle button
    toggleBtn.addEventListener('click', () => {
        container.classList.toggle('collapsed');
    });
    
    // Load settings on page load
    loadSettings();
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createColorSlider);
} else {
    createColorSlider();
}
