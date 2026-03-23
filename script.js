// --- 1. TYPEWRITER EFFECT ---
const words = ["> ARCHITECTING SCALE", "> ELIMINATING INEFFICIENCY", "> DRIVING GLOBAL COMPLIANCE", "> ACCELERATING REVENUE"];
let i = 0; let timer;

function typingEffect() {
    let word = words[i].split("");
    var loopTyping = function() {
        if (word.length > 0) {
            document.getElementById('typewriter').innerHTML += word.shift();
        } else {
            setTimeout(deletingEffect, 2000); return false;
        };
        timer = setTimeout(loopTyping, 50); 
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
        timer = setTimeout(loopDeleting, 30);
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

const savedTheme = localStorage.getItem('porsche-theme') || 'system';
themeSelect.value = savedTheme;
applyTheme(savedTheme);

themeSelect.addEventListener('change', (e) => {
    localStorage.setItem('porsche-theme', e.target.value);
    applyTheme(e.target.value);
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (themeSelect.value === 'system') applyTheme('system');
});

// --- 3. SCROLL REVEAL ANIMATION ---
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

// --- 4. INTERACTIVE TELEMETRY DASHBOARD ---
document.getElementById('reveal-btn').addEventListener('click', async function() {
    const terminal = document.getElementById('terminal-screen');
    terminal.style.display = 'block';
    terminal.classList.add('fade-in');
    
    this.disabled = true;
    this.textContent = "DIAGNOSTICS IN PROGRESS... ⏳";

    document.getElementById('v-height').textContent = window.screen.height;
    document.getElementById('v-width').textContent = window.screen.width;
    document.getElementById('v-orientation').textContent = window.innerWidth > window.innerHeight ? "LANDSCAPE" : "PORTRAIT";
    document.getElementById('v-theme').textContent = window.matchMedia('(prefers-color-scheme: dark)').matches ? "DARK" : "LIGHT";

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
        } catch(e) {
             document.getElementById('v-battery').textContent = "HIDDEN";
             document.getElementById('v-charging').textContent = "HIDDEN";
        }
    } else {
        document.getElementById('v-battery').textContent = "NOT SUPPORTED";
        document.getElementById('v-charging').textContent = "N/A";
    }

    try {
        const response = await fetch('https://ipinfo.io/json');
        const data = await response.json();
        
        document.getElementById('v-ip').textContent = data.ip || "HIDDEN";
        document.getElementById('v-isp').textContent = (data.org || "UNKNOWN ISP").toUpperCase();
        document.getElementById('v-city').textContent = `${data.city}, ${data.region}`.toUpperCase();
        document.getElementById('v-zip').textContent = data.postal || "UNKNOWN";
        
        if(data.loc) {
            const coords = data.loc.split(',');
            document.getElementById('v-lat').textContent = coords[0] + "°";
            document.getElementById('v-lon').textContent = coords[1] + "°";
        }
    } catch (error) {
        document.getElementById('v-ip').textContent = "ENCRYPTED";
        document.getElementById('v-isp').textContent = "UNKNOWN";
        document.getElementById('v-city').textContent = "UNKNOWN LOCATION";
    }

    this.textContent = "DIAGNOSTICS COMPLETE";
});
