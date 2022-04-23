/**
 * Main File.
 */

/**
 * Fetch handlers.
 */
const httpClient = {
  post: async (url, body) => {
    const response = await fetch(url, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.status);
  },
  delete: async (url, body) => {
    const response = await fetch(url, {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.status);
  },
};

/**
 * Display status message.
 *
 * @param {string} message
 */
function displayMessage(message) {
  document.querySelector('.add-album .alert').innerHTML = message;
}

/**
 * Toggle visibility of each album list.
 *
 * @param {Object} e Event object.
 */
function toggleVisibility(e) {
  const list = e.target.closest('ul[data-list]');
  const btns = list.querySelectorAll('.js-toggle-visibility svg');
  const albums = list.querySelectorAll('li:not(.album-heading)');
  if (btns.length === 0 || albums.length === 0) {
    return;
  }
  btns.forEach((btn) => { btn.classList.toggle('hidden'); });
  albums.forEach((album) => { album.classList.toggle('hidden'); });
}

/**
 * Add new album to current list.
 *
 * @param {Object} e Event object.
 */
async function addNewAlbum(e) {
  e.preventDefault();
  const artist = document.querySelector('form.add-album input[name="name"]');
  const album = document.querySelector('form.add-album input[name="album"]');

  if (artist.value === '' || album.value === '') {
    document.querySelector('.add-album .alert').innerHTML = 'Please fill out both artist and album name.';
    return;
  }

  try {
    await httpClient.post('/add-album', { name: artist.value, album: album.value });
    window.location.reload();
  } catch (error) {
    displayMessage(error);
  }
}

/**
 * Delete selected album from list.
 *
 * @param {Object} e Event object.
 */
async function deleteAlbum(e) {
  const result = window.confirm(`Are you sure you want to delete "${e.target.dataset.album}?"`);
  if (!result) {
    return;
  }

  try {
    const btn = e.target.closest('.album-list-item').querySelector('.js-delete');
    await httpClient.delete('/delete-album', { 'album-id': btn.dataset.id });
    window.location.reload();
  } catch (error) {
    displayMessage(error);
  }
}

/**
 * Show update controls for list item.
 *
 * @param {*} e
 */
function toggleControls(e) {
  const listItem = e.target.closest('.album-list-item');
  listItem.querySelector('.edit-controls').classList.toggle('hidden');
  listItem.querySelector('.album-controls').classList.toggle('hidden');
}

async function setStatus(e) {
  const btn = e.target.closest('button[data-status]');
  const isSet = btn.classList.contains('is-set');
  const status = isSet ? null : btn.dataset.status;

  try {
    await httpClient.post('/toggle-status', { 'album-id': btn.dataset.id, status });
    window.location.reload();
  } catch (error) {
    displayMessage(error);
  }
}

/**
 * Selector/Callback Mappings.
 */
const queryMap = {
  '.js-toggle-visibility': toggleVisibility,
  '#js-add-album': addNewAlbum,
  '.js-delete': deleteAlbum,
  '.js-update': toggleControls,
  '.js-cancel': toggleControls,
  '.js-liked': setStatus,
  '.js-disliked': setStatus,
};

// Attach each callback to each selector via Event Listeners.
Object.keys(queryMap).forEach((key) => {
  const buttons = document.querySelectorAll(key);
  Array.from(buttons).forEach((button) => {
    button.addEventListener('click', queryMap[key]);
  });
});
