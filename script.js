// --- THEME TOGGLE LOGIC ---
const themeSelect = document.getElementById('theme-toggle');

function applyTheme(theme) {
    if (theme === 'system') {
        const wantsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', wantsDark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
}

// Check local storage on load
const savedTheme = localStorage.getItem('portfolio-theme') || 'system';
themeSelect.value = savedTheme;
applyTheme(savedTheme);

// Listen for dropdown changes
themeSelect.addEventListener('change', (e) => {
    localStorage.setItem('portfolio-theme', e.target.value);
    applyTheme(e.target.value);
});

// Listen for system theme changes if set to system
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (themeSelect.value === 'system') applyTheme('system');
});


// --- "ABOUT YOU" VISITOR TRACKER LOGIC ---
document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. Get Screen & Theme Data
    document.getElementById('v-height').textContent = window.screen.height;
    document.getElementById('v-width').textContent = window.screen.width;
    document.getElementById('v-orientation').textContent = window.innerWidth > window.innerHeight ? "landscape 🖥️" : "portrait 📱";
    document.getElementById('v-theme').textContent = window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";

    // 2. Get OS & Browser (Basic detection)
    let os = "Unknown OS";
    let browser = "Unknown Browser";
    const ua = navigator.userAgent;
    
    if (ua.indexOf("Win") != -1) os = "Windows";
    if (ua.indexOf("Mac") != -1) os = "Mac/Apple";
    if (ua.indexOf("Linux") != -1) os = "Linux";
    if (ua.indexOf("Android") != -1) os = "Android";
    if (ua.indexOf("like Mac") != -1) os = "iOS";
    
    if (ua.indexOf("Chrome") != -1) browser = "Chrome";
    else if (ua.indexOf("Safari") != -1) browser = "Safari";
    else if (ua.indexOf("Firefox") != -1) browser = "Firefox";
    else if (ua.indexOf("Edge") != -1) browser = "Edge";
    
    document.getElementById('v-os').textContent = os;
    document.getElementById('v-browser').textContent = browser;

    // 3. Get Network Speed (If supported)
    if (navigator.connection) {
        document.getElementById('v-speed').textContent = navigator.connection.downlink + " mbps";
        document.getElementById('v-connection').textContent = navigator.connection.effectiveType;
    } else {
        document.getElementById('v-speed').textContent = "Unknown";
        document.getElementById('v-connection').textContent = "Wi-Fi/Broadband";
    }

    // 4. Get Battery (If supported)
    if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
            document.getElementById('v-battery').textContent = Math.round(battery.level * 100) + "%";
            document.getElementById('v-charging').textContent = battery.charging ? "charging" : "not charging";
        });
    } else {
        document.getElementById('v-battery').textContent = "Unknown";
        document.getElementById('v-charging').textContent = "Unknown";
    }

    // 5. Fetch IP & Location Data (Using a free API)
    try {
        const response = await fetch('https://ipinfo.io/json');
        const data = await response.json();
        
        document.getElementById('v-ip').textContent = data.ip || "Hidden";
        document.getElementById('v-isp').textContent = data.org || "Unknown ISP";
        document.getElementById('v-city').textContent = `${data.city}, ${data.region}, ${data.country}`;
        document.getElementById('v-zip').textContent = data.postal || "Unknown";
        
        if(data.loc) {
            const coords = data.loc.split(',');
            document.getElementById('v-lat').textContent = coords[0] + "°";
            document.getElementById('v-lon').textContent = coords[1] + "°";
        }
    } catch (error) {
        document.getElementById('v-ip').textContent = "Encrypted/Hidden";
        document.getElementById('v-isp').textContent = "Unknown";
        document.getElementById('v-city').textContent = "Unknown Location";
    }
});
