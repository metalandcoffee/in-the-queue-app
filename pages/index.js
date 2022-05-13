import Head from 'next/head'
import Image from 'next/image'
import List from '../components/List'
import styles from '../styles/Home.module.css'

export default function Home({current, liked, disliked}) {

  return (
    <div className={styles.container}>
      <Head>
        <title>In The Queue</title>
        <meta name="description" content="Track your music listening!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <h1>In The Queue</h1>
      </header>
      <main className={styles.main}>
        <List heading="Listening to..." albums={current} />
        <List heading="Liked Music" albums={liked} />
        <List heading="Disliked Music" albums={disliked} />
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
  let current = await fetch('http://localhost:3000/api/current/');
  current = await current.json();

  let liked = await fetch('http://localhost:3000/api/liked/');
  liked = await liked.json();

  let disliked = await fetch('http://localhost:3000/api/disliked/');
  disliked = await disliked.json();

  return {
    props: {
      current: current.albums,
      liked: liked.albums,
      disliked: disliked.albums,
    },
  };
}