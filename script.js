// --- 1. CINEMATIC HERO BACKGROUND FADE ---
window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    const heroBg = document.getElementById('hero-bg');
    if(heroBg) {
        heroBg.style.opacity = Math.max(1 - scroll / 800, 0.05);
    }
});

// --- 2. TYPEWRITER EFFECT (WITH SAFETY CHECK) ---
const words = ["> ARCHITECTING SCALE", "> ELIMINATING INEFFICIENCY", "> DRIVING GLOBAL COMPLIANCE", "> ACCELERATING REVENUE"];
let i = 0; let timer;

function typingEffect() {
    const typewriterEl = document.getElementById('typewriter');
    if (!typewriterEl) return; // Safety check
    
    let word = words[i].split("");
    var loopTyping = function() {
        if (word.length > 0) {
            typewriterEl.innerHTML += word.shift();
        } else {
            setTimeout(deletingEffect, 2000); return false;
        };
        timer = setTimeout(loopTyping, 50); 
    };
    loopTyping();
}

function deletingEffect() {
    const typewriterEl = document.getElementById('typewriter');
    if (!typewriterEl) return; // Safety check
    
    let word = words[i].split("");
    var loopDeleting = function() {
        if (word.length > 0) {
            word.pop();
            typewriterEl.innerHTML = word.join("");
        } else {
            if (words.length > (i + 1)) i++; else i = 0;
            typingEffect(); return false;
        };
        timer = setTimeout(loopDeleting, 30);
    };
    loopDeleting();
}
typingEffect();

// --- 3. THEME TOGGLE LOGIC ---
const themeSelect = document.getElementById('theme-toggle');

function applyTheme(theme) {
    if (theme === 'system') {
        const wantsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', wantsDark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
    if(isTelemetryActive) updateTelemetry();
}

if (themeSelect) {
    const savedTheme = localStorage.getItem('porsche-theme') || 'system';
    themeSelect.value = savedTheme;
    applyTheme(savedTheme);

    themeSelect.addEventListener('change', (e) => {
        localStorage.setItem('porsche-theme', e.target.value);
        applyTheme(e.target.value);
    });
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (themeSelect && themeSelect.value === 'system') applyTheme('system');
});

// --- 4. SCROLL REVEAL ANIMATION ---
function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var j = 0; j < reveals.length; j++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[j].getBoundingClientRect().top;
        var elementVisible = 100; 
        if (elementTop < windowHeight - elementVisible) {
            reveals[j].classList.add("active");
        }
    }
}
window.addEventListener("scroll", reveal);
reveal();

// --- 5. LIVE TELEMETRY DASHBOARD ---
let isTelemetryActive = false;
let geoDataCache = null;

async function updateTelemetry() {
    if (!document.getElementById('v-height')) return; // Safety check

    document.getElementById('v-height').textContent = window.innerHeight;
    document.getElementById('v-width').textContent = window.innerWidth;
    document.getElementById('v-orientation').textContent = window.innerWidth > window.innerHeight ? "LANDSCAPE" : "PORTRAIT";
    
    let currentTheme = document.documentElement.getAttribute('data-theme');
    document.getElementById('v-theme').textContent = currentTheme ? currentTheme.toUpperCase() : "DARK";

    let os = "UNKNOWN OS", browser = "UNKNOWN BROWSER";
    const ua = navigator.userAgent;
    if (ua.indexOf("Win") != -1) os = "WINDOWS";
    if (ua.indexOf("Mac") != -1) os = "MACOS/APPLE";
    if (ua.indexOf("Linux") != -1) os = "LINUX";
    if (ua.indexOf("Android") != -1) os = "ANDROID";
    if (ua.indexOf("like Mac") != -1) os = "IOS";
    
    if (ua.indexOf("Chrome") != -1) browser = "CHROME";
    else if (ua.indexOf("Safari") != -1) browser = "SAFARI";
    else if (ua.indexOf("Firefox") != -1) browser = "FIREFOX";
    else if (ua.indexOf("Edge") != -1) browser = "EDGE";
    
    document.getElementById('v-os').textContent = os;
    document.getElementById('v-browser').textContent = browser;

    if (navigator.connection) {
        document.getElementById('v-speed').textContent = navigator.connection.downlink + " MBPS";
        document.getElementById('v-connection').textContent = navigator.connection.effectiveType.toUpperCase();
    } else {
        document.getElementById('v-speed').textContent = "UNKNOWN";
        document.getElementById('v-connection').textContent = "STANDARD";
    }

    if (navigator.getBattery) {
        try {
            const battery = await navigator.getBattery();
            document.getElementById('v-battery').textContent = Math.round(battery.level * 100) + "%";
            document.getElementById('v-charging').textContent = battery.charging ? "CHARGING" : "DISCHARGING";
            
            battery.onlevelchange = updateTelemetry;
            battery.onchargingchange = updateTelemetry;
        } catch(e) {}
    }

    if (!geoDataCache) {
        try {
            const response = await fetch('https://ipinfo.io/json');
            geoDataCache = await response.json();
        } catch(e) {
            geoDataCache = { ip: "ENCRYPTED", org: "UNKNOWN", city: "UNKNOWN", region: "", postal: "N/A" };
        }
    }
    
    document.getElementById('v-ip').textContent = geoDataCache.ip || "HIDDEN";
    document.getElementById('v-isp').textContent = (geoDataCache.org || "UNKNOWN ISP").toUpperCase();
    document.getElementById('v-city').textContent = `${geoDataCache.city}, ${geoDataCache.region}`.toUpperCase();
    document.getElementById('v-zip').textContent = geoDataCache.postal || "UNKNOWN";
    
    if(geoDataCache.loc) {
        const coords = geoDataCache.loc.split(',');
        document.getElementById('v-lat').textContent = coords[0] + "°";
        document.getElementById('v-lon').textContent = coords[1] + "°";
    }
}

const revealBtn = document.getElementById('reveal-btn');
if (revealBtn) {
    revealBtn.addEventListener('click', async function() {
        const terminal = document.getElementById('terminal-screen');
        terminal.style.display = 'block';
        terminal.classList.add('fade-in');
        
        this.disabled = true;
        this.textContent = "SYSTEM MONITORING ACTIVE \u25CF";
        this.classList.add('live-pulse');
        
        isTelemetryActive = true;
        await updateTelemetry();
        
        window.addEventListener('resize', updateTelemetry);
    });
}
