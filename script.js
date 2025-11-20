const head = document.getElementById('floatingHead');

// --- SETTINGS ---
let stopPoint = 200; // Default limit for Desktop (200px)
const speed = 0.5;   // Slower speed for better control

// Function to set limit based on screen width
function updateStopPoint() {
    if (window.innerWidth < 768) {
        // MOBILE: Sobrang liit lang ng angat (50px) para di humiwalay ang braso
        stopPoint = 50; 
    } else {
        // DESKTOP: Malaki ang angat (200px) para cinematic
        stopPoint = 200;
    }
}

// Run immediately to set initial state
updateStopPoint();

// Logic for movement
let currentScroll = 0;

function updateHeadPosition(delta) {
    currentScroll += delta * speed;

    // Limits
    if (currentScroll < 0) currentScroll = 0;
    if (currentScroll > stopPoint) currentScroll = stopPoint;

    if (head) {
        head.style.transform = `translateY(-${currentScroll}px)`;
    }
}

// Mouse Wheel (Desktop)
window.addEventListener('wheel', (e) => {
    updateHeadPosition(e.deltaY);
});

// Touch (Mobile)
let startY = 0;
window.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
});

window.addEventListener('touchmove', (e) => {
    const currentY = e.touches[0].clientY;
    const diff = startY - currentY; 
    
    // Mas mabagal sa touch (0.3) para hindi biglang lipad
    updateHeadPosition(diff * 0.3); 
    
    startY = currentY;
});

// Listener for screen resize (e.g., rotating phone)
window.addEventListener('resize', updateStopPoint);