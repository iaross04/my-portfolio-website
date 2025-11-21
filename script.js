const head = document.getElementById('floatingHead');
const container = document.querySelector('.character-container');
const body = document.body;
const h1 = document.querySelector('h2');
const p = document.querySelector('.subtitle');
const finalTag = document.getElementById('finalTag');

// --- SETTINGS ---
let stopPoint = 200;
const scrollSpeed = 0.5;
const zoomSpeed = 0.008;
const maxScroll = 130000; // Increased scroll for the cinematic exit duration

// LIMITS:
const maxZoomLevel = 30; 
const maxTagScale = 4.0; 

// State flags
let eyesGenerated = false;
let chuStickersGenerated = false;
let chuTagCreated = false;
let galleryGenerated = false;
let endingStickerCreated = false;

// --- ADD CSS ANIMATIONS ---
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
`;
document.head.appendChild(styleSheet);

// --- 1. GENERATE SCARY EYES (Phase 3) ---
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
        eye.src = 'eye.png';
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

// --- 2. GENERATE CHU STICKERS (Phase 4) ---
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
        sticker.src = 'chu.png'; 
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
        sticker.style.transition = 'transform 0.1s linear'; 
        document.body.appendChild(sticker);
    }
}

// --- 3. GENERATE GALLERY (Phase 5) ---
function generateGallery() {
    const isMobile = window.innerWidth < 768;
    
    for (let i = 0; i < 10; i++) {
        const img = document.createElement('img');
        img.src = `chuchu${i+1}.jpg`; // Using .jpg
        img.className = 'gallery-item'; 
        
        let l, t, w, h;
        if (!isMobile) {
            // Desktop: 2 Rows x 5 Cols
            const col = i % 5; 
            const row = Math.floor(i / 5); 
            w = 20; h = 50;
            l = col * 20; t = row * 50;
        } else {
            // Mobile: 5 Rows x 2 Cols
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
        
        // Initial Entrance Position (Slide Up)
        img.style.transform = 'translateY(100px) scale(0.9)'; 
        img.style.transition = 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.8s ease';
        img.style.border = '1px solid rgba(255,255,255,0.2)';

        // --- B&W LOGIC FOR EVENS (2, 4, 6, 8, 10) ---
        // (i + 1) gives the file number.
        // If (number % 2 === 0), it's even.
        let baseFilter = '';
        if ((i + 1) % 2 === 0) {
            baseFilter = 'grayscale(100%) contrast(120%) brightness(90%)'; // Noir Style
        } else {
            baseFilter = 'none';
        }
        img.style.filter = baseFilter;
        img.dataset.baseFilter = baseFilter; // Store it for later use in animation

        document.body.appendChild(img);
    }
}

function createChuTag() {
    const img = document.createElement('img');
    img.src = 'chu_tag.png';
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
    img.src = 'chu.png';
    img.id = 'endingSticker';
    img.style.position = 'fixed';
    img.style.top = '50%';
    img.style.left = '50%';
    img.style.transform = 'translate(-50%, -50%) scale(0)';
    img.style.width = '150px'; 
    img.style.zIndex = '200'; 
    img.style.opacity = 0;
    img.style.pointerEvents = 'none';
    img.style.transition = 'opacity 1s ease, transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    document.body.appendChild(img);
}

function updateStopPoint() {
    stopPoint = window.innerWidth < 768 ? 50 : 200;
}
updateStopPoint();

let currentScroll = 0;

function updateAnimation(delta) {
    currentScroll += delta * scrollSpeed;
    if (currentScroll < 0) currentScroll = 0;
    if (currentScroll > maxScroll) currentScroll = maxScroll;

    // --- PHASE 1: HEAD LIFT ---
    let headY = Math.min(currentScroll, stopPoint);
    if (head) head.style.transform = `translateY(-${headY}px)`;

    // --- PHASE 2: ZOOM SPIRAL ---
    let rawZoom = 1;
    let visualZoom = 1;

    if (currentScroll > stopPoint) {
        const extraScroll = currentScroll - stopPoint;
        rawZoom = 1 + (extraScroll * zoomSpeed); 
        visualZoom = Math.min(rawZoom, maxZoomLevel);

        if (visualZoom > 3) head.style.opacity = Math.max(0, 1 - (visualZoom - 3)); 
        else head.style.opacity = 1;

        if (container) {
            let radius = 0;
            if (visualZoom > 1.1) radius = Math.min(50, (visualZoom - 1.1) * 50);
            if (visualZoom > 3.5) radius = Math.max(0, 50 - ((visualZoom - 3.5) * 25));
            container.style.borderRadius = `${radius}%`;
            container.style.overflow = (radius > 0) ? "hidden" : "visible";
        }
        
        const triggerPoint = 15;
        
        if (rawZoom >= triggerPoint) {
            let targetBG = "#A5678E"; 

            if(h1) h1.style.opacity = 0;
            if(p) p.style.opacity = 0;
            setTimeout(() => { if(container) container.style.opacity = 0; }, 100); 

            // --- PHASE 3: CHAOS ---
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

            // --- PHASE 4: CHU PHASE ---
            const chuStart = 48;
            const chuExitStart = 75; 
            
            if (rawZoom > chuStart) {
                if (!chuTagCreated) { createChuTag(); chuTagCreated = true; }
                if (!chuStickersGenerated) { generateChuStickers(); chuStickersGenerated = true; }
                
                const chuTag = document.getElementById('chuTag');
                const stickers = document.querySelectorAll('.bg-chu');

                let chuOpacity = Math.min(1, (rawZoom - chuStart) / 5);
                let chuScaleBase = (rawZoom - chuStart) * 0.2;
                let finalChuScale = chuScaleBase;
                
                if (rawZoom > chuExitStart) {
                    const exitProgress = rawZoom - chuExitStart;
                    finalChuScale += exitProgress * 1.5; 
                    chuOpacity = Math.max(0, 1 - (exitProgress / 8)); 
                } else {
                    finalChuScale = Math.min(finalChuScale, maxTagScale);
                }

                if (chuTag) {
                    chuTag.style.opacity = chuOpacity;
                    let exitRot = (rawZoom > chuExitStart) ? (rawZoom - chuExitStart) * 10 : 0;
                    chuTag.style.transform = `translate(-50%, -50%) scale(${finalChuScale}) rotate(${exitRot}deg)`;
                }

                stickers.forEach(sticker => {
                    sticker.style.opacity = chuOpacity;
                    const rot = parseFloat(sticker.dataset.rotation || 0);
                    let stickerScale = finalChuScale * 0.9;
                    sticker.style.transform = `rotate(${rot}deg) scale(${stickerScale})`;
                });

                // --- PHASE 5: GALLERY + CINEMATIC EXIT ---
                const galleryStart = 78; 
                const endingStart = 115; // When the cinematic exit begins
                
                let galleryGlobalOpacity = 1;
                let blurAmount = 0;
                let driftScale = 1;

                if (rawZoom > endingStart) {
                    // PHASE 6: ENDING TRANSITION
                    targetBG = "#000000"; 
                    let fadeOutProgress = (rawZoom - endingStart) / 15; // Slower fade for cinematic feel
                    
                    galleryGlobalOpacity = Math.max(0, 1 - fadeOutProgress);
                    
                    // CINEMATIC EFFECT: Blur + Drift Away
                    blurAmount = Math.min(20, (rawZoom - endingStart) * 0.5);
                    driftScale = Math.max(0, 1 - ((rawZoom - endingStart) * 0.02)); 

                    if (!endingStickerCreated) { createEndingSticker(); endingStickerCreated = true; }
                    const endChu = document.getElementById('endingSticker');
                    if (endChu) {
                        // Delay the sticker appearance slightly so the gallery dissolves first
                        let endOpacity = Math.min(1, (rawZoom - (endingStart + 5)) / 10);
                        endChu.style.opacity = Math.max(0, endOpacity);
                        endChu.style.transform = `translate(-50%, -50%) scale(1)`; 
                    }
                } else {
                     const endChu = document.getElementById('endingSticker');
                     if(endChu) endChu.style.opacity = 0;
                }

                body.style.backgroundColor = targetBG;

                if (rawZoom > galleryStart) {
                    if (!galleryGenerated) { generateGallery(); galleryGenerated = true; }
                    
                    const galleryProgress = rawZoom - galleryStart;
                    const popInterval = 2; 
                    const imagesToShow = Math.floor(galleryProgress / popInterval);

                    const galleryItems = document.querySelectorAll('.gallery-item');
                    galleryItems.forEach((img, idx) => {
                        if (idx <= imagesToShow) {
                            // Show Image
                            img.style.opacity = 1 * galleryGlobalOpacity;
                            
                            // Apply Cinematic Exit Transforms
                            if (rawZoom > endingStart) {
                                // During Exit: Apply Blur & Drift
                                const baseFilter = img.dataset.baseFilter || 'none';
                                img.style.filter = `blur(${blurAmount}px) ${baseFilter}`;
                                img.style.transform = `scale(${driftScale})`;
                                img.style.transition = 'none'; // Disable transition for smooth animation
                            } else {
                                // Normal Gallery Mode
                                img.style.transform = `translateY(0px) scale(1)`;
                                img.style.filter = img.dataset.baseFilter;
                                
                                // Add float animation if not exiting
                                if (!img.classList.contains('floating-item')) {
                                    setTimeout(() => img.classList.add('floating-item'), 800);
                                }
                            }

                        } else {
                            // Hidden (Before Pop)
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
            // Reset All
            if(container) {
                container.style.transition = "opacity 0s";
                container.style.opacity = 1;
            }
            body.style.backgroundColor = "#051F45"; 
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
}

window.addEventListener('wheel', (e) => { updateAnimation(e.deltaY); });
window.addEventListener('touchmove', (e) => {
    const currentY = e.touches[0].clientY;
    updateAnimation((startY - currentY) * 0.4);
    startY = currentY;
});
window.addEventListener('resize', updateStopPoint);