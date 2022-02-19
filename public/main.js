// main.js
const updateAlbums = document.querySelectorAll('.update-button');
const deleteAlbums = document.querySelectorAll('.delete-button');
const cancelBtns = document.querySelectorAll('.cancel-button');
const saveBtns = document.querySelectorAll('.save-button');
const thumbsUpBtns = document.querySelectorAll('.liked-button');
const thumbsDownBtns = document.querySelectorAll('.disliked-button');
const toggleLists = document.querySelectorAll('.toggle-visibility');
const archive = document.getElementById('archive-button');
const archiveContainer = document.querySelector('#archive ul');
const addAlbum = document.getElementById('add-album-button');

addAlbum.addEventListener('click', function (e) {
    e.preventDefault();
    const artist = document.querySelector('form.add-album input[name="name"]');
    const album = document.querySelector('form.add-album input[name="album"]');
    console.log(artist.value, album.value);

    if ('' === artist.value || '' === album.value) {
        alert('Please fill out both artist and album name.');
        return;
    }

    fetch('/add-album', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: artist.value,
            album: album.value
        })
    })
        .then(res => {
            if (res.ok) return res.json();
        })
        .then(data => {
            console.log(data);
            window.location.reload();
        });
});

Array.from(toggleLists).map((toggleList) => {
    toggleList.addEventListener('click', (e) => {
        console.log(e);
        const albums = e.target.closest('ul').querySelectorAll(".album:not(.album-heading)");
        e.target.classList.add('hide');
        if (e.target.classList.contains('show-button')) {
            e.target.parentElement.querySelector('.hide-button').classList.remove('hide');
            albums.forEach(
                function (el) {
                    el.classList.add('hide');
                }
            );
        } else {
            e.target.parentElement.querySelector('.show-button').classList.remove('hide');
            albums.forEach(
                function (el) {
                    el.classList.remove('hide');
                }
            );
        }

    });
});

const toggleAlbumEdit = (btn) => {
    const editAlbum = btn.parentElement.querySelector('.edit-album');
    const readAlbum = btn.parentElement.querySelector('.read-album');
    const liked = btn.parentElement.querySelector('.liked-button');
    const disliked = btn.parentElement.querySelector('.disliked-button');
    editAlbum.classList.toggle('hide');
    readAlbum.classList.toggle('hide');
    liked.classList.toggle('hide');
    disliked.classList.toggle('hide');
};

Array.from(cancelBtns).map((btn) => {
    btn.addEventListener('click', (e) => {
        const updateBtn = btn.parentElement.parentElement.querySelector('.update-button');
        const deleteBtn = btn.parentElement.parentElement.querySelector('.delete-button');
        updateBtn.classList.remove('hide');
        deleteBtn.classList.remove('hide');
        toggleAlbumEdit(btn.parentElement);
    });
});

Array.from(updateAlbums).map((btn) => {
    btn.addEventListener('click', (e) => {
        const deleteBtn = btn.parentElement.querySelector('.delete-button');
        toggleAlbumEdit(btn);
        btn.classList.add('hide');
        deleteBtn.classList.add('hide');
    });
});

Array.from(deleteAlbums).map((album) => {
    album.addEventListener('click', (e) => {
        result = window.confirm(`Are you sure you want to delete "${e.target.dataset.album}?"`);
        if (!result) {
            return;
        }
        fetch('/albums', {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'album-id': e.target.dataset.id,
            })
        })
            .then(res => {
                if (res.ok) return res.json();
            })
            .then(data => {
                console.log(data);
                window.location.reload();
            });
    });
});

Array.from(thumbsUpBtns).map((btn) => {
    btn.addEventListener('click', (e) => {
        const isLiked = e.target.classList.contains('is-liked');
        const status = isLiked ? 'none' : 'liked';
        fetch('/albums', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'album-id': e.target.dataset.id,
                'status': status,
            })
        })
            .then(res => {
                if (res.ok) return res.json();
            })
            .then(data => {
                console.log(data);
                window.location.reload();
            });
    });
});

Array.from(thumbsDownBtns).map((btn) => {
    btn.addEventListener('click', (e) => {
        const isDisliked = e.target.classList.contains('is-disliked');
        const status = isDisliked ? 'none' : 'disliked';
        fetch('/albums', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'album-id': e.target.dataset.id,
                'status': status,
            })
        })
            .then(res => {
                if (res.ok) return res.json();
            })
            .then(data => {
                console.log(data);
                window.location.reload();
            });
    });
});

if (null !== archive) {
    archive.addEventListener('click', function (e) {
        console.log('you clicked the archive button');
        result = window.confirm(`Are you sure you want to archive this list? You will not be able to make anymore changes to it.`);
        if (!result) {
            return;
        }
        fetch('/archive', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: ''
        })
            .then(res => {
                if (res.ok) return res.json();
            })
            .then(data => {
                console.log(data);
                window.location.reload();
            });
    });
}


archiveContainer.addEventListener('click', function (e) {
    if (e.target.tagName !== 'BUTTON') {
        return;
    }

    fetch('/get-archive', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            'date': e.target.dataset.id,
        })
    });
});