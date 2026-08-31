import { galleryImages } from './data/gallery-images.js';
import { architectureImages, natureImages, travelImages, peopleImages, objectsImages } from './data/image-categories.js';

const filterContainer = document.querySelector('.gallery-filter-container');
const galleryGrid = document.querySelector('.js-gallery-grid');

const lightbox = document.querySelector('.js-lightbox');
const lightboxImage = document.querySelector('.js-lightbox-image');
const lightboxTitle = document.querySelector('.js-lightbox-title');
const lightboxCategory = document.querySelector('.js-lightbox-category');
const lightboxCounter = document.querySelector('.js-lightbox-counter');

let currentGallery = galleryImages;
let currentIndex = 0;
const preloadedImages = new Map();

const lightboxPrevious = document.querySelector('.js-lightbox-previous');
const lightboxNext = document.querySelector('.js-lightbox-next');
const lightboxClose = document.querySelector('.js-lightbox-close');

generateHtml(galleryImages);
selectcategories();

function selectcategories() {
    galleryImages.forEach((galleryImage) => {

        if (galleryImage.category === "Architecture") {
            architectureImages.push(galleryImage);

        } else if (galleryImage.category === "Nature") {
            natureImages.push(galleryImage);

        } else if (galleryImage.category === "Travel") {
            travelImages.push(galleryImage);

        } else if (galleryImage.category === "People") {
            peopleImages.push(galleryImage);

        } else if (galleryImage.category === "Objects") {
            objectsImages.push(galleryImage);
        }

    });
};

filterContainer.addEventListener('click', (e) => {
    const clickedFilter = e.target;
    const clickedCategory = clickedFilter.innerText;

    toggleActiveClass(clickedFilter);

    if (clickedCategory === "Nature") {
        currentGallery = natureImages;
        generateHtml(currentGallery); 
    } else if (clickedCategory === "People") {
        currentGallery = peopleImages;
        generateHtml(currentGallery);
    } else if (clickedCategory === "Architecture") {
        currentGallery = architectureImages;
        generateHtml(currentGallery);
    } else if (clickedCategory === "Travel") {
        currentGallery = travelImages;
        generateHtml(currentGallery);
    } else if (clickedCategory === "Objects") {
        currentGallery = objectsImages;
        generateHtml(currentGallery);
    } else {
        currentGallery = galleryImages;
        generateHtml(currentGallery);
    }
});

galleryGrid.addEventListener('click', (e) => {

    const clickedCard = e.target.closest('.gallery-card');

    if (!clickedCard) return;

    const clickedImage = clickedCard.querySelector('.gallery-image');

    const imageId = Number(clickedImage.dataset.id);

    const selectedImage = currentGallery.find((image) => {
        return image.id === imageId;
    });

    if (!selectedImage) return;

    openLightbox(selectedImage);
});

function toggleActiveClass(clickedFilter) {
    document.querySelectorAll('.js-filter-button').forEach((filterButton) => {
        filterButton.classList.remove('active');
        if (clickedFilter === filterButton) {
            clickedFilter.classList.add('active');
        }
    });
};

function generateHtml(category) {
    let html = "";
    
    category.forEach((categoryImage, index) => {
        const {id, category, title, thumbUrl, alt, aspect} = categoryImage;
        html += `
        <figure class="gallery-card ${aspect}">
            <img
                src="${thumbUrl}"
                alt="${alt}"
                data-id="${id}"
                class="gallery-image"
                loading="${index < 6 ? 'eager' : 'lazy'}"
                decoding="async"
            />

            <figcaption class="metadata">
                <p class="metadata-category">${category.toUpperCase()}</p>
                <p class="metadata-title">${title}</p>
            </figcaption>

            <p class="view-link">VIEW ↗</p>
        </figure>`;
    });

    galleryGrid.innerHTML = html;
};

function openLightbox(image) {

    currentIndex = currentGallery.findIndex((galleryImage) => {
        return galleryImage.id === image.id;
    });

    showLightboxImage();

    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.classList.add('is-open');
    
    document.body.classList.add('lightbox-open');
};

function showLightboxImage() {

    const image = currentGallery[currentIndex];

    lightboxImage.src = image.fullUrl;
    lightboxImage.alt = image.alt;

    lightboxTitle.textContent = image.title;
    lightboxCategory.textContent = image.category.toUpperCase();

    lightboxCounter.textContent =
    `${String(currentIndex + 1).padStart(2, '0')} / ${String(currentGallery.length).padStart(2, '0')}`;

    updateNavigationButtons();

    preloadSurroundingImages();
};

function preloadSurroundingImages() {

    const previousImage = currentGallery[currentIndex - 1];
    const nextImage = currentGallery[currentIndex + 1];

    preloadImage(previousImage);
    preloadImage(nextImage);
}

function preloadImage(image) {

    if (!image || !image.fullUrl) return;

    if (preloadedImages.has(image.fullUrl)) return;

    const preloader = new Image();

    preloader.src = image.fullUrl;

    preloadedImages.set(image.fullUrl, preloader);
};

lightboxNext.addEventListener('click', () => {

    if (currentIndex >= currentGallery.length - 1) return;

    currentIndex++;

    showLightboxImage();
});

lightboxPrevious.addEventListener('click', () => {

    if (currentIndex <= 0) return;

    currentIndex--;

    showLightboxImage();
});

function updateNavigationButtons() {

    lightboxPrevious.disabled = currentIndex === 0;

    lightboxNext.disabled = currentIndex === currentGallery.length - 1;
};

lightboxClose.addEventListener('click', () => {
    closeLightbox();
});

lightbox.addEventListener('click', (e) => {

    if (e.target === lightbox) {
        closeLightbox();
    }

});

document.addEventListener('keydown', (e) => {

    if (!lightbox.classList.contains('is-open')) return;

    if (e.key === 'Escape') {
        closeLightbox();
    }

    if (e.key === 'ArrowLeft') {
        lightboxPrevious.click();
    }

    if (e.key === 'ArrowRight') {
        lightboxNext.click();
    }

});

function closeLightbox() {

    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.classList.remove('is-open');

    document.body.classList.remove('lightbox-open');
}