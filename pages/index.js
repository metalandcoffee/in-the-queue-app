import Head from 'next/head'
import Image from 'next/image'

import { useState } from 'react';

import { server } from '../lib/config';
import List from '../components/List'
import styles from '../styles/Home.module.css'
import banner from '../public/banner.jpeg'

/**
 * Home Page.
 */
export default function Home({current, liked, disliked}) {

  // Set state.
  const [currAlbums, setCurrAlbums] = useState(current);
  const [likeAlbums, setLikeAlbums] = useState(liked);
  const [disAlbums, setDisAlbums] = useState(disliked);

  /**
   * Add an album to the database.
   * 
   * @param {*} e 
   */
  async function handleSubmit(e) {
    e.preventDefault();

    let response = await fetch(
    '/api/add/',
    {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: artist.value,
        album: album.value,
      })
    });
    response = await response.json();
    console.log(response);
    // setCurrent(current.push({

    // }));
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>In The Queue</title>
        <meta name="description" content="Track your music listening!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <Image
          src={banner}
          alt='Picture of a vinyl player'
          height={250}
          objectFit='cover'
          objectPosition='0 81%'
        />
        <h1>In The Queue</h1>
      </header>
      <main className={styles.main}>
        <div>
          <h2>Add Album</h2>
          <form action="">
            <input type="text" />
            <input type="text" />
            <button type="submit" onClick={handleSubmit}>Submit</button>
          </form>
        </div>
        <List heading="Listening to..." albums={currAlbums} />
        <List heading="Liked Music" albums={likeAlbums} />
        <List heading="Disliked Music" albums={disAlbums} />
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
  )
}

export async function getServerSideProps(context) {
  let current = await fetch(`${server}/api/current`);
  current = await current.json();

  let liked = await fetch(`${server}/api/liked`);
  liked = await liked.json();

  let disliked = await fetch(`${server}/api/disliked`);
  disliked = await disliked.json();

  return {
    props: {
      current: current.albums,
      liked: liked.albums,
      disliked: disliked.albums,
    },
  };
}