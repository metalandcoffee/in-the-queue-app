/**
 * Main File.
 */

/**
 * Toggle visibility of each album list.
 *
 * @param {Object} e Event.
 */
function toggleVisibility(e) {
  const list = e.target.closest('ul[data-list]');
  const btns = list.querySelectorAll('.toggle-visibility svg');
  const albums = list.querySelectorAll('li:not(.album-heading)');
  if (btns.length === 0 || albums.length === 0) {
    return;
  }
  btns.forEach((btn) => { btn.classList.toggle('hidden'); });
  albums.forEach((album) => { album.classList.toggle('hidden'); });
}

/**
 * Selector/Callback Mappings.
 */
const queryMap = {
  '.toggle-visibility': toggleVisibility,
};

Object.keys(queryMap).forEach((key) => {
  const buttons = document.querySelectorAll(key);
  Array.from(buttons).forEach((button) => {
    button.addEventListener('click', queryMap[key]);
  });
});
