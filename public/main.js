// main.js
const updateAlbums   = document.querySelectorAll('.update-button');
const deleteAlbums   = document.querySelectorAll('.delete-button');
const cancelBtns     = document.querySelectorAll('.cancel-button');
const saveBtns       = document.querySelectorAll('.save-button');
const thumbsUpBtns   = document.querySelectorAll('.liked-button');
const thumbsDownBtns = document.querySelectorAll('.disliked-button');

const toggleAlbumEdit = (btn) => {
    const editAlbum = btn.parentElement.querySelector('.edit-album');
    const readAlbum = btn.parentElement.querySelector('.read-album');
    editAlbum.classList.toggle('hide');
    readAlbum.classList.toggle('hide');
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
        if ( ! result ) {
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
