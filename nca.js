const toggleButton = document.getElementById('dark-mode-toggle');
const body = document.body;
const menuToggle = document.getElementById('menu-toggle');
const closeMenu = document.getElementById('close-menu');
const sidebar = document.querySelector('.sidebar');

// Modal elements
const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-image');
const closeBtn = document.getElementsByClassName('close')[0];

// Zoom elements and variables
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
let zoomLevel = 1; // Start at 1x (original size)
const zoomStep = 0.2; // Zoom in/out by 20% each step
const minZoom = 0.5; // Minimum zoom level (50%)
const maxZoom = 5; // Maximum zoom level (500%)

// Drag variables
let isDragging = false;
let startX, startY;
let offsetX = 0, offsetY = 0;

// Pinch zoom variables
let initialDistance = 0;
let initialZoom = 1;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
}

// Dark mode toggle
toggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    // Save the theme preference
    const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
        document.getElementById("dark-mode-toggle").innerHTML = "☀️";
    } else {
        document.getElementById("dark-mode-toggle").innerHTML = "🌑";
    }
});

// Toggle sidebar on mobile
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

closeMenu.addEventListener('click', () => {
    sidebar.classList.remove('open');
});

// Close sidebar when a link is clicked (optional, for better UX)
const sidebarLinks = sidebar.querySelectorAll('a');
sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });
});


// Slideshow functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

// Auto-slide every 3 seconds (optional)
setInterval(nextSlide, 3000);

// Image click to open modal (with zoom and drag reset)
const images = document.querySelectorAll('.photo-collage img');
images.forEach(img => {
    img.addEventListener('click', function() {
        modal.style.display = 'block';
        modalImg.src = this.src;
        modalImg.alt = this.alt;
        // Reset zoom to 1x and offsets to 0 when opening a new image
        zoomLevel = 1;
        offsetX = 0;
        offsetY = 0;
        updateZoom();
    });
});

// Close modal when close button is clicked
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close modal when clicking outside the image
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Zoom in button
zoomInBtn.addEventListener('click', () => {
    if (zoomLevel < maxZoom) {
        zoomLevel += zoomStep;
        updateZoom();
    }
});

// Zoom out button
zoomOutBtn.addEventListener('click', () => {
    if (zoomLevel > minZoom) {
        zoomLevel -= zoomStep;
        // Center the image if zoomed out to 1x or below
        if (zoomLevel <= 1) {
            offsetX = 0;
            offsetY = 0;
        }
        updateZoom();
    }
});

// Mouse wheel zoom (only when modal is open)
modal.addEventListener('wheel', (event) => {
    event.preventDefault(); // Prevent page scroll
    if (event.deltaY < 0 && zoomLevel < maxZoom) {
        // Scroll up: zoom in
        zoomLevel += zoomStep;
        updateZoom();
    } else if (event.deltaY > 0 && zoomLevel > minZoom) {
        // Scroll down: zoom out
        zoomLevel -= zoomStep;
        // Center the image if zoomed out to 1x or below
        if (zoomLevel <= 1) {
            offsetX = 0;
            offsetY = 0;
        }
        updateZoom();
    }
});

// Drag functionality for the modal image (only when zoomed in beyond 1x)
modalImg.addEventListener('mousedown', (e) => {
    if (zoomLevel > 1) {
        isDragging = true;
        startX = e.clientX - offsetX;
        startY = e.clientY - offsetY;
        modalImg.style.cursor = 'grabbing';
        e.preventDefault(); // Prevent default drag behavior
    }
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        offsetX = e.clientX - startX;
        offsetY = e.clientY - startY;
        updateZoom();
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    modalImg.style.cursor = zoomLevel > 1 ? 'grab' : 'default';
});

// Pinch zoom functionality for touch devices
modalImg.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
        e.preventDefault(); // Prevent default pinch behavior
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = getDistance(touch1, touch2);
        initialZoom = zoomLevel;
    }
});

modalImg.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = getDistance(touch1, touch2);
        const scale = currentDistance / initialDistance;
        zoomLevel = initialZoom * scale;
        zoomLevel = Math.max(minZoom, Math.min(maxZoom, zoomLevel));
        // Center the image if zoomed out to 1x or below
        if (zoomLevel <= 1) {
            offsetX = 0;
            offsetY = 0;
        }
        updateZoom();
    }
});

// Helper function to calculate distance between two touches
function getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

// Set initial cursor based on zoom level
function updateCursor() {
    modalImg.style.cursor = zoomLevel > 1 ? 'grab' : 'default';
}

// Function to apply zoom and drag to the modal image
function updateZoom() {
    modalImg.style.transform = `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) scale(${zoomLevel})`;
    updateCursor(); // Update cursor after zoom change
}

function redirect(event) {
    event.preventDefault();
    window.location.href = 'index.html'; // Redirect on successful login
}

function mainpagebutton() {
    window.location.href = 'rates.html'; // Redirect on successful login
}