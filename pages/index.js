import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import { server } from '../lib/config';
import List from '../components/List';
import styles from '../styles/Home.module.css';
import banner from '../public/banner.jpeg';

/**
 * Home Page.
 */
export default function Home({
  listeningJson, likedJson, dislikedJson,
}) {
  // Set state.
  const [ artist, setArtist ] = useState('');
  const [ album, setAlbum ] = useState('');
  const [ error, setError ] = useState(false);
  const [ notif, setNotif ] = useState(false);
  const [ listening, setListening ] = useState(listeningJson);
  const [ liked, setLiked ] = useState(likedJson);
  const [ disliked, setDisliked ] = useState(dislikedJson);

  async function handleSubmit(e) {
    e.preventDefault();

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
      const newAdd = await response.json();
      setListening([ ...listening, newAdd ]);

      // Set notification.
      setNotif('Album successfully added.');

      // Clear form fields.
      setArtist('');
      setAlbum('');
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
            src={ banner }
            alt="Picture of a vinyl player"
            height={250}
            style={{ borderRadius: 5 }}
            objectFit='cover'
            objectPosition='0 81%'
          />
         <h1 className="container">In The Queue</h1>
      </div>

      </header>
      <main className={styles.main}>
      { notif && (
        <div className="notification">{notif}</div>
      )}
      { error && (
        <div className="error">{error}</div>
      )}
        <div className="container">
          <h2>Add Album</h2>
          <form>
            <input className={styles.input} type="text" value={artist} placeholder="Enter name..." onChange={(e) => setArtist(e.target.value)}/>
            <input className={styles.input} type="text" value={album} placeholder="Enter album..." onChange={(e) => setAlbum(e.target.value)}/>
            <button className={styles.button} type="submit" onClick={handleSubmit}>Submit</button>
          </form>
        </div>
        <hr className="container" />
        <List
          className={styles.listening}
          heading="Listening to..."
          albums={listening}
          type="listening"
          listening={listening}
          liked={liked}
          disliked={disliked}
          setListening={ setListening }
          setLiked={ setLiked }
          setDisliked={ setDisliked }
        />
        <hr className="container" />
        <List
          className={styles.liked}
          heading="Liked Music"
          albums={liked}
          type="liked"
          listening={listening}
          liked={liked}
          disliked={disliked}
          setListening={ setListening }
          setLiked={ setLiked }
          setDisliked={ setDisliked }
        />
        <hr className="container" />
        <List
          className={styles.disliked}
          heading="Disliked Music"
          albums={disliked}
          type="disliked"
          listening={listening}
          liked={liked}
          disliked={disliked}
          setListening={ setListening }
          setLiked={ setLiked }
          setDisliked={ setDisliked }
        />
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}

export async function getServerSideProps() {
  const listeningRes = await fetch(`${server}/api/listening`);
  const listeningJson = await listeningRes.json();

  const likedRes = await fetch(`${server}/api/liked`);
  const likedJson = await likedRes.json();

  const dislikedRes = await fetch(`${server}/api/disliked`);
  const dislikedJson = await dislikedRes.json();

  return { props: {
    listeningJson: listeningJson.albums,
    likedJson: likedJson.albums,
    dislikedJson: dislikedJson.albums,
  } };
}
