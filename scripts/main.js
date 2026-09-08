import { galleryImages } from './data/gallery-images.js';
import { featuredImages } from './data/featured-images.js';
import { formatNumber } from './utils/numberformatter.js';
import { renderMobileMenu } from './utils/mobileMenu.js';

let currentIndex = 0;

selectFeaturedImages(); // selects featured images and stores them in an array when the JS loads
preloadImages(); // preloads the featured images when the JS loads

// this function loops through the general array to select and add the featured images to their data array.
function selectFeaturedImages () {
  galleryImages.forEach((galleryImage) => {
    const {category, title, year, thumbUrl, alt, aspect} = galleryImage;

    if (aspect === "wide-cinematic") {
        featuredImages.push({
            category: `${category}`,
            title: `${title}`,
            year: `${year}`,
            thumbUrl: `${thumbUrl}`,
            alt: `${alt}`
        });
    }
  });
}

// this function preloads the images in the featured images array 
function preloadImages() {
  featuredImages.forEach((image) => {
    const img = new Image();
    img.src = image.thumbUrl;
  });
}

//this function renders mobile menu of the page for mobile devices
renderMobileMenu();

// this event listener performs navigation action. It checks which nav button was clicked and calls the appropriate function for each.
document.querySelector('.js-nav-control-container').addEventListener('click', (e) => {
  const clicked = e.target;

  if (clicked === document.querySelector('.js-back-arrow')) {
    previousSlide();
  } else if (clicked === document.querySelector('.js-forward-arrow')) {
    nextSlide();
  }
});

// another event listener for navigation keyboard support
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    previousSlide();
  } else if (event.key === "ArrowRight") {
    nextSlide();
  }
});

/* this function increases the current index of the image with a loop back to the start when it reaches the end. It asigns active image to the current index in the featured image array and updates the function with the active image. */
function nextSlide () {
  currentIndex = (currentIndex + 1) % featuredImages.length;
  const activeImage = featuredImages[currentIndex];
  updateFeaturedImage(activeImage);
}

/* this function decreases the current index of the image with a loop back to the start when it reaches the end. It asigns active image to the current index in the featured image array and updates the function with the active image. */
function previousSlide() {
  currentIndex = (currentIndex - 1 + featuredImages.length) % featuredImages.length;
  const activeImage = featuredImages[currentIndex];
  updateFeaturedImage(activeImage);
}

/* this is the function that updates the image. It accepts the activeIamge as a parameter and updates the image to the active one with the current index. After updating new the image, it removes the old image.  */
function updateFeaturedImage(activeImage) {
  const container = document.querySelector('.js-featured-image-container');

  const newImage = new Image();

  newImage.src = activeImage.thumbUrl;
  newImage.alt = activeImage.alt;
  newImage.classList.add('new-image');
  newImage.style = `z-index: 1000`;

  //adds the transition as the next image loads
  newImage.onload = () => {
    container.appendChild(newImage);

    requestAnimationFrame(() => {
      newImage.classList.add('visible');
    });
  };

  //this checks if the image has changed and deletes the old image
  newImage.addEventListener('transitionend', () => {
    const oldImages = container.querySelectorAll('.new-image');

    oldImages.forEach((image) => {
      if (image !== newImage) {
        image.remove();
      }
    });
  });

  updateMetaData(activeImage);
};

/* this function updates the metadata with the data of the active image displayed */
function updateMetaData(activeImage) {
  let html = '';
  
  html += `
    <p class="metadata-counter">${formatNumber(currentIndex)} / ${featuredImages.length}</p>
    <p class="metadata-title">${activeImage.title}</p>
    <p class="metadata-category">${activeImage.category} · ${activeImage.year}</p>
  `;

  document.querySelector('.js-metadata-card').innerHTML = html;
};