// --- 1. TYPEWRITER EFFECT ---
const words = ["Strategic Operations", "System Architect", "Technical Problem Solver", "Data-Driven Innovator"];
let i = 0; let timer;

function typingEffect() {
    let word = words[i].split("");
    var loopTyping = function() {
        if (word.length > 0) {
            document.getElementById('typewriter').innerHTML += word.shift();
        } else {
            setTimeout(deletingEffect, 2000); return false;
        };
        timer = setTimeout(loopTyping, 100);
    };
    loopTyping();
}

function deletingEffect() {
    let word = words[i].split("");
    var loopDeleting = function() {
        if (word.length > 0) {
            word.pop();
            document.getElementById('typewriter').innerHTML = word.join("");
        } else {
            if (words.length > (i + 1)) i++; else i = 0;
            typingEffect(); return false;
        };
        timer = setTimeout(loopDeleting, 50);
    };
    loopDeleting();
}
typingEffect();


// --- 2. THEME TOGGLE LOGIC ---
const themeSelect = document.getElementById('theme-toggle');

function applyTheme(theme) {
    if (theme === 'system') {
        const wantsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', wantsDark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
}

const savedTheme = localStorage.getItem('spatial-theme') || 'system';
themeSelect.value = savedTheme;
applyTheme(savedTheme);

themeSelect.addEventListener('change', (e) => {
    localStorage.setItem('spatial-theme', e.target.value);
    applyTheme(e.target.value);
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (themeSelect.value === 'system') applyTheme('system');
});


// --- 3. SCROLL REVEAL ANIMATION (Apple/VisionOS Feel) ---
function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var j = 0; j < reveals.length; j++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[j].getBoundingClientRect().top;
        var elementVisible = 100; // Trigger threshold
        if (elementTop < windowHeight - elementVisible) {
            reveals[j].classList.add("active");
        }
    }
}
window.addEventListener("scroll", reveal);
reveal(); // Trigger once on initial load


// --- 4. INTERACTIVE "ABOUT YOU" TRACKER ---
document.getElementById('reveal-btn').addEventListener('click', async function() {
    const terminal = document.getElementById('terminal-screen');
    terminal.style.display = 'block';
    terminal.classList.add('fade-in');
    
    this.disabled = true;
    this.textContent = "Running Diagnostics... ⏳";

    // Client-side DOM/Window data
    document.getElementById('v-height').textContent = window.screen.height;
    document.getElementById('v-width').textContent = window.screen.width;
    document.getElementById('v-orientation').textContent = window.innerWidth > window.innerHeight ? "Landscape" : "Portrait";
    document.getElementById('v-theme').textContent = window.matchMedia('(prefers-color-scheme: dark)').matches ? "Dark" : "Light";

    // Basic User Agent Parsing
    let os = "Unknown OS", browser = "Unknown Browser";
    const ua = navigator.userAgent;
    if (ua.indexOf("Win") != -1) os = "Windows";
    if (ua.indexOf("Mac") != -1) os = "macOS/Apple";
    if (ua.indexOf("Linux") != -1) os = "Linux";
    if (ua.indexOf("Android") != -1) os = "Android";
    if (ua.indexOf("like Mac") != -1) os = "iOS";
    
    if (ua.indexOf("Chrome") != -1) browser = "Chrome";
    else if (ua.indexOf("Safari") != -1) browser = "Safari";
    else if (ua.indexOf("Firefox") != -1) browser = "Firefox";
    else if (ua.indexOf("Edge") != -1) browser = "Edge";
    
    document.getElementById('v-os').textContent = os;
    document.getElementById('v-browser').textContent = browser;

    // Network API
    if (navigator.connection) {
        document.getElementById('v-speed').textContent = navigator.connection.downlink + " mbps";
        document.getElementById('v-connection').textContent = navigator.connection.effectiveType;
    } else {
        document.getElementById('v-speed').textContent = "Unknown";
        document.getElementById('v-connection').textContent = "Standard";
    }

    // Battery API
    if (navigator.getBattery) {
        try {
            const battery = await navigator.getBattery();
            document.getElementById('v-battery').textContent = Math.round(battery.level * 100) + "%";
            document.getElementById('v-charging').textContent = battery.charging ? "Charging🔌" : "Discharging🔋";
        } catch(e) {
             document.getElementById('v-battery').textContent = "Hidden";
             document.getElementById('v-charging').textContent = "Hidden";
        }
    } else {
        document.getElementById('v-battery').textContent = "Not Supported";
        document.getElementById('v-charging').textContent = "N/A";
    }

    // External IP/Geo API Call
    try {
        const response = await fetch('https://ipinfo.io/json');
        const data = await response.json();
        
        document.getElementById('v-ip').textContent = data.ip || "Hidden";
        document.getElementById('v-isp').textContent = data.org || "Unknown ISP";
        document.getElementById('v-city').textContent = `${data.city}, ${data.region}`;
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

    this.textContent = "Scan Complete ✅";
});
