import { fetchImages } from './api/api-service';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formRef = document
  .querySelector('#search-form')
  .addEventListener('submit', submitRef);
const inputRef = document.querySelector('input#search-form');
const galleryRef = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');
buttonLoadMore.addEventListener('click', onLoadMore);

let page = null;
let query = '';
let currentPage = 1;

function submitRef(e) {
  e.preventDefault();
  page = 1;
  galleryRef.innerHTML = '';
  const q = e.currentTarget.elements.searchQuery.value;
  fetchImages(q, page).then(res => {
    console.log(res.data);
    page = 2;
    query = q;
    console.log(res.data.total);
    if (res.data.total === 40 && res.data.total < 40) {
      buttonLoadMore.classList.add('hidden');
    }

    if (res.data.total > 40) {
      buttonLoadMore.classList.add('hidden');
    }
    if (res.data.total > 40) {
      buttonLoadMore.classList.remove('hidden');
    }

    if (res.data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      buttonLoadMore.classList.add('hidden');
    } else {
      renderPic(res.data.hits);
      Notiflix.Notify.success(`Hooray! We found ${res.data.totalHits} images.`);
    }
  });

  e.currentTarget.reset();
}

function renderPic(images) {
  const markUpImages = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <a class="gallery__link" href="${largeImageURL}">
        <div class="photo-card">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" title="${tags}"/>
            <div class="info">
              <p class="info-item">
                <b>Лайки</b><br>${likes}
              </p>
              <p class="info-item">
                <b>Перегляди</b><br>${views}
              </p>
              <p class="info-item">
                <b>Коментарі</b><br>${comments}
              </p>
              <p class="info-item">
                <b>Завантаження</b><br>${downloads}
              </p>
            </div>
        </div>
      </a>
      `
    )
    .join('');

  galleryRef.insertAdjacentHTML('beforeend', markUpImages);

  const lightbox = new SimpleLightbox('.gallery__link', {
    elements: '.photo-card img',
    disableScroll: false,
    nav: true,
  });

  lightbox.refresh();
}

function onLoadMore() {
  currentPage += 1;
  fetchImages(query, currentPage)
    .then(({ data }) => {
      const images = data.hits;
      const totalHits = data.totalHits;
      const currentImagesCount = document.querySelectorAll(
        '.gallery .photo-card'
      ).length;

      if (totalHits <= currentImagesCount + images.length) {
        buttonLoadMore.classList.add('hidden');
        Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
      }
      if (totalHits < 40) {
        buttonLoadMore.classList.add('hidden');
      }

      renderPic(images);

      const lightbox = new SimpleLightbox('.gallery__link', {
        elements: '.photo-card img',
        disableScroll: false,
        nav: true,
      });

      lightbox.refresh();

      smoothScrollToNextImages();
    })
    .catch(error => {
      console.log(error);
    });
}

function smoothScrollToNextImages() {
  const cardHeight = document.querySelector('.photo-card').offsetHeight;
  const currentScrollPosition =
    window.pageYOffset || document.documentElement.scrollTop;

  window.scrollTo({
    top: currentScrollPosition + cardHeight * 2,
    behavior: 'smooth',
  });
}
