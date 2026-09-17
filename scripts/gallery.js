import { galleryImages } from './data/gallery-images.js';
import { architectureImages, natureImages, travelImages, peopleImages, objectsImages } from './data/image-categories.js';
import { renderMobileMenu } from './utils/mobileMenu.js';

const filterContainer = document.querySelector('.gallery-filter-container');
const galleryGrid = document.querySelector('.js-gallery-grid');

const lightbox = document.querySelector('.js-lightbox');
const lightboxImage = document.querySelector('.js-lightbox-image');
const lightboxTitle = document.querySelector('.js-lightbox-title');
const lightboxCategory = document.querySelector('.js-lightbox-category');
const lightboxCounter = document.querySelector('.js-lightbox-counter');
const lightboxImageContainer = document.querySelector('.lightbox-image-container');

const backToTop = document.querySelector('.js-back-to-top');

let currentGallery = galleryImages;
let currentIndex = 0;
let lightboxRequestId = 0;
const preloadedImages = new Map();

const lightboxPrevious = document.querySelector('.js-lightbox-previous');
const lightboxNext = document.querySelector('.js-lightbox-next');
const lightboxClose = document.querySelector('.js-lightbox-close');

generateHtml(galleryImages); //default gallery image generation when the page loads
selectcategories(); //stores all the images in a new individual array based on categories

renderMobileMenu();//this function renders mobile menu of the page for mobile devices


/* This function loops through the gallery data array, select images based on categories and then stores them in new category data arrays*/
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

/* This filter eventlistener uses event & target to get the clicked filter/category. Then reassigns the currentGallery to the clicked category and generates the Html based on it*/
filterContainer.addEventListener('click', (e) => {
    const clickedFilter = e.target; 
    const clickedCategory = clickedFilter.innerText;

    toggleActiveClass(clickedFilter); //toggles the active class status to the clicked filter

    if (clickedCategory === "Nature") {
        currentGallery = natureImages;
        generateHtml(currentGallery); //only nature category images are generated and displayed on the page
    } else if (clickedCategory === "People") {
        currentGallery = peopleImages;
        generateHtml(currentGallery); //only people category images are generated and displayed on the page
    } else if (clickedCategory === "Architecture") {
        currentGallery = architectureImages;
        generateHtml(currentGallery); //only architecture category images are generated and displayed on the page
    } else if (clickedCategory === "Travel") {
        currentGallery = travelImages;
        generateHtml(currentGallery); //only travel category images are generated and displayed on the page
    } else if (clickedCategory === "Objects") {
        currentGallery = objectsImages;
        generateHtml(currentGallery); //only object category images are generated and displayed on the page
    } else if (clickedCategory === "All"){
        currentGallery = galleryImages;
        generateHtml(currentGallery); //back to default general gallery images
    }
});

/* gets the id of the clicked image, returns it, and opens the lighbox with the clicked image */
galleryGrid.addEventListener('click', (e) => {

    const clickedCard = e.target.closest('.gallery-card'); //gets the image card that was clicked

    if (!clickedCard) return; //function returns if the clicked space in the gallery grid was not an image card

    const clickedImage = clickedCard.querySelector('.gallery-image'); //gets the image in the clicked card

    const imageId = Number(clickedImage.dataset.id); //returns the id of the clicked image

    const selectedImage = currentGallery.find((image) => {
        return image.id === imageId;
    }); //finds the image in the current gallery array and returns it if image id match

    if (!selectedImage) return; //function returns if image not found

    openLightbox(selectedImage); //opens the lightbox with the clicked image
});

function toggleActiveClass(clickedFilter) {
    document.querySelectorAll('.js-filter-button').forEach((filterButton) => {
        filterButton.classList.remove('active');
        if (clickedFilter === filterButton) {
            clickedFilter.classList.add('active');
        }
    });
}; //loops throught all the filter buttons and removes the active class, then adds it to the clciked filter button

