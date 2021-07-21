// main.js
const updateAlbums = document.querySelectorAll('.update-button');
const deleteAlbums = document.querySelectorAll('.delete-button');
const cancelBtns = document.querySelectorAll('.cancel-button');
const saveBtns = document.querySelectorAll('.save-button');

const toggleAlbumEdit = (btn) => {
    const editAlbum = btn.parentElement.querySelector('.edit-album');
    const readAlbum = btn.parentElement.querySelector('.read-album');
    editAlbum.classList.toggle('hide');
    readAlbum.classList.toggle('hide');
};


        // fetch('/albums', {
        //     method: 'put',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         name: 'Born of Osiris',
        //         album: 'Angel or Alien',
        //     })
        // })
        // .then(res => {
        //     if (res.ok) return res.json();
        // })
        // .then(response => {
        //     console.log(response);
        // });

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
    album.addEventListener('click', () => {
        fetch('/albums', {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Born of Osiris',
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
