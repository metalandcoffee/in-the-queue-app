/**
 * External dependencies.
 */
import {
  useEffect, useState,
} from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import Head from 'next/head';
import Link from 'next/link';

/**
 * Internal dependencies.
 */
import { server } from '../lib/config';
import List from '../components/List';
import Login from '../components/icons/Login';
import Logout from '../components/icons/Logout';

/**
 * Types.
 */
 import { AlbumProps } from '../components/Album';
 import { Album } from '../models/types';

/**
 * Home Page.
 */
export default function Home() {
  const {
    user, isLoading,
  } = useUser();

  const isLoggedIn: boolean = user && !isLoading ? true : false;

  // Set state.
  const [ albums, setAlbums ] = useState<Album[]>([]);
  const [ artist, setArtist ] = useState('');
  const [ album, setAlbum ] = useState('');
  const [ error, setError ] = useState(false);
  const [ notif, setNotif ] = useState<String>('');

  const onAlbumUpdate = async (): Promise<void> => {
    try {
      const res = await fetch(`${server}/api/albums`);
      const obj = await res.json();

      setAlbums(obj.albums);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    (async () => {
      onAlbumUpdate();
    })();
  },
  []);

  const handleSubmit = async (event: React.MouseEvent) : Promise<void> => {
    event.preventDefault();
    console.log(event);

    // Add new album to database.
    const response = await fetch('/api/add/',
      {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: artist,
          album,
        }),
      });

    // If database update is successful...
    if (response.ok) {
      await onAlbumUpdate();

      // Set notification and expiration.
      setNotif('Album successfully added.');
      setTimeout(function(){
        setNotif('');
      }, 2000);

      // Clear form fields.
      setArtist('');
      setAlbum('');
    } else {
      const resJson = await response.json();
      setError(resJson.message);
    }
  }

  return (
    <div className="container">
      <Head>
        <title>In The Queue</title>
        <meta name="description" content="Track your music listening!" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
      </Head>
      <main className="">
        <header>
        {isLoggedIn ? (
            <Link href="/api/auth/logout" passHref>
              <a title="Logout">
                <Logout />
              </a>
            </Link>
        ) : (
          <Link href="/api/auth/login" passHref>
          <a title="Login">
            <Login />
          </a>
        </Link>
        ) }
          <h1 id="app-name">In The Queue</h1>
          <div></div>
        </header>

        {notif && <div className="notification"><span>{notif}</span></div>}
        {error && <div className="error">{error}</div>}
        {isLoggedIn && (
          <div id="add-album">
            <h2>Add Album</h2>
            <form>
              <input
                className=""
                type="text"
                value={artist}
                placeholder="Enter name..."
                onChange={(e) => setArtist(e.target.value)}
              />
              <input
                className=""
                type="text"
                value={album}
                placeholder="Enter album..."
                onChange={(e) => setAlbum(e.target.value)}
              />
              <button
                className=""
                type="submit"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </form>
          </div>
        )}
        <List
          id="listening"
          heading="Listening to..."
          albums={albums.filter((album) => album.status === 'none')}
          onAlbumUpdate={onAlbumUpdate}
        />
        <List
          id="liked-albums"
          heading="Liked Music"
          albums={albums.filter((album) => album.status === 'liked')}
          onAlbumUpdate={onAlbumUpdate}
        />
        <List
          id="disliked-albums"
          heading="Disliked Music"
          albums={albums.filter((album) => album.status === 'disliked')}
          onAlbumUpdate={onAlbumUpdate}
        />
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}