/* This function generates the gallery images based on the current category passed as a parameter*/
function generateHtml(category) {
    let html = "";
    
    //loops through the current gallery category array and generates an html for each image
    category.forEach((categoryImage, index) => {
        const {id, category, title, thumbUrl, alt, aspect} = categoryImage;
        html += `
        <figure class="gallery-card ${aspect} is-loading">
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

    galleryGrid.innerHTML = html; //appends the generated html to the gallery grid


    /* Loading states for each image in the gallery */
    const galleryCards = galleryGrid.querySelectorAll('.gallery-card');

    //checks each image; is it loading?, did it throw an error?, has it finished loading?, and performs an action based on the current state
    galleryCards.forEach((card) => {

        const image = card.querySelector('.gallery-image');

        image.addEventListener('load', () => {
            card.classList.remove('is-loading');
            card.classList.add('is-loaded');
        });

        image.addEventListener('error', () => {
            card.classList.remove('is-loading');
            card.classList.add('is-error');
        });

        if (image.complete) {

            if (image.naturalWidth > 0) {
                card.classList.remove('is-loading');
                card.classList.add('is-loaded');
            }
        }

    });
};


function openLightbox(image) {

    currentIndex = currentGallery.findIndex((galleryImage) => {
        return galleryImage.id === image.id;
    }); //using the image id we got from the event listener in the gallery grid to find the index of the clicked image

    showLightboxImage(); //dislays the image

    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.classList.add('is-open');
    
    document.body.classList.add('lightbox-open');
};

async function showLightboxImage() {

    const image = currentGallery[currentIndex];

    if (!image) return; //return if there's not image for the current index

    const requestId = ++lightboxRequestId; //request id to know which image we're currently on during lightbox navigation

    //removes error message immediately after navigating from it
    lightboxImageContainer.classList.remove('is-error');
    lightboxImageContainer.classList.add('is-loading');

    // Show loading state immediately
    lightboxImageContainer.classList.add('is-loading');

    // Remove the previously displayed image
    lightboxImage.removeAttribute('src');

    lightboxImage.alt = image.alt;

    lightboxTitle.textContent = image.title;
    lightboxCategory.textContent = image.category.toUpperCase();

    lightboxCounter.textContent =
        `${String(currentIndex + 1).padStart(2, '0')} / ${String(currentGallery.length).padStart(2, '0')}`;

    updateNavigationButtons();

    preloadSurroundingImages(); //to avoid long loading times when navigating the lightbox

    try {

        await preloadImage(image);

        // Ignore this image if the user has already navigated elsewhere
        if (requestId !== lightboxRequestId) return;

        lightboxImage.src = image.fullUrl;

        lightboxImageContainer.classList.remove('is-loading');

    } catch (error) {

        if (requestId !== lightboxRequestId) return;

        lightboxImageContainer.classList.remove('is-loading');
        lightboxImageContainer.classList.add('is-error');

        console.error('Failed to load image:', error);
    }
}

function preloadSurroundingImages() {

    const previousImage = currentGallery[currentIndex - 1];
    const nextImage = currentGallery[currentIndex + 1];

    preloadImage(previousImage);
    preloadImage(nextImage);
}

function preloadImage(image) {

    //Ignores if there's no image or full image url
    if (!image || !image.fullUrl) return;

    if (preloadedImages.has(image.fullUrl)) {
        return preloadedImages.get(image.fullUrl);
    }

    const imagePromise = new Promise((resolve, reject) => {

        const preloader = new Image();

        preloader.onload = () => resolve(preloader);
        preloader.onerror = reject;

        preloader.src = image.fullUrl;
    });

    preloadedImages.set(image.fullUrl, imagePromise);

    return imagePromise;
}

lightboxNext.addEventListener('click', () => {

    if (currentIndex >= currentGallery.length - 1) return; //terminates when the current index exceeds the length of available images

    currentIndex++;

    showLightboxImage();
});

lightboxPrevious.addEventListener('click', () => {

    if (currentIndex <= 0) return; //terminates when the current index is less than zero. i.e index starts from 0.

    currentIndex--;

    showLightboxImage();
});

function updateNavigationButtons() {

    lightboxPrevious.disabled = currentIndex === 0; //disables the previous nav button when on the first image

    lightboxNext.disabled = currentIndex === currentGallery.length - 1; //disables the next nav button when on the last image
};

lightboxClose.addEventListener('click', () => {
    closeLightbox();
});

lightbox.addEventListener('click', (e) => {

    if (e.target === lightbox) {
        closeLightbox();
    }

});

/* Keyboard support for lightbox navigation */
document.addEventListener('keydown', (e) => {

    //Ignores if lightbox is not open
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

/* Closes the lightbox view */
function closeLightbox() {

    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.classList.remove('is-open');

    document.body.classList.remove('lightbox-open');
}

/* Controls back to top arrow visibility */

window.addEventListener('scroll', () => {

    if (window.scrollY > 150) {
        backToTop.classList.add('is-visible');
    } else {
        backToTop.classList.remove('is-visible');
    }

});