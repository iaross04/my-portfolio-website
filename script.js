const head = document.getElementById('floatingHead');
const container = document.querySelector('.character-container');
const body = document.body;
const contentDiv = document.querySelector('.content'); 
const h1 = document.querySelector('h2');
const p = document.querySelector('.subtitle');
const finalTag = document.getElementById('finalTag');

// --- SETTINGS ---
let stopPoint = 200;

const scrollSpeed = 5.0; 

const zoomSpeed = 0.008;
const maxScroll = 24000; 

const maxZoomLevel = 30; 
const maxTagScale = 4.0; 

// Flags
let eyesGenerated = false;
let chuStickersGenerated = false;
let chuTagCreated = false;
let galleryGenerated = false;
let endingStickerCreated = false;

// --- INJECT CSS ---
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @keyframes floatGallery {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
    }
    .floating-item {
        animation: floatGallery 4s ease-in-out infinite;
    }
    body {
        transition: background-color 0.5s ease-in-out !important;
    }
    .content {
        background-color: transparent !important;
        pointer-events: none;
    }
    html, body {
        touch-action: none; 
        overscroll-behavior: none;
    }
    .character-container, .gallery-item, .bg-eye, .bg-chu, #finalTag, #chuTag {
        will-change: transform, opacity;
        backface-visibility: hidden;
        transform-style: preserve-3d;
    }
    #chuTag, .bg-chu, .gallery-item {
        transition: none !important; 
    }
    body.end-state, body.end-state * {
        cursor: not-allowed !important;
    }
