import { useEffect } from 'react';
import Head from "next/head";
import Image from "next/image";
import { server } from "../lib/config"
import { useState } from "react";
import List from "../components/List";
import styles from "../styles/Home.module.css";
import banner from "../public/banner.jpeg";

/**
 * Home Page.
 */
export default function Home() {
  // Set state.
  const [albums, setAlbums] = useState([]);
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [error, setError] = useState(false);
  const [notif, setNotif] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${server}/api/albums`);
        const obj = await res.json();
        console.log(albums);

        setAlbums(obj.albums);
      } catch (e) {
        console.log(e);
        setAlbums(albums);
      }
    })()
  }, [])

  const onChange = async () => {
    try {
      const res = await fetch(`${server}/api/albums`);
      const obj = await res.json();
      console.log(albums);

      setAlbums(obj.albums);
    } catch (e) {
      console.log(e);
      setAlbums(albums);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Add new album to database.
    const response = await fetch("/api/add/", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: artist,
        album,
      }),
    });

    // If database update is successful...
    if (response.ok) {
      await onChange();

      // Set notification.
      setNotif("Album successfully added.");

      // Clear form fields.
      setArtist("");
      setAlbum("");
    } else {
      const resJson = await response.json();
      setError(resJson.message);
    }
  }

  return (
    <div>
      <Head>
        <title>In The Queue</title>
        <meta name="description" content="Track your music listening!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <div className={styles.imageContainer}>
          <Image
            src={banner}
            alt="Picture of a vinyl player"
            height={250}
            style={{ borderRadius: 5 }}
            objectFit="cover"
            objectPosition="0 81%"
          />
          <h1 className="container">In The Queue</h1>
        </div>
      </header>
      <main className={styles.main}>
        {notif && <div className="notification">{notif}</div>}
        {error && <div className="error">{error}</div>}
        <div className="container">
          <h2>Add Album</h2>
          <form>
            <input
              className={styles.input}
              type="text"
              value={artist}
              placeholder="Enter name..."
              onChange={(e) => setArtist(e.target.value)}
            />
            <input
              className={styles.input}
              type="text"
              value={album}
              placeholder="Enter album..."
              onChange={(e) => setAlbum(e.target.value)}
            />
            <button
              className={styles.button}
              type="submit"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </form>
        </div>
        <hr className="container" />
        <List
          className={styles.listening}
          heading="Listening to..."
          albums={albums.filter(x => x.status === 'none')}
          onChange={onChange}
        />
        <hr className="container" />
        <List
          className={styles.liked}
          heading="Liked Music"
          albums={albums.filter(x => x.status === 'liked')}
          onChange={onChange}
        />
        <hr className="container" />
        <List
          className={styles.disliked}
          heading="Disliked Music"
          albums={albums.filter(x => x.status === 'disliked')}
          onChange={onChange}
        />
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: {},
  };
}
