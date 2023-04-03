import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '34988265-31525e5fda47f62db94d94ddb';

export async function fetchImages(q, page) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page: 40,
      },
    });
    return response;
  } catch (e) {
    console.log('error', e);
  }
}