`;
document.head.appendChild(styleSheet);

// --- GENERATORS ---
function generateEyes() {
    const numEyes = 7;
    const sizeValues = { small: 50, medium: 80, large: 110 }; 
    const sizes = ['small', 'medium', 'large'];
    const regions = [
        { x: [5, 25], y: [5, 30] }, { x: [40, 60], y: [5, 25] },
        { x: [75, 95], y: [5, 30] }, { x: [5, 25], y: [70, 95] },
        { x: [70, 95], y: [70, 95] }, { x: [5, 30], y: [40, 60] },
        { x: [70, 95], y: [35, 55] }
    ];
    
    for (let i = 0; i < numEyes; i++) {
        const eye = document.createElement('img');
        eye.src = '/html/eye.png'; 
        eye.className = 'bg-eye';
        const region = regions[i];
        const x = region.x[0] + Math.random() * (region.x[1] - region.x[0]);
        const y = region.y[0] + Math.random() * (region.y[1] - region.y[0]);
        const rotation = Math.random() * 360;
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        
        eye.style.left = `${x}%`;
        eye.style.top = `${y}%`;
        eye.style.width = `${sizeValues[size]}px`;
        eye.dataset.rotation = rotation;
        eye.style.transform = `rotate(${rotation}deg) scale(0)`;
        eye.style.opacity = 0;
        eye.style.position = 'fixed';
        eye.style.zIndex = '20';
        document.body.appendChild(eye);
    }
}

function generateChuStickers() {
    const numStickers = 8; 
    const sizeValues = { small: 60, medium: 90, large: 130 }; 
    const sizes = ['small', 'medium', 'large'];
    const regions = [
        { x: [5, 25], y: [5, 30] }, { x: [40, 60], y: [5, 25] },
        { x: [75, 95], y: [5, 30] }, { x: [5, 25], y: [70, 95] },
        { x: [70, 95], y: [70, 95] }, { x: [5, 30], y: [40, 60] },
        { x: [70, 95], y: [35, 55] }, { x: [40, 60], y: [80, 95] }
    ];
    
    for (let i = 0; i < numStickers; i++) {
        const sticker = document.createElement('img');
        sticker.src = '/html/chu.png'; 
        sticker.className = 'bg-chu'; 
        const region = regions[i % regions.length];
        const x = region.x[0] + Math.random() * (region.x[1] - region.x[0]);
        const y = region.y[0] + Math.random() * (region.y[1] - region.y[0]);
        const rotation = Math.random() * 60 - 30; 
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        
        sticker.style.left = `${x}%`;
        sticker.style.top = `${y}%`;
        sticker.style.width = `${sizeValues[size]}px`;
        sticker.dataset.rotation = rotation;
        sticker.style.transform = `rotate(${rotation}deg) scale(0)`;
        sticker.style.opacity = 0;
        sticker.style.position = 'fixed';
        sticker.style.zIndex = '25'; 
        document.body.appendChild(sticker);
    }
}

function generateGallery() {
    const isMobile = window.innerWidth < 768;
    
    for (let i = 0; i < 10; i++) {
        const img = document.createElement('img');
        img.src = `/html/chuchu${i+1}.jpg`; 
        img.className = 'gallery-item'; 
        
        let l, t, w, h;
        if (!isMobile) {
            const col = i % 5; 
            const row = Math.floor(i / 5); 
            w = 20; h = 50;
            l = col * 20; t = row * 50;
        } else {
            const col = i % 2; 
            const row = Math.floor(i / 2); 
            w = 50; h = 20;
            l = col * 50; t = row * 20;
        }

        img.style.position = 'fixed';
        img.style.left = `${l}%`;
        img.style.top = `${t}%`;
        img.style.width = `${w}%`;
        img.style.height = `${h}%`;
        img.style.objectFit = 'cover';
        img.style.zIndex = '10'; 
        img.style.opacity = '0';
        img.style.transform = 'translateY(100px) scale(0.9)'; 
        img.style.border = '1px solid rgba(255,255,255,0.2)';

        let baseFilter = '';
        if ((i + 1) % 2 === 0) {
            baseFilter = 'grayscale(100%) contrast(120%) brightness(90%)'; 
        } else {
            baseFilter = 'none';
        }
        img.style.filter = baseFilter;
        img.dataset.baseFilter = baseFilter;

        document.body.appendChild(img);
    }
}

function createChuTag() {
    const img = document.createElement('img');
    img.src = '/html/chu_tag.png';
    img.id = 'chuTag';
    img.style.position = 'fixed';
    img.style.top = '50%';
    img.style.left = '50%';
    img.style.transform = 'translate(-50%, -50%) scale(0)';
    img.style.width = '350px'; 
    img.style.maxWidth = '80%';
    img.style.zIndex = '100'; 
    img.style.opacity = 0;
    img.style.pointerEvents = 'none';
    document.body.appendChild(img);
}

function createEndingSticker() {
    const img = document.createElement('img');
    img.src = '/html/chu.png';
    img.id = 'endingSticker';
    img.style.position = 'fixed';
    img.style.top = '50%';
    img.style.left = '50%';
    img.style.transform = 'translate(-50%, -50%) scale(0)';
    img.style.width = '150px'; 
    img.style.zIndex = '200'; 
    img.style.opacity = 0;
    img.style.pointerEvents = 'none';
    document.body.appendChild(img);
}

function updateStopPoint() {
    stopPoint = window.innerWidth < 768 ? 50 : 200;
}
updateStopPoint();

// --- SMOOTH SCROLL ENGINE ---
let targetScroll = 0;
let currentScroll = 0;

window.addEventListener('wheel', (e) => {
    targetScroll += e.deltaY * scrollSpeed;
    if (targetScroll < 0) targetScroll = 0;
    if (targetScroll > maxScroll) targetScroll = maxScroll;
});

let startY = 0;
window.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
}, { passive: false });

window.addEventListener('touchmove', (e) => {
    e.preventDefault(); 
    const currentY = e.touches[0].clientY;
    // 🚀 MOBILE SPEED BOOST (5.5x)
    const deltaY = (startY - currentY) * 5.5; 
    targetScroll += deltaY;
    if (targetScroll < 0) targetScroll = 0;
    if (targetScroll > maxScroll) targetScroll = maxScroll;
    startY = currentY;
}, { passive: false });

// --- RENDER LOOP ---
function render() {
    currentScroll += (targetScroll - currentScroll) * 0.1;

    if (targetScroll >= maxScroll - 100) {
        document.body.classList.add('end-state');
    } else {
        document.body.classList.remove('end-state');
    }

    let headY = Math.min(currentScroll, stopPoint);
    if (head) head.style.transform = `translateY(-${headY}px)`;

    let rawZoom = 1;
    let visualZoom = 1;

    if (currentScroll > stopPoint) {
        const extraScroll = currentScroll - stopPoint;
        rawZoom = 1 + (extraScroll * zoomSpeed); 
        visualZoom = Math.min(rawZoom, maxZoomLevel);

        if (visualZoom > 3) head.style.opacity = Math.max(0, 1 - (visualZoom - 3)); 
        else head.style.opacity = 1;

        const triggerPoint = 12; 

        if (container) {
            let radius = 0;
            if (visualZoom > 1.1) radius = Math.min(50, (visualZoom - 1.1) * 50);
            if (visualZoom > 3.5) radius = Math.max(0, 50 - ((visualZoom - 3.5) * 25));
            container.style.borderRadius = `${radius}%`;
            container.style.overflow = (radius > 0) ? "hidden" : "visible";

            if (rawZoom >= triggerPoint) {
                 container.style.opacity = Math.max(0, 1 - (rawZoom - triggerPoint) / 3);
            } else {
                 container.style.opacity = 1;
            }
        }
        
        if (rawZoom >= triggerPoint) {
            let targetBG = "#A5678E"; 
            body.style.backgroundColor = targetBG;
            if(contentDiv) contentDiv.style.backgroundColor = "transparent";

            if(h1) h1.style.opacity = 0;
            if(p) p.style.opacity = 0;
            
            let chaosOpacity = 1;
            if (rawZoom > 38) {
                chaosOpacity = Math.max(0, 1 - ((rawZoom - 38) / 7));
            }

            let tagScale = Math.min((rawZoom - triggerPoint) * 0.2, maxTagScale);

            if(finalTag) {
                finalTag.style.opacity = chaosOpacity;
                finalTag.style.transform = `scale(${tagScale})`;
            }
            
            if (!eyesGenerated) { generateEyes(); eyesGenerated = true; }
            const eyes = document.querySelectorAll('.bg-eye');
            eyes.forEach(eye => {
                eye.style.opacity = chaosOpacity; 
                const rot = eye.dataset.rotation || 0;
                eye.style.transform = `rotate(${rot}deg) scale(${tagScale * 0.8})`; 
            });

            const chuStart = 48;
            const chuExitStart = 75; 
            
            if (rawZoom > chuStart) {
                if (!chuTagCreated) { createChuTag(); chuTagCreated = true; }
                if (!chuStickersGenerated) { generateChuStickers(); chuStickersGenerated = true; }
                
                const chuTag = document.getElementById('chuTag');
                const stickers = document.querySelectorAll('.bg-chu');

                let progress = rawZoom - chuStart;
                let finalChuScale = progress * 0.2; 
                let rot = progress * 2; 
                let chuOpacity = 1;
                
                if (rawZoom > chuExitStart) {
                    let extraSpeed = rawZoom - chuExitStart;
                    finalChuScale += extraSpeed * 1.5; 
                    rot += extraSpeed * 10; 
                    chuOpacity = Math.max(0, 1 - (extraSpeed / 15)); 
                } else {
                    chuOpacity = Math.min(1, progress / 5);
                }

                if (chuTag) {
                    chuTag.style.opacity = chuOpacity;
                    chuTag.style.transform = `translate(-50%, -50%) scale(${finalChuScale}) rotate(${rot}deg)`;
                }

                stickers.forEach(sticker => {
                    sticker.style.opacity = chuOpacity;
                    const baseRot = parseFloat(sticker.dataset.rotation || 0);
                    sticker.style.transform = `rotate(${baseRot + rot}deg) scale(${finalChuScale * 0.9})`;
                });

                const galleryStart = 95; 
                const endingStart = 155; 
                
                let galleryGlobalOpacity = 1;
                let driftScale = 1;

                if (rawZoom > endingStart) {
                    targetBG = "#000000"; 
                    body.style.backgroundColor = targetBG; 

                    let fadeOutProgress = (rawZoom - endingStart) / 15;
                    galleryGlobalOpacity = Math.max(0, 1 - fadeOutProgress);
                    
                    driftScale = Math.max(0, 1 - ((rawZoom - endingStart) * 0.01)); 

                    if (!endingStickerCreated) { createEndingSticker(); endingStickerCreated = true; }
                    const endChu = document.getElementById('endingSticker');
                    if (endChu) {
                        let endOpacity = Math.min(1, (rawZoom - (endingStart + 5)) / 10);
                        endChu.style.opacity = Math.max(0, endOpacity);
                        endChu.style.transform = `translate(-50%, -50%) scale(1)`; 
                    }
                } else {
                    const endChu = document.getElementById('endingSticker');
                    if(endChu) endChu.style.opacity = 0;
                }

                if (rawZoom > galleryStart) {
                    if (!galleryGenerated) { generateGallery(); galleryGenerated = true; }
                    const galleryProgress = rawZoom - galleryStart;
                    
                    const popInterval = 5; 
                    const imagesToShow = Math.floor(galleryProgress / popInterval);

                    const galleryItems = document.querySelectorAll('.gallery-item');
                    galleryItems.forEach((img, idx) => {
                        if (idx <= imagesToShow) {
                            img.style.opacity = 1 * galleryGlobalOpacity;
                            if (rawZoom > endingStart) {
                                img.style.transform = `scale(${driftScale})`;
                            } else {
                                img.style.transform = `translateY(0px) scale(1)`;
                                if (!img.classList.contains('floating-item')) {
                                    setTimeout(() => img.classList.add('floating-item'), 800);
                                }
                            }
                        } else {
                            img.style.opacity = 0;
                            img.style.transform = `translateY(100px) scale(0.9)`; 
                            img.classList.remove('floating-item');
                        }
                    });
                } else {
                    const galleryItems = document.querySelectorAll('.gallery-item');
                    galleryItems.forEach(img => {
                        img.style.opacity = 0;
                        img.style.transform = `translateY(100px) scale(0.9)`; 
                        img.classList.remove('floating-item');
                    });
                }
            } else {
                const chuTag = document.getElementById('chuTag');
                if(chuTag) chuTag.style.opacity = 0;
                const stickers = document.querySelectorAll('.bg-chu');
                stickers.forEach(s => s.style.opacity = 0);
            }
        } else {
            body.style.backgroundColor = "#051F45";
            if(contentDiv) contentDiv.style.backgroundColor = "transparent";

            if(h1) h1.style.opacity = 1;
            if(p) p.style.opacity = 1;
            if(finalTag) finalTag.style.opacity = 0;
            
            document.querySelectorAll('.bg-eye').forEach(e => e.style.opacity = 0);
            document.querySelectorAll('.bg-chu').forEach(e => e.style.opacity = 0);
            const cTag = document.getElementById('chuTag');
            if(cTag) cTag.style.opacity = 0;
            const eTag = document.getElementById('endingSticker');
            if(eTag) eTag.style.opacity = 0;
        }
    } else {
        if (container) {
            container.style.borderRadius = '0%';
            container.style.overflow = "visible";
        }
    }
    if (container) {
        container.style.transformOrigin = "50% 43%"; 
        container.style.transform = `translate(-50%, -40%) scale(${visualZoom})`;
    }

    requestAnimationFrame(render);
}

requestAnimationFrame(render);

window.addEventListener('resize', updateStopPoint);