// Hanapin ang Ulo element sa HTML
const head = document.getElementById('floatingHead');

// Makinig sa Scroll Event
window.addEventListener('scroll', () => {
    // Kunin kung nasaan na ang scroll
    const scrollY = window.scrollY;

    // --- ANIMATION LOGIC ---
    // scrollY * 0.8  -> Bilis ng angat (Mabilis)
    // 200            -> Maximum height na iaangat (para di lumipad)
    let moveUp = Math.min(scrollY * 0.8, 200);
    
    // Siguraduhin na nahanap yung head bago galawin
    if (head) {
        head.style.transform = `translateY(-${moveUp}px)`;
    }
});