import { galleryImages } from './data/gallery-images.js';
import { architectureImages, natureImages, travelImages, peopleImages, objectsImages } from './data/image-categories.js';

const filterContainer = document.querySelector('.gallery-filter-container');

generateHtml(galleryImages);
selectcategories();

filterContainer.addEventListener('click', (e) => {
    const clickedFilter = e.target;
    const clickedCategory = clickedFilter.innerText;

    toggleActiveClass(clickedFilter);

    if (clickedCategory === "Nature") {
        generateHtml(natureImages); 
    } else if (clickedCategory === "People") {
        generateHtml(peopleImages);
    } else if (clickedCategory === "Architecture") {
        generateHtml(architectureImages);
    } else if (clickedCategory === "Travel") {
        generateHtml(travelImages);
    } else if (clickedCategory === "Objects") {
        generateHtml(objectsImages);
    } else {
        generateHtml(galleryImages);
    }
});

function toggleActiveClass(clickedFilter) {
    document.querySelectorAll('.js-filter-button').forEach((filterButton) => {
        filterButton.classList.remove('active');
    });

    clickedFilter.classList.add('active');
};

function selectcategories () {
  galleryImages.forEach((galleryImage) => {
    const {category, title, year, thumbUrl, alt, aspect} = galleryImage;

    if (category === "Architecture") {
        architectureImages.push({
            category: `${category}`,
            title: `${title}`,
            year: `${year}`,
            thumbUrl: `${thumbUrl}`,
            alt: `${alt}`,
            aspect: `${aspect}`
        });
    } else if (category === "Nature") {
        natureImages.push({
            category: `${category}`,
            title: `${title}`,
            year: `${year}`,
            thumbUrl: `${thumbUrl}`,
            alt: `${alt}`,
            aspect: `${aspect}`
        });
    } else if ( category === "Travel") {
        travelImages.push({
            category: `${category}`,
            title: `${title}`,
            year: `${year}`,
            thumbUrl: `${thumbUrl}`,
            alt: `${alt}`,
            aspect: `${aspect}`
        });
    } else if (category === "People") {
        peopleImages.push({
            category: `${category}`,
            title: `${title}`,
            year: `${year}`,
            thumbUrl: `${thumbUrl}`,
            alt: `${alt}`,
            aspect: `${aspect}`
        });
    } else if (category === "Objects") {
        objectsImages.push({
            category: `${category}`,
            title: `${title}`,
            year: `${year}`,
            thumbUrl: `${thumbUrl}`,
            alt: `${alt}`,
            aspect: `${aspect}`
        });
    }
  });
}

function generateHtml(category) {
    let html = "";
    
    category.forEach((categoryImage, index) => {
        const {category, title, thumbUrl, alt, aspect} = categoryImage;
        html += `
        <figure class="gallery-card ${aspect}">
            <img
                src="${thumbUrl}"
                alt="${alt}"
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

    document.querySelector('.js-gallery-grid').innerHTML = html;
    console.log(html);
};
